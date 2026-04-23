'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CMSComponent } from '@/types/cms';
import { GripVertical, Trash2 } from 'lucide-react';

interface Props {
    component: CMSComponent;
    isSelected: boolean;
    onClick: () => void;
    onRemove: () => void;
}

export function SortableItem({ component, isSelected, onClick, onRemove }: Props) {
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
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative' as const,
        border: isSelected ? '2px solid #6366f1' : '2px solid transparent',
        borderRadius: '8px',
        marginBottom: '8px',
        cursor: 'default',
        backgroundColor: isSelected ? '#f5f3ff' : 'transparent',
    };

    const renderPreview = () => {
        switch (component.type) {
            case 'hero':
                return (
                    <div style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: 'white', borderRadius: '4px' }}>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{component.props.title}</h1>
                        <p style={{ opacity: 0.9, fontSize: '0.875rem' }}>{component.props.subtitle}</p>
                    </div>
                );
            case 'text':
                return (
                    <div style={{ padding: '1.5rem', border: '1px dashed #e2e8f0', borderRadius: '4px' }}>
                        <p style={{ color: '#475569' }}>{component.props.content}</p>
                    </div>
                );
            case 'image':
                return (
                    <div style={{ textAlign: 'center', backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '4px' }}>
                        <img src={component.props.url} alt={component.props.alt} style={{ maxWidth: '100px', height: 'auto', borderRadius: '4px' }} />
                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Image: {component.props.alt}</p>
                    </div>
                );
            default:
                return <div style={{ padding: '1rem' }}>Component: {component.type}</div>;
        }
    };

    return (
        <div ref={setNodeRef} style={style} onClick={(e) => { e.stopPropagation(); onClick(); }}>
            <div style={{
                position: 'absolute',
                top: '8px',
                left: '-32px',
                cursor: 'grab',
                padding: '4px',
                color: '#94a3b8'
            }} {...attributes} {...listeners}>
                <GripVertical size={20} />
            </div>

            {isSelected && (
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    display: 'flex',
                    gap: '0.5rem',
                    zIndex: 5
                }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        style={{ padding: '4px', color: '#ef4444', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #fee2e2' }}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )}

            <div style={{ padding: '1rem' }}>
                {renderPreview()}
            </div>
        </div>
    );
}
