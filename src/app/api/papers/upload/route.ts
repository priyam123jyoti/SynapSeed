import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { fileTypeFromBuffer } from 'file-type';
import { uploadRateLimit } from '@/lib/upstash';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const MAX_THUMBNAIL_SIZE = 1 * 1024 * 1024; // 1 MB for Thumbnail
const MAX_QR_FILE_SIZE = 3 * 1024 * 1024; // 3 MB for QR image

const ALLOWED_PAPER_TYPES = [
  { mime: 'application/pdf', ext: 'pdf' },
  { mime: 'image/png', ext: 'png' },
  { mime: 'image/jpeg', ext: 'jpg' },
  { mime: 'image/jpeg', ext: 'jpeg' },
];

const ALLOWED_IMAGE_TYPES = [
  { mime: 'image/png', ext: 'png' },
  { mime: 'image/jpeg', ext: 'jpg' },
  { mime: 'image/jpeg', ext: 'jpeg' },
  { mime: 'image/webp', ext: 'webp' },
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
    // 1. Authenticate User
    //------------------------------------------------------
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized access.' },
        { status: 401 }
      );
    }

    //------------------------------------------------------
    // 2. Rate Limit Check (Upstash)
    //------------------------------------------------------
    const { success } = await uploadRateLimit.limit(`upload:${user.id}`);

    if (!success) {
      return NextResponse.json(
        { error: 'Upload limit exceeded. Maximum 5 uploads per hour.' },
        { status: 429 }
      );
    }

    //------------------------------------------------------
    // 3. Read Form Data & Extract Files
    //------------------------------------------------------
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const thumbnailFile = formData.get('thumbnail_file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No paper file uploaded.' },
        { status: 400 }
      );
    }

    if (!thumbnailFile) {
      return NextResponse.json(
        { error: 'No cover thumbnail image uploaded.' },
        { status: 400 }
      );
    }

    //------------------------------------------------------
    // 4. Optional: Process Payout Profile Updates
    //------------------------------------------------------
    const payout_upi_id = cleanText(formData.get('payout_upi_id'));
    const payout_phone = cleanText(formData.get('payout_phone'));
    const payout_qr_file = formData.get('payout_qr_file') as File | null;

    if (payout_upi_id && payout_phone) {
      let qrCodeUrl: string | null = null;

      if (payout_qr_file && payout_qr_file.size > 0) {
        if (payout_qr_file.size > MAX_QR_FILE_SIZE) {
          return NextResponse.json(
            { error: 'Payment QR code image must be smaller than 3 MB.' },
            { status: 400 }
          );
        }

        const qrBytes = await payout_qr_file.arrayBuffer();
        const qrBuffer = Buffer.from(qrBytes);
        const detectedQrType = await fileTypeFromBuffer(qrBuffer);

        const isValidQr = detectedQrType && ALLOWED_IMAGE_TYPES.some(
          (t) => t.mime === detectedQrType.mime && t.ext === detectedQrType.ext
        );

        if (!isValidQr) {
          return NextResponse.json(
            { error: 'Invalid QR code image format. Only PNG, JPG, and WEBP are allowed.' },
            { status: 400 }
          );
        }

        const qrFileName = `qr_${user.id}_${crypto.randomUUID()}.${detectedQrType.ext}`;
        const qrFilePath = `payout_qrs/${qrFileName}`;

        const { error: qrUploadError } = await supabase.storage
          .from('secure-papers')
          .upload(qrFilePath, qrBuffer, {
            contentType: detectedQrType.mime,
            upsert: true,
          });

        if (!qrUploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('secure-papers')
            .getPublicUrl(qrFilePath);
          qrCodeUrl = publicUrlData.publicUrl;
        }
      }

      const profileData: Record<string, any> = {
        id: user.id,
        email: user.email,
        upi_id: payout_upi_id,
        phone_number: payout_phone,
        updated_at: new Date().toISOString(),
      };
      if (qrCodeUrl) profileData.qr_code_url = qrCodeUrl;

      const { error: profileError } = await supabase
        .from('uploader_profiles')
        .upsert(profileData);

      if (profileError) {
        console.error('Failed to update payout profile:', profileError.message);
      }
    }

    //------------------------------------------------------
    // 5. Validate Paper File (Size & Type)
    //------------------------------------------------------
    if (file.size === 0) {
      return NextResponse.json(
        { error: 'Uploaded paper file is empty.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Maximum paper file size is 2 MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const detectedType = await fileTypeFromBuffer(buffer);

    if (!detectedType) {
      return NextResponse.json(
        { error: 'Unable to determine uploaded file type.' },
        { status: 400 }
      );
    }

    const isAllowed = ALLOWED_PAPER_TYPES.some(
      (type) => type.mime === detectedType.mime && type.ext === detectedType.ext
    );

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Only PDF, JPG and PNG files are allowed for question papers.' },
        { status: 400 }
      );
    }

    //------------------------------------------------------
    // 6. Validate Thumbnail File (Size & Type)
    //------------------------------------------------------
    if (thumbnailFile.size === 0) {
      return NextResponse.json(
        { error: 'Uploaded thumbnail image is empty.' },
        { status: 400 }
      );
    }

    if (thumbnailFile.size > MAX_THUMBNAIL_SIZE) {
      return NextResponse.json(
        { error: 'Maximum thumbnail image size is 1 MB.' },
        { status: 400 }
      );
    }

    const thumbBytes = await thumbnailFile.arrayBuffer();
    const thumbBuffer = Buffer.from(thumbBytes);
    const detectedThumbType = await fileTypeFromBuffer(thumbBuffer);

    if (!detectedThumbType) {
      return NextResponse.json(
        { error: 'Unable to determine uploaded thumbnail file type.' },
        { status: 400 }
      );
    }

    const isThumbAllowed = ALLOWED_IMAGE_TYPES.some(
      (type) => type.mime === detectedThumbType.mime && type.ext === detectedThumbType.ext
    );

    if (!isThumbAllowed) {
      return NextResponse.json(
        { error: 'Only PNG, JPG, and WEBP images are allowed for paper thumbnails.' },
        { status: 400 }
      );
    }

    //------------------------------------------------------
    // 7. Read and Clean Metadata
    //------------------------------------------------------
    const college_name = cleanText(formData.get('college_name'));
    const program = cleanText(formData.get('program'));
    const department = cleanText(formData.get('department'));
    const semester = Number(cleanText(formData.get('semester')));
    const year = Number(cleanText(formData.get('year')));
    const course_code = cleanText(formData.get('course_code')).toUpperCase();
    const course_title = cleanText(formData.get('course_title'));
    const exam_type = cleanText(formData.get('exam_type'));

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
        { error: 'Missing or invalid paper metadata.' },
        { status: 400 }
      );
    }

    if (semester < 1 || semester > 10) {
      return NextResponse.json(
        { error: 'Semester must be between 1 and 10.' },
        { status: 400 }
      );
    }

    const currentYear = new Date().getFullYear();
    if (year < 2000 || year > currentYear + 1) {
      return NextResponse.json(
        { error: `Year must be between 2000 and ${currentYear + 1}.` },
        { status: 400 }
      );
    }

    //------------------------------------------------------
    // 8. Generate File Paths & Upload to Buckets
    //------------------------------------------------------
    const fileUUID = crypto.randomUUID();
    
    // PDF File Path
    const uniqueFileName = `${fileUUID}.${detectedType.ext}`;
    const filePath = `vault/${user.id}/${uniqueFileName}`;

    // Thumbnail File Path
    const uniqueThumbName = `${fileUUID}.${detectedThumbType.ext}`;
    const thumbnailPath = `thumbs/${user.id}/${uniqueThumbName}`;

    // Upload PDF File to Private Storage
    const { error: storageError } = await supabase.storage
      .from('secure-papers')
      .upload(filePath, buffer, {
        contentType: detectedType.mime,
        upsert: false,
      });

    if (storageError) {
      return NextResponse.json(
        { error: storageError.message },
        { status: 500 }
      );
    }

    // Upload Thumbnail to Storage (paper-thumbnails bucket)
    const { error: thumbStorageError } = await supabase.storage
      .from('paper-thumbnails')
      .upload(thumbnailPath, thumbBuffer, {
        contentType: detectedThumbType.mime,
        upsert: false,
      });

    if (thumbStorageError) {
      // Rollback PDF upload if thumbnail upload fails
      await supabase.storage.from('secure-papers').remove([filePath]);

      return NextResponse.json(
        { error: thumbStorageError.message },
        { status: 500 }
      );
    }

    //------------------------------------------------------
    // 9. Save Metadata to Database (`papers` Table)
    //------------------------------------------------------
    const { data: insertedPaper, error: dbError } = await supabase
      .from('papers')
      .insert({
        uploader_id: user.id,
        uploader_email: user.email,
        college_name,
        program,
        department,
        semester,
        year,
        course_code,
        course_title,
        exam_type,
        file_path: filePath,
        thumbnail_path: thumbnailPath, // Stored in database
        price: 5.0,
        uploader_cut: 3.0,
      })
      .select()
      .single();

    // Rollback both file uploads if DB insert fails
    if (dbError) {
      await supabase.storage.from('secure-papers').remove([filePath]);
      await supabase.storage.from('paper-thumbnails').remove([thumbnailPath]);

      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      );
    }

    //------------------------------------------------------
    // 10. Audit Logging
    //------------------------------------------------------
    try {
      await supabase.rpc('log_audit', {
        p_user_id: user.id,
        p_action: 'paper_uploaded',
        p_resource_type: 'paper',
        p_resource_id: filePath,
        p_details: {
          paper_id: insertedPaper?.id,
          college_name,
          program,
          department,
          semester,
          year,
          course_code,
          course_title,
          exam_type,
          thumbnail_path: thumbnailPath,
        },
      });
    } catch (err) {
      console.error('Audit log failed:', err);
    }

    //------------------------------------------------------
    // 11. Return Success Response
    //------------------------------------------------------
    return NextResponse.json({
      success: true,
      message: 'Paper uploaded successfully with thumbnail.',
      paper: insertedPaper,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}