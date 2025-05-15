import { z } from 'zod';

export const executeCodeSchema = z.object({
  code: z.string().min(1, 'Code cannot be empty'),
  language: z.string().min(1, 'Language is required'),
  // Optional: stdin for providing input to the code
  stdin: z.string().optional(), 
});

export type ExecuteCodeInput = z.infer<typeof executeCodeSchema>;
