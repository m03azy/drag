import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Plus, Edit2, ExternalLink } from 'lucide-react';
import DeletePageButton from '@/components/admin/DeletePageButton';

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
                <Link href="/wp-admin/pages/new" className="btn btn-primary">
                    <Plus size={20} /> Create New Page
                </Link>
            </div>

            <div className="card shadow-lg" style={{ padding: 0, overflow: 'hidden', border: '1px solid hsl(var(--border))' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'hsl(var(--bg-main))', textAlign: 'left' }}>
                            <th style={{ padding: '1.25rem 1rem', borderBottom: '1px solid hsl(var(--border))', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'hsl(var(--text-muted))' }}>Title</th>
                            <th style={{ padding: '1.25rem 1rem', borderBottom: '1px solid hsl(var(--border))', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'hsl(var(--text-muted))' }}>Slug</th>
                            <th style={{ padding: '1.25rem 1rem', borderBottom: '1px solid hsl(var(--border))', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'hsl(var(--text-muted))' }}>Status</th>
                            <th style={{ padding: '1.25rem 1rem', borderBottom: '1px solid hsl(var(--border))', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'hsl(var(--text-muted))' }}>Last Updated</th>
                            <th style={{ padding: '1.25rem 1rem', borderBottom: '1px solid hsl(var(--border))', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'hsl(var(--text-muted))', textAlign: 'right' }}>Actions</th>
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
                            pages.map((page: any) => (
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
                                        <Link href={`/wp-admin/pages/edit/${page.id}`} style={{ color: '#6366f1' }}>
                                            <Edit2 size={18} />
                                        </Link>
                                        <DeletePageButton id={page.id} title={page.title} />
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
