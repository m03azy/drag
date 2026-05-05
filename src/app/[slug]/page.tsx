import React from 'react';
import { prisma } from '@/lib/prisma';
import { PageRenderer } from '@/components/cms/PageRenderer';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CMSPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Safety check for Prisma client
    if (!prisma) {
        return <div>Database connection error</div>;
    }

    const page = await prisma.page.findUnique({
        where: { slug },
    });

    // Handle site settings if table exists
    let settings = null;
    try {
        settings = await (prisma as any).siteSettings?.findUnique({
            where: { id: 'global' }
        });
    } catch (e) {
        console.warn("SiteSettings table not found");
    }

    if (!page) {
        notFound();
    }

    const content = JSON.parse(page.content);
    const headerContent = settings?.globalHeader ? JSON.parse(settings.globalHeader) : null;
    const footerContent = settings?.globalFooter ? JSON.parse(settings.globalFooter) : null;

    return (
        <div>
            {headerContent ? (
                <PageRenderer content={headerContent} />
            ) : (
                <nav style={{ padding: '1rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {settings?.logoUrl && <img src={settings.logoUrl} alt={settings.siteName} style={{ height: '32px' }} />}
                        <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{settings?.siteName || 'BusinessSite'}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <a href="/" style={{ fontWeight: 500 }}>Home</a>
                        <a href="/wp-admin" style={{ fontWeight: 500 }}>Admin</a>
                    </div>
                </nav>
            )}

            <PageRenderer content={content} />

            {footerContent ? (
                <PageRenderer content={footerContent} />
            ) : (
                <footer style={{ padding: '4rem 2rem', backgroundColor: '#0f172a', color: 'white', marginTop: '4rem' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
                        <div>
                            <h3 style={{ marginBottom: '1rem' }}>{settings?.siteName || 'BusinessSite'}</h3>
                            <p style={{ color: '#94a3b8' }}>{settings?.siteDesc || 'Providing top-tier solutions for modern businesses.'}</p>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1rem' }}>Links</h4>
                            <ul style={{ listStyle: 'none', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <li>Services</li>
                                <li>Portfolio</li>
                                <li>Careers</li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1rem' }}>Legal</h4>
                            <ul style={{ listStyle: 'none', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <li>Privacy Policy</li>
                                <li>Terms of Use</li>
                            </ul>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}
