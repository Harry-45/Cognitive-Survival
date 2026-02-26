import React, { useState, useEffect } from 'react';
import api from '../api';

const Simulation = ({ onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(45);
    const [session, setSession] = useState(null);
    const [scenario, setScenario] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [started, setStarted] = useState(false);
    const [sessionEnded, setSessionEnded] = useState(false);
    const [finalReportId, setFinalReportId] = useState(null);

    const startNewSession = async () => {
        setLoading(true);
        setStarted(true);
        setSessionEnded(false);
        setScenario(null);
        try {
            const res = await api.post('session/start/');
            setSession(res.data);
            if (res.data.initial_scenario) {
                setScenario(res.data.initial_scenario);
            }
        } catch (err) {
            console.error("Failed to start session", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (timeLeft <= 0 || !scenario || sessionEnded) return;
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, scenario, sessionEnded]);

    const handleDecision = async (choiceLabel) => {
        setLoading(true);
        try {
            const res = await api.post('decision/', {
                session_id: session.id,
                scenario_id: scenario.id,
                choice_data: { label: choiceLabel }
            });

            setMetrics(res.data.psychological_metrics);
            setSession(prev => ({ ...prev, resources: res.data.updated_resources, current_difficulty: res.data.difficulty_level }));

            if (res.data.session_ended) {
                setSessionEnded(true);
                setFinalReportId(res.data.report_id);
                setScenario(null);
            } else {
                setScenario(res.data.next_scenario);
                setTimeLeft(45);
            }
        } catch (err) {
            console.error("Decision failed", err);
        }
        setLoading(false);
    };

    if (loading && !session) return <div className="p-20 text-center font-orbitron animate-pulse">CONNECTING_TO_NEURAL_ENGINE...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Top Status Bar */}
            <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-6 border-white/5 bg-cyber-bg/60">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg glow-button flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-xs font-black font-orbitron">COGNITIVE <span className="text-cyber-blue">SURVIVAL</span></div>
                        <div className="text-[8px] text-gray-500 font-mono tracking-widest uppercase">Neural Simulation v2.1.0</div>
                    </div>
                </div>

                <div className="flex items-center gap-12">
                    <div className="text-center">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue border border-cyber-blue shadow-[0_0_8px_rgba(59,130,246,1)]"></span>
                            <span className="text-sm font-orbitron font-bold">Lvl {session?.current_difficulty || 1}</span>
                        </div>
                        <div className="text-[8px] text-gray-500 uppercase tracking-widest mt-1">Difficulty</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center gap-2 text-cyber-cyan">
                            <span>💧</span>
                            <span className="text-sm font-orbitron font-bold">{session?.resources?.water || 100}</span>
                        </div>
                        <div className="text-[8px] text-gray-500 uppercase tracking-widest mt-1">Water</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center gap-2 text-green-500">
                            <span>🔋</span>
                            <span className="text-sm font-orbitron font-bold">{session?.resources?.energy || 100}</span>
                        </div>
                        <div className="text-[8px] text-gray-500 uppercase tracking-widest mt-1">Energy</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center gap-2 text-red-500">
                            <span className="animate-pulse">🍱</span>
                            <span className="text-sm font-orbitron font-bold">{session?.resources?.food || 100}</span>
                        </div>
                        <div className="text-[8px] text-gray-500 uppercase tracking-widest mt-1">Food</div>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                    <div className="w-10 h-10 rounded-full border border-white/10 p-0.5">
                        <div className="w-full h-full rounded-full bg-cyber-blue/20 overflow-hidden flex items-center justify-center">
                            <svg className="w-6 h-6 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Dilemma View */}
                <div className="lg:col-span-2 glass-panel p-12 border-cyber-blue/10 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[500px]">
                    <div className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(var(--color-cyber-blue) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                    {!started ? (
                        <div className="relative z-10 flex flex-col items-center animate-in">
                            <div className="w-24 h-24 rounded-2xl bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                                <svg className="w-12 h-12 text-cyber-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h2 className="text-4xl font-black font-orbitron mb-4 tracking-tighter uppercase">Neural Link Ready</h2>
                            <p className="text-gray-400 text-sm max-w-md mb-12 font-inter leading-relaxed">
                                System initialized. Environmental variables loaded. Awaiting subject authorization to begin the cognitive assessment.
                            </p>
                            <button
                                onClick={startNewSession}
                                className="px-16 py-5 bg-cyber-blue text-white rounded-xl font-bold font-orbitron text-xs tracking-[0.3em] hover:bg-cyber-blue/80 transition-all shadow-[0_0_30px_rgba(59,130,246,0.4)] uppercase"
                            >
                                Start Simulation
                            </button>
                        </div>
                    ) : sessionEnded ? (
                        <div className="relative z-10 flex flex-col items-center animate-in">
                            <div className="w-20 h-20 rounded-full border-2 border-cyber-blue flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                                <svg className="w-10 h-10 text-cyber-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-4xl font-black font-orbitron mb-4 tracking-tighter uppercase">Simulation Complete</h2>
                            <p className="text-gray-400 text-sm max-w-md mb-12 font-inter leading-relaxed">
                                Neural synchronization finished. All 8 core dilemmas processed. Subject data has been committed to the neural archives.
                            </p>
                            <div className="flex gap-6">
                                <button
                                    onClick={() => onComplete(session.id)}
                                    className="px-10 py-4 bg-cyber-blue text-white rounded-lg font-bold font-orbitron text-[10px] tracking-widest hover:bg-cyber-blue/80 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                >
                                    VIEW_ANALYTICS
                                </button>
                                <button
                                    onClick={startNewSession}
                                    className="px-10 py-4 border border-white/20 text-white rounded-lg font-bold font-orbitron text-[10px] tracking-widest hover:bg-white/5 transition-all"
                                >
                                    RESTART_SYSTEM
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Timer Circle */}
                            <div className="relative w-48 h-48 mb-12">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="96" cy="96" r="80" className="stroke-white/5 fill-none" strokeWidth="4" />
                                    <circle
                                        cx="96" cy="96" r="80"
                                        className="stroke-cyber-blue fill-none transition-all duration-1000"
                                        strokeWidth="4"
                                        strokeDasharray="502.6"
                                        strokeDashoffset={502.6 * (1 - timeLeft / 45)}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black font-orbitron leading-none">{timeLeft}</span>
                                    <span className="text-[8px] text-gray-500 uppercase tracking-widest mt-2">Seconds</span>
                                </div>
                            </div>

                            {scenario ? (
                                <div className="relative z-10 max-w-xl animate-in">
                                    <div className="text-[10px] text-cyber-blue font-orbitron uppercase tracking-[0.4em] mb-6">{scenario.category}</div>
                                    <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight uppercase font-orbitron tracking-tighter">
                                        {scenario.title}
                                    </h2>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-12 italic font-inter">
                                        {scenario.description}
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {Object.keys(scenario.impact_data || {}).map((label, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleDecision(label)}
                                                className="flex-1 px-8 py-5 rounded-lg font-bold font-orbitron text-[10px] tracking-widest bg-cyber-blue/10 border border-cyber-blue/30 text-white hover:bg-cyber-blue/20 transition-all uppercase"
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-500 font-orbitron uppercase tracking-widest animate-pulse">
                                    Awaiting_Neural_Input...
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Right Sidebar Telemetry */}
                <div className="space-y-6 flex flex-col">
                    <div className="glass-panel p-6 border-white/5 flex-1">
                        <div className="flex items-center gap-2 mb-8">
                            <span className="text-cyber-blue text-lg">📊</span>
                            <h3 className="text-[10px] font-orbitron uppercase tracking-widest text-white/70">Psychological Telemetry</h3>
                        </div>

                        <div className="space-y-8">
                            {[
                                { label: 'Risk Index', key: 'risk_index', color: 'bg-cyber-blue' },
                                { label: 'Ethical Drift', key: 'ethical_drift', color: 'bg-red-500' },
                                { label: 'Adaptability', key: 'adaptability_score', color: 'bg-green-500' },
                                { label: 'Loss Aversion', key: 'loss_aversion', color: 'bg-amber-500' },
                            ].map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-[10px] uppercase font-orbitron mb-2">
                                        <span className="text-gray-500 tracking-wider">{item.label}</span>
                                        <span className="text-white">{(metrics?.[item.key] || 0).toFixed(1)}%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${metrics?.[item.key] || 0}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-6 border-white/5 bg-cyber-blue/5">
                        <div className="text-[8px] font-black italic font-orbitron text-cyber-blue/60 mb-2">AI RECOMMENDATION</div>
                        <p className="text-[10px] text-white/70 leading-relaxed font-inter">
                            System status: {sessionEnded ? 'TERMINATED' : (session?.status || 'AWAITING')}. {sessionEnded ? 'Data synchronized. Calibration final.' : 'Neural patterns consistent with baseline.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Simulation;
