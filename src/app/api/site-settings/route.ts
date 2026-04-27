import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import SiteSettingsModel from '@/models/SiteSettings';

// Public GET — anyone can read settings (for homepage badge)
export async function GET() {
    await dbConnect();
    const settings = await SiteSettingsModel.find({}).lean();
    const result: Record<string, any> = {};
    settings.forEach((s: any) => { result[s.key] = s.value; });
    return NextResponse.json(result);
}

// Protected POST — only admin can update
export async function POST(req: NextRequest) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { key, value } = await req.json();
    if (!key) {
        return NextResponse.json({ error: 'Key is required.' }, { status: 400 });
    }

    await dbConnect();
    await SiteSettingsModel.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
}