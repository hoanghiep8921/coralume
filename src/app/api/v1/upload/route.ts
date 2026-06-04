import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { storage, generateKey, getExtension, validateFile, MAX_IMAGE_COUNT } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    // Auth guard
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Chưa đăng nhập', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Parse multipart form data
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ — cần multipart/form-data', code: 'BAD_REQUEST' },
        { status: 400 }
      );
    }

    // Extract files and type
    const files = formData.getAll('files') as File[];
    const uploadType = (formData.get('type') as string) || 'coral';

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Vui lòng chọn ít nhất 1 file', code: 'NO_FILES' },
        { status: 400 }
      );
    }

    if (files.length > MAX_IMAGE_COUNT) {
      return NextResponse.json(
        { error: `Tối đa ${MAX_IMAGE_COUNT} file`, code: 'TOO_MANY_FILES' },
        { status: 400 }
      );
    }

    // Validate each file
    for (const file of files) {
      if (!(file instanceof File)) {
        return NextResponse.json(
          { error: 'Dữ liệu file không hợp lệ', code: 'BAD_REQUEST' },
          { status: 400 }
        );
      }
      const error = validateFile({ type: file.type, size: file.size });
      if (error) {
        return NextResponse.json({ error, code: 'VALIDATION_ERROR' }, { status: 400 });
      }
    }

    // Upload all files
    const urls: string[] = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const extension = getExtension(file.type);
      const key = generateKey(uploadType, extension);
      const url = await storage.upload(buffer, key, file.type);
      urls.push(url);
    }

    return NextResponse.json({ data: { urls, count: urls.length } }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Lỗi server khi upload file', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
