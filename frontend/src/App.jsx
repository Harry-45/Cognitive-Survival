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

      {/* Footer */}
      <footer className="p-12 border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center p-1">
              <svg viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-sm font-black font-orbitron tracking-tighter">
              COGNITIVE SURVIVAL © 2024
            </span>
          </div>
          <div className="flex gap-8 text-[8px] font-orbitron uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-white transition-colors">EULA</a>
            <a href="#" className="hover:text-white transition-colors">Community Hub</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded border border-white/10 flex items-center justify-center hover:bg-white/5 cursor-pointer">
              <span className="text-xs">🌐</span>
            </div>
            <div className="w-8 h-8 rounded border border-white/10 flex items-center justify-center hover:bg-white/5 cursor-pointer">
              <span className="text-xs">💬</span>
            </div>
          </div>
        </div>
      </footer>

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
