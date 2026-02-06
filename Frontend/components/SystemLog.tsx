import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface SystemLogProps {
  logs: LogEntry[];
}

export const SystemLog: React.FC<SystemLogProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="h-full bg-black border-t border-mono-800 font-mono text-[10px] p-2 overflow-y-auto">
      <div className="flex flex-col gap-1">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 hover:bg-mono-900/50 p-0.5 px-2 rounded-sm cursor-default">
            <span className="text-mono-600 select-none">[{log.timestamp}]</span>
            <span className={`font-bold w-10 ${
              log.level === 'INFO' ? 'text-tech-cyan' :
              log.level === 'WARN' ? 'text-tech-amber' :
              log.level === 'CRIT' ? 'text-tech-red' :
              'text-tech-emerald'
            }`}>
              {log.level}
            </span>
            <span className="text-mono-300">{log.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
