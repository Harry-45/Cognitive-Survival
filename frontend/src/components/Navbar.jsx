import React from 'react';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-sm bg-cyber-bg/50">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg glow-button flex items-center justify-center p-1.5">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="text-white">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
                <span className="text-xl font-black font-orbitron tracking-tighter">
                    COGNITIVE <span className="text-cyber-blue">SURVIVAL</span>
                </span>
            </div>

            <div className="hidden md:flex items-center gap-10">
                <a href="#" className="text-[10px] font-orbitron uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors">The Simulation</a>
                <a href="#" className="text-[10px] font-orbitron uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors">Mechanics</a>
                <a href="#" className="text-[10px] font-orbitron uppercase tracking-[0.2em] text-cyber-blue transition-colors">Neural Sync</a>
                <a href="#" className="text-[10px] font-orbitron uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors">Lore</a>
            </div>

            <button className="px-6 py-2 rounded border border-cyber-blue/30 text-cyber-blue text-[10px] font-orbitron font-bold uppercase tracking-[0.2em] hover:bg-cyber-blue/10 transition-colors">
                Access Terminal
            </button>
        </nav>
    );
};

export default Navbar;
