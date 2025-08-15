import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: 'postgresql://webapp:secure123@postgres:5432/webapp_dev',
});

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, 'your-super-secret-jwt-key');

    // Get demo organization (we'll use the one we created)
    const organizationId = '123e4567-e89b-12d3-a456-426614174000';

    const foldersResult = await pool.query(`
      SELECT 
        f.id,
        f.name,
        f.path,
        f.is_system_folder,
        COUNT(c.id) as card_count
      FROM folders f
      LEFT JOIN cards c ON f.id = c.primary_folder_id AND c.deleted_at IS NULL
      WHERE f.organization_id = $1 AND f.deleted_at IS NULL
      GROUP BY f.id, f.name, f.path, f.is_system_folder
      ORDER BY f.is_system_folder DESC, f.name ASC
    `, [organizationId]);

    const folders = foldersResult.rows.map(folder => ({
      id: folder.id,
      name: folder.name,
      icon: getSystemFolderIcon(folder.name),
      path: folder.path,
      isSystemFolder: folder.is_system_folder,
      count: parseInt(folder.card_count)
    }));

    return Response.json({ success: true, folders });

  } catch (error) {
    console.error('Folders API error:', error);
    return Response.json({ error: 'Failed to fetch folders' }, { status: 500 });
  }
}

function getSystemFolderIcon(folderName) {
  const icons = {
    'Inbox': '📥',
    'Shared': '🔗', 
    'Archive': '📦',
    'Trash': '🗑️'
  };
  return icons[folderName] || '📁';
}
