import { NextResponse } from 'next/server';
import { writeFile, readdir, unlink } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
    try {
        const formData = await req.json();
        const { file, fileName } = formData;

        if (!file || !fileName) {
            return NextResponse.json({ error: 'No file or fileName provided' }, { status: 400 });
        }

        // Decode base64 file
        const buffer = Buffer.from(file.split(',')[1], 'base64');
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(uploadDir, fileName);

        await writeFile(filePath, buffer);

        return NextResponse.json({ url: `/uploads/${fileName}`, fileName });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        let files: string[] = [];
        try {
            files = await readdir(uploadDir);
        } catch (e) {
            // Directory might not exist yet
            return NextResponse.json([]);
        }

        const media = files.map(file => ({
            name: file,
            url: `/uploads/${file}`,
            size: 0, // In a real app, we'd get stats
            type: file.split('.').pop()
        }));

        return NextResponse.json(media);
    } catch (error) {
        console.error('Error fetching media:', error);
        return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { fileName } = await req.json();
        const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
        await unlink(filePath);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting file:', error);
        return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
    }
}
