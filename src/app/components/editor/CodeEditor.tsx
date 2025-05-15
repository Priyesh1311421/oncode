'use client';

import React, { useState, useEffect, useRef } from 'react';
import Editor, { OnChange, OnMount } from '@monaco-editor/react';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  theme?: 'vs-dark' | 'light';
  onChange?: (value: string | undefined) => void;
  onMount?: (editor: any, monaco: any) => void; // Allow access to editor instance
  height?: string;
  width?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = '// Start typing your code here...',
  language = 'javascript',
  theme = 'vs-dark',
  onChange,
  onMount,
  height = '500px',
  width = '100%',
}) => {
  const [code, setCode] = useState(initialCode);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleEditorChange: OnChange = (value) => {
    setCode(value || '');
    if (onChange) {
      onChange(value);
    }
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    // You can now access the editor instance via editorRef.current
    // For example, to focus the editor:
    // editor.focus();
    if (onMount) {
      onMount(editor, monaco);
    }
  };

  return (
    <div style={{ width, height, border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }} className="dark:border-gray-700">
      <Editor
        height="100%" // Make editor fill the container
        width="100%"
        language={language}
        theme={theme}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          automaticLayout: true,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: 'on',
          padding: {
            top: 10,
            bottom: 10
          },
          // Add more editor options as needed
          // e.g., lineNumbers: 'on' | 'off' | 'relative' | 'interval'
        }}
      />
    </div>
  );
};

export default CodeEditor;
