'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeletePageButton({ id, title }: { id: string, title: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete the page "${title}"?`)) {
            return;
        }

        try {
            const res = await fetch(`/api/pages`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert('Failed to delete page');
            }
        } catch (err) {
            console.error(err);
            alert('Error deleting page');
        }
    };

    return (
        <button
            onClick={handleDelete}
            style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Delete Page"
        >
            <Trash2 size={18} />
        </button>
    );
}
