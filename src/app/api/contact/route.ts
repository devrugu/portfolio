import { NextRequest, NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = 'contact@ugurcanyilmaz.com';
const TO_EMAIL = 'devrugu@ugurcanyilmaz.com';

// In-memory OTP store: email -> { code, expiresAt, name, message }
// This works fine for serverless — each verification is short-lived
const otpStore = new Map<string, {
    code: string;
    expiresAt: number;
    name: string;
    message: string;
}>();

// Generate a 6-digit code
function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP to user's email
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action } = body;

        // ── Step 1: Send OTP ──────────────────────────────────────────
        if (action === 'send_otp') {
            const { name, email, message } = body;

            if (!name?.trim() || !email?.trim() || !message?.trim()) {
                return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
            }

            if (message.trim().length < 10) {
                return NextResponse.json({ error: 'Message must be at least 10 characters.' }, { status: 400 });
            }

            const code = generateCode();
            const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

            // Store OTP with form data
            otpStore.set(email.toLowerCase(), { code, expiresAt, name, message });

            // Send verification email to user
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: `Uğurcan Yılmaz <${FROM_EMAIL}>`,
                    to: [email],
                    subject: 'Verify your email — Portfolio Contact',
                    html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9f9f9; border-radius: 12px;">
              <h2 style="color: #111; margin-bottom: 8px;">Verify your email</h2>
              <p style="color: #555; margin-bottom: 24px;">
                You're sending a message to Uğurcan Yılmaz. Enter the code below to confirm your email and send your message.
              </p>
              <div style="background: white; border: 2px solid #f0a500; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <p style="color: #999; font-size: 12px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.1em;">Your verification code</p>
                <p style="font-size: 40px; font-weight: 700; color: #111; letter-spacing: 0.2em; margin: 0;">${code}</p>
                <p style="color: #999; font-size: 12px; margin: 8px 0 0;">Valid for 10 minutes</p>
              </div>
              <p style="color: #999; font-size: 12px;">
                If you didn't request this, you can safely ignore this email.
              </p>
            </div>
          `,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                console.error('Resend OTP error:', err);
                return NextResponse.json({ error: 'Failed to send verification email. Please try again.' }, { status: 500 });
            }

            return NextResponse.json({ success: true });
        }

        // ── Step 2: Verify OTP and send contact message ───────────────
        if (action === 'verify_and_send') {
            const { email, code } = body;

            if (!email?.trim() || !code?.trim()) {
                return NextResponse.json({ error: 'Email and code are required.' }, { status: 400 });
            }

            const stored = otpStore.get(email.toLowerCase());

            if (!stored) {
                return NextResponse.json({ error: 'No verification code found. Please request a new one.' }, { status: 400 });
            }

            if (Date.now() > stored.expiresAt) {
                otpStore.delete(email.toLowerCase());
                return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 });
            }

            if (stored.code !== code.trim()) {
                return NextResponse.json({ error: 'Invalid verification code. Please try again.' }, { status: 400 });
            }

            // Code is correct — send the actual contact message to you
            const { name, message } = stored;
            otpStore.delete(email.toLowerCase());

            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: `Portfolio Contact <${FROM_EMAIL}>`,
                    to: [TO_EMAIL],
                    reply_to: email,
                    subject: `Portfolio contact from ${name}`,
                    html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
              <h2 style="color: #111; border-bottom: 2px solid #f0a500; padding-bottom: 12px;">
                New verified message from your portfolio
              </h2>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 80px; font-weight: bold;">Name</td>
                  <td style="padding: 8px 0; color: #111;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Email</td>
                  <td style="padding: 8px 0;">
                    <a href="mailto:${email}" style="color: #f0a500;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Verified</td>
                  <td style="padding: 8px 0; color: #22c55e;">✓ Email verified</td>
                </tr>
              </table>
              <div style="background: #f9f9f9; border-left: 3px solid #f0a500; padding: 16px; border-radius: 4px; margin-top: 16px;">
                <p style="color: #111; margin: 0; white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
              </div>
              <p style="color: #999; font-size: 12px; margin-top: 24px;">
                Sent from ugurcanyilmaz.com · Email verified · Reply directly to respond.
              </p>
            </div>
          `,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                console.error('Resend send error:', err);
                return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
            }

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });

    } catch (err: any) {
        console.error('Contact API error:', err);
        return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }
}