import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProjectViewModel from '@/models/ProjectView';

// GET /api/project-views?slug=fir-filter — get view count
export async function GET(req: NextRequest) {
    const slug = req.nextUrl.searchParams.get('slug');
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

    await dbConnect();
    const doc = await ProjectViewModel.findOne({ slug }).lean() as any;
    return NextResponse.json({ views: doc?.views ?? 0 });
}

// POST /api/project-views — increment and return new count
export async function POST(req: NextRequest) {
    const { slug } = await req.json();
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

    await dbConnect();
    const doc = await ProjectViewModel.findOneAndUpdate(
        { slug },
        { $inc: { views: 1 } },
        { upsert: true, new: true }
    ).lean() as any;

    return NextResponse.json({ views: doc.views });
}