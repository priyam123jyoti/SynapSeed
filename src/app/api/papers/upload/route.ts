import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Authenticate user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized access layer' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No question paper file submitted' }, { status: 400 });
    }

    // Extract Flipkart-style required metadata filters
    const college_name = formData.get('college_name') as string;
    const program = formData.get('program') as string;
    const department = formData.get('department') as string;
    const semester = parseInt(formData.get('semester') as string, 10);
    const year = parseInt(formData.get('year') as string, 10);
    const course_code = formData.get('course_code') as string;
    const course_title = formData.get('course_title') as string;
    const exam_type = formData.get('exam_type') as string;

    // Validate requirements
    if (!college_name || !program || !department || !semester || !year || !course_code || !course_title || !exam_type) {
      return NextResponse.json({ error: 'Missing mandatory metadata criteria properties.' }, { status: 400 });
    }

    // 2. Generate a unique cryptographic storage path inside the private bucket
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${crypto.randomUUID()}.${fileExtension}`;
    const filePath = `vault/${user.id}/${uniqueFileName}`;

    // Convert file object to buffer array data
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Write binary stream array data to the secure-papers bucket
    const { error: storageError } = await supabase.storage
      .from('secure-papers')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (storageError) {
      return NextResponse.json({ error: `Storage commit failure: ${storageError.message}` }, { status: 500 });
    }

    // 4. Record entry to the main papers catalog database table
    const { error: dbError } = await supabase.from('papers').insert({
      uploader_id: user.id,
      college_name,
      program,
      department,
      semester,
      year,
      course_code,
      course_title,
      exam_type,
      file_path: filePath,
    });

    if (dbError) {
      // Rollback file upload step if metadata tracking fails
      await supabase.storage.from('secure-papers').remove([filePath]);
      return NextResponse.json({ error: `Database entry tracking broken: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Paper catalog asset fully optimized and provisioned.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Fatal crash lifecycle' }, { status: 500 });
  }
}