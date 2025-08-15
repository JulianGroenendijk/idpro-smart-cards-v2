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
    const decoded = jwt.verify(token, 'your-super-secret-jwt-key');
    
    const { id } = params;

    const result = await pool.query(`
      SELECT 
        c.id,
        c.title,
        c.body,
        c.created_at,
        c.updated_at,
        f.name as folder_name,
        u.display_name as created_by
      FROM cards c
      LEFT JOIN folders f ON c.primary_folder_id = f.id
      LEFT JOIN users u ON c.created_by = u.id
      WHERE c.id = $1 AND c.deleted_at IS NULL
    `, [id]);

    if (result.rows.length === 0) {
      return Response.json({ error: 'Card not found' }, { status: 404 });
    }

    const card = result.rows[0];

    const cardDetail = {
      id: card.id,
      title: card.title,
      body: card.body,
      folderName: card.folder_name,
      createdBy: card.created_by,
      createdAt: card.created_at,
      updatedAt: card.updated_at
    };

    return Response.json({ success: true, card: cardDetail });

  } catch (error) {
    console.error('Card detail API error:', error);
    return Response.json({ error: 'Failed to fetch card details' }, { status: 500 });
  }
}
