import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import ChatLogModel from '@/models/ChatLog';

export async function GET() {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const logs = await ChatLogModel.find({}).sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json({ logs });
}

export async function DELETE() {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    await ChatLogModel.deleteMany({});
    return NextResponse.json({ success: true });
}