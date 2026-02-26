import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const Analytics = ({ sessionId }) => {
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
                // If no sessionId passed, find the last session for this user
                const sessionsRes = await api.get('game/sessions/');
                const lastSession = sessionsRes.data.length > 0 ? sessionsRes.data[sessionsRes.data.length - 1] : null;
                if (lastSession) targetSessionId = lastSession.id;
            }

            if (targetSessionId) {
                const reportRes = await api.get(`analytics/report/${targetSessionId}/`);
                setReport(reportRes.data);
            }
        } catch (err) {
            console.error("Failed to fetch analytics", err);
        }
        setLoading(false);
    };

    if (loading) return <div className="p-20 text-center font-orbitron animate-pulse">DECRYPTING_NEURAL_LOGS...</div>;

    return (
        <div className="p-8 space-y-6">
            {/* Header Info */}
            <div className="flex flex-wrap items-center gap-6 glass-panel p-4 border-white/5 bg-cyber-bg/40">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center">
                        <svg className="w-5 h-5 text-cyber-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-[10px] text-cyber-cyan/60 uppercase tracking-widest font-heading">Cognitive Survival</div>
                        <div className="text-sm font-bold font-orbitron">SIM_ANALYTICS_V4.0</div>
                    </div>
                </div>
                <div className="h-10 w-[1px] bg-white/10 mx-2 hidden sm:block"></div>
                <div className="space-y-1">
                    <div className="text-[8px] text-gray-500 uppercase tracking-widest">Subject ID</div>
                    <div className="text-[10px] font-orbitron">{user?.username || 'ANONYMOUS'}</div>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/20">
                        <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse"></span>
                        <span className="text-[8px] font-orbitron uppercase tracking-widest text-cyber-cyan">Live Sync</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Analysis */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 border-cyber-cyan/10 col-span-2">
                        <div className="text-[10px] text-cyber-cyan uppercase tracking-widest mb-6 font-orbitron">Psychological Profile Summary</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                {[
                                    { label: 'Risk Propensity', val: report?.analysis?.metrics?.risk_index },
                                    { label: 'Ethical Consistency', val: 100 - (report?.analysis?.metrics?.ethical_drift || 0) },
                                    { label: 'Resource Stewardship', val: report?.analysis?.metrics?.resource_stewardship },
                                    { label: 'Loss Aversion', val: report?.analysis?.metrics?.loss_aversion },
                                ].map((m, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-[10px] uppercase font-orbitron mb-2">
                                            <span className="text-gray-500">{m.label}</span>
                                            <span className="text-cyber-cyan">{m.val?.toFixed(1) || 0}%</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-cyber-cyan transition-all duration-1000" style={{ width: `${m.val || 0}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-cyber-cyan/5 rounded-lg border border-cyber-cyan/10">
                                <div className="text-[8px] text-cyber-cyan uppercase font-black mb-4 tracking-widest">Neural Assessment</div>
                                <p className="text-xs text-white/70 leading-relaxed font-inter italic">
                                    "{report?.analysis?.summary || 'No analysis available for current sync cycle.'}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 border-white/5 space-y-6">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-heading mb-4">Global Constants</div>
                    <div className="space-y-4">
                        <div className="p-3 border border-white/5 bg-white/5 rounded">
                            <div className="text-[8px] text-gray-500 mb-1">STABILITY_COEFFICIENT</div>
                            <div className="text-xs font-mono text-cyber-blue">0.882</div>
                        </div>
                        <div className="p-3 border border-white/5 bg-white/5 rounded">
                            <div className="text-[8px] text-gray-500 mb-1">DRIFT_THRESHOLD</div>
                            <div className="text-xs font-mono text-red-500">15.0%</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div className="glass-panel p-6 border-white/5">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-heading mb-6">AI Behavioral Recommendations</div>
                <div className="flex flex-wrap gap-4">
                    {report?.recommendations?.map((rec, i) => (
                        <div key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded text-[10px] text-white/80 font-inter">
                            • {rec}
                        </div>
                    )) || <div className="text-[10px] text-gray-600 italic">No recommendations generated. Proceed with standard protocol.</div>}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
