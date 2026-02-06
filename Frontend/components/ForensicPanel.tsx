import React, { useState, useEffect } from 'react';
import { AlertOctagon, Search, Zap, Skull, FileWarning, Microscope } from 'lucide-react';
import { ForensicReport } from '../types';

interface ForensicPanelProps {
  report?: ForensicReport | null;
}

const TypewriterText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 10 }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    if (!text) return;
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => text.slice(0, index + 1));
      index++;
      if (index >= text.length) clearInterval(interval);
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

export const ForensicPanel: React.FC<ForensicPanelProps> = ({ report }) => {
  if (!report) return null;

  return (
    <div className="h-full flex flex-col gap-4 animate-in fade-in slide-in-from-right duration-500">
      <div className="bg-mono-900 border-2 border-tech-red p-4 relative overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.2)]">
        <div className="absolute top-0 right-0 p-4 opacity-10 animate-pulse">
           <Skull size={64} className="text-tech-red" />
        </div>
        
        <div className="flex items-center gap-2 text-tech-red mb-2 font-mono font-bold tracking-widest text-xs uppercase">
           <AlertOctagon size={14} /> INCIDENT DETECTED
        </div>
        <h2 className="text-2xl font-black font-sans text-mono-100 tracking-tighter mb-1">
           CRASH REPORT
        </h2>
        <div className="font-mono text-[10px] text-tech-red opacity-80 mb-4">
           ID: {Math.random().toString(36).slice(2, 10).toUpperCase()} // SEVERITY: CRITICAL
        </div>

        <div className="bg-black/50 border border-tech-red/30 p-2 flex items-center gap-3 mb-2">
            <div className="bg-tech-red/20 p-2 rounded-sm">
                <Search size={16} className="text-tech-red" />
            </div>
            <div>
                <div className="text-[9px] font-mono text-mono-500 uppercase">Failure Signature</div>
                <div className="text-sm font-mono text-mono-200 font-bold">
                    <TypewriterText text={report.failure_signature || "Kinematic Rupture"} delay={30} />
                </div>
            </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col bg-black border border-mono-800 relative">
         <div className="bg-mono-900/50 p-2 border-b border-mono-800 flex items-center gap-2 text-[10px] font-mono text-mono-400 uppercase tracking-wider">
            <Microscope size={12} className="text-tech-red" /> Forensic Analysis Log
         </div>

         <div className="p-4 space-y-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-1">
               <h3 className="text-[10px] font-bold font-sans text-tech-red uppercase flex items-center gap-2">
                  <Zap size={10} /> Physical Law Violation
               </h3>
               <div className="text-xs font-mono text-mono-300 border-l-2 border-tech-red/50 pl-3 py-1">
                  {report.primary_law_violated || "Conservation of Momentum"}
               </div>
            </div>

            <div className="space-y-1">
               <h3 className="text-[10px] font-bold font-sans text-mono-400 uppercase flex items-center gap-2">
                  <FileWarning size={10} /> Event Reconstruction
               </h3>
               <div className="text-xs font-mono text-mono-400 leading-relaxed bg-mono-900/30 p-2 border border-mono-800/50">
                  <span className="text-tech-red">{" >> "} DECRYPTING BLACK BOX...</span><br/>
                  <span className="opacity-80"><TypewriterText text={report.reconstruction_analysis || "Data recovery in progress..."} delay={10} /></span>
               </div>
            </div>

            <div className="space-y-1">
               <h3 className="text-[10px] font-bold font-sans text-tech-emerald uppercase flex items-center gap-2">
                  <Zap size={10} /> Governor Patch Recommendation
               </h3>
               <div className="font-mono text-[10px] text-tech-emerald bg-tech-emerald/5 border border-tech-emerald/20 p-2">
                  {report.governor_patch || "Increase damping ratio on Z-axis."}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};