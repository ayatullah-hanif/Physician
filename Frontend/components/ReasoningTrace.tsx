import React from 'react';
import { Wind, Weight, Move3d, Terminal, Zap, Triangle } from 'lucide-react';
import { PhysicianAnalysis } from '../types';

interface ReasoningTraceProps {
  analysis: PhysicianAnalysis | null;
  loading: boolean;
}

const DigitalGauge: React.FC<{ label: string; value: string | number; unit?: string; icon: React.ReactNode; color: string }> = ({ label, value, unit, icon, color }) => (
  <div className="bg-mono-900 border border-mono-800 p-3 relative overflow-hidden group hover:border-mono-600 transition-colors">
    <div className={`absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity ${color}`}>
        {icon}
    </div>
    <div className="text-[10px] font-mono text-mono-500 uppercase tracking-wider mb-1 flex items-center gap-2">
       {icon && <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>}
       {label}
    </div>
    <div className="flex items-baseline gap-1">
        <span className={`text-xl font-bold font-mono ${color}`}>{value}</span>
        {unit && <span className="text-[10px] text-mono-500 font-mono">{unit}</span>}
    </div>
    <div className="w-full h-1 bg-mono-800 mt-2 rounded-full overflow-hidden">
        <div className={`h-full w-2/3 ${color.replace('text-', 'bg-')} opacity-50`}></div>
    </div>
  </div>
);

export const ReasoningTrace: React.FC<ReasoningTraceProps> = ({ analysis, loading }) => {
  return (
    <div className="flex flex-col h-full gap-4">
       <div className="grid grid-cols-1 gap-2">
            <DigitalGauge 
                label="Friction Coeff (μ)" 
                value={analysis?.details?.friction_mu || "--"} 
                icon={<Wind size={16} />}
                color="text-tech-amber"
            />
            <DigitalGauge 
                label="Stability Index" 
                value={analysis?.status === 'PASS' ? '98.2%' : analysis?.status === 'FAIL' ? '12.4%' : '--'} 
                icon={<Triangle size={16} />}
                color="text-tech-cyan"
            />
            <DigitalGauge 
                label="Est. Mass" 
                value={"1.2kg"} 
                icon={<Weight size={16} />}
                color="text-tech-emerald"
            />
       </div>

       <div className="flex-grow flex flex-col bg-black border border-mono-800 overflow-hidden relative">
            <div className="bg-mono-900/50 p-2 border-b border-mono-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-mono text-mono-400 uppercase tracking-wider">
                    <Terminal size={10} /> Causal Reasoning Chain
                </div>
                {loading && <div className="w-2 h-2 bg-tech-cyan rounded-full animate-pulse"></div>}
            </div>
            
            <div className="p-3 font-mono text-[10px] text-mono-300 overflow-y-auto space-y-3 flex-grow custom-scrollbar">
                {loading ? (
                    <div className="space-y-1 animate-pulse text-tech-cyan">
                        <div>{">"} INITIATING PHYSICS KERNEL...</div>
                        <div>{">"} PARSING GEOMETRY...</div>
                        <div>{">"} CALCULATING FORCES...</div>
                    </div>
                ) : analysis ? (
                    <>
                        <div className="text-mono-500 border-b border-mono-800 pb-2 mb-2">
                            {">"} TARGET DETECTED: {analysis?.details?.material?.toUpperCase() || "UNKNOWN"}
                        </div>
                        <div className="space-y-2">
                            <p className="leading-relaxed"><span className="text-tech-cyan">{">>"} ANALYSIS:</span> {analysis?.details?.reasoning}</p>
                            
                            {analysis?.details?.risks && (
                                <div>
                                    <span className="text-tech-amber">{">>"} RISKS IDENTIFIED:</span>
                                    <ul className="pl-4 mt-1 list-disc text-mono-400">
                                        <li>Kinematic Instability Detected</li>
                                        <li>Surface Friction Variance</li>
                                    </ul>
                                </div>
                            )}

                            <div>
                                <span className="text-mono-400">{">>"} LOGIC TRACE:</span>
                                <p className="mt-1 text-mono-500 opacity-80 pl-2 border-l border-mono-800">
                                    {analysis?.details?.reasoning || "No trace available."}
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-mono-600 italic text-center mt-10">
                        // AWAITING DATA STREAM
                    </div>
                )}
            </div>
       </div>
    </div>
  );
};