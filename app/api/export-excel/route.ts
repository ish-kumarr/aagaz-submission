import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import dbConnect from '@/lib/mongoose';
import Submission from '@/models/Submission';

export async function GET(req: NextRequest) {
  // Implement basic API key protection or check if request comes from authenticated session
  // For now, we'll allow access, assuming the /admin page handles authentication.
  // if (req.headers.get('Authorization') !== `Bearer ${process.env.ADMIN_API_KEY}`) {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  // }

  await dbConnect();

  try {
    const submissions = await Submission.find({});

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Submissions');

    // Define columns
    worksheet.columns = [
      { header: 'ID', key: '_id', width: 30 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Contact', key: 'contact', width: 20 },
      { header: 'Email', key: 'email', width: 30 }, // Added Email column
      { header: 'State', key: 'state', width: 20 },
      { header: 'Visitor Type', key: 'visitorType', width: 15 },
      { header: 'Interest', key: 'interest', width: 20 },
      { header: 'Submitted At', key: 'createdAt', width: 25 },
    ];

    // Add rows
    submissions.forEach((submission) => {
      worksheet.addRow({
        _id: submission._id.toString(),
        name: submission.name,
        contact: submission.contact,
        email: submission.email, // Added Email data
        state: submission.state,
        visitorType: submission.visitorType,
        interest: submission.interest,
        createdAt: submission.createdAt.toLocaleString(),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const headers = new Headers();
    headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    headers.set('Content-Disposition', 'attachment; filename="submissions.xlsx"');

    return new NextResponse(buffer, { headers });
  } catch (error) {
    console.error('Error exporting submissions to Excel:', error);
    return NextResponse.json({ message: 'Error exporting data to Excel.' }, { status: 500 });
  }
}