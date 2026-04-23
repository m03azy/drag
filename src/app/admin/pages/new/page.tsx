'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewPage() {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    slug,
                    content: []
                }),
            });

            if (res.ok) {
                const page = await res.json();
                router.push(`/admin/pages/edit/${page.id}`);
            } else {
                alert('Failed to create page');
            }
        } catch (err) {
            console.error(err);
            alert('Error creating page');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Link href="/admin/pages" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', marginBottom: '2rem' }}>
                <ArrowLeft size={18} /> Back to Pages
            </Link>

            <div className="card">
                <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Create New Page</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Page Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                            }}
                            placeholder="e.g. Home Page"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>URL Slug</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <span>example.com/</span>
                            <input
                                type="text"
                                required
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                style={{ border: 'none', background: 'none', outline: 'none', color: '#0f172a', fontWeight: 500, flex: 1 }}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                    >
                        {isSubmitting ? 'Creating...' : <><Save size={20} /> Create & Start Designing</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
