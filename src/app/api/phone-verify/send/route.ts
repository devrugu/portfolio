import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: NextRequest) {
    try {
        const { phone } = await req.json();

        if (!phone) {
            return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
        }

        // E.164 format check (e.g. +905XXXXXXXXX)
        const e164Regex = /^\+[1-9]\d{7,14}$/;
        if (!e164Regex.test(phone)) {
            return NextResponse.json(
                { error: 'Please enter a valid phone number with country code (e.g. +905XXXXXXXXX).' },
                { status: 400 }
            );
        }

        await client.verify.v2
            .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
            .verifications.create({ to: phone, channel: 'sms' });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Twilio send error:', err);
        return NextResponse.json(
            { error: 'Failed to send verification code. Please try again.' },
            { status: 500 }
        );
    }
}