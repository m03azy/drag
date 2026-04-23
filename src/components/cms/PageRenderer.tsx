import React from 'react';
import { CMSComponent } from '@/types/cms';

const Hero = ({ title, subtitle }: any) => (
    <section style={{ padding: '80px 20px', textAlign: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: 'white' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{title || 'Welcome to Our Website'}</h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>{subtitle || 'Built with our amazing CMS'}</p>
    </section>
);

const TextSection = ({ content }: any) => (
    <section style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <div dangerouslySetInnerHTML={{ __html: content || 'Start typing your content here...' }} />
    </section>
);

const componentMap: Record<string, React.FC<any>> = {
    hero: Hero,
    text: TextSection,
};

export const PageRenderer = ({ content }: { content: CMSComponent[] }) => {
    return (
        <main>
            {content.map((comp) => {
                const Component = componentMap[comp.type];
                return Component ? <Component key={comp.id} {...comp.props} /> : null;
            })}
        </main>
    );
};
