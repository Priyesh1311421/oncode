'use client';

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Dynamically import the CodeEditor component to enable client-side rendering only
const CodeEditor = dynamic(() => import('@/app/components/editor/CodeEditor'), { 
  ssr: false,
  loading: () => <p className="text-center text-gray-500 dark:text-gray-400">Loading Editor...</p>
});

// Define supported languages and themes
const supportedLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'markdown', label: 'Markdown' },
];

const editorThemes = [
  { value: 'vs-dark', label: 'Dark Theme' },
  { value: 'light', label: 'Light Theme' },
];

export default function EditorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [code, setCode] = useState('// Welcome to OnCode!\n// Select your language and start coding.\n');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [output, setOutput] = useState(''); // For code execution results
  const [stdin, setStdin] = useState(''); // For user input
  const [isExecuting, setIsExecuting] = useState(false);
  const [snippetTitle, setSnippetTitle] = useState('');
  const [isSavingSnippet, setIsSavingSnippet] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // To show save success/error messages
  const [activeTab, setActiveTab] = useState<'stdin' | 'output'>('output'); // New state for tabs

  if (status === 'loading') {
    return <p className="flex justify-center items-center min-h-screen">Loading session...</p>;
  }

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const handleExecuteCode = async () => {
    if (!code.trim()) {
      setOutput('Please write some code to execute.');
      setActiveTab('output'); // Switch to output tab
      return;
    }
    setIsExecuting(true);
    setOutput('Executing code...');
    setActiveTab('output'); // Switch to output tab
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Include stdin in the request body
        body: JSON.stringify({ code, language, stdin }), 
      });

      const result = await response.json();

      if (response.ok) {
        // Use result.stdout instead of result.output
        setOutput(result.stdout || 'No output received from execution.'); 
      } else {
        // Prefer stderr if available, then error, then a generic message
        const errorMessage = result.stderr || result.error || 'An unknown error occurred during execution.';
        setOutput(errorMessage);
      }
    } catch (error) {
      console.error("Execution API error:", error);
      setOutput('Failed to connect to the execution service. See console for details.');
    }
    setIsExecuting(false);
  };

  const handleSaveSnippet = async () => {
    if (!session) {
      setSaveStatus('You must be logged in to save a snippet.');
      // Optionally, redirect to login or show a login prompt
      // router.push('/auth/signin'); 
      return;
    }
    if (!snippetTitle.trim()) {
      setSaveStatus('Please enter a title for your snippet.');
      return;
    }
    if (!code.trim()) {
      setSaveStatus('Cannot save an empty snippet.');
      return;
    }

    setIsSavingSnippet(true);
    setSaveStatus('Saving snippet...');

    try {
      const response = await fetch('/api/snippets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: snippetTitle,
          code,
          language,
          description: '', // Optional: Add a description field later
          // tags: [], // Optional: Add tags later
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSaveStatus(`Snippet "${result.title}" saved successfully!`);
        setSnippetTitle(''); // Clear title after save
      } else {
        setSaveStatus(result.message || 'Failed to save snippet. Please try again.');
        console.error("Save snippet error:", result);
      }
    } catch (error) {
      console.error("Save snippet API error:", error);
      setSaveStatus('An error occurred while saving the snippet. See console for details.');
    }
    setIsSavingSnippet(false);
    // Clear status message after a few seconds
    setTimeout(() => setSaveStatus(''), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 flex flex-col">
      
      {/* Top Controls Bar */}
      <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor="language-select" className="sr-only">Language:</label>
            <select 
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 transition duration-150 ease-in-out text-sm"
            >
              {supportedLanguages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="theme-select" className="sr-only">Editor Theme:</label>
            <select 
              id="theme-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'vs-dark' | 'light')}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 transition duration-150 ease-in-out text-sm"
            >
              {editorThemes.map(th => (
                <option key={th.value} value={th.value}>{th.label}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleExecuteCode}
          disabled={isExecuting}
          className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 text-sm"
        >
          {isExecuting ? 'Executing...' : 'Run Code'}
        </button>
      </div>

      {/* Main Content Area: Editor and Tabbed Stdin/Output */}
      <div className="flex-grow flex flex-col md:flex-row gap-4">
        {/* Editor Section (Left Column on MD+) */}
        <div className="md:w-3/5 lg:w-2/3 flex flex-col">
          <div className="flex-grow relative h-[60vh] sm:h-[65vh] md:h-full bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <Suspense fallback={<p className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">Loading Editor...</p>}>
              <CodeEditor
                language={language}
                theme={theme}
                initialCode={code}
                onChange={handleCodeChange}
                height="100%"
              />
            </Suspense>
          </div>
        </div>

        {/* Tabbed Stdin/Output Section (Right Column on MD+) */}
        <div className="md:w-2/5 lg:w-1/3 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('stdin')}
              className={`flex-1 py-2 px-4 text-sm font-medium text-center transition-colors duration-150
                ${activeTab === 'stdin' 
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              Standard Input
            </button>
            <button
              onClick={() => setActiveTab('output')}
              className={`flex-1 py-2 px-4 text-sm font-medium text-center transition-colors duration-150
                ${activeTab === 'output' 
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              Output / Console
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-grow p-1 overflow-auto h-[30vh] md:h-auto"> {/* Added h-[30vh] for mobile, md:h-auto for larger screens to fill space */}
            {activeTab === 'stdin' && (
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Enter input for your code here... (optional)"
                className="w-full h-full p-2 text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 border-transparent resize-none"
              />
            )}
            {activeTab === 'output' && (
              <pre className="w-full h-full p-2 whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-100 rounded-md">
                {output || "Code output will appear here..."}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Save Snippet Section */}
      {session && (
         <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col items-center gap-3">
            <div className="w-full max-w-md">
              <label htmlFor="snippet-title" className="block text-sm font-medium mb-1 sr-only">Snippet Title:</label>
              <input
                type="text"
                id="snippet-title"
                value={snippetTitle}
                onChange={(e) => setSnippetTitle(e.target.value)}
                placeholder="Enter a title for your snippet"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 transition duration-150 ease-in-out text-sm"
                disabled={isSavingSnippet}
              />
            </div>
            <button 
                onClick={handleSaveSnippet}
                disabled={isSavingSnippet || !snippetTitle.trim() || !code.trim()}
                className="py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
                {isSavingSnippet ? 'Saving...' : 'Save Snippet'}
            </button>
            {saveStatus && <p className={`text-xs mt-1 ${saveStatus.includes('success') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{saveStatus}</p>}
        </div>
      )}
    </div>
  );
}
