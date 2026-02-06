import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { TelemetryFeed } from './components/TelemetryFeed';
import { ReasoningTrace } from './components/ReasoningTrace';
import { ForensicPanel } from './components/ForensicPanel';
import { LogEntry, PhysicianAnalysis } from './types';
// Removed analyzeKinematics as we now hit our local Python server
import { Upload, FileImage, MousePointer2, AlertCircle, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [intent, setIntent] = useState<string>("Pick up the glass bottle and rotate it 90 degrees.");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [simulateCrash, setSimulateCrash] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = useCallback((message: string, level: LogEntry['level'] = 'INFO') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36),
      timestamp: new Date().toISOString().split('T')[1].slice(0, 8),
      level,
      message,
    };
    setLogs(prev => [...prev, newLog]);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        addLog("Visual telemetry buffer loaded into memory.", "INFO");
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!selectedFile) {
      addLog("MISSING_TELEMETRY: No visual input source.", "WARN");
      return;
    }
    
    // Check if user is triggering the demo override
    const finalIntent = simulateCrash ? `OVERRIDE: ${intent}` : intent;

    setIsAnalyzing(true);
    setAnalysis(null);
    addLog(simulateCrash ? "INITIATING STRESS TEST [SIMULATION]..." : "Synchronizing with local Physician Kernel...", "SYS");
    
    try {
      // 1. Prepare FormData for the Python Backend
      const formData = new FormData();
      formData.append('command', finalIntent);
      formData.append('image', selectedFile);

      // 2. CALL THE PYTHON BRIDGE (bridge.py)
      const response = await fetch('http://localhost:8000/verify', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Backend Offline');

      const result = await response.json();
      
      // 3. Update Analysis State
      setAnalysis(result);
      
      // 4. Handle UI Logging based on results
      if (result.is_crash) {
        addLog("CRITICAL: PHYSICAL LAW VIOLATION DETECTED", "CRIT");
        addLog("INITIATING FORENSIC BLACK BOX RECOVERY...", "CRIT");
      } else if (result.verdict === "GO") {
        addLog(`VERIFICATION_SUCCESS: Gate is OPEN`, "INFO");
      } else {
        addLog(`VERIFICATION_BLOCKED: Safety Governor Engaged`, "WARN");
      }

    } catch (error) {
      addLog("CONNECTION_ERROR: Python bridge.py is not responding.", "CRIT");
      console.error("Analysis Failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-mono-950 text-mono-100 font-sans overflow-hidden grid-bg">
      <Header />
      
      <main className="flex-grow p-6 grid grid-cols-12 gap-6 h-[calc(100vh-4rem)]">
        
        {/* COL 1: COMMAND DECK */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
            <div className="bg-mono-900/80 border border-mono-800 p-1">
                <div className="bg-mono-950 p-2 border-b border-mono-800 text-[10px] font-mono text-mono-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <FileImage size={12}/> Visual Telemetry
                </div>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video border-2 border-dashed border-mono-800 hover:border-tech-cyan/50 hover:bg-mono-900 cursor-pointer flex flex-col items-center justify-center transition-all group"
                >
                    {imagePreview ? (
                        <img src={imagePreview} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                    ) : (
                        <>
                            <Upload className="text-mono-600 group-hover:text-tech-cyan mb-2" size={24} />
                            <span className="text-[10px] font-mono text-mono-600 group-hover:text-tech-cyan">UPLOAD SOURCE</span>
                        </>
                    )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            <div className="bg-mono-900/80 border border-mono-800 p-1 flex-grow flex flex-col">
                <div className="bg-mono-950 p-2 border-b border-mono-800 text-[10px] font-mono text-mono-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <MousePointer2 size={12}/> Intent Vector
                </div>
                <textarea
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    className="w-full flex-grow bg-black border border-mono-800 p-3 text-xs font-mono text-mono-300 focus:border-tech-cyan outline-none resize-none placeholder-mono-700"
                    placeholder="// Enter robot command..."
                />
                
                <div className="mt-4 px-2 flex items-center justify-between border border-mono-800 p-2 bg-mono-950 select-none">
                   <div className="flex items-center gap-2 text-[10px] font-mono text-mono-400">
                      <Zap size={10} className={simulateCrash ? "text-tech-red" : "text-mono-600"} />
                      STRESS TEST
                   </div>
                   <button 
                     onClick={() => setSimulateCrash(!simulateCrash)}
                     className={`w-8 h-4 rounded-full relative transition-colors ${simulateCrash ? 'bg-tech-red' : 'bg-mono-800'}`}
                   >
                      <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${simulateCrash ? 'translate-x-4' : ''}`}></div>
                   </button>
                </div>
                {simulateCrash && (
                  <div className="text-[9px] font-mono text-tech-red mt-1 px-1 flex items-center gap-1 animate-pulse">
                     <AlertCircle size={10}/> FORCING FAILURE SIMULATION
                  </div>
                )}

                <button 
                    onClick={runAnalysis}
                    disabled={isAnalyzing}
                    className={`mt-2 w-full h-12 flex items-center justify-center gap-2 text-sm font-bold font-mono tracking-widest uppercase transition-all
                        ${isAnalyzing 
                            ? 'bg-mono-800 text-mono-500 cursor-wait' 
                            : imagePreview 
                                ? (simulateCrash ? 'bg-tech-red text-black shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-tech-cyan text-black hover:bg-white shadow-[0_0_20px_rgba(6,182,212,0.4)]') 
                                : 'bg-mono-800 text-mono-600 cursor-not-allowed'}`}
                >
                    {isAnalyzing ? 'PROCESSING' : simulateCrash ? 'RUN SIMULATION' : 'VERIFY'}
                </button>
            </div>
        </div>

        {/* COL 2: THE GATE */}
        <div className="col-span-12 lg:col-span-6 flex flex-col relative h-full">
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 bg-mono-950 px-4 text-[10px] font-mono text-mono-500 uppercase tracking-widest z-10 border border-mono-800 text-center">
                Primary Kinematic Gate
            </div>
            <TelemetryFeed 
                imagePreview={imagePreview} 
                isAnalyzing={isAnalyzing} 
                status={analysis?.is_crash ? 'FAIL' : analysis?.verdict === 'GO' ? 'PASS' : analysis?.verdict === 'BLOCKED' ? 'FAIL' : undefined} 
            />
        </div>

        {/* COL 3: PHYSICS/FORENSICS */}
        <div className="col-span-12 lg:col-span-3 flex flex-col h-full gap-4">
             {analysis?.is_crash ? (
               <ForensicPanel report={{
                 failure_signature: "Kinematic Rupture",
                 primary_law_violated: "Torque Limit Exceeded",
                 reconstruction_analysis: analysis.forensic_analysis,
                 governor_patch: "Increase Damping Ratio +0.5"
               }} />
             ) : (
               <ReasoningTrace analysis={analysis} loading={isAnalyzing} />
             )}
        </div>
        
      </main>
    </div>
  );
};

export default App;