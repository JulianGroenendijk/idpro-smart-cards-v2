import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const pool = new Pool({
  connectionString: 'postgresql://webapp:secure123@postgres:5432/webapp_dev',
});

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, 'your-super-secret-jwt-key');

    const formData = await request.formData();
    const file = formData.get('file');
    const cardId = formData.get('cardId');

    if (!file || !cardId) {
      return Response.json({ error: 'File and cardId are required' }, { status: 400 });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return Response.json({ error: 'File too large. Maximum size is 10MB' }, { status: 400 });
    }

    // Generate file hash
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Create unique filename
    const originalName = file.name;
    const extension = path.extname(originalName);
    const uniqueName = `${Date.now()}_${crypto.randomBytes(8).toString('hex')}${extension}`;

    // Create storage directory
    const storageDir = path.join(process.cwd(), 'storage', 'attachments');
    await mkdir(storageDir, { recursive: true });

    // Save file
    const filePath = path.join(storageDir, uniqueName);
    await writeFile(filePath, fileBuffer);

    // Save to database
    const organizationId = '123e4567-e89b-12d3-a456-426614174000';
    const attachmentResult = await pool.query(`
      INSERT INTO attachments (
        card_id, organization_id, original_filename, safe_filename, 
        file_hash, mime_type, file_size_bytes, storage_path, uploaded_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, original_filename, file_size_bytes, created_at
    `, [
      cardId, organizationId, originalName, originalName,
      fileHash, file.type, file.size, uniqueName, decoded.userId
    ]);

    const attachment = attachmentResult.rows[0];

    return Response.json({
      success: true,
      attachment: {
        id: attachment.id,
        filename: attachment.original_filename,
        size: attachment.file_size_bytes,
        uploadedAt: attachment.created_at
      }
    });

  } catch (error) {
    console.error('File upload error:', error);
    return Response.json({ error: 'File upload failed' }, { status: 500 });
  }
}
