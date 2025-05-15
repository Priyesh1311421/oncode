import { z } from 'zod';

export const createSnippetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title can be at most 100 characters'),
  code: z.string().min(1, 'Code cannot be empty'),
  language: z.string().min(1, 'Language is required'),
  description: z.string().max(500, 'Description can be at most 500 characters').optional(),
  tags: z.array(z.string().max(20, 'Tag can be at most 20 characters')).max(10, 'You can add at most 10 tags').optional(),
});

export type CreateSnippetInput = z.infer<typeof createSnippetSchema>;

export const updateSnippetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title can be at most 100 characters').optional(),
  code: z.string().min(1, 'Code cannot be empty').optional(),
  language: z.string().min(1, 'Language is required').optional(),
  description: z.string().max(500, 'Description can be at most 500 characters').optional().nullable(),
  tags: z.array(z.string().max(20, 'Tag can be at most 20 characters')).max(10, 'You can add at most 10 tags').optional().nullable(),
});

export type UpdateSnippetInput = z.infer<typeof updateSnippetSchema>;
