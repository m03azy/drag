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
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CMSComponent, ComponentType } from '@/types/cms';
import { SortableItem } from './SortableItem';
import { Save, Eye, Move } from 'lucide-react';
import Link from 'next/link';


export default function Editor({ initialData }: { initialData?: any }) {
    const [components, setComponents] = useState<CMSComponent[]>(initialData?.content || []);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
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
            setComponents((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }

        setActiveId(null);
    };

    const addComponent = (type: ComponentType) => {
        const newComponent: CMSComponent = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            props: getDefaultProps(type),
        };
        setComponents([...components, newComponent]);
    };

    const updateComponentProps = (id: string, newProps: any) => {
        setComponents(components.map(c => c.id === id ? { ...c, props: { ...c.props, ...newProps } } : c));
    };

    const removeComponent = (id: string) => {
        setComponents(components.filter(c => c.id !== id));
        if (selectedId === id) setSelectedId(null);
    };

    const handleSave = async () => {
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

            if (res.ok) {
                alert('Page saved successfully!');
            } else {
                alert('Failed to save page');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving page');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)', margin: '-2rem' }}>
            {/* Editor Header */}
            <header style={{
                height: '4rem',
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 2rem',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem' }}>Page Editor</h2>
                    <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{initialData?.title}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href={`/${initialData?.slug}`} target="_blank" className="btn btn-outline"><Eye size={18} /> Preview</Link>
                    <button onClick={handleSave} className="btn btn-primary"><Save size={18} /> Save Changes</button>
                </div>
            </header>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Components Sidebar */}
                <Sidebar onAdd={addComponent} />

                {/* Canvas Area */}
                <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f1f5f9', padding: '3rem' }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: 'white', minHeight: '80vh', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', paddingBottom: '200px' }}>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={components.map(c => c.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {components.length === 0 ? (
                                    <div style={{ padding: '6rem 2rem', textAlign: 'center', color: '#94a3b8' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                                        <h3>Your canvas is empty</h3>
                                        <p>Click components on the left to start building</p>
                                    </div>
                                ) : (
                                    components.map((comp) => (
                                        <SortableItem
                                            key={comp.id}
                                            component={comp}
                                            isSelected={selectedId === comp.id}
                                            onClick={() => setSelectedId(comp.id)}
                                            onRemove={() => removeComponent(comp.id)}
                                        />
                                    ))
                                )}
                            </SortableContext>

                            <DragOverlay>
                                {activeId ? (
                                    <div className="card" style={{ cursor: 'grabbing', opacity: 0.8 }}>
                                        <Move size={20} /> Moving component...
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    </div>
                </main>

                {/* Properties Sidebar */}
                <aside style={{ width: '300px', borderLeft: '1px solid #e2e8f0', backgroundColor: 'white', padding: '1.5rem', overflowY: 'auto' }}>
                    {selectedId ? (
                        <PropertyEditor
                            component={components.find(c => c.id === selectedId)!}
                            onUpdate={(props) => updateComponentProps(selectedId, props)}
                        />
                    ) : (
                        <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '4rem' }}>
                            Select a component to edit its properties
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}

function Sidebar({ onAdd }: { onAdd: (type: ComponentType) => void }) {
    const componentTypes: { type: ComponentType, label: string, icon: string }[] = [
        { type: 'hero', label: 'Hero Section', icon: '⚡' },
        { type: 'text', label: 'Text Content', icon: '📝' },
        { type: 'image', label: 'Image Section', icon: '🖼️' },
        { type: 'button', label: 'Button', icon: '🔘' },
        { type: 'features', label: 'Features Grid', icon: '✨' },
        { type: 'cta', label: 'Call to Action', icon: '📢' },
    ];

    return (
        <aside style={{ width: '260px', borderRight: '1px solid #e2e8f0', backgroundColor: 'white', padding: '1.5rem', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Components</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {componentTypes.map((item) => (
                    <button
                        key={item.type}
                        onClick={() => onAdd(item.type)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            textAlign: 'left',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = '#6366f1';
                            e.currentTarget.style.backgroundColor = '#f5f3ff';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.backgroundColor = 'white';
                        }}
                    >
                        <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                        <span style={{ fontWeight: 500 }}>{item.label}</span>
                    </button>
                ))}
            </div>
        </aside>
    );
}

function PropertyEditor({ component, onUpdate }: { component: CMSComponent, onUpdate: (props: any) => void }) {
    return (
        <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Editing {component.type}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {Object.entries(component.props).map(([key, value]) => (
                    <div key={key}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, textTransform: 'capitalize' }}>
                            {key.replace(/([A-Z])/g, ' $1')}
                        </label>
                        {typeof value === 'string' && value.length > 50 ? (
                            <textarea
                                value={value}
                                onChange={(e) => onUpdate({ [key]: e.target.value })}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0', minHeight: '100px' }}
                            />
                        ) : (
                            <input
                                type="text"
                                value={value as string}
                                onChange={(e) => onUpdate({ [key]: e.target.value })}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function getDefaultProps(type: ComponentType) {
    switch (type) {
        case 'hero': return { title: 'Modern Business CMS', subtitle: 'Build fast, secure, and aesthetic websites.', ctaText: 'Get Started' };
        case 'text': return { content: 'This is a text section. You can use it for your main message, about us description, or any other textual information.' };
        case 'image': return { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', alt: 'Laptop on desk' };
        case 'button': return { label: 'Click Me', link: '#' };
        default: return {};
    }
}
