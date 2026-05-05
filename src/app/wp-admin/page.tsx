import React from 'react';
import { prisma } from '@/lib/prisma';
import { FileText, Users, MousePointer2, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function AdminPanelDashboard() {
    const pageCount = await prisma.page.count();
    const latestPages = await prisma.page.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
    });

    const stats = [
        { label: 'Total Pages', value: pageCount, icon: <FileText size={24} />, color: '#6366f1' },
        { label: 'Total Users', value: '1', icon: <Users size={24} />, color: '#10b981' },
        { label: 'Page Views', value: '1,280', icon: <TrendingUp size={24} />, color: '#f59e0b' },
        { label: 'Drag Events', value: '456', icon: <MousePointer2 size={24} />, color: '#ec4899' },
    ];

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem' }}>Dashboard Overview</h1>
                <p style={{ color: '#64748b' }}>Welcome back. Here's what's happening with your site.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {stats.map((stat, i) => (
                    <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '12px',
                            backgroundColor: `${stat.color}15`,
                            color: stat.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>{stat.label}</p>
                            <h3 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.125rem' }}>Recently Updated Pages</h3>
                        <Link href="/wp-admin/pages" style={{ fontSize: '0.875rem', color: '#6366f1', fontWeight: 500 }}>View All</Link>
                    </div>
                    <div style={{ padding: '0.5rem' }}>
                        {latestPages.map((page: any) => (
                            <div key={page.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                                <div>
                                    <p style={{ fontWeight: 600 }}>{page.title}</p>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>/{page.slug}</p>
                                </div>
                                <Link href={`/wp-admin/pages/edit/${page.id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                                    Edit
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Link href="/wp-admin/pages/new" className="btn btn-primary" style={{ width: '100%' }}>Create New Page</Link>
                        <Link href="/wp-admin/media" className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start' }}>Upload Media</Link>
                        <Link href="/wp-admin/settings" className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start' }}>Edit Site Settings</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
