import React, { useState, useRef } from 'react';
import { Upload, FileCode, Zap, AlertCircle, Box, MonitorPlay, Download, FileJson } from 'lucide-react';
import { analyzeImageAndGenerateScript } from './services/gemini';
import { AppState, GeminiResponse } from './types';
import { AnalysisCard } from './components/AnalysisCard';
import { CodeBlock } from './components/CodeBlock';

const App = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [data, setData] = useState<GeminiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setData(null);
      setAppState(AppState.IDLE);
      setError(null);
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    // NOTE: In a real deployment, we would properly handle the key.
    // For this environment, we assume process.env.API_KEY is available.
    // Since we are generating client-side, we must ensure we have a key.
    
    // !!! IMPORTANT: The user MUST provide their own key in a real app,
    // but for this demo environment we check the environment.
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      setError("API Key not found. Please ensure REACT_APP_GEMINI_API_KEY is set.");
      return;
    }

    setAppState(AppState.ANALYZING);
    setError(null);

    try {
      const result = await analyzeImageAndGenerateScript(file, apiKey);
      setData(result);
      setAppState(AppState.COMPLETE);
    } catch (err: any) {
      setAppState(AppState.ERROR);
      setError(err.message || "Failed to analyze image.");
    }
  };

  const handleDownloadScript = () => {
    if (!data?.blenderScript) return;
    const blob = new Blob([data.blenderScript], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.analysis.characterName.replace(/\s+/g, '_').toLowerCase()}_builder.py`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.analysis.characterName.replace(/\s+/g, '_').toLowerCase()}_analysis.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-cyber-black text-gray-100 font-sans selection:bg-cyber-primary/30 pb-20">
      
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-cyber-secondary/20 bg-cyber-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-cyber-primary text-cyber-black p-2 rounded">
              <Box size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold tracking-widest text-white">NEUROMESH <span className="text-cyber-primary">3D</span></h1>
              <p className="text-xs text-cyber-primary/60 tracking-widest uppercase">Image to Block-out Architect</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> SYSTEM ONLINE</span>
             <span>V.1.0.4</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        
        {/* Input Section */}
        <section className="mb-12">
          <div 
            className={`
              relative group border-2 border-dashed rounded-xl p-8 transition-all duration-300 ease-out
              ${!file ? 'border-gray-700 bg-cyber-panel/50 hover:border-cyber-primary/50 hover:bg-cyber-panel' : 'border-cyber-primary bg-cyber-dark'}
            `}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              accept="image/*"
            />
            
            {!file ? (
              <div className="text-center space-y-4 py-8">
                <div className="w-20 h-20 mx-auto rounded-full bg-cyber-dark border border-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
                  <Upload className="text-gray-400 group-hover:text-cyber-primary transition-colors" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-display text-white mb-2">Initialize Asset Scan</h3>
                  <p className="text-gray-400 max-w-md mx-auto">Drop character concept art here or click to browse. Supported formats: PNG, JPG, WEBP.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative w-full md:w-1/3 aspect-[3/4] rounded-lg overflow-hidden border border-cyber-primary/30 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-shadow">
                  <img src={previewUrl!} alt="Preview" className="w-full h-full object-cover" />
                  {appState === AppState.ANALYZING && (
                    <div className="absolute inset-0 bg-cyber-primary/10 animate-pulse z-10">
                      <div className="absolute top-0 w-full h-1 bg-cyber-primary shadow-[0_0_10px_#00f0ff] animate-scan"></div>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-xl font-display text-white mb-1">Source Detected</h3>
                    <p className="text-cyber-primary font-mono text-sm">{file.name}</p>
                    <p className="text-gray-500 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>

                  {appState === AppState.IDLE && (
                    <button 
                      onClick={handleProcess}
                      className="group relative px-8 py-4 bg-cyber-primary text-cyber-black font-display font-bold text-lg tracking-wider clip-path-polygon hover:bg-white transition-colors w-full md:w-auto"
                      style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%)' }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Zap size={20} className="group-hover:fill-current" />
                        INITIATE GENERATION SEQUENCE
                      </span>
                    </button>
                  )}

                  {appState === AppState.ANALYZING && (
                    <div className="space-y-2">
                       <div className="h-2 w-full bg-cyber-dark rounded-full overflow-hidden">
                         <div className="h-full bg-cyber-primary w-2/3 animate-[progress_2s_ease-in-out_infinite]"></div>
                       </div>
                       <p className="text-cyber-primary font-mono text-xs animate-pulse">PROCESSING NEURAL ARCHITECTURE...</p>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-200 rounded flex items-center gap-3">
                      <AlertCircle size={20} />
                      {error}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Results Section */}
        {appState === AppState.COMPLETE && data && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-[fadeIn_0.5s_ease-out]">
            
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-cyber-primary border-b border-cyber-primary/20 pb-2">
                <FileCode size={20} />
                <h2 className="font-display font-bold">ANALYSIS PROTOCOL</h2>
              </div>
              <AnalysisCard data={data.analysis} />
              
              <div className="bg-cyber-panel border border-cyber-secondary/30 p-6 rounded-lg">
                <h3 className="text-sm uppercase text-gray-400 font-bold mb-4 flex items-center gap-2">
                  <MonitorPlay size={16} /> Instructions
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300 font-mono">
                  <li>Download the Python Script (see below).</li>
                  <li>Open <span className="text-orange-400">Blender</span> (v3.0+).</li>
                  <li>Go to the <span className="text-white">Scripting</span> tab.</li>
                  <li>Open or paste the downloaded code.</li>
                  <li>Press "Run Script" (Play icon) to generate the mesh.</li>
                  <li className="text-cyber-primary font-bold">Export as .FBX via File &gt; Export &gt; FBX.</li>
                </ol>
              </div>

              {/* Export Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-cyber-secondary/20">
                 <button 
                  onClick={handleDownloadScript}
                  className="bg-cyber-primary hover:bg-white text-cyber-black font-display font-bold py-4 rounded flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                >
                  <Download size={20} strokeWidth={2.5} />
                  <span>DOWNLOAD BUILD SCRIPT</span>
                </button>
                <button 
                  onClick={handleDownloadJSON}
                  className="bg-cyber-dark hover:bg-cyber-panel border border-cyber-secondary/50 text-cyber-secondary hover:text-white py-4 rounded flex items-center justify-center gap-2 transition-all font-mono text-sm"
                >
                  <FileJson size={20} />
                  <span>EXPORT RAW ANALYSIS</span>
                </button>
              </div>
            </div>

            <div className="space-y-6 flex flex-col h-[600px]">
              <div className="flex items-center gap-2 text-cyber-secondary border-b border-cyber-secondary/20 pb-2">
                <Box size={20} />
                <h2 className="font-display font-bold">GENERATED BLUEPRINT (PYTHON)</h2>
              </div>
              <CodeBlock code={data.blenderScript} />
            </div>

          </section>
        )}

      </main>
    </div>
  );
};

export default App;