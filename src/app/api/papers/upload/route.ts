import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { fileTypeFromBuffer } from 'file-type';
import { uploadRateLimit } from '@/lib/upstash';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const ALLOWED_TYPES = [
  {
    mime: 'application/pdf',
    ext: 'pdf',
  },
  {
    mime: 'image/png',
    ext: 'png',
  },
  {
    mime: 'image/jpeg',
    ext: 'jpg',
  },
  {
    mime: 'image/jpeg',
    ext: 'jpeg',
  },
];

function cleanText(value: FormDataEntryValue | null): string {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ');
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    //------------------------------------------------------
    // Authenticate
    //------------------------------------------------------

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: 'Unauthorized access.',
        },
        {
          status: 401,
        }
      );
    }

    //------------------------------------------------------
    // Rate limit
    //------------------------------------------------------

    const { success } = await uploadRateLimit.limit(
      `upload:${user.id}`
    );

    if (!success) {
      return NextResponse.json(
        {
          error:
            'Upload limit exceeded. Maximum 5 uploads per hour.',
        },
        {
          status: 429,
        }
      );
    }

    //------------------------------------------------------
    // Read form
    //------------------------------------------------------

    const formData = await req.formData();

    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        {
          error: 'No file uploaded.',
        },
        {
          status: 400,
        }
      );
    }

    //------------------------------------------------------
    // Validate size
    //------------------------------------------------------

    if (file.size === 0) {
      return NextResponse.json(
        {
          error: 'Uploaded file is empty.',
        },
        {
          status: 400,
        }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: 'Maximum file size is 2 MB.',
        },
        {
          status: 400,
        }
      );
    }

    //------------------------------------------------------
    // Read buffer
    //------------------------------------------------------

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    //------------------------------------------------------
    // Detect REAL file type
    //------------------------------------------------------

    const detectedType = await fileTypeFromBuffer(buffer);

    if (!detectedType) {
      return NextResponse.json(
        {
          error: 'Unable to determine uploaded file type.',
        },
        {
          status: 400,
        }
      );
    }

    const isAllowed = ALLOWED_TYPES.some(
      (type) =>
        type.mime === detectedType.mime &&
        type.ext === detectedType.ext
    );

    if (!isAllowed) {
      return NextResponse.json(
        {
          error: 'Only PDF, JPG and PNG files are allowed.',
        },
        {
          status: 400,
        }
      );
    }

    //------------------------------------------------------
    // Read metadata
    //------------------------------------------------------

    const college_name = cleanText(
      formData.get('college_name')
    );

    const program = cleanText(
      formData.get('program')
    );

    const department = cleanText(
      formData.get('department')
    );

    const semester = Number(
      cleanText(formData.get('semester'))
    );

    const year = Number(
      cleanText(formData.get('year'))
    );

    const course_code = cleanText(
      formData.get('course_code')
    ).toUpperCase();

    const course_title = cleanText(
      formData.get('course_title')
    );

    const exam_type = cleanText(
      formData.get('exam_type')
    );

    //------------------------------------------------------
    // Validate metadata
    //------------------------------------------------------

    if (
      !college_name ||
      !program ||
      !department ||
      !course_code ||
      !course_title ||
      !exam_type ||
      !Number.isInteger(semester) ||
      !Number.isInteger(year)
    ) {
      return NextResponse.json(
        {
          error: 'Missing or invalid metadata.',
        },
        {
          status: 400,
        }
      );
    }
    //------------------------------------------------------
// Validate semester range
//------------------------------------------------------

if (semester < 1 || semester > 10) {
  return NextResponse.json(
    {
      error: 'Semester must be between 1 and 10.',
    },
    {
      status: 400,
    }
  );
}

//------------------------------------------------------
// Validate year range
//------------------------------------------------------

const currentYear = new Date().getFullYear();

if (year < 2000 || year > currentYear + 1) {
  return NextResponse.json(
    {
      error: `Year must be between 2000 and ${currentYear + 1}.`,
    },
    {
      status: 400,
    }
  );
}

    //------------------------------------------------------
    // Generate secure filename
    //------------------------------------------------------

    const uniqueFileName =
      `${crypto.randomUUID()}.${detectedType.ext}`;

    const filePath =
      `vault/${user.id}/${uniqueFileName}`;

    //------------------------------------------------------
    // Upload to private bucket
    //------------------------------------------------------

    const { error: storageError } =
      await supabase.storage
        .from('secure-papers')
        .upload(filePath, buffer, {
          contentType: detectedType.mime,
          upsert: false,
        });

    if (storageError) {
      return NextResponse.json(
        {
          error: storageError.message,
        },
        {
          status: 500,
        }
      );
    }

    //------------------------------------------------------
    // Save metadata
    //------------------------------------------------------

    const { error: dbError } =
      await supabase
        .from('papers')
        .insert({
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

    //------------------------------------------------------
    // Rollback upload if database insert fails
    //------------------------------------------------------

    if (dbError) {
      await supabase.storage
        .from('secure-papers')
        .remove([filePath]);

      return NextResponse.json(
        {
          error: dbError.message,
        },
        {
          status: 500,
        }
      );
    }


    try {
  await supabase.rpc('log_audit', {
    p_user_id: user.id,
    p_action: 'paper_uploaded',
    p_resource_type: 'paper',
    p_resource_id: filePath,
    p_details: {
      college_name,
      program,
      department,
      semester,
      year,
      course_code,
      course_title,
      exam_type,
    },
  });
} catch (err) {
  console.error('Audit log failed:', err);
}

    //------------------------------------------------------
    // Success
    //------------------------------------------------------

    return NextResponse.json({
      success: true,
      message: 'Paper uploaded successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.message ||
          'Internal server error.',
      },
      {
        status: 500,
      }
    );
  }
}