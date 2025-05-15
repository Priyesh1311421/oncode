import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';

// const prisma = new PrismaClient(); // This line is removed
import prisma from '@/lib/prisma'; // Import the shared Prisma instance

const registerUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = registerUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 } // Conflict
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    // Return a subset of user data, excluding passwordHash
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { 
        message: 'User registered successfully', 
        user: userWithoutPassword 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('[AUTH_REGISTER_ERROR]', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
