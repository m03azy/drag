'use client';

import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Loader2, Globe, Palette, Mail } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        siteName: '',
        siteDesc: '',
        logoUrl: '',
        primaryColor: '#6366f1',
        contactEmail: '',
        homePageId: ''
    });
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

            if (res.ok) {
                alert('Settings saved successfully!');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to save settings');
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
                <h1 style={{ fontSize: '1.875rem' }}>Site Settings</h1>
                <p style={{ color: '#64748b' }}>Configure global settings for your website.</p>
            </div>

            <form onSubmit={handleSave} className="card shadow-lg" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#6366f1' }}>
                            <Globe size={20} />
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>General Information</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label className="prop-label">Site Name</label>
                                <input
                                    type="text"
                                    value={settings.siteName}
                                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                    className="prop-input"
                                    placeholder="My Business"
                                />
                            </div>
                            <div>
                                <label className="prop-label">Starting Page (Homepage)</label>
                                <input
                                    type="text"
                                    value={(settings as any).homePageId || ''}
                                    onChange={(e) => setSettings({ ...settings, homePageId: e.target.value })}
                                    className="prop-input"
                                    placeholder="Enter page slug (e.g. home)"
                                />
                                <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.5rem' }}>Leave blank to show the default layout.</p>
                            </div>
                            <div>
                                <label className="prop-label">Site Description</label>
                                <textarea
                                    value={settings.siteDesc || ''}
                                    onChange={(e) => setSettings({ ...settings, siteDesc: e.target.value })}
                                    className="prop-input"
                                    style={{ minHeight: '80px' }}
                                    placeholder="Leading provider of..."
                                />
                            </div>
                            <div>
                                <label className="prop-label">Logo URL</label>
                                <input
                                    type="text"
                                    value={settings.logoUrl || ''}
                                    onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                                    className="prop-input"
                                    placeholder="https://example.com/logo.png"
                                />
                                <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.5rem' }}>Use the Media Library to upload your logo and paste the URL here.</p>
                            </div>
                        </div>
                    </section>

                    <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#6366f1' }}>
                            <Palette size={20} />
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Branding & Style</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label className="prop-label">Primary Brand Color</label>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        value={settings.primaryColor}
                                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                        style={{ width: '50px', height: '40px', padding: '0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    />
                                    <input
                                        type="text"
                                        value={settings.primaryColor}
                                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                        className="prop-input"
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#6366f1' }}>
                            <Mail size={20} />
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Information</h3>
                        </div>
                        <div>
                            <label className="prop-label">Support/Contact Email</label>
                            <input
                                type="email"
                                value={settings.contactEmail || ''}
                                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                className="prop-input"
                                placeholder="hello@example.com"
                            />
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', justifySelf: 'flex-end', marginTop: '1rem' }}
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {isSaving ? 'Saving Settings...' : 'Save All Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
