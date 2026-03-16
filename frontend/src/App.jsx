import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Analytics from './components/Analytics';
import Simulation from './components/Simulation';
import Matrix from './components/Matrix';
import Profile from './components/Profile';
import Login from './components/Login';
import { useAuth } from './context/AuthContext';

function App() {
  const [activeModule, setActiveModule] = useState('landing');
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const { user, logout, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-cyber-bg flex items-center justify-center font-orbitron">INITIALIZING_NEURAL_LINK...</div>;

  const renderModule = () => {
    if (!user && activeModule !== 'landing') {
      return <Login onSuccess={() => setActiveModule('simulation')} />;
    }

    switch (activeModule) {
      case 'landing':
        return <Hero onAction={(mod) => setActiveModule(mod)} />;
      case 'analytics':
        return <Analytics sessionId={selectedSessionId} />;
      case 'simulation':
        return <Simulation onComplete={(id) => { setSelectedSessionId(id); setActiveModule('matrix'); }} />;
      case 'matrix':
        return <Matrix sessionId={selectedSessionId} />;
      case 'profile':
        return <Profile onSelectSession={(id) => { setSelectedSessionId(id); setActiveModule('analytics'); }} />;
      case 'login':
        return <Login onSuccess={() => setActiveModule('simulation')} />;
      default:
        return <Hero />;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-white selection:bg-cyber-blue/30 overflow-x-hidden">
      {/* Custom Global Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-cyber-bg/50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveModule('landing')}>
          <div className="w-8 h-8 rounded-lg glow-button flex items-center justify-center p-1.5">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-black font-orbitron tracking-tighter uppercase">
            COGNITIVE <span className="text-cyber-blue">SURVIVAL</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <button
            onClick={() => setActiveModule('simulation')}
            className={`text-[10px] font-orbitron uppercase tracking-[0.2em] transition-colors ${activeModule === 'simulation' ? 'text-cyber-blue' : 'text-white/50 hover:text-white'}`}
          >
            The Simulation
          </button>
          <button
            onClick={() => setActiveModule('matrix')}
            className={`text-[10px] font-orbitron uppercase tracking-[0.2em] transition-colors ${activeModule === 'matrix' ? 'text-cyber-blue' : 'text-white/50 hover:text-white'}`}
          >
            Variance Matrix
          </button>
          <button
            onClick={() => setActiveModule('analytics')}
            className={`text-[10px] font-orbitron uppercase tracking-[0.2em] transition-colors ${activeModule === 'analytics' ? 'text-cyber-blue' : 'text-white/50 hover:text-white'}`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveModule('profile')}
            className={`text-[10px] font-orbitron uppercase tracking-[0.2em] transition-colors ${activeModule === 'profile' ? 'text-cyber-blue' : 'text-white/50 hover:text-white'}`}
          >
            Neural Sync
          </button>
        </div>

        <button
          onClick={() => setActiveModule(user ? 'profile' : 'login')}
          className="px-6 py-2 rounded border border-cyber-blue/30 text-cyber-blue text-[10px] font-orbitron font-bold uppercase tracking-[0.2em] hover:bg-cyber-blue/10 transition-colors"
        >
          {user ? `[ ${user.username} ]` : 'Access Terminal'}
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="pt-24 min-h-screen">
        <div className="animate-in fade-in duration-700">
          {renderModule()}
        </div>
      </main>

      {/* Footer - Hidden on Login Screen for clean UI */}
      {(activeModule !== 'login' && (user || activeModule === 'landing')) && (
        <footer className="p-12 border-t border-white/5 mt-20 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 opacity-60">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-cyber-blue/20 flex items-center justify-center p-1 border border-cyber-blue/30">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="text-cyber-blue">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <span className="text-sm font-black font-orbitron tracking-tighter">
                    COGNITIVE SURVIVAL
                  </span>
                </div>
                <p className="text-[9px] font-orbitron leading-relaxed tracking-wider text-white/50">
                  Advanced neural simulation platform for cognitive boundary exploration and variance matrix analysis.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-orbitron font-bold text-cyber-blue uppercase tracking-[0.2em]">System Status</h4>
                <div className="space-y-2 text-[8px] font-orbitron uppercase tracking-widest text-white/40">
                  <div className="flex justify-between"><span>Neural Link</span><span className="text-green-500">Active</span></div>
                  <div className="flex justify-between"><span>Simulation Load</span><span>42.8%</span></div>
                  <div className="flex justify-between"><span>Data Clusters</span><span>11,092</span></div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-orbitron font-bold text-cyber-blue uppercase tracking-[0.2em]">Protocols</h4>
                <div className="flex flex-col gap-2 text-[8px] font-orbitron uppercase tracking-widest">
                  <a href="#" className="hover:text-cyber-blue transition-colors">Privacy Protocol</a>
                  <a href="#" className="hover:text-cyber-blue transition-colors">EULA</a>
                  <a href="#" className="hover:text-cyber-blue transition-colors">Core Directive</a>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-orbitron font-bold text-cyber-blue uppercase tracking-[0.2em]">Neural Network</h4>
                <div className="flex gap-4">
                  <a 
                    href="https://github.com/Harry-45" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded border border-white/10 flex items-center justify-center hover:border-cyber-blue/50 hover:bg-cyber-blue/5 transition-all cursor-pointer text-white/60 hover:text-cyber-blue"
                    title="GitHub Profile"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/om-gore45" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded border border-white/10 flex items-center justify-center hover:border-cyber-blue/50 hover:bg-cyber-blue/5 transition-all cursor-pointer text-white/60 hover:text-cyber-blue"
                    title="LinkedIn Profile"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                  <div className="w-8 h-8 rounded border border-white/10 flex items-center justify-center hover:border-cyber-blue/50 hover:bg-cyber-blue/5 transition-all cursor-pointer text-white/60">
                    <span className="text-xs">📡</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 opacity-30">
              <span className="text-[8px] font-orbitron tracking-[0.3em]">
                © 2026 COGNITIVE SURVIVAL. ALL RIGHTS RESERVED.
              </span>
              <span className="text-[8px] font-orbitron tracking-[0.3em]">
                VERSION 4.0.2-BETA // SIGNAL_SECURE
              </span>
            </div>
          </div>
        </footer>
      )}

      <style>{`
        .animate-in {
          animation: animate-in 0.5s ease-out;
        }
        @keyframes animate-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;
