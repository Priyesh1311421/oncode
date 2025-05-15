import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createSnippetSchema, updateSnippetSchema } from '@/lib/schemas/snippetSchemas';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = createSnippetSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, code, language, description, tags } = validation.data;

    const newSnippet = await prisma.codeSnippet.create({
      data: {
        title,
        code,
        language,
        description,
        userId: session.user.id,
      },
    });

    return NextResponse.json(newSnippet, { status: 201 });
  } catch (error) {
    console.error('[SNIPPETS_POST_ERROR]', error);
    if (error instanceof SyntaxError) { // Handle malformed JSON
        return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// GET /api/snippets - Get all snippets for the authenticated user
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const snippets = await prisma.codeSnippet.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }, 
    });

    return NextResponse.json(snippets, { status: 200 });
  } catch (error) {
    console.error('[SNIPPETS_GET_ERROR]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
