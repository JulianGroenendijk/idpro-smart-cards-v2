import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

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

    const { title, body, folderId } = await request.json();

    if (!title || !folderId) {
      return Response.json({ error: 'Title and folder are required' }, { status: 400 });
    }

    // Use demo organization
    const organizationId = '123e4567-e89b-12d3-a456-426614174000';

    // Create the card
    const cardResult = await pool.query(`
      INSERT INTO cards (organization_id, primary_folder_id, title, body, created_by, last_edited_by)
      VALUES ($1, $2, $3, $4, $5, $5)
      RETURNING id, title, created_at
    `, [organizationId, folderId, title, body || '', decoded.userId]);

    const newCard = cardResult.rows[0];

    return Response.json({
      success: true,
      card: {
        id: newCard.id,
        title: newCard.title,
        createdAt: newCard.created_at
      }
    });

  } catch (error) {
    console.error('Create card error:', error);
    return Response.json({ error: 'Failed to create card' }, { status: 500 });
  }
}
