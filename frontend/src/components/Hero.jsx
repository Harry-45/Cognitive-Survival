import React from 'react';

const Hero = ({ onAction }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyber-blue/20 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyber-purple/20 rounded-full blur-[120px] animate-pulse-slow"></div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 mb-8">
            <span className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse"></span>
            <span className="text-[10px] font-orbitron uppercase tracking-[0.2em] text-cyber-blue">System Status: Active</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-4 leading-tight">
            OUTTHINK<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-cyber-purple">THE MACHINE.</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-light">
            A premium psychological strategy experience. Master your neural signatures to navigate a complex, adversarial digital psyche. Survival isn't physical—it's cognitive.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={() => onAction('simulation')}
              className="glow-button px-8 py-4 rounded-lg font-orbitron text-sm font-bold flex items-center justify-center gap-2 group"
            >
              BEGIN NEURAL SYNC
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button className="px-8 py-4 rounded-lg font-orbitron text-sm font-bold border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
              WATCH TRAILER
            </button>
          </div>
          
          <div className="flex gap-16 mt-16 pt-8 border-t border-white/5 justify-center lg:justify-start">
            <div>
              <div className="text-3xl font-orbitron font-bold">0.02ms</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Sync Latency</div>
            </div>
            <div>
              <div className="text-3xl font-orbitron font-bold">100%</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Cortex Integrity</div>
            </div>
          </div>
        </div>

        {/* Cyborg Visual Placeholder */}
        <div className="flex-1 relative">
          <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] glass-panel flex items-center justify-center overflow-hidden border-cyber-blue/20">
             {/* We'll use a generated image here eventually, for now a placeholder aesthetic */}
             <div className="absolute inset-0 bg-gradient-to-t from-cyber-blue/20 to-transparent"></div>
             <div className="text-cyber-blue/50 text-center space-y-4">
                <div className="w-16 h-16 border-t-2 border-l-2 border-cyber-blue mx-auto rounded-tl-xl opacity-20"></div>
                <div className="font-orbitron text-[10px] tracking-[0.3em] uppercase">Neural Mapping In Progress...</div>
                {/* Visual scan animation */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-cyber-blue/50 animate-[scan_3s_linear_infinite]"></div>
             </div>
             
             {/* HUD elements */}
             <div className="absolute top-6 left-6 text-[8px] font-mono text-cyber-blue/60 leading-tight">
                X-992-ALPHA<br />
                UPTIME: 02:44:12
             </div>
             <div className="absolute top-6 right-6 p-2 rounded border border-cyber-blue/20 bg-cyber-blue/5">
                <div className="text-[8px] text-cyber-blue/60 mb-1">MEMORY LOAD</div>
                <div className="w-16 h-1 mb-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-[42%] h-full bg-cyber-blue"></div>
                </div>
                <div className="text-[8px] text-right text-cyber-blue font-bold">42%</div>
             </div>
             
             <div className="absolute bottom-10 right-10 glass-panel p-3 border-cyber-purple/30 bg-cyber-purple/5">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple"></span>
                    <span className="text-[8px] font-orbitron text-cyber-purple/80 uppercase tracking-widest">Ego Vulnerability</span>
                </div>
                <div className="text-[10px] text-cyber-purple font-bold tracking-widest">LOW_THREAT_DETECTED</div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Protocol Lines */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-cyber-bg to-transparent flex flex-col items-center">
         <div className="text-[8px] font-orbitron text-gray-600 tracking-[0.5em] mb-4">PROTOCOL START</div>
         <div className="w-[1px] h-12 bg-gradient-to-b from-cyber-blue to-transparent"></div>
      </div>

      <style>{`
        @keyframes scan {
          from { top: 0%; }
          to { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Hero;
