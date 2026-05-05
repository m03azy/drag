'use client';
import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function HeaderEditor() {
    const [header, setHeader] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetch('/api/settings')
            .then((res) => res.json())
            .then((data) => {
                setHeader(data?.globalHeader || '');
                setIsLoading(false);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ globalHeader: header }),
            });
            if (res.ok) alert('Header layout saved!');
        } catch (err) {
            console.error(err);
            alert('Failed to save header');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                <Loader2 className="animate-spin" size={40} color="#6366f1" />
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/wp-admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <h1 style={{ fontSize: '1.875rem' }}>Header Designer</h1>
                <p style={{ color: '#64748b' }}>Edit the JSON definition of your global header (navbar).</p>
            </div>
            <form onSubmit={handleSave} className="card shadow-lg" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <label className="prop-label">Header JSON Definition</label>
                    <textarea
                        value={header}
                        onChange={(e) => setHeader(e.target.value)}
                        className="prop-input"
                        style={{ minHeight: '200px', fontFamily: 'monospace', fontSize: '0.875rem' }}
                        placeholder='[{"id": "nav-1", "type": "section", "children": [...]}]'
                    />
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {isSaving ? 'Saving...' : 'Save Header'}
                    </button>
                </div>
            </form>
        </div>
    );
}
