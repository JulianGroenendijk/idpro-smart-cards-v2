import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: 'postgresql://webapp:secure123@postgres:5432/webapp_dev',
});

export async function GET(request, { params }) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    jwt.verify(token, 'your-super-secret-jwt-key');

    const { cardId } = params;
    const organizationId = '123e4567-e89b-12d3-a456-426614174000';

    const attachmentsResult = await pool.query(`
      SELECT 
        a.id, a.original_filename, a.mime_type, a.file_size_bytes, a.created_at,
        u.display_name as uploaded_by_name
      FROM attachments a
      LEFT JOIN users u ON a.uploaded_by = u.id
      WHERE a.card_id = $1 AND a.organization_id = $2 AND a.deleted_at IS NULL
      ORDER BY a.created_at DESC
    `, [cardId, organizationId]);

    const attachments = attachmentsResult.rows.map(att => ({
      id: att.id,
      filename: att.original_filename,
      mimeType: att.mime_type,
      size: att.file_size_bytes,
      sizeFormatted: formatFileSize(att.file_size_bytes),
      uploadedBy: att.uploaded_by_name,
      uploadedAt: att.created_at,
      icon: getFileIcon(att.mime_type)
    }));

    return Response.json({ success: true, attachments });

  } catch (error) {
    console.error('Get attachments error:', error);
    return Response.json({ error: 'Failed to fetch attachments' }, { status: 500 });
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getFileIcon(mimeType) {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType === 'application/pdf') return '📄';
  if (mimeType.includes('word')) return '📝';
  if (mimeType.includes('excel')) return '📊';
  return '📎';
}
