import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const TOKEN = process.env.SANITY_WRITE_TOKEN!;

export async function POST(req: NextRequest) {
    // Auth check
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json({ error: 'No image provided.' }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'File must be an image.' }, { status: 400 });
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'Image must be under 5MB.' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Step 1: Upload image to Sanity Assets API
        const uploadRes = await fetch(
            `https://${PROJECT_ID}.api.sanity.io/v2021-03-25/assets/images/${DATASET}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': file.type,
                    'X-Sanity-Asset-Filename': file.name,
                },
                body: buffer,
            }
        );

        if (!uploadRes.ok) {
            const err = await uploadRes.text();
            console.error('Sanity upload error:', err);
            return NextResponse.json({ error: 'Failed to upload image to Sanity.' }, { status: 500 });
        }

        const uploadData = await uploadRes.json();
        const assetId = uploadData.document._id;

        // Step 2: Fetch existing author document _id
        const queryRes = await fetch(
            `https://${PROJECT_ID}.api.sanity.io/v2021-03-25/data/query/${DATASET}?query=*[_type=="author"][0]{_id}`,
            {
                headers: { 'Authorization': `Bearer ${TOKEN}` },
            }
        );
        const queryData = await queryRes.json();
        const authorId = queryData.result?._id;

        if (!authorId) {
            return NextResponse.json({ error: 'Author document not found in Sanity.' }, { status: 404 });
        }

        // Step 3: Patch author document with new image
        const patchRes = await fetch(
            `https://${PROJECT_ID}.api.sanity.io/v2021-03-25/data/mutate/${DATASET}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mutations: [
                        {
                            patch: {
                                id: authorId,
                                set: {
                                    image: {
                                        _type: 'image',
                                        asset: {
                                            _type: 'reference',
                                            _ref: assetId,
                                        },
                                    },
                                },
                            },
                        },
                    ],
                }),
            }
        );

        if (!patchRes.ok) {
            const err = await patchRes.text();
            console.error('Sanity patch error:', err);
            return NextResponse.json({ error: 'Failed to update author image.' }, { status: 500 });
        }

        // Return the new image URL
        const imageUrl = uploadData.document.url;
        return NextResponse.json({ success: true, imageUrl });

    } catch (err: any) {
        console.error('Profile picture error:', err);
        return NextResponse.json({ error: err.message || 'Something went wrong.' }, { status: 500 });
    }
}