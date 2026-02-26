import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
        <div className="max-w-md mx-auto p-8 glass-panel border-cyber-blue/30 mt-20">
            <h2 className="text-2xl font-black font-orbitron mb-8 text-center uppercase tracking-widest">
                {isRegister ? 'Neural Registration' : 'Access Terminal'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-[8px] uppercase tracking-widest text-gray-500 mb-2 font-orbitron">Identifier</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-cyber-blue outline-none transition-all"
                        placeholder="Neural_ID"
                        required
                    />
                </div>
                {isRegister && (
                    <div>
                        <label className="block text-[8px] uppercase tracking-widest text-gray-500 mb-2 font-orbitron">Linked Sync</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-cyber-blue outline-none transition-all"
                            placeholder="neural@sync.io"
                            required
                        />
                    </div>
                )}
                <div>
                    <label className="block text-[8px] uppercase tracking-widest text-gray-500 mb-2 font-orbitron">Sequence Key</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-cyber-blue outline-none transition-all"
                        placeholder="••••••••"
                        required
                    />
                </div>
                {error && <div className="text-red-500 text-[10px] font-mono text-center">{error}</div>}
                <button type="submit" className="w-full glow-button py-4 rounded-lg font-orbitron font-bold uppercase tracking-widest text-xs">
                    {isRegister ? 'Initialize Connection' : 'Establish Link'}
                </button>
            </form>
            <p className="mt-6 text-center text-[10px] text-gray-500 uppercase tracking-widest cursor-pointer hover:text-cyber-blue transition-all"
                onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Already Synchronized? Access' : 'New Subject? Register'}
            </p>
        </div>
    );
};

export default Login;
