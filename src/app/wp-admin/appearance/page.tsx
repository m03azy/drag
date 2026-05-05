'use client';

import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Loader2, LayoutPanelTop, Layout } from 'lucide-react';
import Link from 'next/link';

export default function AppearancePage() {
    const [settings, setSettings] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                setIsLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (res.ok) alert('Global layouts saved!');
        } catch (err) {
            console.error(err);
            alert('Failed to save layouts');
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
                <h1 style={{ fontSize: '1.875rem' }}>Appearance Editor</h1>
                <p style={{ color: '#64748b' }}>Configure global code JSON for your Navbar and Footer directly. (Visual Builder Coming Soon)</p>
            </div>

            <form onSubmit={handleSave} className="card shadow-lg" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#6366f1' }}>
                            <LayoutPanelTop size={20} />
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Global Navbar / Header</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label className="prop-label">Menu JSON Definition</label>
                                <textarea
                                    value={settings?.globalHeader || ''}
                                    onChange={(e) => setSettings({ ...settings, globalHeader: e.target.value })}
                                    className="prop-input"
                                    style={{ minHeight: '150px', fontFamily: 'monospace', fontSize: '0.875rem' }}
                                    placeholder='[{"id": "nav-1", "type": "section", "children": [...]}]'
                                />
                            </div>
                        </div>
                    </section>

                    <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#6366f1' }}>
                            <Layout size={20} />
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Global Footer</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label className="prop-label">Footer JSON Definition</label>
                                <textarea
                                    value={settings?.globalFooter || ''}
                                    onChange={(e) => setSettings({ ...settings, globalFooter: e.target.value })}
                                    className="prop-input"
                                    style={{ minHeight: '150px', fontFamily: 'monospace', fontSize: '0.875rem' }}
                                    placeholder='[{"id": "foot-1", "type": "section", "children": [...]}]'
                                />
                            </div>
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {isSaving ? 'Saving...' : 'Save Global Layouts'}
                    </button>
                </div>
            </form>
        </div>
    );
}
