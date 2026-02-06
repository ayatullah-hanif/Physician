import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Lock, Wifi } from 'lucide-react';

export const Header: React.FC = () => {
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setUptime(u => u + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <header className="h-16 bg-mono-950 border-b border-mono-800 flex items-center justify-between px-6 select-none z-50 relative overflow-hidden">
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.05),transparent_50%)] pointer-events-none"></div>

      <div className="flex items-center gap-6 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-mono-900 border border-mono-700 flex items-center justify-center relative shadow-[0_0_15px_rgba(0,0,0,0.5)]">
             <div className="absolute top-0 left-0 w-1 h-1 bg-tech-cyan"></div>
             <div className="absolute bottom-0 right-0 w-1 h-1 bg-tech-cyan"></div>
             <Cpu size={20} className="text-tech-cyan" />
          </div>
          <div>
            <h1 className="text-xl font-black font-sans text-mono-100 tracking-tight leading-none">PHYSICIAN <span className="text-tech-cyan text-sm align-top opacity-80">v1.0</span></h1>
            <p className="text-[10px] font-mono text-mono-400 tracking-[0.2em] leading-none mt-1">KINEMATIC OS</p>
          </div>
        </div>
        
        <div className="h-8 w-[1px] bg-mono-800 mx-2"></div>

        <div className="flex flex-col">
          <span className="text-[9px] font-mono text-mono-500 uppercase tracking-wider">System Status</span>
          <div className="flex items-center gap-2 text-tech-emerald text-xs font-mono font-bold shadow-green-900">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tech-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tech-emerald"></span>
            </div>
            <span>SYSTEM ONLINE</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8 z-10">
        <div className="flex flex-col items-end hidden md:flex">
           <span className="text-[9px] font-mono text-mono-500 uppercase">Session Uptime</span>
           <span className="text-xs font-mono text-mono-200 tabular-nums">{formatUptime(uptime)}</span>
        </div>
        
        <div className="flex items-center justify-center w-10 h-10 border border-mono-800 bg-mono-900 text-mono-500 hover:text-tech-cyan hover:border-tech-cyan/50 transition-colors cursor-pointer">
           <Wifi size={16} />
        </div>
        
        <div className="flex items-center justify-center w-10 h-10 border border-mono-800 bg-mono-900 text-mono-500 hover:text-tech-emerald hover:border-tech-emerald/50 transition-colors cursor-pointer">
           <Lock size={16} />
        </div>
      </div>
    </header>
  );
};