import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, slug, content } = body;

        const page = await prisma.page.create({
            data: {
                title,
                slug,
                content: JSON.stringify(content),
            },
        });

        return NextResponse.json(page);
    } catch (error) {
        console.error('Error creating page:', error);
        return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, title, slug, content, published } = body;

        const page = await prisma.page.update({
            where: { id },
            data: {
                title,
                slug,
                content: JSON.stringify(content),
                published,
            },
        });

        return NextResponse.json(page);
    } catch (error) {
        console.error('Error updating page:', error);
        return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
    }
}
