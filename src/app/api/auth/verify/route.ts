import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { passcode } = await req.json();
    const serverPasscode = process.env.DEPT_PASSCODE;

    if (!serverPasscode) {
      return NextResponse.json(
        { error: 'Server passcode configuration missing.' },
        { status: 500 }
      );
    }

    if (passcode !== serverPasscode) {
      return NextResponse.json(
        { error: 'Invalid departmental passcode.' },
        { status: 401 }
      );
    }

    // Passcode matches! Create a secure response
    const response = NextResponse.json({ success: true });

    // Set a secure, HTTP-only cookie to remember the session
    response.cookies.set('admin_authenticated', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // Valid for 24 hours
      path: '/',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}