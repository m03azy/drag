'use client';

import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CMSComponent, ComponentType } from '@/types/cms';
import { SortableItem } from './SortableItem';
import {
    Save, Eye, Move, Layout as LayoutIcon, Type, Image as ImageIcon,
    MousePointer2, CreditCard, MessageSquare, Star, Settings2,
    AlignCenter, AlignLeft, AlignRight, Maximize, Scissors,
    Type as TypographyIcon, Palette, Square, Columns as ColumnsIcon,
    Plus, Bold, Italic, Underline, AlignJustify, ClipboardList, Trash2
} from 'lucide-react';
import Link from 'next/link';
import { MediaPicker } from './MediaPicker';

export default function Editor({ initialData }: { initialData?: any }) {
    const [components, setComponents] = useState<CMSComponent[]>(initialData?.content || []);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [pickerTarget, setPickerTarget] = useState<{ id: string, prop: string, index?: number } | null>(null);

    const activeComponents = components;
    const setActiveComponents = (updater: (prev: CMSComponent[]) => CMSComponent[]) => {
        setComponents(updater);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setActiveComponents((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                if (oldIndex !== -1 && newIndex !== -1) {
                    return arrayMove(items, oldIndex, newIndex);
                }
                return items;
            });
        }

        setActiveId(null);
    };

    const addComponent = (type: ComponentType, parentId?: string) => {
        const newComponent: CMSComponent = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            props: getDefaultProps(type),
            styles: {
                paddingTop: '60px',
                paddingBottom: '60px',
                paddingLeft: '20px',
                paddingRight: '20px',
                marginTop: '0px',
                marginBottom: '0px',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                textColor: '#0f172a',
                fontSize: '16px',
                fontWeight: '400',
                fontFamily: 'Inter, sans-serif',
                lineHeight: '1.5',
                maxWidth: '1200px',
                borderRadius: '0px',
                display: (type === 'section' || type === 'hero') ? 'flex' : 'block',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gridColumns: '1',
                gap: '20px'
            },
            children: (type === 'section' || type === 'hero') ? [] : undefined
        };

        if (parentId) {
            setActiveComponents(prev => prev.map(c => {
                if (c.id === parentId) {
                    return { ...c, children: [...(c.children || []), newComponent] };
                }
                return c;
            }));
        } else {
            setActiveComponents(prev => [...prev, newComponent]);
        }
        setSelectedId(newComponent.id);
    };

    const updateComponent = (id: string, updates: Partial<CMSComponent>) => {
        const recursiveUpdate = (items: CMSComponent[]): CMSComponent[] => {
            return items.map(c => {
                if (c.id === id) return { ...c, ...updates };
                if (c.children) return { ...c, children: recursiveUpdate(c.children) };
                return c;
            });
        };
        setActiveComponents(prev => recursiveUpdate(prev));
    };

    const removeComponent = (id: string) => {
        const recursiveRemove = (items: CMSComponent[]): CMSComponent[] => {
            return items.filter(c => c.id !== id).map(c => ({
                ...c,
                children: c.children ? recursiveRemove(c.children) : undefined
            }));
        };
        setActiveComponents(prev => recursiveRemove(prev));
        if (selectedId === id) setSelectedId(null);
    };

    const handlePropChange = (key: string, value: any, id?: string) => {
        const targetId = id || selectedId;
        if (targetId) {
            updateComponent(targetId, { props: { ...findComponentById(activeComponents, targetId)?.props, [key]: value } });
        }
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: '0.5' } },
        }),
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)', margin: '-2rem' }}>
            {pickerTarget && (
                <MediaPicker
                    onClose={() => setPickerTarget(null)}
                    onSelect={(url) => {
                        if (pickerTarget.prop === '__bgImage__') {
                            // Special key: set backgroundImage in styles, not props
                            const comp = findComponentById(components, pickerTarget.id);
                            if (comp) {
                                updateComponent(pickerTarget.id, { styles: { ...(comp.styles || {}), backgroundImage: url } });
                            }
                        } else if (pickerTarget.index !== undefined) {
                            // Update specific slide in array
                            const comp = findComponentById(activeComponents, pickerTarget.id);
                            if (comp) {
                                const newSlides = [...(comp.props.slides || [])];
                                newSlides[pickerTarget.index] = { ...newSlides[pickerTarget.index], url };
                                handlePropChange(pickerTarget.prop, newSlides, pickerTarget.id);
                            }
                        } else {
                            handlePropChange(pickerTarget.prop, url, pickerTarget.id);
                        }
                        setPickerTarget(null);
                    }}
                />
            )}

            <header style={{
                height: '4rem',
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 2rem',
                zIndex: 100,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="sidebar-logo" style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, hsl(var(--p)), hsl(var(--ph)))', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px hsla(var(--p) / 0.3)' }}>
                        <LayoutIcon size={20} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>{initialData?.title}</h2>
                        <p style={{ color: '#64748b', fontSize: '0.75rem' }}>Editing /{initialData?.slug}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link href={`/${initialData?.slug}`} target="_blank" className="btn btn-outline" style={{ height: '2.5rem', fontSize: '0.875rem' }}>
                        <Eye size={16} /> Preview
                    </Link>
                    <button onClick={handleSave} className="btn btn-primary" style={{ height: '2.5rem', fontSize: '0.875rem' }}>
                        <Save size={16} /> Update Page
                    </button>
                </div>
            </header>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <Sidebar onAdd={(type) => addComponent(type)} />
                <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f1f5f9', padding: '2rem' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'white', minHeight: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', paddingBottom: '300px' }}>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                            <SortableContext items={activeComponents.map(c => c.id)} strategy={verticalListSortingStrategy}>
                                {activeComponents.length === 0 ? (
                                    <div style={{ padding: '10rem 2rem', textAlign: 'center', color: '#94a3b8' }}>
                                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🏗️</div>
                                        <h3 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Page is Empty</h3>
                                        <p>Select an element from the left to start building your site</p>
                                    </div>
                                ) : (
                                    activeComponents.map((comp) => (
                                        <SortableItem
                                            key={comp.id}
                                            component={comp}
                                            isSelected={selectedId === comp.id}
                                            selectedId={selectedId}
                                            onSelect={(id) => setSelectedId(id)}
                                            onRemove={() => removeComponent(comp.id)}
                                            onRemoveChild={(id: string) => removeComponent(id)}
                                            onAddComponent={(type) => addComponent(type, comp.id)}
                                        />
                                    ))
                                )}
                            </SortableContext>
                            <DragOverlay dropAnimation={dropAnimation}>
                                {activeId ? (
                                    <div className="card" style={{ cursor: 'grabbing', opacity: 0.9, border: '2px solid #6366f1', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ padding: '8px', backgroundColor: '#f5f3ff', borderRadius: '4px' }}><Move size={20} color="#6366f1" /></div>
                                            <span>Moving Element...</span>
                                        </div>
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    </div>
                </main>

                <aside style={{ width: '420px', borderLeft: '1px solid hsl(var(--border))', backgroundColor: 'white', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px -15px rgba(0,0,0,0.05)' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid hsl(var(--border))', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundImage: 'linear-gradient(to bottom, #fff, #f8fafc)' }}>
                        <Settings2 size={18} color="hsl(var(--p))" />
                        <h3 style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'hsl(var(--text-main))' }}>Inspector</h3>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                        {selectedId ? (
                            <PropertyEditor
                                component={findComponentById(components, selectedId)!}
                                onUpdate={(updates) => updateComponent(selectedId, updates)}
                                onOpenPicker={(prop, index) => setPickerTarget({ id: selectedId, prop, index })}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', marginTop: '5rem', color: '#94a3b8' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🖱️</div>
                                <p style={{ fontSize: '0.875rem' }}>Click an element on the canvas to edit its properties</p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );

    function findComponentById(items: CMSComponent[], id: string): CMSComponent | null {
        for (const item of items) {
            if (item.id === id) return item;
            if (item.children) {
                const found = findComponentById(item.children, id);
                if (found) return found;
            }
        }
        return null;
    }

    async function handleSave() {
        try {
            const res = await fetch('/api/pages', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: initialData.id,
                    title: initialData.title,
                    slug: initialData.slug,
                    content: components,
                    published: initialData.published,
                }),
            });
            if (res.ok) alert('Page updated successfully!');
            else alert('Failed to update page');
        } catch (err) { alert('Error updating page'); }
    }
}

function Sidebar({ onAdd }: { onAdd: (type: ComponentType) => void }) {
    const categories = [
        { name: 'Layout', items: [{ type: 'section' as ComponentType, label: 'Section', icon: <ColumnsIcon size={18} /> }] },
        {
            name: 'Basic', items: [
                { type: 'hero' as ComponentType, label: 'Hero', icon: <LayoutIcon size={18} /> },
                { type: 'heading' as ComponentType, label: 'Heading', icon: <TypographyIcon size={18} /> },
                { type: 'text' as ComponentType, label: 'Paragraph', icon: <Type size={18} /> },
                { type: 'image' as ComponentType, label: 'Image', icon: <ImageIcon size={18} /> },
                { type: 'button' as ComponentType, label: 'Button', icon: <MousePointer2 size={18} /> },
            ]
        },
        {
            name: 'Complex', items: [
                { type: 'features' as ComponentType, label: 'Features Grid', icon: <Star size={18} /> },
                { type: 'pricing' as ComponentType, label: 'Pricing Plans', icon: <CreditCard size={18} /> },
                { type: 'testimonials' as ComponentType, label: 'Testimonials', icon: <MessageSquare size={18} /> },
                { type: 'slider' as ComponentType, label: 'Image Slider', icon: <ImageIcon size={18} /> },
                { type: 'form' as ComponentType, label: 'Contact Form', icon: <ClipboardList size={18} /> },
            ]
        },
        {
            name: 'Global', items: [
                { type: 'navbar' as ComponentType, label: 'Navigation Bar', icon: <LayoutIcon size={18} /> },
                { type: 'site-footer' as ComponentType, label: 'Site Footer', icon: <ColumnsIcon size={18} /> },
            ]
        }
    ];

    return (
        <aside style={{ width: '280px', borderRight: '1px solid hsl(var(--border))', backgroundColor: 'white', padding: '1.75rem', overflowY: 'auto' }}>
            {categories.map((cat, i) => (
                <div key={cat.name} style={{ marginBottom: i === categories.length - 1 ? 0 : '2.5rem' }}>
                    <h4 style={{ marginBottom: '1.25rem', fontSize: '0.65rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800 }}>{cat.name}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                        {cat.items.map((item) => (
                            <button
                                key={item.type}
                                onClick={() => onAdd(item.type)}
                                className="sidebar-item"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: '1px solid hsl(var(--border))',
                                    backgroundColor: '#f8fafc',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'hsl(var(--p) / 0.5)';
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px hsla(var(--p) / 0.1)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'hsl(var(--border))';
                                    e.currentTarget.style.backgroundColor = '#f8fafc';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={{ color: 'hsl(var(--p))' }}>{item.icon}</div>
                                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'hsl(var(--text-main))' }}>{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </aside>
    );
}

const StyleSection = ({ title, icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div style={{ marginBottom: '1.5rem', border: '1px solid #f1f5f9', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {icon}
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>{title}</span>
        </div>
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>{children}</div>
    </div>
);

const UnitInput = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => {
    const val = parseFloat(value) || 0;
    const unit = value?.replace(/[0-9.]/g, '') || 'px';

    return (
        <div>
            <label className="prop-label">{label}</label>
            <div style={{ display: 'flex', gap: '4px' }}>
                <input
                    type="number"
                    value={val}
                    onChange={(e) => onChange(e.target.value + unit)}
                    className="prop-input"
                    style={{ flex: 1 }}
                />
                <select
                    value={unit}
                    onChange={(e) => onChange(val + e.target.value)}
                    className="prop-input"
                    style={{ width: '60px', paddingLeft: '4px', paddingRight: '4px' }}
                >
                    <option value="px">px</option>
                    <option value="%">%</option>
                    <option value="em">em</option>
                    <option value="rem">rem</option>
                    <option value="vh">vh</option>
                </select>
            </div>
        </div>
    );
};

function PropertyEditor({ component, onUpdate, onOpenPicker }: { component: CMSComponent, onUpdate: (updates: Partial<CMSComponent>) => void, onOpenPicker: (prop: string, index?: number) => void }) {
    const [tab, setTab] = useState<'content' | 'style'>('content');
    const handlePropChange = (key: string, value: any) => onUpdate({ props: { ...component.props, [key]: value } });
    const handleStyleChange = (key: string, value: any) => {
        const next: Record<string, any> = { ...(component.styles || {}), [key]: value };
        // Remove keys explicitly set to undefined so conditionals work correctly
        if (value === undefined) delete next[key];
        onUpdate({ styles: next });
    };
    const handleStyleClear = (...keys: string[]) => {
        const next: Record<string, any> = { ...(component.styles || {}) };
        keys.forEach(k => delete next[k]);
        onUpdate({ styles: next });
    };

    const fontFamilies = [
        'Inter, sans-serif',
        'system-ui, sans-serif',
        'Georgia, serif',
        'Monaco, monospace',
        'Outfit, sans-serif',
        'Playfair Display, serif',
        'Roboto, sans-serif',
        'Montserrat, sans-serif',
        'Poppins, sans-serif',
        'Open Sans, sans-serif',
        'Lato, sans-serif',
        'Merriweather, serif',
        'Nunito, sans-serif',
        'Raleway, sans-serif',
        'Ubuntu, sans-serif',
        'Oswald, sans-serif'
    ];

    const styles: any = component.styles || {};

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '10px', padding: '4px' }}>
                {['content', 'style'].map(t => (
                    <button key={t} onClick={() => setTab(t as any)} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: tab === t ? 'white' : 'transparent', boxShadow: tab === t ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', textTransform: 'uppercase' }}>{t}</button>
                ))}
            </div>

            {tab === 'content' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {Object.entries(component.props || {}).map(([key, value]) => {
                        if (key === 'slides' && Array.isArray(value)) {
                            return (
                                <div key={key}>
                                    <label className="prop-label">Slides</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {value.map((slide: any, index: number) => (
                                            <div key={index} className="card" style={{ padding: '1rem', backgroundColor: '#f8fafc' }}>
                                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                                                    <div
                                                        onClick={() => onOpenPicker('slides', index)}
                                                        style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', flexShrink: 0, border: '1px solid hsl(var(--border))' }}
                                                    >
                                                        <img src={slide.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <input
                                                            className="prop-input"
                                                            style={{ marginBottom: '0.5rem' }}
                                                            value={slide.title}
                                                            placeholder="Slide Title"
                                                            onChange={(e) => {
                                                                const newSlides = [...value];
                                                                newSlides[index] = { ...newSlides[index], title: e.target.value };
                                                                handlePropChange('slides', newSlides);
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const newSlides = value.filter((_, i) => i !== index);
                                                                handlePropChange('slides', newSlides);
                                                            }}
                                                            style={{ color: '#ef4444', fontSize: '0.7rem', fontWeight: 700 }}
                                                        >Remove Slide</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            className="btn btn-outline"
                                            style={{ width: '100%', fontSize: '0.75rem' }}
                                            onClick={() => {
                                                const newSlides = [...value, { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426', title: 'New Slide' }];
                                                handlePropChange('slides', newSlides);
                                            }}
                                        >
                                            <Plus size={14} /> Add Slide
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        if (key === 'fields' && Array.isArray(value)) {
                            return (
                                <div key={key}>
                                    <label className="prop-label">Form Fields</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {value.map((field: any, index: number) => (
                                            <div key={index} className="card" style={{ padding: '1rem', backgroundColor: '#f8fafc' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <input
                                                            className="prop-input"
                                                            style={{ flex: 2 }}
                                                            value={field.label}
                                                            placeholder="Field Label"
                                                            onChange={(e) => {
                                                                const newFields = [...value];
                                                                newFields[index] = { ...newFields[index], label: e.target.value };
                                                                handlePropChange('fields', newFields);
                                                            }}
                                                        />
                                                        <select
                                                            className="prop-input"
                                                            style={{ flex: 1.5 }}
                                                            value={field.type}
                                                            onChange={(e) => {
                                                                const newFields = [...value];
                                                                newFields[index] = { ...newFields[index], type: e.target.value };
                                                                handlePropChange('fields', newFields);
                                                            }}
                                                        >
                                                            <option value="text">Text</option>
                                                            <option value="email">Email</option>
                                                            <option value="tel">Phone</option>
                                                            <option value="textarea">Textarea</option>
                                                        </select>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                        <input
                                                            className="prop-input"
                                                            value={field.placeholder}
                                                            placeholder="Placeholder"
                                                            onChange={(e) => {
                                                                const newFields = [...value];
                                                                newFields[index] = { ...newFields[index], placeholder: e.target.value };
                                                                handlePropChange('fields', newFields);
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const newFields = value.filter((_, i) => i !== index);
                                                                handlePropChange('fields', newFields);
                                                            }}
                                                            style={{ color: '#ef4444', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' }}
                                                        >Remove</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            className="btn btn-outline"
                                            style={{ width: '100%', fontSize: '0.75rem' }}
                                            onClick={() => {
                                                const newFields = [...value, { label: 'New Field', name: 'field_' + Date.now(), type: 'text', placeholder: 'Enter value', required: false }];
                                                handlePropChange('fields', newFields);
                                            }}
                                        >
                                            <Plus size={14} /> Add Field
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        // Navbar links editor
                        if (key === 'links' && Array.isArray(value) && (component.type === 'navbar')) {
                            return (
                                <div key={key}>
                                    <label className="prop-label">Navigation Links</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {value.map((link: any, index: number) => (
                                            <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <input
                                                    className="prop-input"
                                                    style={{ flex: 2 }}
                                                    value={link.label}
                                                    placeholder="Label"
                                                    onChange={(e) => {
                                                        const updated = [...value];
                                                        updated[index] = { ...updated[index], label: e.target.value };
                                                        handlePropChange('links', updated);
                                                    }}
                                                />
                                                <input
                                                    className="prop-input"
                                                    style={{ flex: 2 }}
                                                    value={link.href}
                                                    placeholder="URL"
                                                    onChange={(e) => {
                                                        const updated = [...value];
                                                        updated[index] = { ...updated[index], href: e.target.value };
                                                        handlePropChange('links', updated);
                                                    }}
                                                />
                                                <button onClick={() => handlePropChange('links', value.filter((_: any, i: number) => i !== index))} style={{ color: '#ef4444', flexShrink: 0 }}><Trash2 size={14} /></button>
                                            </div>
                                        ))}
                                        <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.75rem' }} onClick={() => handlePropChange('links', [...value, { label: 'New Link', href: '#' }])}>
                                            <Plus size={14} /> Add Link
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        // Footer columns editor
                        if (key === 'columns' && Array.isArray(value) && component.type === 'site-footer') {
                            return (
                                <div key={key}>
                                    <label className="prop-label">Footer Columns</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {value.map((col: any, ci: number) => (
                                            <div key={ci} className="card" style={{ padding: '1rem', backgroundColor: '#f8fafc' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                    <input
                                                        className="prop-input"
                                                        value={col.title}
                                                        placeholder="Column Title"
                                                        onChange={(e) => {
                                                            const updated = [...value];
                                                            updated[ci] = { ...updated[ci], title: e.target.value };
                                                            handlePropChange('columns', updated);
                                                        }}
                                                    />
                                                    <button onClick={() => handlePropChange('columns', value.filter((_: any, i: number) => i !== ci))} style={{ color: '#ef4444', marginLeft: '0.5rem', flexShrink: 0 }}><Trash2 size={14} /></button>
                                                </div>
                                                {(col.links || []).map((link: any, li: number) => (
                                                    <div key={li} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                                                        <input className="prop-input" style={{ flex: 2 }} value={link.label} placeholder="Label" onChange={(e) => {
                                                            const updated = [...value]; updated[ci].links[li] = { ...link, label: e.target.value }; handlePropChange('columns', updated);
                                                        }} />
                                                        <input className="prop-input" style={{ flex: 2 }} value={link.href} placeholder="URL" onChange={(e) => {
                                                            const updated = [...value]; updated[ci].links[li] = { ...link, href: e.target.value }; handlePropChange('columns', updated);
                                                        }} />
                                                        <button onClick={() => { const updated = [...value]; updated[ci].links = col.links.filter((_: any, i: number) => i !== li); handlePropChange('columns', updated); }} style={{ color: '#ef4444', flexShrink: 0 }}><Trash2 size={12} /></button>
                                                    </div>
                                                ))}
                                                <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.7rem', marginTop: '0.25rem' }} onClick={() => {
                                                    const updated = [...value]; updated[ci].links = [...(col.links || []), { label: 'New Link', href: '#' }]; handlePropChange('columns', updated);
                                                }}><Plus size={12} /> Add Link</button>
                                            </div>
                                        ))}
                                        <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.75rem' }} onClick={() => handlePropChange('columns', [...value, { title: 'New Column', links: [{ label: 'Link', href: '#' }] }])}>
                                            <Plus size={14} /> Add Column
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        if (key === 'level' && component.type === 'heading') {
                            return (
                                <div key={key}>
                                    <label className="prop-label">Heading Level</label>
                                    <select value={value as string} onChange={(e) => handlePropChange(key, e.target.value)} className="prop-input">
                                        <option value="h1">Header 1 (H1)</option>
                                        <option value="h2">Header 2 (H2)</option>
                                        <option value="h3">Header 3 (H3)</option>
                                        <option value="h4">Header 4 (H4)</option>
                                        <option value="h5">Header 5 (H5)</option>
                                        <option value="h6">Header 6 (H6)</option>
                                    </select>
                                </div>
                            );
                        }

                        if (key === 'variant' && component.type === 'button') {
                            return (
                                <div key={key}>
                                    <label className="prop-label">Button Style (Variant)</label>
                                    <select value={value as string} onChange={(e) => handlePropChange(key, e.target.value)} className="prop-input">
                                        <option value="primary">Primary (Solid)</option>
                                        <option value="secondary">Secondary</option>
                                        <option value="outline">Outline</option>
                                        <option value="ghost">Ghost (Text Only)</option>
                                    </select>
                                </div>
                            );
                        }

                        return (
                            <div key={key}>
                                <label className="prop-label">{key.replace(/([A-Z])/g, ' $1')}</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {typeof value === 'string' && value.length > 50 ? (
                                        <textarea value={value} onChange={(e) => handlePropChange(key, e.target.value)} className="prop-input" style={{ minHeight: '120px' }} />
                                    ) : (
                                        <input type="text" value={value as string} onChange={(e) => handlePropChange(key, e.target.value)} className="prop-input" />
                                    )}
                                    {(key.toLowerCase().includes('url') || key.toLowerCase().includes('logo') || key.toLowerCase().includes('image')) && (
                                        <button
                                            onClick={() => onOpenPicker(key)}
                                            className="btn btn-outline"
                                            style={{ width: '40px', padding: 0, flexShrink: 0 }}
                                        >
                                            <ImageIcon size={18} />
                                        </button>
                                    )}
                                </div>
                                {key === 'url' && component.type === 'image' && (
                                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div>
                                            <label className="prop-label">Overlay Text</label>
                                            <input type="text" value={component.props.overlayText || ''} onChange={(e) => handlePropChange('overlayText', e.target.value)} className="prop-input" placeholder="Animated hover text" />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div>
                                                <label className="prop-label">Overlay Color</label>
                                                <input type="color" value={component.props.overlayColor || '#000000'} onChange={(e) => handlePropChange('overlayColor', e.target.value)} className="prop-input" style={{ height: '36px', padding: '2px' }} />
                                            </div>
                                            <div>
                                                <label className="prop-label">Overlay Opacity (0-1)</label>
                                                <input type="number" step="0.1" min="0" max="1" value={component.props.overlayOpacity !== undefined ? component.props.overlayOpacity : 0.4} onChange={(e) => handlePropChange('overlayOpacity', parseFloat(e.target.value))} className="prop-input" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <StyleSection title="Typography" icon={<TypographyIcon size={14} />}>
                        <div>
                            <label className="prop-label">Font Family</label>
                            <select value={styles.fontFamily || 'Inter, sans-serif'} onChange={(e) => handleStyleChange('fontFamily', e.target.value)} className="prop-input">
                                {fontFamilies.map(f => <option key={f} value={f}>{f.split(',')[0]}</option>)}
                            </select>
                        </div>
                        <UnitInput label="Font Size" value={styles.fontSize || '16px'} onChange={(val) => handleStyleChange('fontSize', val)} />
                        <div>
                            <label className="prop-label">Weight</label>
                            <select value={styles.fontWeight || '400'} onChange={(e) => handleStyleChange('fontWeight', e.target.value)} className="prop-input">
                                <option value="300">Light</option>
                                <option value="400">Regular</option>
                                <option value="600">Semi-Bold</option>
                                <option value="700">Bold</option>
                                <option value="900">Black</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {[
                                { k: 'fontStyle', v: 'italic', icon: <Italic size={14} /> },
                                { k: 'textDecoration', v: 'underline', icon: <Underline size={14} /> },
                            ].map(tool => (
                                <button key={tool.k} onClick={() => handleStyleChange(tool.k, styles[tool.k] === tool.v ? 'normal' : tool.v)}
                                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: styles[tool.k] === tool.v ? '#f1f5f9' : 'white' }}>
                                    {tool.icon}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="prop-label">Line Height</label>
                                <input type="number" step="0.1" value={parseFloat(styles.lineHeight || '1.5')} onChange={(e) => handleStyleChange('lineHeight', e.target.value)} className="prop-input" />
                            </div>
                            <div>
                                <label className="prop-label">Spacing</label>
                                <input type="number" step="0.5" value={parseFloat(styles.letterSpacing || '0')} onChange={(e) => handleStyleChange('letterSpacing', e.target.value + 'px')} className="prop-input" />
                            </div>
                        </div>
                    </StyleSection>

                    <StyleSection title="Background & Colors" icon={<Palette size={14} />}>
                        <div>
                            <label className="prop-label">Background Type</label>
                            <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f1f5f9', padding: '2px', borderRadius: '8px' }}>
                                {['Transparent', 'Solid', 'Gradient', 'Image'].map(t => {
                                    const isTransparent = (!styles.backgroundColor || styles.backgroundColor === 'transparent') && !styles.backgroundGradient && styles.backgroundImage === undefined;
                                    const isSolid = styles.backgroundColor && styles.backgroundColor !== 'transparent' && !styles.backgroundGradient && styles.backgroundImage === undefined;
                                    const isActive = (t === 'Transparent' && isTransparent) ||
                                        (t === 'Solid' && isSolid) ||
                                        (t === 'Gradient' && !!styles.backgroundGradient) ||
                                        (t === 'Image' && styles.backgroundImage !== undefined && !styles.backgroundGradient);
                                    return (
                                        <button key={t} onClick={() => {
                                            if (t === 'Transparent') {
                                                handleStyleClear('backgroundGradient', 'backgroundImage');
                                                handleStyleChange('backgroundColor', 'transparent');
                                            } else if (t === 'Solid') {
                                                handleStyleClear('backgroundGradient', 'backgroundImage');
                                                handleStyleChange('backgroundColor', styles.backgroundColor && styles.backgroundColor !== 'transparent' ? styles.backgroundColor : '#f8fafc');
                                            } else if (t === 'Gradient') {
                                                handleStyleClear('backgroundImage', 'backgroundColor');
                                                handleStyleChange('backgroundGradient', styles.backgroundGradient || 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)');
                                            } else {
                                                handleStyleClear('backgroundGradient', 'backgroundColor');
                                                handleStyleChange('backgroundImage', styles.backgroundImage || '');
                                            }
                                        }} style={{ flex: 1, padding: '8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, backgroundColor: isActive ? 'white' : 'transparent', boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.1)' : 'none' }}>
                                            {t}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {(!styles.backgroundImage && styles.backgroundImage !== '') && !styles.backgroundGradient && styles.backgroundColor && styles.backgroundColor !== 'transparent' && (() => {
                            const parseColor = () => {
                                const str = styles.backgroundColor || '#ffffff';
                                if (str.startsWith('rgba')) {
                                    const m = str.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/);
                                    if (m) {
                                        const r = parseInt(m[1]).toString(16).padStart(2, '0');
                                        const g = parseInt(m[2]).toString(16).padStart(2, '0');
                                        const b = parseInt(m[3]).toString(16).padStart(2, '0');
                                        return { hex: `#${r}${g}${b}`, opacity: Math.round(parseFloat(m[4]) * 100) };
                                    }
                                }
                                if (str.length === 9 && str.startsWith('#')) {
                                    const alpha = parseInt(str.substring(7, 9), 16) / 255;
                                    return { hex: str.substring(0, 7), opacity: Math.round(alpha * 100) };
                                }
                                return { hex: str.startsWith('#') ? str.substring(0, 7) : (str === 'transparent' ? '#ffffff' : '#f8fafc'), opacity: str === 'transparent' ? 0 : 100 };
                            };
                            const c = parseColor();
                            const setColor = (hx: string, op: number) => {
                                hx = hx.replace('#', '');
                                if (hx.length === 3) hx = hx.split('').map(x => x + x).join('');
                                const r = parseInt(hx.substring(0, 2), 16) || 255;
                                const g = parseInt(hx.substring(2, 4), 16) || 255;
                                const b = parseInt(hx.substring(4, 6), 16) || 255;
                                handleStyleChange('backgroundColor', `rgba(${r}, ${g}, ${b}, ${op / 100})`);
                            };
                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label className="prop-label">Background Color</label>
                                        <div style={{ position: 'relative', height: '40px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: styles.backgroundColor || '#ffffff' }}>
                                            <input type="color" value={c.hex} onChange={(e) => setColor(e.target.value, c.opacity)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                                            <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.8)', pointerEvents: 'none' }}>{styles.backgroundColor || '#ffffff'}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="prop-label">Opacity ({c.opacity}%)</label>
                                        <input type="range" min="0" max="100" value={c.opacity} onChange={(e) => setColor(c.hex, parseInt(e.target.value))} style={{ width: '100%' }} />
                                    </div>
                                </div>
                            );
                        })()}

                        {styles.backgroundGradient && (() => {
                            const parseObj = () => {
                                const str = styles.backgroundGradient || '';
                                const dMatch = str.match(/(?:linear-gradient\()(\d+)deg/);
                                const cMatch = str.match(/(#[0-9a-fA-F]{3,8})/g);
                                const sMatch = str.match(/(\d+)%/);
                                return {
                                    degree: dMatch ? parseInt(dMatch[1]) : 135,
                                    color1: cMatch?.[0] || '#6366f1',
                                    color2: cMatch?.[1] || '#a855f7',
                                    split: sMatch ? parseInt(sMatch[1]) : 0
                                };
                            };
                            const grad = parseObj();
                            const setGrad = (u: any) => {
                                const m = { ...grad, ...u };
                                handleStyleChange('backgroundGradient', `linear-gradient(${m.degree}deg, ${m.color1} ${m.split}%, ${m.color2} 100%)`);
                            };
                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label className="prop-label">Color 1</label>
                                            <div style={{ position: 'relative', height: '36px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: grad.color1 }}>
                                                <input type="color" value={grad.color1} onChange={(e) => setGrad({ color1: e.target.value })} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                                                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem', color: 'white', pointerEvents: 'none' }}>{grad.color1}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="prop-label">Color 2</label>
                                            <div style={{ position: 'relative', height: '36px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: grad.color2 }}>
                                                <input type="color" value={grad.color2} onChange={(e) => setGrad({ color2: e.target.value })} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                                                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem', color: 'white', pointerEvents: 'none' }}>{grad.color2}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label className="prop-label">Angle ({grad.degree}°)</label>
                                            <input type="range" min="0" max="360" value={grad.degree} onChange={(e) => setGrad({ degree: parseInt(e.target.value) })} style={{ width: '100%' }} />
                                        </div>
                                        <div>
                                            <label className="prop-label">Split ({grad.split}%)</label>
                                            <input type="range" min="0" max="100" value={grad.split} onChange={(e) => setGrad({ split: parseInt(e.target.value) })} style={{ width: '100%' }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {styles.backgroundImage !== undefined && !styles.backgroundGradient && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label className="prop-label">Background Image</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input type="text" value={styles.backgroundImage || ''} onChange={(e) => handleStyleChange('backgroundImage', e.target.value)} className="prop-input" placeholder="https://..." />
                                        <button onClick={() => onOpenPicker('__bgImage__')} className="btn btn-outline" style={{ width: '40px', padding: 0, flexShrink: 0 }}><ImageIcon size={18} /></button>
                                    </div>
                                    {styles.backgroundImage && (
                                        <div style={{ marginTop: '0.5rem', height: '80px', borderRadius: '8px', backgroundImage: `url(${styles.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid #e2e8f0' }} />
                                    )}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label className="prop-label">Size</label>
                                        <select value={styles.backgroundSize || 'cover'} onChange={(e) => handleStyleChange('backgroundSize', e.target.value)} className="prop-input">
                                            <option value="cover">Cover</option>
                                            <option value="contain">Contain</option>
                                            <option value="auto">Auto</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="prop-label">Position</label>
                                        <select value={styles.backgroundPosition || 'center'} onChange={(e) => handleStyleChange('backgroundPosition', e.target.value)} className="prop-input">
                                            <option value="center">Center</option>
                                            <option value="top">Top</option>
                                            <option value="bottom">Bottom</option>
                                            <option value="left">Left</option>
                                            <option value="right">Right</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="prop-label">Text Color</label>
                            <div style={{ position: 'relative', height: '40px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: styles.textColor || '#000000' }}>
                                <input type="color" value={styles.textColor || '#000000'} onChange={(e) => handleStyleChange('textColor', e.target.value)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: styles.textColor ? 'white' : '#64748b', pointerEvents: 'none' }}>{styles.textColor || '#000000'}</div>
                            </div>
                        </div>
                    </StyleSection>

                    <StyleSection title="Layout & Alignment" icon={<LayoutIcon size={14} />}>
                        <div>
                            <label className="prop-label">Text Align</label>
                            <div style={{ display: 'flex', gap: '2px', backgroundColor: '#f1f5f9', padding: '2px', borderRadius: '8px' }}>
                                {[
                                    { val: 'left', icon: <AlignLeft size={14} /> },
                                    { val: 'center', icon: <AlignCenter size={14} /> },
                                    { val: 'right', icon: <AlignRight size={14} /> },
                                    { val: 'justify', icon: <AlignJustify size={14} /> }
                                ].map((a) => (
                                    <button key={a.val} onClick={() => handleStyleChange('textAlign', a.val)} style={{ flex: 1, padding: '8px', borderRadius: '6px', backgroundColor: styles.textAlign === a.val ? 'white' : 'transparent', boxShadow: styles.textAlign === a.val ? '0 1px 2px rgba(0,0,0,0.1)' : 'none' }}>{a.icon}</button>
                                ))}
                            </div>
                        </div>

                        {(component.type === 'section' || component.type === 'hero') && (
                            <>
                                <div>
                                    <label className="prop-label">Display Mode</label>
                                    <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                                        {['flex', 'grid'].map(m => (
                                            <button key={m} onClick={() => handleStyleChange('display', m)} style={{ flex: 1, padding: '6px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', backgroundColor: styles.display === m ? 'white' : 'transparent', boxShadow: styles.display === m ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>{m}</button>
                                        ))}
                                    </div>
                                </div>
                                {(styles.display === 'flex' || !styles.display) && (
                                    <div>
                                        <label className="prop-label">Direction</label>
                                        <select value={styles.flexDirection || 'column'} onChange={(e) => handleStyleChange('flexDirection', e.target.value)} className="prop-input">
                                            <option value="column">Vertical (Column)</option>
                                            <option value="row">Horizontal (Row)</option>
                                        </select>
                                    </div>
                                )}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label className="prop-label">Horizontal</label>
                                        <select value={styles.justifyContent || 'center'} onChange={(e) => handleStyleChange('justifyContent', e.target.value)} className="prop-input">
                                            <option value="flex-start">Left / Top</option>
                                            <option value="center">Center</option>
                                            <option value="flex-end">Right / Bottom</option>
                                            <option value="space-between">Space Between</option>
                                            <option value="space-around">Space Around</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="prop-label">Vertical</label>
                                        <select value={styles.alignItems || 'center'} onChange={(e) => handleStyleChange('alignItems', e.target.value)} className="prop-input">
                                            <option value="flex-start">Top</option>
                                            <option value="center">Middle</option>
                                            <option value="flex-end">Bottom</option>
                                            <option value="stretch">Stretch</option>
                                        </select>
                                    </div>
                                </div>
                                {styles.display === 'grid' && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label className="prop-label">Columns</label>
                                            <select value={styles.gridColumns || '2'} onChange={(e) => handleStyleChange('gridColumns', e.target.value)} className="prop-input">
                                                {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n.toString()}>{n} Col</option>)}
                                            </select>
                                        </div>
                                        <UnitInput label="Gap" value={styles.gap || '20px'} onChange={(val) => handleStyleChange('gap', val)} />
                                    </div>
                                )}
                                {styles.display === 'flex' && (
                                    <UnitInput label="Gap" value={styles.gap || '0px'} onChange={(val) => handleStyleChange('gap', val)} />
                                )}
                            </>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <UnitInput label="Max Width" value={styles.maxWidth || '100%'} onChange={(val) => handleStyleChange('maxWidth', val)} />
                            <UnitInput label="Radius" value={styles.borderRadius || '0px'} onChange={(val) => handleStyleChange('borderRadius', val)} />
                        </div>
                    </StyleSection>

                    <StyleSection title="Animations" icon={<Star size={14} />}>
                        <div>
                            <label className="prop-label">Animation Type</label>
                            <select
                                value={styles.animationType || 'none'}
                                onChange={(e) => handleStyleChange('animationType', e.target.value)}
                                className="prop-input"
                            >
                                <option value="none">None</option>
                                <option value="fade">Fade In</option>
                                <option value="slideUp">Slide Up</option>
                                <option value="slideDown">Slide Down</option>
                                <option value="slideLeft">Slide Left</option>
                                <option value="slideRight">Slide Right</option>
                                <option value="scale">Scale In</option>
                                <option value="bounce">Bounce (Infinite)</option>
                                <option value="scroll-zoom-text">Scroll Zoom + Text Overlay</option>
                            </select>
                        </div>
                        {styles.animationType && styles.animationType !== 'none' && (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label className="prop-label">Duration (s)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={styles.animationDuration || 0.6}
                                            onChange={(e) => handleStyleChange('animationDuration', parseFloat(e.target.value))}
                                            className="prop-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="prop-label">Delay (s)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={styles.animationDelay || 0}
                                            onChange={(e) => handleStyleChange('animationDelay', parseFloat(e.target.value))}
                                            className="prop-input"
                                        />
                                    </div>
                                </div>
                                {['slideUp', 'slideDown', 'slideLeft', 'slideRight'].includes(styles.animationType) && (
                                    <div>
                                        <label className="prop-label">Distance (px)</label>
                                        <input
                                            type="number"
                                            step="10"
                                            min="0"
                                            value={styles.animationDistance || 50}
                                            onChange={(e) => handleStyleChange('animationDistance', parseInt(e.target.value))}
                                            className="prop-input"
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </StyleSection>

                    <StyleSection title="Spacing" icon={<Maximize size={14} />}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {['Top', 'Bottom', 'Left', 'Right'].map(dir => (
                                <UnitInput key={dir} label={`Padding ${dir}`} value={styles[`padding${dir}`] || '0px'} onChange={(val) => handleStyleChange(`padding${dir}`, val)} />
                            ))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {['Top', 'Bottom'].map(dir => (
                                <UnitInput key={dir} label={`Margin ${dir}`} value={styles[`margin${dir}`] || '0px'} onChange={(val) => handleStyleChange(`margin${dir}`, val)} />
                            ))}
                            <UnitInput label="Element Gap" value={styles.gap || '0px'} onChange={(val) => handleStyleChange('gap', val)} />
                        </div>
                    </StyleSection>
                </div>
            )}
        </div>
    );
}

function getDefaultProps(type: ComponentType) {
    switch (type) {
        case 'hero': return { title: 'Design Your Future', subtitle: 'A revolutionary platform building the next generation of full-stack business tools.', ctaText: '' };
        case 'heading': return { content: 'Heading Text', level: 'h2' };
        case 'text': return { content: 'Add your story here. This editor gives you full control over your content and how it appears to your customers.' };
        case 'image': return { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426', alt: 'Dashboard mockup', overlayText: '', overlayColor: '#000000', overlayOpacity: 0.4 };
        case 'button': return { label: 'Click Me!', link: '#', variant: 'primary' };
        case 'features': return { title: 'Explore Features', items: [{ title: 'Fast', desc: 'Optimized for modern web' }, { title: 'Secure', desc: 'Built-in protection' }] };
        case 'pricing': return { title: 'Pricing Plans' };
        case 'testimonials': return { title: 'What Our Clients Say' };
        case 'slider': return {
            slides: [
                { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426', title: 'Modern Business Solutions', description: 'Scale your business with our cutting-edge technology.' },
                { url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2574', title: 'Empowering Innovation', description: 'Driving the future of digital transformation.' }
            ]
        };
        case 'form': return {
            title: 'Get In Touch',
            description: 'Have a question? We would love to hear from you.',
            submitText: 'Send Message',
            successMsg: 'Thank you! Your message has been sent.',
            fields: [
                { label: 'Name', name: 'name', type: 'text', placeholder: 'Your name', required: true },
                { label: 'Email', name: 'email', type: 'email', placeholder: 'Your email', required: true },
                { label: 'Message', name: 'message', type: 'textarea', placeholder: 'How can we help?', required: true },
            ]
        };
        case 'navbar': return {
            siteName: 'My Brand',
            logoUrl: '',
            links: [
                { label: 'Home', href: '/' },
                { label: 'Features', href: '#' },
                { label: 'About', href: '#' },
                { label: 'Contact', href: '#' },
            ],
            ctaLabel: 'Get Started',
            ctaHref: '#',
        };
        case 'site-footer': return {
            siteName: 'My Brand',
            logoUrl: '',
            description: 'Empowering businesses with modern solutions. Built with passion and precision.',
            copyrightText: '',
            columns: [
                { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Press', href: '#' }] },
                { title: 'Product', links: [{ label: 'Features', href: '#' }, { label: 'Pricing', href: '#' }, { label: 'Changelog', href: '#' }] },
                { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }] },
            ],
        };
        default: return {};
    }
}
