import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Step 1: Call Nebius API directly
    const nebiusResponse = await fetch('https://api.studio.nebius.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEBIUS_API_KEY}`
      },
      body: JSON.stringify({
        model: "black-forest-labs/flux-schnell",
        prompt: prompt,
        response_format: "url",
        size: "512x512",
        num_images: 1
      })
    });

    if (!nebiusResponse.ok) {
      const errorData = await nebiusResponse.text();
      throw new Error(`Nebius API error: ${nebiusResponse.status} - ${errorData}`);
    }

    const nebiusData = await nebiusResponse.json();
    const imageUrl = nebiusData.data[0]?.url;

    if (!imageUrl) {
      throw new Error("No image URL received from Nebius API");
    }

    // Step 2: Download and convert to base64
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:image/webp;base64,${base64}`;

    return NextResponse.json({ 
      imageUrl: dataUrl,
      debug: { originalUrl: imageUrl }
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: error.message,
        details: error.stack 
      },
      { status: 500 }
    );
  }
}
