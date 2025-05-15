'use server';

import { NextRequest, NextResponse } from 'next/server';
import { executeCodeSchema } from '@/lib/schemas/executionSchemas';

const languageToJudge0Id: Record<string, number> = {
  javascript: 93, // Node.js
  typescript: 94, // TypeScript
  python: 92,     // Python 3
  java: 91,       // Java
  csharp: 86,     // C# .NET
  cpp: 76,        // C++ (GCC)
  ruby: 72,       // Ruby
  go: 95,         // Go
};

const JUDGE0_API_URL = process.env.JUDGE0_API_URL;
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY; // For RapidAPI or similar
const JUDGE0_HOST_HEADER = process.env.JUDGE0_HOST_HEADER; // For RapidAPI

export async function POST(req: NextRequest) {

  if (!JUDGE0_API_URL) {
    console.error('JUDGE0_API_URL is not configured in environment variables.');
    return NextResponse.json({ message: 'Code execution service is not configured.', error: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const validation = executeCodeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { code, language, stdin } = validation.data;

    const languageId = languageToJudge0Id[language.toLowerCase()];

    if (!languageId) {
      return NextResponse.json(
        { message: `Language '${language}' is not supported for execution.` },
        { status: 400 }
      );
    }

    const submissionPayload = {
      source_code: code,
      language_id: languageId,
      stdin: stdin || undefined, 
    };

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (JUDGE0_API_KEY) {
      headers['X-RapidAPI-Key'] = JUDGE0_API_KEY;
    }
    if (JUDGE0_HOST_HEADER) {
      headers['X-RapidAPI-Host'] = JUDGE0_HOST_HEADER;
    }
    const judge0Response = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(submissionPayload),
    });

    if (!judge0Response.ok) {
      const errorData = await judge0Response.text(); // Or .json() if Judge0 returns JSON errors
      console.error('Judge0 API error:', judge0Response.status, errorData);
      return NextResponse.json(
        { message: 'Error from code execution service', error: errorData },
        { status: judge0Response.status }
      );
    }

    const result = await judge0Response.json();
    
    let output = result.stdout || '';
    let errorOutput = result.stderr || '';
    let compileError = result.compile_output || '';
    let executionError = null;

    if (result.status_id > 2) { // Not In Queue or Processing
        if (result.status_id === 3) { // Accepted
            // Output is already in stdout
        } else if (result.status_id === 6) { // Compilation Error
            errorOutput = compileError || 'Compilation failed.';
        } else if (result.status_id === 5) { // Time Limit Exceeded
            errorOutput = `Execution timed out. Time: ${result.time}s. ${errorOutput}`.trim();
        } else if (result.status_id === 4) { // Wrong Answer (less relevant for playground)
             errorOutput = `Execution Error (Wrong Answer): ${errorOutput || 'No specific error message.'}`.trim();
        } else { // Other errors (Runtime Error, Internal Error, etc.)
            errorOutput = `${result.status?.description || 'Execution Error'}. ${errorOutput || compileError || 'No specific error message.'}`.trim();
        }
    }
    
    // If there was an error during execution itself (not compilation)
    if (result.message) { // Judge0 might put internal error messages here
        executionError = result.message;
    }


    return NextResponse.json({
      stdout: output,
      stderr: errorOutput,
      compile_output: compileError,
      status: result.status, // Full status object from Judge0
      time: result.time,
      memory: result.memory,
      error: executionError, // For errors not covered by stderr (e.g. Judge0 internal issues)
    }, { status: 200 });

  } catch (error: any) {
    console.error('[EXECUTE_CODE_API_ERROR]', error);
    if (error instanceof SyntaxError) { // From req.json()
        return NextResponse.json({ message: 'Invalid JSON payload', error: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error', error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
