import React, { useState, useEffect } from 'react';
import { User } from '../types.ts';
import { Logo } from './Logo.tsx';

interface LoginProps {
    onAuthSuccess: (user: User) => void;
    onRegister: (newUser: Omit<User, 'id'>) => User | null;
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
        const rememberedUserId = localStorage.getItem('rememberedUserId');
        if (rememberedUserId) {
            const rememberedEmail = localStorage.getItem(`rememberedEmail_${rememberedUserId}`);
            const rememberedPassword = localStorage.getItem(`rememberedPassword_${rememberedUserId}`);
            if (rememberedEmail && rememberedPassword) {
                setEmail(rememberedEmail);
                setPassword(rememberedPassword);
                setRememberMe(true);
            }
        }
    }, []);

    const handleSuccessfulLogin = (user: User, pass: string, remember: boolean) => {
        if (remember) {
            localStorage.setItem('rememberedUserId', user.id);
            localStorage.setItem(`rememberedEmail_${user.id}`, user.email);
            localStorage.setItem(`rememberedPassword_${user.id}`, pass);
        } else {
            localStorage.removeItem('rememberedUserId');
            localStorage.removeItem(`rememberedEmail_${user.id}`);
            localStorage.removeItem(`rememberedPassword_${user.id}`);
        }
        onAuthSuccess(user);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isRegistering) {
            if (!name || !email || !password) {
                setError('Todos os campos são obrigatórios.');
                return;
            }
            const newUser = onRegister({ name, email, password });
            if (newUser) {
                handleSuccessfulLogin(newUser, password, rememberMe);
            } else {
                setError('Este e-mail já está em uso.');
            }
        } else {
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                handleSuccessfulLogin(user, password, rememberMe);
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
                            placeholder="mairfim@email.com"
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="password">
                            Senha
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="p-2 w-full rounded bg-background border border-border pr-10"
                                placeholder="********"
                                required
                                autoComplete={isRegistering ? 'new-password' : 'current-password'}
                            />
                        </div>
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