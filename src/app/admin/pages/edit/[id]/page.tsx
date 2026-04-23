import React from 'react';
import { prisma } from '@/lib/prisma';
import Editor from '@/components/admin/Editor';
import { notFound } from 'next/navigation';

export default async function EditPage({ params }: { params: { id: string } }) {
    const page = await prisma.page.findUnique({
        where: { id: params.id },
    });

    if (!page) {
        notFound();
    }

    const initialData = {
        ...page,
        content: JSON.parse(page.content),
    };

    return <Editor initialData={initialData} />;
}
