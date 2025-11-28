'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Code, Terminal } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const lines = [
  'Initializing system...',
  'Connecting to mainframe...',
  'Bypassing security protocols...',
  'Accessing encrypted data stream...',
  'Decompiling core logic...',
  'Injecting custom scripts...',
  'Compiling... [OK]',
  'Executing payload... [OK]',
  'System access granted.',
  'Redirecting to secure login...',
];

export default function PreLoginPage() {
  const router = useRouter();
  const [currentLine, setCurrentLine] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentLine < lines.length) {
      const timeout = setTimeout(
        () => {
          setCurrentLine(currentLine + 1);
          setProgress(((currentLine + 1) / lines.length) * 100);
        },
        350
      );
      return () => clearTimeout(timeout);
    } else {
      const redirectTimeout = setTimeout(() => {
        router.push('/login');
      }, 1000);
      return () => clearTimeout(redirectTimeout);
    }
  }, [currentLine, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black font-mono text-green-400">
      <div className="w-full max-w-2xl rounded-lg border border-green-700/50 bg-black/50 p-4 shadow-[0_0_20px_rgba(0,255,0,0.2)]">
        <div className="flex items-center justify-between border-b border-green-700/50 pb-2 mb-4">
            <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                <h1 className="text-lg">SYSTEM_SHELL</h1>
            </div>
            <div className="flex items-center gap-2 text-xs">
                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
            </div>
        </div>
        <div className="h-48 space-y-2 overflow-hidden text-sm">
          {lines.slice(0, currentLine).map((line, index) => (
            <div key={index} className="flex items-center gap-2">
                <span className="text-green-700">{'>'}</span>
                <p className="animate-pulse">{line}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
            <Progress value={progress} className="h-2 [&>div]:bg-green-400" />
            <p className="text-xs text-right mt-1">{Math.round(progress)}% complete</p>
        </div>
      </div>
    </div>
  );
}
