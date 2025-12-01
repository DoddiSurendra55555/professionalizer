import { useState } from 'react';
import axios from 'axios';
import { 
  Briefcase, MessageCircle, Gavel, Flame, 
  Copy, Sparkles, Loader2, Cpu, Activity, 
  Terminal, ShieldCheck 
} from 'lucide-react';

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tone, setTone] = useState('Professional');

  // Matched tones to the screenshot's right-side list style
  const tones = [
    { id: 'Professional', icon: Briefcase, label: 'Professional', desc: 'Corporate Standard' },
    { id: 'Friendly', icon: MessageCircle, label: 'Friendly', desc: 'Warm & Casual' },
    { id: 'Cold', icon: Gavel, label: 'Strict', desc: 'Direct & Firm' },
    { id: 'Persuasive', icon: Flame, label: 'Persuasive', desc: 'Sales & Impact' },
  ];

  const handleRewrite = async () => {
    if (!input) return;
    setIsLoading(true);
    setOutput(""); 

    try {
      const response = await axios.post('http://localhost:5000/api/rewrite', {
        text: input,
        tone: tone
      });
      setOutput(response.data.result);
    } catch (error) {
      console.error("Error:", error);
      setOutput("⚠️ CONNECTION FAILURE: Server unreachable on port 5000.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col relative">
      
      {/* Top HUD Bar */}
      <header className="flex justify-between items-center mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-cyan-400 bg-cyan-950/30 flex items-center justify-center rounded-lg shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            <Cpu className="text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider text-glow-cyan uppercase">
              Pro<span className="text-cyan-400">fessionalizer</span>
            </h1>
            <div className="flex items-center gap-2 text-[10px] text-cyan-600 tracking-[0.2em] font-mono">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
              SYSTEM_READY
            </div>
          </div>
        </div>
        <div className="hidden md:flex gap-4 text-xs font-mono text-slate-500">
          <span className="flex items-center gap-1"><Terminal size={12}/> V2.0.4</span>
          <span className="flex items-center gap-1"><ShieldCheck size={12}/> ENCRYPTED</span>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
        
        {/* LEFT COLUMN: Input (Cyan Theme) */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Hero Input Card */}
          <div className="glass-card-cyan rounded-2xl p-1 relative flex-1 flex flex-col min-h-[500px]">
            {/* Tech Decoration Lines */}
            <div className="absolute top-0 left-8 w-20 h-[1px] bg-cyan-400/50"></div>
            <div className="absolute top-0 right-8 w-4 h-[1px] bg-cyan-400/50"></div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-cyan-300 font-semibold tracking-wide flex items-center gap-2">
                  <Activity size={16} /> INPUT DATA STREAM
                </h2>
                <span className="text-xs font-mono text-cyan-600 bg-cyan-950/30 px-2 py-1 rounded">
                  {input.length} BYTES
                </span>
              </div>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder=">> Enter raw text sequence here..."
                className="tech-input w-full flex-1 rounded-xl p-4 resize-none font-mono text-sm leading-relaxed placeholder:text-slate-600"
              />
              
              {/* Action Bar inside Card */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleRewrite}
                  disabled={isLoading || !input}
                  className="relative overflow-hidden group bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="flex items-center gap-2">
                    {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                    {isLoading ? 'PROCESSING...' : 'INITIALIZE REWRITE'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Output & Tones (Pink/Purple Theme) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Tone Selector Panel */}
          <div className="glass-card-pink rounded-2xl p-6">
            <h3 className="text-fuchsia-300 text-sm font-bold mb-4 tracking-wider uppercase flex items-center gap-2">
              <Activity size={14} className="text-fuchsia-500"/> Select Modulation
            </h3>
            
            <div className="grid grid-cols-1 gap-2">
              {tones.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-200 group text-left
                    ${tone === t.id 
                      ? 'bg-fuchsia-900/40 border-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.2)]' 
                      : 'bg-transparent border-white/5 text-slate-400 hover:bg-white/5 hover:border-white/20'
                    }`}
                >
                  <div className={`p-2 rounded-md ${tone === t.id ? 'bg-fuchsia-500 text-black' : 'bg-slate-800 text-slate-500'}`}>
                    <t.icon size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.label}</div>
                    <div className="text-[10px] opacity-60 font-mono uppercase">{t.desc}</div>
                  </div>
                  {tone === t.id && <div className="ml-auto w-2 h-2 bg-fuchsia-500 rounded-full animate-pulse"></div>}
                </button>
              ))}
            </div>
          </div>

          {/* Output Panel */}
          <div className="glass-card-pink rounded-2xl p-1 relative flex-1 min-h-[300px] flex flex-col">
             <div className="absolute top-0 right-8 w-20 h-[1px] bg-fuchsia-500/50"></div>
             
             <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-fuchsia-300 font-semibold tracking-wide">
                    OUTPUT SIGNAL
                  </h2>
                  {output && (
                    <button onClick={copyToClipboard} className="text-xs flex items-center gap-1 text-fuchsia-400 hover:text-white transition-colors">
                      <Copy size={12} /> COPY
                    </button>
                  )}
                </div>

                <div className="flex-1 rounded-xl bg-black/40 border border-fuchsia-500/10 p-4 relative overflow-hidden">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 text-fuchsia-500/50">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="text-xs font-mono animate-pulse">AI COMPUTING...</span>
                    </div>
                  ) : (
                    <textarea
                      readOnly
                      value={output}
                      placeholder="// Waiting for output..."
                      className="w-full h-full bg-transparent border-none focus:ring-0 resize-none text-slate-200 text-base leading-relaxed"
                    />
                  )}
                </div>
             </div>
          </div>

        </section>
      </main>
    </div>
  );
}