'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CMSComponent } from '@/types/cms';

const getAnimationProps = (styles: any) => {
    const type = styles?.animationType || 'none';
    const duration = styles?.animationDuration || 0.6;
    const delay = styles?.animationDelay || 0;
    const distance = styles?.animationDistance || 50;

    if (type === 'none') return {};

    const transitions: any = { duration, delay, ease: "easeOut" };

    const variants: any = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    switch (type) {
        case 'slideUp': variants.hidden.y = distance; variants.visible.y = 0; break;
        case 'slideDown': variants.hidden.y = -distance; variants.visible.y = 0; break;
        case 'slideLeft': variants.hidden.x = distance; variants.visible.x = 0; break;
        case 'slideRight': variants.hidden.x = -distance; variants.visible.x = 0; break;
        case 'scale': variants.hidden.scale = 0.8; variants.visible.scale = 1; break;
        case 'bounce':
            variants.visible.y = [0, -20, 0];
            transitions.y = { repeat: Infinity, duration: 2, ease: "easeInOut" };
            break;
    }

    return {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, margin: "-100px" },
        variants,
        transition: transitions
    };
};

const safeArray = (val: any): any[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') { try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; } }
    return [];
};

const getStyles = (styles: any) => ({
    paddingTop: styles?.paddingTop || '0px',
    paddingBottom: styles?.paddingBottom || '0px',
    paddingLeft: styles?.paddingLeft || '0px',
    paddingRight: styles?.paddingRight || '0px',
    marginTop: styles?.marginTop || '0px',
    marginBottom: styles?.marginBottom || '0px',
    textAlign: styles?.textAlign || 'center',
    backgroundColor: styles?.backgroundColor || 'transparent',
    backgroundImage: styles?.backgroundImage ? `url(${styles.backgroundImage})` : 'none',
    backgroundSize: styles?.backgroundSize || 'cover',
    backgroundPosition: styles?.backgroundPosition || 'center',
    backgroundRepeat: styles?.backgroundRepeat || 'no-repeat',
    background: styles?.backgroundGradient || undefined,
    color: styles?.textColor || 'inherit',
    fontSize: styles?.fontSize || 'inherit',
    fontWeight: styles?.fontWeight || 'inherit',
    fontStyle: styles?.fontStyle || 'inherit',
    fontFamily: styles?.fontFamily || 'inherit',
    textDecoration: styles?.textDecoration || 'inherit',
    lineHeight: styles?.lineHeight || 'inherit',
    letterSpacing: styles?.letterSpacing || 'inherit',
    borderRadius: styles?.borderRadius || '0px',
    maxWidth: styles?.maxWidth || '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    display: styles?.display || 'block',
    flexDirection: styles?.flexDirection || 'column',
    justifyContent: styles?.justifyContent || 'center',
    alignItems: styles?.alignItems || 'center',
    gridTemplateColumns: styles?.display === 'grid' ? `repeat(${styles?.gridColumns || 1}, 1fr)` : 'none',
    gap: styles?.gap || '0px',
});

const CMSHero = ({ title, subtitle, ctaText, styles, children }: any) => {
    const s = getStyles(styles);
    const hasChildren = children && children.length > 0;
    const animationProps = getAnimationProps(styles);

    return (
        <motion.section
            {...animationProps}
            style={{
                ...s,
                background: styles?.backgroundGradient || s.backgroundImage || styles?.backgroundColor || 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                color: styles?.textColor || 'white',
                minHeight: '60vh',
                display: 'flex',
                flexDirection: styles?.flexDirection || 'column',
                justifyContent: styles?.justifyContent || 'center',
                alignItems: styles?.alignItems || 'center',
            }}>
            <div style={{ maxWidth: styles?.maxWidth || '1200px', margin: '0 auto', width: '100%', padding: '0 2rem' }}>
                {!hasChildren ? (
                    <>
                        <h1 style={{
                            fontSize: '4rem',
                            fontWeight: 800,
                            marginBottom: '1.5rem',
                            lineHeight: 1.1,
                            fontFamily: styles?.fontFamily,
                            color: styles?.textColor
                        }}>{title || 'Create something amazing'}</h1>
                        <p style={{
                            fontSize: '1.5rem',
                            opacity: 0.9,
                            marginBottom: '2.5rem',
                            maxWidth: '800px',
                            margin: styles?.textAlign === 'center' ? '0 auto 2.5rem' : '0 0 2.5rem',
                            fontFamily: styles?.fontFamily
                        }}>{subtitle || 'The most powerful drag & drop CMS for your business.'}</p>
                        {ctaText && <button className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', backgroundColor: 'white', color: '#6366f1' }}>{ctaText}</button>}
                    </>
                ) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: styles?.flexDirection || 'column',
                        justifyContent: styles?.justifyContent || 'center',
                        alignItems: styles?.alignItems || 'center',
                        gap: styles?.gap || '2rem'
                    }}>
                        {children.map((child: CMSComponent) => (
                            <PageComponent key={child.id} component={child} />
                        ))}
                    </div>
                )}
            </div>
        </motion.section>
    );
};

const CMSImage = ({ url, alt, overlayText, overlayColor, overlayOpacity, styles }: any) => {
    const s = getStyles(styles);
    let animationProps = getAnimationProps(styles);

    const isScrollZoom = styles?.animationType === 'scroll-zoom-text';
    if (isScrollZoom) { animationProps = {}; }

    return (
        <motion.div {...animationProps} style={{ ...s, display: 'flex', justifyContent: styles?.textAlign === 'center' ? 'center' : styles?.textAlign === 'right' ? 'flex-end' : 'flex-start', position: 'relative', overflow: (isScrollZoom || overlayText) ? 'hidden' : 'visible', borderRadius: styles?.borderRadius || '8px' }}>
            <motion.img
                src={url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426'}
                alt={alt || ''}
                initial={isScrollZoom ? { scale: 1.2 } : undefined}
                whileInView={isScrollZoom ? { scale: 1 } : undefined}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: styles?.borderRadius || '8px',
                    boxShadow: styles?.boxShadow || 'none',
                    display: 'block'
                }}
            />
            {overlayText && (
                <motion.div
                    initial={isScrollZoom ? { opacity: 0, y: 20 } : undefined}
                    whileInView={isScrollZoom ? { opacity: 1, y: 0 } : undefined}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                    style={{
                        position: 'absolute', inset: 0,
                        backgroundColor: overlayColor ? `${overlayColor}${Math.floor((overlayOpacity !== undefined ? overlayOpacity : 0.4) * 255).toString(16).padStart(2, '0')}` : 'rgba(0,0,0,0.4)',
                        borderRadius: styles?.borderRadius || '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '2rem'
                    }}>
                    <h3 style={{ color: '#fff', fontSize: '2rem', fontWeight: 700, textAlign: 'center', textShadow: '0 2px 10px rgba(0,0,0,0.3)', fontFamily: styles?.fontFamily }}>{overlayText}</h3>
                </motion.div>
            )}
        </motion.div>
    );
};

const CMSButton = ({ label, link, variant, styles }: any) => {
    const s = getStyles(styles);
    const animationProps = getAnimationProps(styles);
    return (
        <motion.div {...animationProps} style={{ ...s, display: 'flex', justifyContent: styles?.textAlign === 'center' ? 'center' : styles?.textAlign === 'right' ? 'flex-end' : 'flex-start' }}>
            <a
                href={link || '#'}
                className={`btn btn-${variant || 'primary'}`}
                style={{
                    backgroundColor: styles?.backgroundColor && styles?.backgroundColor !== 'transparent' ? styles?.backgroundColor : undefined,
                    color: styles?.textColor || undefined,
                    padding: `${styles?.paddingTop || '0.75rem'} ${styles?.paddingRight || '1.5rem'} ${styles?.paddingBottom || '0.75rem'} ${styles?.paddingLeft || '1.5rem'}`,
                    fontSize: styles?.fontSize || '1rem',
                    borderRadius: styles?.borderRadius || '8px',
                    fontFamily: styles?.fontFamily,
                    fontWeight: styles?.fontWeight || '600',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'inline-block'
                }}
            >
                {label || 'Click Here'}
            </a>
        </motion.div>
    );
};

const CMSFeatures = ({ title, items, styles }: any) => {
    const s = getStyles(styles);
    const animationProps = getAnimationProps(styles);
    return (
        <motion.section {...animationProps} style={s}>
            <div style={{ maxWidth: styles?.maxWidth || '1200px', margin: '0 auto' }}>
                <h2 style={{ textAlign: styles?.textAlign || 'center', marginBottom: '4rem', fontSize: '2.5rem', fontFamily: styles?.fontFamily }}>{title || 'Our Features'}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: styles?.gap || '2rem' }}>
                    {safeArray(items).length > 0 ? safeArray(items).map((item: any, i: number) => (
                        <div key={i} className="card" style={{ textAlign: styles?.textAlign || 'center', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: styles?.borderRadius || '12px' }}>
                            <div style={{ width: '64px', height: '64px', backgroundColor: '#f5f3ff', color: '#6366f1', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: styles?.textAlign === 'center' ? '0 auto 1.5rem' : '0 0 1.5rem', fontSize: '1.5rem' }}>{item.icon || '✨'}</div>
                            <h3 style={{ marginBottom: '1rem', fontFamily: styles?.fontFamily }}>{item.title || `Feature ${i + 1}`}</h3>
                            <p style={{ color: '#64748b', fontFamily: styles?.fontFamily }}>{item.desc || 'A brief description of this amazing feature.'}</p>
                        </div>
                    )) : [1, 2, 3].map((_: any, i: number) => (
                        <div key={i} className="card" style={{ textAlign: styles?.textAlign || 'center', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: styles?.borderRadius || '12px' }}>
                            <div style={{ width: '64px', height: '64px', backgroundColor: '#f5f3ff', color: '#6366f1', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: styles?.textAlign === 'center' ? '0 auto 1.5rem' : '0 0 1.5rem', fontSize: '1.5rem' }}>✨</div>
                            <h3 style={{ marginBottom: '1rem', fontFamily: styles?.fontFamily }}>Feature {i + 1}</h3>
                            <p style={{ color: '#64748b', fontFamily: styles?.fontFamily }}>A brief description of this amazing feature and how it helps your business grow.</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

const CMSPricing = ({ title, plans, styles }: any) => {
    const s = getStyles(styles);
    const animationProps = getAnimationProps(styles);
    return (
        <motion.section {...animationProps} style={s}>
            <div style={{ maxWidth: styles?.maxWidth || '1200px', margin: '0 auto' }}>
                <h2 style={{ textAlign: styles?.textAlign || 'center', marginBottom: '1rem', fontSize: '2.5rem', fontFamily: styles?.fontFamily }}>{title || 'Simple Pricing'}</h2>
                <p style={{ textAlign: styles?.textAlign || 'center', color: '#64748b', marginBottom: '4rem', fontFamily: styles?.fontFamily }}>Choose the perfect plan for your needs.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: styles?.gap || '2rem' }}>
                    {['Starter', 'Professional', 'Enterprise'].map((plan: string, i: number) => (
                        <div key={i} className="card" style={{
                            transform: i === 1 ? 'scale(1.05)' : 'none',
                            borderColor: i === 1 ? '#6366f1' : '#e2e8f0',
                            zIndex: i === 1 ? 1 : 0,
                            borderRadius: styles?.borderRadius || '12px'
                        }}>
                            <h3 style={{ marginBottom: '0.5rem', fontFamily: styles?.fontFamily }}>{plan}</h3>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', fontFamily: styles?.fontFamily }}>
                                ${i === 0 ? '29' : i === 1 ? '99' : '199'}<span style={{ fontSize: '1rem', color: '#64748b' }}>/mo</span>
                            </div>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', color: '#64748b' }}>
                                <li>✅ Unlimited Projects</li>
                                <li>✅ 24/7 Support</li>
                                <li>✅ Advanced Analytics</li>
                            </ul>
                            <button className={i === 1 ? "btn btn-primary" : "btn btn-outline"} style={{ width: '100%' }}>Choose {plan}</button>
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

const CMSHeading = ({ content, level, styles }: any) => {
    const s = getStyles(styles);
    const animationProps = getAnimationProps(styles);
    const Tag = (level || 'h2') as any;
    return (
        <motion.div {...animationProps}>
            <Tag style={{ ...s, fontSize: styles?.fontSize || (Tag === 'h1' ? '3rem' : Tag === 'h2' ? '2.5rem' : '1.5rem'), fontFamily: styles?.fontFamily }}>{content}</Tag>
        </motion.div>
    );
};

const CMSText = ({ content, styles }: any) => {
    const s = getStyles(styles);
    const animationProps = getAnimationProps(styles);
    return (
        <motion.div
            {...animationProps}
            style={{ ...s, fontSize: styles?.fontSize || '1.125rem', lineHeight: styles?.lineHeight || 1.8 }}
            dangerouslySetInnerHTML={{ __html: content || 'Start typing...' }}
        />
    );
};

const CMSSection = ({ children, styles }: any) => {
    const s = getStyles(styles);
    const animationProps = getAnimationProps(styles);
    return (
        <motion.div
            {...animationProps}
            style={{
                ...s,
                background: styles?.backgroundGradient || s.backgroundImage || styles?.backgroundColor || 'transparent',
            }}>
            <div style={{
                maxWidth: styles?.maxWidth || '1200px',
                margin: '0 auto',
                display: styles?.display === 'grid' ? 'grid' : 'flex',
                flexDirection: styles?.flexDirection || 'column',
                justifyContent: styles?.justifyContent || 'flex-start',
                alignItems: styles?.alignItems || 'stretch',
                gridTemplateColumns: styles?.display === 'grid' ? `repeat(${styles?.gridColumns || 1}, 1fr)` : 'none',
                gap: styles?.gap || '0px',
            }}>
                {(children || []).map((child: CMSComponent) => (
                    <PageComponent key={child.id} component={child} />
                ))}
            </div>
        </motion.div>
    );
};

const CMSSlider = ({ slides, styles }: any) => {
    const [current, setCurrent] = React.useState(0);
    const s = getStyles(styles);
    const animationProps = getAnimationProps(styles);
    const items = safeArray(slides).length > 0 ? safeArray(slides) : [
        { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426', title: 'Slide 1' },
        { url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2574', title: 'Slide 2' }
    ];

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % items.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [items.length]);

    return (
        <motion.section {...animationProps} style={{ ...s, position: 'relative', overflow: 'hidden', height: '600px' }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${items[current].url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        textAlign: 'center',
                        padding: '2rem'
                    }}>
                        <div style={{ maxWidth: '800px' }}>
                            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem' }}>{items[current].title}</h2>
                            <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>{items[current].description}</p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.75rem', zIndex: 10 }}>
                {items.map((_: any, i: number) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        style={{
                            width: i === current ? '40px' : '10px',
                            height: '10px',
                            borderRadius: '5px',
                            backgroundColor: i === current ? 'white' : 'rgba(255,255,255,0.5)',
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </div>
        </motion.section>
    );
};

const CMSForm = ({ title, description, fields, submitText, successMsg, styles }: any) => {
    const [status, setStatus] = React.useState<'idle' | 'loading' | 'success'>('idle');
    const s = getStyles(styles);
    const animationProps = getAnimationProps(styles);

    const formFields = safeArray(fields).length > 0 ? safeArray(fields) : [
        { label: 'Name', name: 'name', type: 'text', placeholder: 'Enter your name', required: true },
        { label: 'Email', name: 'email', type: 'email', placeholder: 'Enter your email', required: true },
        { label: 'Message', name: 'message', type: 'textarea', placeholder: 'How can we help?', required: true }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        // Simple delay to simulate submission
        await new Promise(r => setTimeout(r, 1500));
        setStatus('success');
    };

    if (status === 'success') {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ ...s, textAlign: 'center', padding: '4rem 2rem' }}>
                <div style={{ width: '64px', height: '64px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem' }}>✓</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{successMsg || 'Message Sent!'}</h3>
                <p style={{ color: '#64748b' }}>We'll get back to you as soon as possible.</p>
                <button onClick={() => setStatus('idle')} className="btn btn-outline" style={{ marginTop: '2rem' }}>Send Another</button>
            </motion.div>
        );
    }

    return (
        <motion.section {...animationProps} style={s}>
            <div style={{ maxWidth: styles?.maxWidth || '600px', margin: '0 auto' }}>
                {title && <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: styles?.textAlign }}>{title}</h2>}
                {description && <p style={{ color: '#64748b', marginBottom: '2.5rem', textAlign: styles?.textAlign }}>{description}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {formFields.map((field: any, i: number) => (
                        <div key={i} style={{ textAlign: 'left' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1e293b' }}>
                                {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                            </label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    name={field.name}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '120px', fontFamily: 'inherit' }}
                                />
                            ) : (
                                <input
                                    type={field.type || 'text'}
                                    name={field.name}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                            )}
                        </div>
                    ))}
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="btn btn-primary"
                        style={{ width: '100%', height: '3.5rem', fontSize: '1rem', marginTop: '1rem' }}
                    >
                        {status === 'loading' ? 'Sending...' : (submitText || 'Send Message')}
                    </button>
                </form>
            </div>
        </motion.section>
    );
};

const CMSNavbar = ({ logoUrl, siteName, links, ctaLabel, ctaHref, styles }: any) => {
    const s = getStyles(styles);
    const animationProps = getAnimationProps(styles);
    return (
        <motion.nav {...animationProps} style={{ ...s, position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <div style={{ maxWidth: styles?.maxWidth || '1200px', margin: '0 auto', padding: '0.875rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {logoUrl && <img src={logoUrl} alt={siteName} style={{ height: '32px', objectFit: 'contain' }} />}
                    {siteName && <span style={{ fontWeight: 800, fontSize: '1.25rem', color: styles?.textColor || 'inherit' }}>{siteName}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    {(links || []).map((link: any, i: number) => (
                        <a key={i} href={link.href || '#'} style={{ fontWeight: 600, fontSize: '0.875rem', color: styles?.textColor || '#64748b' }}>{link.label}</a>
                    ))}
                    {ctaLabel && (
                        <a href={ctaHref || '#'} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8125rem' }}>{ctaLabel}</a>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

const CMSSiteFooter = ({ logoUrl, siteName, description, columns, copyrightText, styles }: any) => {
    const s = getStyles(styles);
    const animationProps = getAnimationProps(styles);
    return (
        <motion.footer {...animationProps} style={{ ...s, backgroundColor: styles?.backgroundColor || '#0f172a', color: styles?.textColor || 'white' }}>
            <div style={{ maxWidth: styles?.maxWidth || '1280px', margin: '0 auto', padding: '5rem 2rem 3rem', display: 'grid', gridTemplateColumns: `2fr ${(columns || []).map(() => '1fr').join(' ')}`, gap: '3rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        {logoUrl && <img src={logoUrl} alt={siteName} style={{ height: '28px', filter: 'brightness(0) invert(1)', objectFit: 'contain' }} />}
                        {siteName && <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>{siteName}</span>}
                    </div>
                    {description && <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '280px' }}>{description}</p>}
                </div>
                {(columns || []).map((col: any, i: number) => (
                    <div key={i}>
                        <h4 style={{ marginBottom: '1.25rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'white' }}>{col.title}</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {(col.links || []).map((link: any, j: number) => (
                                <li key={j}><a href={link.href || '#'} style={{ color: '#94a3b8', fontSize: '0.875rem', transition: 'color 0.2s' }}>{link.label}</a></li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'center', color: '#475569', fontSize: '0.75rem' }}>
                {copyrightText || `© ${new Date().getFullYear()} ${siteName || 'Company'}. All rights reserved.`}
            </div>
        </motion.footer>
    );
};

const componentMap: Record<string, React.FC<any>> = {
    hero: CMSHero,
    heading: CMSHeading,
    text: CMSText,
    features: CMSFeatures,
    pricing: CMSPricing,
    section: CMSSection,
    image: CMSImage,
    button: CMSButton,
    slider: CMSSlider,
    form: CMSForm,
    navbar: CMSNavbar,
    'site-footer': CMSSiteFooter,
};

const PageComponent = ({ component }: { component: CMSComponent }) => {
    const Component = componentMap[component.type];
    if (!Component) return null;
    return <Component {...component.props} styles={component.styles} children={component.children} />;
};

export const PageRenderer = ({ content }: { content: CMSComponent[] }) => {
    return (
        <main>
            <AnimatePresence>
                {content.map((comp) => (
                    <PageComponent key={comp.id} component={comp} />
                ))}
            </AnimatePresence>
        </main>
    );
};
