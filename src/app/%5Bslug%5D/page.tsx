import React from 'react';
import { prisma } from '@/lib/prisma';
import { PageRenderer } from '@/components/cms/PageRenderer';
import { notFound } from 'next/navigation';

export default async function DynamicPage({ params }: { params: { slug: string } }) {
    const page = await prisma.page.findUnique({
        where: { slug: params.slug },
    });

    if (!page) {
        notFound();
    }

    const content = JSON.parse(page.content);

    return (
        <div>
            <nav style={{ padding: '1rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>BusinessSite</div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <a href="/" style={{ fontWeight: 500 }}>Home</a>
                    <a href="#" style={{ fontWeight: 500 }}>Features</a>
                    <a href="#" style={{ fontWeight: 500 }}>About</a>
                    <a href="#" style={{ fontWeight: 500 }}>Contact</a>
                </div>
            </nav>

            <PageRenderer content={content} />

            <footer style={{ padding: '4rem 2rem', backgroundColor: '#0f172a', color: 'white', marginTop: '4rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>BusinessSite</h3>
                        <p style={{ color: '#94a3b8' }}>Providing top-tier solutions for modern businesses.</p>
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
        </div>
    );
}
