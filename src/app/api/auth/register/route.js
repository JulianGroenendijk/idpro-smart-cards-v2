import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: 'postgresql://webapp:secure123@postgres:5432/webapp_dev',
});

export async function POST(request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, display_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name',
      [email.toLowerCase(), passwordHash, firstName, lastName, firstName + ' ' + lastName]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, email: user.email }, 'your-super-secret-jwt-key', { expiresIn: '24h' });

    return Response.json({ success: true, user, token });

  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ error: 'Registration failed' }, { status: 500 });
  }
}
