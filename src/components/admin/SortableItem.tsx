'use client';

import React from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CMSComponent, ComponentType } from '@/types/cms';
import { GripVertical, Trash2, Plus, Type, Image as ImageIcon, MousePointer2 } from 'lucide-react';

interface Props {
    component: CMSComponent;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onRemove: () => void;
    onRemoveChild: (id: string) => void;
    onAddComponent: (type: ComponentType, parentId?: string) => void;
    selectedId?: string | null;
}

export function SortableItem({ component, isSelected, onSelect, onRemove, onRemoveChild, onAddComponent, selectedId }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: component.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isDragging ? 0.4 : 1,
        position: 'relative' as const,
        zIndex: isDragging ? 10 : 1,
        outline: isSelected ? '2px solid hsl(var(--p))' : '1px dashed transparent',
        outlineOffset: '-2px',
        marginTop: component.styles?.marginTop || '0px',
        marginBottom: component.styles?.marginBottom || '0px',
        borderRadius: component.styles?.borderRadius || '0px'
    };

    const renderPreview = () => {
        const styles = component.styles || {};

        // Safely parse a prop that may be a JSON string or already an array
        const safeArray = (val: any): any[] => {
            if (Array.isArray(val)) return val;
            if (typeof val === 'string') { try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; } }
            return [];
        };

        const st: React.CSSProperties = {
            paddingTop: styles.paddingTop || '0px',
            paddingBottom: styles.paddingBottom || '0px',
            paddingLeft: styles.paddingLeft || '0px',
            paddingRight: styles.paddingRight || '0px',
            marginTop: styles.marginTop || '0px',
            marginBottom: styles.marginBottom || '0px',
            backgroundColor: styles.backgroundColor || 'transparent',
            backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : 'none',
            backgroundSize: styles.backgroundSize || 'cover',
            backgroundPosition: styles.backgroundPosition || 'center',
            color: styles.textColor || 'inherit',
            textAlign: (styles.textAlign as any) || 'center',
            display: styles.display || 'block',
            flexDirection: (styles.flexDirection as any) || 'column',
            justifyContent: (styles.justifyContent as any) || 'center',
            alignItems: (styles.alignItems as any) || 'center',
            gap: styles.gap || '0px',
            gridTemplateColumns: styles.display === 'grid' ? `repeat(${styles.gridColumns || 1}, 1fr)` : 'none',
            borderRadius: styles.borderRadius || '0px',
            maxWidth: styles.maxWidth || '100%',
        };

        if (component.type === 'section' || component.type === 'hero') {
            const hasChildren = component.children && component.children.length > 0;
            return (
                <div style={{
                    ...st,
                    background: component.type === 'hero' ? (styles.backgroundGradient || st.backgroundImage || styles.backgroundColor || 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)') : st.backgroundColor,
                    minHeight: component.type === 'hero' && !hasChildren ? '300px' : '100px',
                    border: component.type === 'section' ? '1px dashed #e2e8f0' : 'none',
                    position: 'relative',
                    color: component.type === 'hero' && !hasChildren ? 'white' : st.color,
                }}>
                    {component.children && component.children.length > 0 ? (
                        <SortableContext items={component.children.map(c => c.id)} strategy={verticalListSortingStrategy}>
                            {component.children.map((child) => (
                                <SortableItem
                                    key={child.id}
                                    component={child}
                                    isSelected={selectedId === child.id}
                                    selectedId={selectedId}
                                    onSelect={onSelect}
                                    onRemove={() => onRemoveChild(child.id)}
                                    onRemoveChild={onRemoveChild}
                                    onAddComponent={onAddComponent}
                                />
                            ))}
                        </SortableContext>
                    ) : (
                        component.type === 'section' ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', color: '#94a3b8', fontSize: '0.75rem' }}>
                                Empty Section Container
                            </div>
                        ) : (
                            <div style={{ textAlign: (component.styles?.textAlign as any) || 'center', width: '100%' }}>
                                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', fontFamily: component.styles?.fontFamily }}>{component.props.title}</h1>
                                <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '2rem', fontFamily: component.styles?.fontFamily }}>{component.props.subtitle}</p>
                            </div>
                        )
                    )}
                </div>
            );
        }

        switch (component.type) {
            case 'heading': {
                const Tag = (component.props.level || 'h2') as any;
                return <Tag style={{ ...st, fontSize: styles.fontSize || (Tag === 'h1' ? '3rem' : Tag === 'h2' ? '2.5rem' : '1.5rem') }}>{component.props.content}</Tag>;
            }
            case 'text':
                return <div style={{ ...st, fontSize: styles.fontSize || '1.125rem', lineHeight: styles.lineHeight || 1.8 }} dangerouslySetInnerHTML={{ __html: component.props.content }} />;
            case 'image':
                return (
                    <div style={{ ...st, display: 'flex', justifyContent: st.textAlign === 'center' ? 'center' : st.textAlign === 'right' ? 'flex-end' : 'flex-start' }}>
                        <img src={component.props.url} alt={component.props.alt} style={{ maxWidth: '100%', height: 'auto', borderRadius: component.styles?.borderRadius }} />
                    </div>
                );
            case 'button':
                return (
                    <div style={{ ...st, display: 'flex', justifyContent: st.textAlign === 'center' ? 'center' : st.textAlign === 'right' ? 'flex-end' : 'flex-start' }}>
                        <button className={`btn btn-${component.props.variant || 'primary'}`} style={{ backgroundColor: component.styles?.backgroundColor, color: component.styles?.textColor }}>{component.props.label}</button>
                    </div>
                );
            case 'features':
                return (
                    <div style={st}>
                        <h3 style={{ marginBottom: '2rem' }}>{component.props.title}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            {safeArray(component.props.items).map((item: any, i: number) => (
                                <div key={i} className="card" style={{ padding: '1.5rem' }}>
                                    <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</div>
                                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{item.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'slider':
                return (
                    <div style={{ ...st, position: 'relative', height: '150px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: `url(${safeArray(component.props.slides)[0]?.url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426'})`, backgroundSize: 'cover' }} />
                        <div style={{ position: 'relative', zIndex: 1, padding: '2rem', textAlign: 'center' }}>
                            <div style={{ fontWeight: 800 }}>SLIDER: {safeArray(component.props.slides).length} Slides</div>
                            <div style={{ fontSize: '0.75rem' }}>{safeArray(component.props.slides)[0]?.title}</div>
                        </div>
                    </div>
                );
            case 'form':
                return (
                    <div style={{ ...st, border: '1px solid hsl(var(--border))', backgroundColor: '#f8fafc', padding: '2rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.5rem' }}>{component.props.title || 'Contact Form'}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{component.props.fields?.length || 3} Form Fields</div>
                        </div>
                    </div>
                );
            default:
                return <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8' }}>Component: {component.type}</div>;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={(e) => { e.stopPropagation(); onSelect(component.id); }}
            className="editor-item"
        >
            <div className="item-overlay" style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                display: isSelected ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '4px',
                zIndex: 40
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(8px)',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <div {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.2)', paddingRight: '6px', marginRight: '2px' }}>
                        <GripVertical size={12} />
                    </div>
                    <span>{component.type}</span>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                    {(component.type === 'section' || component.type === 'hero') && (
                        <>
                            {[
                                { type: 'text', icon: <Type size={14} />, label: 'Text' },
                                { type: 'image', icon: <ImageIcon size={14} />, label: 'Img' },
                                { type: 'button', icon: <MousePointer2 size={14} />, label: 'Btn' }
                            ].map(tool => (
                                <button
                                    key={tool.type}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddComponent(tool.type as any, component.id);
                                    }}
                                    title={`Add ${tool.label}`}
                                    style={{ backgroundColor: 'white', color: 'hsl(var(--p))', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid hsl(var(--border))', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                    {tool.icon}
                                </button>
                            ))}
                        </>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        title="Delete"
                        style={{ backgroundColor: '#ef4444', color: 'white', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)' }}>
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            <div>
                {renderPreview()}
            </div>
        </div>
    );
}
