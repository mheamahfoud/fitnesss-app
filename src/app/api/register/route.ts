// app/api/register/route.ts
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password, role } = await req.json();
  const passwordHash = await hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash, role, name: email.split('@')[0] } });
  return NextResponse.json({ message: 'User registered', user });
}
