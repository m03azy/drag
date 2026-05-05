'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, File, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface MediaItem {
    name: string;
    url: string;
    type: string;
}

export default function MediaPage() {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    const fetchMedia = async () => {
        try {
            const res = await fetch('/api/media');
            const data = await res.json();
            setMedia(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const res = await fetch('/api/media', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        file: reader.result,
                        fileName: file.name
                    })
                });

                if (res.ok) {
                    fetchMedia();
                } else {
                    alert('Upload failed');
                }
            } catch (err) {
                console.error(err);
                alert('Error uploading');
            } finally {
                setIsUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDelete = async (fileName: string) => {
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            const res = await fetch('/api/media', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName })
            });

            if (res.ok) {
                setMedia(prev => prev.filter(m => m.name !== fileName));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <Link href="/wp-admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                    <h1 style={{ fontSize: '1.875rem' }}>Media Library</h1>
                </div>
                <label className="btn btn-primary" style={{ cursor: 'pointer', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                    {isUploading ? 'Uploading...' : 'Upload New'}
                    <input type="file" hidden onChange={handleFileUpload} disabled={isUploading} />
                </label>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                    <Loader2 className="animate-spin" size={40} color="#6366f1" />
                </div>
            ) : media.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', color: '#94a3b8' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📂</div>
                    <h3>No media files found</h3>
                    <p>Start by uploading your first image or document.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {media.map((item) => (
                        <div key={item.name} className="card" style={{ padding: '0.5rem', position: 'relative', overflow: 'hidden' }}>
                            <div style={{
                                width: '100%',
                                aspectRatio: '1',
                                borderRadius: '8px',
                                backgroundColor: '#f8fafc',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '0.75rem',
                                overflow: 'hidden'
                            }}>
                                {['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(item.type?.toLowerCase()) ? (
                                    <img src={item.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <File size={40} color="#94a3b8" />
                                )}
                            </div>
                            <div style={{ padding: '0 0.5rem 0.5rem' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.25rem' }}>{item.name}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.625rem', color: '#64748b', textTransform: 'uppercase' }}>{item.type}</span>
                                    <button onClick={() => handleDelete(item.name)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <div
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.origin + item.url);
                                    alert('URL copied to clipboard!');
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '0.5rem',
                                    right: '0.5rem',
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    borderRadius: '4px',
                                    padding: '4px',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                                title="Copy URL"
                            >
                                <ImageIcon size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
