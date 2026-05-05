import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        let settings = await (prisma as any).siteSettings.findUnique({
            where: { id: 'global' },
        });

        if (!settings) {
            settings = await (prisma as any).siteSettings.create({
                data: { id: 'global', siteName: 'My Business Site' }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const settings = await (prisma as any).siteSettings.upsert({
            where: { id: 'global' },
            create: {
                id: 'global',
                ...body
            },
            update: {
                ...body
            }
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
