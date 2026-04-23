import Link from 'next/link';

export default function Home() {
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
          <Link href="/admin" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
            Go to Admin Dashboard
          </Link>
          <button className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
            Learn More
          </button>
        </div>
      </main>

      <div style={{ marginTop: '6rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', width: '100%', maxWidth: '1000px' }}>
        <div className="card">
          <h3>🚀 Fast</h3>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Optimized for speed and performance right out of the box.</p>
        </div>
        <div className="card">
          <h3>🔒 Secure</h3>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Built with security-first mindset and robust authentication.</p>
        </div>
        <div className="card">
          <h3>✨ Modern</h3>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Aesthetic designs that wow your customers at first glance.</p>
        </div>
      </div>
    </div>
  );
}
