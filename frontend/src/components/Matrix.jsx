import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const Matrix = ({ sessionId }) => {
    const { user } = useAuth();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReport();
    }, [sessionId]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            let targetSessionId = sessionId;

            if (!targetSessionId) {
                const sessionsRes = await api.get('game/sessions/');
                const lastSession = sessionsRes.data.length > 0 ? sessionsRes.data[sessionsRes.data.length - 1] : null;
                if (lastSession) targetSessionId = lastSession.id;
            }

            if (targetSessionId) {
                const reportRes = await api.get(`analytics/report/${targetSessionId}/`);
                setReport(reportRes.data);
            }
        } catch (err) {
            console.error("Failed to fetch matrix data", err);
        }
        setLoading(false);
    };

    const getRadarPoints = (data) => {
        if (!data) return "50,50 50,50 50,50 50,50 50,50 50,50";

        // Data order: Logic, Pragmatism, Aggression, Impulsivity, Intuition, Empathy
        const angles = [0, 60, 120, 180, 240, 300];
        const points = data.map((val, i) => {
            const r = (val / 100) * 50;
            const rad = (angles[i] - 90) * (Math.PI / 180);
            const x = 50 + r * Math.cos(rad);
            const y = 50 + r * Math.sin(rad);
            return `${x.toFixed(2)},${y.toFixed(2)}`;
        });
        return points.join(' ');
    };

    if (loading) return <div className="p-20 text-center font-orbitron animate-pulse">SYNCING_NEURAL_MATRIX...</div>;

    const traitColors = ['bg-cyber-blue', 'bg-cyber-purple', 'bg-green-500'];
    const traits = report?.analysis?.traits?.map((t, i) => ({
        name: t,
        val: report.analysis.radar_data[i % 6] || 50,
        color: traitColors[i % 3]
    })) || [];

    const radarPoints = getRadarPoints(report?.analysis?.radar_data);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-8">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-cyber-purple/10 border border-cyber-purple/30 flex items-center justify-center">
                        <svg className="w-6 h-6 text-cyber-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-[10px] text-cyber-purple/60 uppercase tracking-[0.3em] font-heading">Neural Sync Analysis</div>
                        <div className="text-xl font-bold font-orbitron tracking-wider">NEURAL VARIANCE MATRIX</div>
                    </div>
                </div>
                <div className="flex items-center gap-8 text-[8px] font-mono tracking-widest text-gray-500">
                    <div>SUBJECT ID: {user?.username?.toUpperCase() || 'PX-8821'}</div>
                    <div>SESSION: {report?.session_id ? `NEURAL-SYNC-${report.session_id}` : 'PENDING'}</div>
                </div>
                <button className="px-6 py-2 rounded border border-white/10 text-white/50 text-[10px] font-orbitron uppercase tracking-widest hover:text-white hover:border-white/20 transition-all">
                    Export Dossier
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Radar Chart Section */}
                <div className="lg:col-span-2 glass-panel p-12 border-cyber-purple/10 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px]">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-cyber-purple) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                    <div className="relative w-80 h-80">
                        {/* Radar Background Grids */}
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            {[0.2, 0.4, 0.6, 0.8, 1].map((r, i) => (
                                <polygon
                                    key={i}
                                    points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25"
                                    transform={`translate(${50 - 50 * r},${50 - 50 * r}) scale(${r})`}
                                    className="fill-none stroke-white/10"
                                    strokeWidth="0.5"
                                />
                            ))}
                            {/* Radial Lines */}
                            <line x1="50" y1="50" x2="50" y2="0" className="stroke-white/10" strokeWidth="0.5" />
                            <line x1="50" y1="50" x2="93.3" y2="25" className="stroke-white/10" strokeWidth="0.5" />
                            <line x1="50" y1="50" x2="93.3" y2="75" className="stroke-white/10" strokeWidth="0.5" />
                            <line x1="50" y1="50" x2="50" y2="100" className="stroke-white/10" strokeWidth="0.5" />
                            <line x1="50" y1="50" x2="6.7" y2="75" className="stroke-white/10" strokeWidth="0.5" />
                            <line x1="50" y1="50" x2="6.7" y2="25" className="stroke-white/10" strokeWidth="0.5" />

                            {/* The Variance Polygon */}
                            <polygon
                                points={radarPoints}
                                className="fill-cyber-purple/20 stroke-cyber-purple transition-all duration-1000"
                                strokeWidth="1"
                            />
                            {radarPoints.split(' ').map((p, i) => {
                                const [x, y] = p.split(',');
                                return <circle key={i} cx={x} cy={y} r="1.5" className="fill-white shadow-[0_0_8px_white]" />;
                            })}
                        </svg>

                        {/* Labels */}
                        <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 text-[8px] font-orbitron tracking-widest">LOGIC</div>
                        <div className="absolute top-[18%] right-[-30px] text-[8px] font-orbitron tracking-widest text-right">PRAGMATISM</div>
                        <div className="absolute bottom-[18%] right-[-30px] text-[8px] font-orbitron tracking-widest text-right">AGGRESSION</div>
                        <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-[8px] font-orbitron tracking-widest">IMPULSIVITY</div>
                        <div className="absolute bottom-[18%] left-[-30px] text-[8px] font-orbitron tracking-widest">INTUITION</div>
                        <div className="absolute top-[18%] left-[-30px] text-[8px] font-orbitron tracking-widest">EMPATHY</div>
                    </div>

                    <div className="mt-20 flex gap-12 sm:gap-16">
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-orbitron font-bold">{report?.analysis?.metrics?.confidence_stability?.toFixed(0) || 0}%</div>
                            <div className="text-[8px] text-gray-500 uppercase tracking-widest mt-1">Cognitive Stability</div>
                        </div>
                        <div className="text-center border-x border-white/5 px-8 sm:px-16">
                            <div className="text-2xl sm:text-3xl font-orbitron font-bold">14ms</div>
                            <div className="text-[8px] text-gray-500 uppercase tracking-widest mt-1">Response Latency</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-orbitron font-bold text-cyber-purple">
                                {report?.analysis?.metrics?.adaptability_score > 80 ? 'A+' : report?.analysis?.metrics?.adaptability_score > 60 ? 'B+' : 'C'}
                            </div>
                            <div className="text-[8px] text-gray-500 uppercase tracking-widest mt-1 font-heading">Survival Index</div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6 flex flex-col">
                    <div className="glass-panel p-8 border-white/5 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-xl bg-cyber-purple/20 border border-cyber-purple/30 flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-cyber-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                            </svg>
                        </div>
                        <div className="text-[8px] font-orbitron text-cyber-purple/60 uppercase tracking-[0.4em] mb-2">Archetype Classification</div>
                        <h3 className="text-2xl sm:text-3xl font-bold font-orbitron mb-4">{report?.analysis?.classification || 'Processing...'}</h3>
                        <p className="text-gray-400 text-xs leading-relaxed mb-8">
                            {report?.analysis?.summary}
                        </p>

                        <div className="flex gap-2 flex-wrap justify-center mb-8">
                            {report?.analysis?.traits?.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[8px] font-orbitron text-white/50 tracking-widest">{tag}</span>
                            ))}
                        </div>

                        <div className="w-full space-y-6 pt-6 border-t border-white/5 text-left">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-cyber-purple text-xs">🧬</span>
                                <h4 className="text-[8px] font-orbitron uppercase tracking-widest text-white/70">Behavioral Breakdown</h4>
                            </div>
                            {traits.map(t => (
                                <div key={t.name}>
                                    <div className="flex justify-between text-[10px] uppercase font-heading mb-2">
                                        <span className="text-gray-500 tracking-wider">{t.name}</span>
                                        <span className="text-white">{t.val.toFixed(0)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${t.color} transition-all duration-1000`} style={{ width: `${t.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => window.location.href = '/simulation'}
                            className="w-full mt-10 py-4 rounded-lg glow-button font-orbitron text-[10px] font-bold tracking-[0.3em] text-white"
                        >
                            INITIATE RECALIBRATION
                        </button>
                    </div>
                </div>
            </div>

            {/* Event Logs */}
            <div className="glass-panel p-8 border-white/5">
                <div className="flex items-center gap-4 mb-8">
                    <span className="text-cyber-purple">🔄</span>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-heading">Neural Log: SYNC_DATA_{report?.session_id}</div>
                </div>
                <div className="space-y-4 font-mono text-[10px]">
                    {[
                        { time: 'T-ZERO', tag: 'SESSION_START', msg: 'Neural handshake complete. Subject entered simulation.' },
                        { time: 'T-MID', tag: 'METRIC_SYNC', msg: `Primary trait identified: ${report?.analysis?.traits[0] || 'Unknown'}.` },
                        { time: 'T-FINAL', tag: 'SIMULATION_END', msg: `Final archetype confirmed: ${report?.analysis?.classification}.` },
                    ].map((log, i) => (
                        <div key={i} className="flex gap-4 border-l border-white/10 pl-4 py-1 leading-relaxed">
                            <span className="text-cyber-purple shrink-0">[{log.time}]</span>
                            <span className="text-gray-500 shrink-0 font-bold">{log.tag}:</span>
                            <span className="text-white/70">{log.msg}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between text-[8px] text-gray-700 font-mono border-t border-white/5 pt-8 gap-4">
                <div className="flex flex-wrap gap-4 sm:gap-12 uppercase tracking-widest">
                    <span>Proprietary Neural Engine © 2024 Cognitive Survival Project</span>
                    <span>Privacy Protocols</span>
                    <span>Neural Safety Standards</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-pulse"></span>
                    <span>DOSSIER ENCRYPTED & SECURE</span>
                </div>
            </div>
        </div>
    );
};

export default Matrix;
