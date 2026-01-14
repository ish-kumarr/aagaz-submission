import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Submission from '@/models/Submission';

export async function OPTIONS(request: NextRequest) {
  const allowedOrigin = request.headers.get('origin');
  const response = new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
  return response;
}

export async function POST(req: NextRequest) {
  await dbConnect(); // Connect to the database
  try {
    const data = await req.json();
    console.log('Form submission received:', data);

    // Create a new submission instance
    const submission = await Submission.create(data);

    const response = NextResponse.json({ message: 'Form submitted successfully!', data: submission }, { status: 201 });
    response.headers.set('Access-Control-Allow-Origin', '*'); // Replace with your frontend domain in production
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error: any) {
    console.error('Error processing form submission:', error);
    let errorMessage = 'Error submitting form.';
    if (error.name === 'ValidationError') {
      errorMessage = Object.values(error.errors).map((val: any) => val.message).join(', ');
      const response = NextResponse.json({ message: errorMessage }, { status: 400 });
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      return response;
    }

    const response = NextResponse.json({ message: errorMessage }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*'); // Replace with your frontend domain in production
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  }
}
