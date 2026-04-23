import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';

export default async function PagesIndex() {
    const pages = await prisma.page.findMany({
        orderBy: { updatedAt: 'desc' },
    });

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem' }}>Pages</h1>
                    <p style={{ color: '#64748b' }}>Manage your website's pages and their content.</p>
                </div>
                <Link href="/admin/pages/new" className="btn btn-primary">
                    <Plus size={20} /> Create New Page
                </Link>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Title</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Slug</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Last Updated</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pages.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                                    No pages found. Create your first page!
                                </td>
                            </tr>
                        ) : (
                            pages.map((page) => (
                                <tr key={page.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{page.title}</td>
                                    <td style={{ padding: '1rem', color: '#64748b' }}>/{page.slug}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            backgroundColor: page.published ? '#dcfce7' : '#fef9c3',
                                            color: page.published ? '#166534' : '#854d0e',
                                            fontWeight: 600
                                        }}>
                                            {page.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#64748b' }}>
                                        {new Date(page.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <Link href={`/${page.slug}`} target="_blank" style={{ color: '#64748b' }}>
                                            <ExternalLink size={18} />
                                        </Link>
                                        <Link href={`/admin/pages/edit/${page.id}`} style={{ color: '#6366f1' }}>
                                            <Edit2 size={18} />
                                        </Link>
                                        <button style={{ color: '#ef4444' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
