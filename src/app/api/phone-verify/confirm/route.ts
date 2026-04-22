import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import dbConnect from '@/lib/mongodb';
import PhoneViewerModel from '@/models/PhoneViewer';

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: NextRequest) {
    try {
        const { phone, code, firstName, lastName } = await req.json();

        if (!phone || !code || !firstName || !lastName) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        // Verify the OTP with Twilio
        const result = await client.verify.v2
            .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
            .verificationChecks.create({ to: phone, code });

        if (result.status !== 'approved') {
            return NextResponse.json(
                { error: 'Invalid or expired verification code.' },
                { status: 400 }
            );
        }

        // Get IP and country from request headers
        const ip =
            req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
            req.headers.get('x-real-ip') ||
            'unknown';

        const country = req.headers.get('x-vercel-ip-country') || 'unknown';

        // Save to MongoDB
        await dbConnect();
        await PhoneViewerModel.create({ firstName, lastName, phone, ip, country });

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error('Twilio verify error:', err?.message, 'code:', err?.code);

        const twilioMessage: string = err?.message || '';

        if (err?.code === 60202) {
            return NextResponse.json(
                { error: 'Maximum verification attempts reached. Please request a new code.' },
                { status: 400 }
            );
        }

        if (err?.code === 60203) {
            return NextResponse.json(
                { error: 'Maximum send attempts reached. Please wait before requesting a new code.' },
                { status: 400 }
            );
        }

        if (
            twilioMessage.toLowerCase().includes('not a valid phone number') ||
            twilioMessage.toLowerCase().includes('unverified') ||
            err?.code === 21608
        ) {
            return NextResponse.json(
                { error: 'This number is not verified in Twilio. During trial, only pre-verified numbers can receive SMS.' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: twilioMessage ? `Verification failed: ${twilioMessage}` : 'Verification failed. Please try again.' },
            { status: 500 }
        );
    }
}