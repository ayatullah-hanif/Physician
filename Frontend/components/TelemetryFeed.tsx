import React from 'react';
import { Camera, RefreshCw, CheckCircle2, Ban, Shield, Loader2, AlertTriangle } from 'lucide-react';
import { PhysicianAnalysis } from '../types';

interface TelemetryFeedProps {
  imagePreview: string | null;
  isAnalyzing: boolean;
  status?: PhysicianAnalysis['status'];
}

export const TelemetryFeed: React.FC<TelemetryFeedProps> = ({ imagePreview, isAnalyzing, status }) => {
  
  // Define Gate States
  const isIdle = !isAnalyzing && !status;
  const isVerifying = isAnalyzing;
  const isGo = !isAnalyzing && status === 'PASS';
  const isBlocked = !isAnalyzing && status === 'FAIL';
  const isWarning = !isAnalyzing && status === 'WARNING';

  let borderColor = "border-mono-800";
  let glowEffect = "";
  let headerColor = "text-mono-500";
  
  if (isVerifying) {
    borderColor = "border-tech-cyan";
    glowEffect = "shadow-[0_0_30px_rgba(6,182,212,0.2)]";
    headerColor = "text-tech-cyan";
  } else if (isGo) {
    borderColor = "border-tech-emerald";
    glowEffect = "shadow-[0_0_50px_rgba(16,185,129,0.3)]";
    headerColor = "text-tech-emerald";
  } else if (isBlocked) {
    borderColor = "border-tech-red";
    glowEffect = "shadow-[0_0_50px_rgba(239,68,68,0.4)]";
    headerColor = "text-tech-red";
  } else if (isWarning) {
     borderColor = "border-tech-amber";
     glowEffect = "shadow-[0_0_30px_rgba(245,158,11,0.2)]";
     headerColor = "text-tech-amber";
  }

  return (
    <div className={`relative h-full w-full bg-black border-2 ${borderColor} ${glowEffect} transition-all duration-500 overflow-hidden flex flex-col`}>
      
      {/* HUD Header */}
      <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-start pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md px-3 py-1 border border-mono-800 text-[10px] font-mono text-tech-cyan flex items-center gap-2">
            <Camera size={12} /> LIVE_FEED_01
        </div>
        <div className={`bg-black/60 backdrop-blur-md px-3 py-1 border border-mono-800 text-[10px] font-mono font-bold flex items-center gap-2 uppercase ${headerColor}`}>
            {isVerifying ? 'CALCULATING PHYSICS...' 
              : isGo ? 'SAFE TO PROCEED' 
              : isBlocked ? 'SAFETY INHIBITION ACTIVE' 
              : isWarning ? 'CAUTION: RESTRICTED MODE'
              : 'STANDBY'}
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-grow flex items-center justify-center bg-[#050505] overflow-hidden">
        {imagePreview ? (
            <img 
              src={imagePreview} 
              alt="Telemetry" 
              className={`w-full h-full object-contain transition-opacity duration-500 ${isAnalyzing ? 'opacity-50' : 'opacity-80'}`}
            />
        ) : (
            <div className="flex flex-col items-center justify-center opacity-30">
                <Shield size={64} className="text-mono-700 mb-4" />
                <div className="text-mono-500 font-mono text-xs tracking-widest">NO SIGNAL SOURCE</div>
            </div>
        )}

        {/* --- STATE OVERLAYS --- */}

        {/* 1. IDLE (Grid only) */}
        {isIdle && imagePreview && (
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
        )}

        {/* 2. VERIFYING (Spinner) */}
        {isVerifying && (
            <div className="absolute inset-0 flex items-center justify-center z-30">
                <div className="relative">
                    <div className="absolute inset-0 bg-tech-cyan/20 blur-xl rounded-full"></div>
                    <Loader2 size={80} className="text-tech-cyan animate-spin relative z-10" />
                    <div className="mt-4 text-center font-mono text-tech-cyan text-xs tracking-[0.2em] animate-pulse">VERIFYING KINEMATICS</div>
                </div>
            </div>
        )}

        {/* 3. BLOCKED (Red Gate) */}
        {isBlocked && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="border-2 border-tech-red bg-black/90 p-8 flex flex-col items-center shadow-[0_0_50px_rgba(239,68,68,0.3)] animate-in zoom-in duration-300">
                    <Ban size={64} className="text-tech-red mb-4" />
                    <h2 className="text-3xl font-black font-sans text-tech-red tracking-tighter">HARD BLOCK</h2>
                    <div className="w-full h-[1px] bg-tech-red/50 my-4"></div>
                    <p className="text-tech-red font-mono text-xs uppercase tracking-widest">Kinematic Violation</p>
                </div>
            </div>
        )}

        {/* 4. GO (Green Gate) */}
        {isGo && (
            <div className="absolute inset-0 z-10 pointer-events-none border-[1px] border-tech-emerald/30 m-4">
                 <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-tech-emerald/10 border border-tech-emerald px-6 py-2 backdrop-blur-md flex items-center gap-3">
                    <CheckCircle2 size={24} className="text-tech-emerald" />
                    <span className="text-tech-emerald font-bold font-mono tracking-widest">GATE OPEN</span>
                 </div>
            </div>
        )}

        {/* 5. WARNING (Amber Gate) */}
        {isWarning && (
            <div className="absolute inset-0 z-10 pointer-events-none border-[1px] border-tech-amber/30 m-4 border-dashed">
                 <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-tech-amber/10 border border-tech-amber px-6 py-2 backdrop-blur-md flex items-center gap-3">
                    <AlertTriangle size={24} className="text-tech-amber" />
                    <span className="text-tech-amber font-bold font-mono tracking-widest">PROCEED WITH CAUTION</span>
                 </div>
            </div>
        )}
      </div>
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-mono-700"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-mono-700"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-mono-700"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-mono-700"></div>

    </div>
  );
};