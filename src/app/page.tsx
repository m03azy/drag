import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { PageRenderer } from '@/components/cms/PageRenderer';

export const dynamic = 'force-dynamic';

export default async function Home() {
  if (!prisma) return <div>Database connection error</div>;

  let settings = null;
  try {
    settings = await (prisma as any).siteSettings?.findUnique({
      where: { id: 'global' }
    });
  } catch (e) {
    console.warn("SiteSettings table not found");
  }

  // If a custom home page is assigned, render it
  if (settings?.homePageId) {
    const page = await prisma.page.findUnique({
      where: { slug: settings.homePageId }
    });

    if (page) {
      const content = JSON.parse(page.content);
      const headerContent = settings.globalHeader ? JSON.parse(settings.globalHeader) : null;
      const footerContent = settings.globalFooter ? JSON.parse(settings.globalFooter) : null;

      return (
        <div>
          {headerContent && <PageRenderer content={headerContent} />}
          <PageRenderer content={content} />
          {footerContent && <PageRenderer content={footerContent} />}
        </div>
      );
    }
  }

  // Default Fallback Home Page
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at top right, #f5f3ff, #ffffff)', padding: '2rem' }}>
      <main style={{ textAlign: 'center', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Your Vision, Dragged and Dropped.
        </h1>
        <p style={{ fontSize: '1.5rem', color: '#64748b', marginBottom: '3rem' }}>
          A secure, modern, full-stack CMS for your business matters.
          Create stunning pages in minutes with our intuitive interface.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/wp-admin" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
            Go to Dashboard
          </Link>
          <button className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
            Learn More
          </button>
        </div>
      </main>
    </div>
  );
}
