import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Submission from '@/models/Submission';

export async function GET(req: NextRequest) {
  await dbConnect();

  // Implement basic API key protection or check if request comes from authenticated session
  // For now, we'll allow access, but this should be secured.
  // if (req.headers.get('Authorization') !== `Bearer ${process.env.ADMIN_API_KEY}`) {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const submissions = await Submission.find({});
    return NextResponse.json(submissions, { status: 200 });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ message: 'Error fetching submissions.' }, { status: 500 });
  }
}
