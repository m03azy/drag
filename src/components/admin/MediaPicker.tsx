'use client';

import React, { useState, useEffect } from 'react';
import { Search, Image as ImageIcon, X, Loader2, Upload } from 'lucide-react';

interface MediaItem {
    name: string;
    url: string;
    type: string;
}

interface Props {
    onSelect: (url: string) => void;
    onClose: () => void;
}

export function MediaPicker({ onSelect, onClose }: Props) {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const fetchMedia = async () => {
        try {
            const res = await fetch('/api/media');
            const data = await res.json();
            setMedia(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const filteredMedia = media.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) &&
        ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(m.type?.toLowerCase() || '')
    );

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
                    const newItem = await res.json();
                    setMedia(prev => [newItem, ...prev]);
                    onSelect(newItem.url);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div className="card shadow-2xl animate-fade-in" style={{
                width: '100%',
                maxWidth: '900px',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                padding: 0,
                overflow: 'hidden',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.2)'
            }}>
                {/* Header */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid hsl(var(--border))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', backgroundColor: 'hsl(var(--p))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <ImageIcon size={20} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Media Library</h3>
                            <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Select or upload an image</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fff', border: '1px solid hsl(var(--border))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--text-muted))' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Toolbar */}
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid hsl(var(--border))', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
                        <input
                            type="text"
                            placeholder="Search media..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="prop-input"
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                    <label className="btn btn-primary" style={{ cursor: 'pointer', flexShrink: 0 }}>
                        {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                        {isUploading ? 'Uploading...' : 'Upload New'}
                        <input type="file" hidden onChange={handleUpload} disabled={isUploading} accept="image/*" />
                    </label>
                </div>

                {/* Grid */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                            <Loader2 className="animate-spin" size={40} color="hsl(var(--p))" />
                        </div>
                    ) : filteredMedia.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'hsl(var(--text-muted))' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
                            <p>No images found {search && `for "${search}"`}</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                            {filteredMedia.map((item) => (
                                <div
                                    key={item.name}
                                    onClick={() => onSelect(item.url)}
                                    style={{
                                        aspectRatio: '1',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        border: '2px solid transparent',
                                        transition: 'all 0.2s',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'hsl(var(--p))'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                                >
                                    <img src={item.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        padding: '0.5rem',
                                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                        color: 'white',
                                        fontSize: '0.6rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {item.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
