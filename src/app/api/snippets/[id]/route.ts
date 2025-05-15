import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { updateSnippetSchema } from '@/lib/schemas/snippetSchemas';

// GET /api/snippets/[id] - Get a specific snippet by ID
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const id = context.params.id;

  try {
    const snippet = await prisma.codeSnippet.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!snippet) {
      return NextResponse.json({ message: 'Snippet not found or access denied' }, { status: 404 });
    }

    return NextResponse.json(snippet, { status: 200 });
  } catch (error) {
    console.error('[SNIPPET_ID_GET_ERROR]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/snippets/[id] - Update a specific snippet by ID
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const id = context.params.id;

  try {
    const body = await request.json();
    const validation = updateSnippetSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const snippetToUpdate = await prisma.codeSnippet.findUnique({
      where: { id, userId: session.user.id }, 
    });

    if (!snippetToUpdate) {
      return NextResponse.json({ message: 'Snippet not found or access denied' }, { status: 404 });
    }

    const updatedSnippet = await prisma.codeSnippet.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json(updatedSnippet, { status: 200 });
  } catch (error) {
    console.error('[SNIPPET_ID_PUT_ERROR]', error);
    if (error instanceof SyntaxError) { 
        return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/snippets/[id] - Delete a specific snippet by ID
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const id = context.params.id;

  try {
    const snippetToDelete = await prisma.codeSnippet.findUnique({
      where: { id, userId: session.user.id }, 
    });

    if (!snippetToDelete) {
      return NextResponse.json({ message: 'Snippet not found or access denied' }, { status: 404 });
    }

    await prisma.codeSnippet.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Snippet deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('[SNIPPET_ID_DELETE_ERROR]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
