import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, FileText, Settings, LogOut, Globe } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: '#1e293b',
                color: 'white',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem'
            }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: '#6366f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '1rem' }}>S</span>
                    </div>
                    StandCMS
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <Link href="/admin" className="admin-nav-item">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link href="/admin/pages" className="admin-nav-item">
                        <FileText size={20} /> Pages
                    </Link>
                    <Link href="/admin/settings" className="admin-nav-item">
                        <Settings size={20} /> Settings
                    </Link>
                </nav>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid #334155', paddingTop: '1rem' }}>
                    <Link href="/" target="_blank" className="admin-nav-item">
                        <Globe size={20} /> View Site
                    </Link>
                    <button className="admin-nav-item" style={{ width: '100%', textAlign: 'left', background: 'none' }}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f8fafc', padding: '2rem' }}>
                {children}
            </main>

            <style jsx global>{`
        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.2s;
          border-radius: 8px;
          font-weight: 500;
        }
        .admin-nav-item:hover {
          color: white;
          background-color: #334155;
        }
      `}</style>
        </div>
    );
}
