import { NextRequest, NextResponse } from 'next/server';
import { createEventSubmission } from '@/lib/notion';

// Verify Turnstile token with Cloudflare
async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // If no secret key is configured, skip verification (for development)
  if (!secretKey) {
    console.warn('TURNSTILE_SECRET_KEY not configured, skipping verification');
    return true;
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, date, time, location, description, submitter_name, submitter_email, turnstileToken } = body;

    // Verify Turnstile token first
    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Security verification required' },
        { status: 400 }
      );
    }

    const isValidToken = await verifyTurnstileToken(turnstileToken);
    if (!isValidToken) {
      return NextResponse.json(
        { error: 'Security verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!title || !date || !time || !location || !description || !submitter_name || !submitter_email) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(submitter_email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const success = await createEventSubmission({
      title,
      date,
      time,
      location,
      description,
      submitter_name,
      submitter_email,
    });

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to submit event' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Event submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
