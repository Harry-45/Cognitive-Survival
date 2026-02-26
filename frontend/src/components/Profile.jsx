import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Profile = ({ onSelectSession }) => {
    const { user, logout, updateUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ simulations: 0, survivalRate: 0, peakStability: 0 });
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(user?.username || '');
    const [nameError, setNameError] = useState('');

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const [sessionsRes, profileRes] = await Promise.all([
                api.get('game/sessions/'),
                api.get('auth/profile/')
            ]);

            setSessions(sessionsRes.data);
            setProfile(profileRes.data);

            const completed = sessionsRes.data.filter(s => s.status === 'COMPLETED').length;
            const success = sessionsRes.data.filter(s => s.status === 'COMPLETED' && s.resources.water > 0).length;

            setStats({
                simulations: sessionsRes.data.length,
                survivalRate: completed > 0 ? (success / completed * 100).toFixed(1) : 0,
                peakStability: profileRes.data.peak_stability || 98
            });
        } catch (err) {
            console.error("Profile fetch failed", err);
        }
        setLoading(false);
    };

    const resizeImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 400;
                    const MAX_HEIGHT = 400;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/jpeg', 0.8);
                };
            };
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const resizedBlob = await resizeImage(file);
            const formData = new FormData();
            formData.append('profile_picture', resizedBlob, 'profile.jpg');

            const res = await api.patch('auth/profile/upload/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfile(res.data);
        } catch (err) {
            console.error("Upload failed", err);
        }
        setUploading(false);
    };

    const handleUsernameUpdate = async () => {
        if (!/^[a-zA-Z]+$/.test(newName)) {
            setNameError("ALPHABETIC_CHARACTERS_ONLY");
            return;
        }

        try {
            const res = await api.patch('auth/profile/', { username: newName });
            setProfile(res.data);
            updateUser({ username: newName });
            setIsEditingName(false);
            setNameError('');
        } catch (err) {
            console.error("Username update failed", err);
            setNameError(err.response?.data?.username || "UPDATE_FAILED");
        }
    };

    if (loading) return <div className="p-20 text-center font-orbitron animate-pulse">SYNCHRONIZING_SUBJECT_DATA...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            {/* Profile Header */}
            <div className="glass-panel p-10 flex flex-col md:flex-row items-center gap-10 border-white/5 bg-cyber-bg/40">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                    <div className="relative w-40 h-40 rounded-xl overflow-hidden border-2 border-cyber-blue/50 bg-cyber-bg/80">
                        {uploading ? (
                            <div className="w-full h-full flex items-center justify-center font-orbitron text-[10px] animate-pulse text-cyber-blue">
                                OPTIMIZING...
                            </div>
                        ) : (
                            <>
                                <img
                                    src={profile?.profile_picture ? (profile.profile_picture.startsWith('http') ? profile.profile_picture : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}${profile.profile_picture}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                                    <svg className="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-[8px] font-orbitron font-bold text-white tracking-widest">UPLOAD_AVATAR</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </>
                        )}
                        <div className="absolute bottom-0 right-0 p-1.5 bg-cyber-blue text-[8px] font-bold font-orbitron rounded-tl-lg">LVL 12</div>
                    </div>
                </div>

                <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            {isEditingName ? (
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value.replace(/[^a-zA-Z]/g, ''))}
                                            className="bg-cyber-bg/60 border border-cyber-blue/30 text-white font-orbitron text-xl px-4 py-2 rounded focus:outline-none focus:border-cyber-blue"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleUsernameUpdate}
                                            className="p-2 bg-cyber-blue text-white rounded hover:bg-cyber-blue/80 transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => { setIsEditingName(false); setNewName(user?.username); setNameError(''); }}
                                            className="p-2 border border-white/10 text-gray-400 rounded hover:bg-white/5 transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    {nameError && <div className="text-red-500 text-[8px] font-orbitron uppercase tracking-widest">{nameError}</div>}
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <h2 className="text-4xl font-black font-orbitron tracking-tight uppercase">{user?.username}</h2>
                                    <button
                                        onClick={() => setIsEditingName(true)}
                                        className="p-1 text-gray-500 hover:text-cyber-blue transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                            <div className="flex gap-4 text-[10px] font-orbitron font-bold tracking-[0.2em] mt-2">
                                <span className="text-cyber-blue">NEURAL SUBJECT</span>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-500">ID-{user?.user_id || '0000'}</span>
                            </div>
                        </div>
                        <button onClick={logout} className="px-4 py-2 border border-red-500/30 text-red-500 text-[8px] font-orbitron hover:bg-red-500/10 transition-all">SIGNOFF</button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6 border-t border-white/5">
                        <div>
                            <div className="text-[8px] text-gray-500 uppercase tracking-widest mb-1">Simulations</div>
                            <div className="text-3xl font-orbitron font-bold">{stats.simulations}</div>
                        </div>
                        <div>
                            <div className="text-[8px] text-gray-500 uppercase tracking-widest mb-1">Survival Rate</div>
                            <div className="text-3xl font-orbitron font-bold text-cyber-blue">{stats.survivalRate}%</div>
                        </div>
                        <div>
                            <div className="text-[8px] text-gray-500 uppercase tracking-widest mb-1">Peak Stability</div>
                            <div className="text-3xl font-orbitron font-bold">{stats.peakStability}%</div>
                        </div>
                        <div>
                            <div className="text-[8px] text-gray-500 uppercase tracking-widest mb-1">Global Rank</div>
                            <div className="text-3xl font-orbitron font-bold text-cyber-blue">#---</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Telemetry Listing */}
            <div className="space-y-6">
                <h3 className="text-2xl font-bold font-orbitron">Neural Activity Log</h3>
                <div className="space-y-4">
                    {sessions.map((s) => (
                        <div key={s.id} className="glass-panel p-6 border-white/5 flex flex-wrap items-center gap-12 group hover:border-cyber-blue/20 transition-all">
                            <div className="space-y-1 border-l-2 border-cyber-blue/30 pl-4">
                                <div className="text-[8px] text-cyber-blue font-bold font-mono uppercase tracking-widest">{new Date(s.start_time).toLocaleDateString()}</div>
                                <div className="text-lg font-bold font-orbitron">SIG-{s.id}</div>
                            </div>

                            <div className="flex-1">
                                <div className="text-[8px] text-gray-500 uppercase tracking-widest font-heading mb-2">Outcome</div>
                                <div className={`text-xs font-orbitron ${s.status === 'COMPLETED' ? 'text-green-500' : 'text-amber-500'}`}>
                                    {s.status}
                                </div>
                            </div>

                            <div className="flex gap-12">
                                <div className="text-center">
                                    <div className="text-[8px] text-gray-500 uppercase tracking-widest mb-1">Difficulty</div>
                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                                        <span className="text-xs font-bold font-orbitron">{s.current_difficulty}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="ml-auto">
                                <button
                                    onClick={() => onSelectSession(s.id)}
                                    className="px-6 py-2 rounded-lg border border-white/10 text-[8px] font-orbitron font-bold tracking-widest hover:bg-white/5 transition-all"
                                >
                                    VIEW_TELEMETRY
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;
