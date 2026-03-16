import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Login = ({ onSuccess }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isRegister) {
                await register(username, password, email);
            } else {
                await login(username, password);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.detail || 'Authentication failed');
        }
    };

    return (
        <div className="relative min-h-[80vh] flex items-center justify-center px-4 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyber-blue/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md p-8 glass-panel border-cyber-blue/30 backdrop-blur-xl bg-black/40 shadow-2xl shadow-cyber-blue/5"
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-2xl font-black font-orbitron mb-2 text-center uppercase tracking-[0.3em] bg-clip-text text-transparent bg-gradient-to-r from-white via-cyber-blue to-white">
                        {isRegister ? 'Neural Registration' : 'Access Terminal'}
                    </h2>
                    <p className="text-[8px] font-orbitron text-center text-cyber-blue/60 uppercase tracking-widest mb-10">
                        {isRegister ? 'SIGNAL_ORIGIN: NEW_SUBJECT' : 'SIGNAL_ID: SECURE_LINK_REQUIRED'}
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="block text-[8px] uppercase tracking-[0.2em] text-white/40 mb-2 font-orbitron ml-1">Identifier</label>
                        <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded font-mono p-3 text-sm focus:border-cyber-blue/50 outline-none transition-all placeholder:text-white/10"
                            placeholder="Neural_ID"
                            required
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        {isRegister && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-1 overflow-hidden"
                            >
                                <label className="block text-[8px] uppercase tracking-[0.2em] text-white/40 mb-2 font-orbitron ml-1">Linked Sync</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded font-mono p-3 text-sm focus:border-cyber-blue/50 outline-none transition-all placeholder:text-white/10"
                                    placeholder="neural@sync.io"
                                    required
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-1">
                        <label className="block text-[8px] uppercase tracking-[0.2em] text-white/40 mb-2 font-orbitron ml-1">Sequence Key</label>
                        <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded font-mono p-3 text-sm focus:border-cyber-blue/50 outline-none transition-all placeholder:text-white/10"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-red-400 text-[10px] font-mono text-center bg-red-500/10 py-2 rounded border border-red-500/20"
                        >
                            ERR: {error}
                        </motion.div>
                    )}

                    <motion.button 
                        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 243, 255, 0.2)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        className="w-full glow-button py-4 rounded font-orbitron font-bold uppercase tracking-[0.3em] text-[10px] bg-cyber-blue text-black border-none"
                    >
                        {isRegister ? 'Initialize Connection' : 'Establish Link'}
                    </motion.button>
                </form>

                <motion.p 
                    layout
                    className="mt-8 text-center text-[9px] text-white/30 uppercase tracking-[0.2em] cursor-pointer hover:text-cyber-blue transition-all"
                    onClick={() => setIsRegister(!isRegister)}
                >
                    {isRegister ? 'Already Synchronized? [ ACCESS ]' : 'New Subject? [ REGISTER ]'}
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Login;
