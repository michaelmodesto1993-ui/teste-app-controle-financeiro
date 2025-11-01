import React, { useState, useEffect } from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { User } from '../types.ts';
import { Logo } from './Logo.tsx';

interface LoginProps {
    onAuthSuccess: (user: User, remember: boolean) => void;
    onRegister: (newUser: Omit<User, 'id' | 'password'> & { passwordPlain: string }) => User | null;
    users: User[];
}

const Login: React.FC<LoginProps> = ({ onAuthSuccess, onRegister, users }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Pre-fill credentials if they were remembered from a previous session
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        const rememberedPassword = localStorage.getItem('rememberedPassword');

        if (rememberedEmail && rememberedPassword) {
            setEmail(rememberedEmail);
            setPassword(rememberedPassword);
            setRememberMe(true);
        }
    }, []); // Empty dependency array ensures this runs only once on mount


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isRegistering) {
            if (!name || !email || !password) {
                setError('Todos os campos são obrigatórios.');
                return;
            }
            const newUser = onRegister({ name, email, passwordPlain: password });
            if (newUser) {
                // After registration, always log in and remember the session
                // for a seamless user experience.
                onAuthSuccess(newUser, true);
            } else {
                setError('Este e-mail já está em uso.');
            }
        } else {
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                onAuthSuccess(user, rememberMe);
            } else {
                setError('E-mail ou senha inválidos.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="p-8 bg-surface rounded-lg shadow-lg w-full max-w-sm">
                <div className="flex flex-col items-center justify-center mb-4">
                    <Logo />
                    <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-expense to-income bg-clip-text text-transparent mt-2">
                        MAIRFIM
                    </h1>
                </div>
                <h2 className="text-center text-text-secondary mb-6">{isRegistering ? 'Crie a sua conta' : 'Acesse a sua conta'}</h2>
                <form onSubmit={handleSubmit}>
                    {isRegistering && (
                        <div className="mb-4">
                            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="name">
                                Nome
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="p-2 w-full rounded bg-background border border-border"
                                placeholder="Seu Nome"
                                autoComplete="name"
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-2 w-full rounded bg-background border border-border"
                            placeholder="user@example.com"
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="password">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-2 w-full rounded bg-background border border-border"
                            placeholder="********"
                            required
                            autoComplete={isRegistering ? 'new-password' : 'current-password'}
                        />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center text-sm text-text-secondary cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary focus:ring-offset-0"
                            />
                            <span className="ml-2">Lembrar-me</span>
                        </label>
                    </div>

                    {error && <p className="text-expense text-center text-sm mb-4">{error}</p>}

                    <button type="submit" className="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary-dark transition-colors">
                        {isRegistering ? 'Registrar' : 'Entrar'}
                    </button>
                </form>

                <p className="text-center text-sm text-text-secondary mt-6">
                    {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}
                    <button onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="font-bold text-primary hover:underline ml-1">
                        {isRegistering ? 'Entrar' : 'Registre-se'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;