import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import PhoneViewerModel from '@/models/PhoneViewer';

export async function GET(req: NextRequest) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const viewers = await PhoneViewerModel.find({}).sort({ viewedAt: -1 }).lean();

    return NextResponse.json({ viewers });
}