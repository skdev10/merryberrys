import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const execAsync = promisify(exec);

/**
 * One-time production seed. Set SETUP_SECRET in Vercel, then:
 * POST /api/setup/seed  Header: x-setup-secret: YOUR_SECRET
 */
export async function POST(request) {
  const secret = request.headers.get('x-setup-secret');
  const expected = process.env.SETUP_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cwd = process.cwd();
    const seedPath = path.join(cwd, 'prisma', 'seed.js');
    const { stdout, stderr } = await execAsync(`node "${seedPath}"`, {
      cwd,
      env: process.env,
      timeout: 55000,
    });

    return NextResponse.json({
      ok: true,
      message: 'Database seeded successfully',
      log: stdout?.slice(-2000) || '',
      warnings: stderr || undefined,
    });
  } catch (error) {
    console.error('setup seed', error);
    return NextResponse.json(
      {
        error: 'Seed failed',
        message: error.message,
        stderr: error.stderr?.slice(-1500),
      },
      { status: 500 }
    );
  }
}
