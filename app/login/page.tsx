'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
    const router = useRouter();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulação de autenticação (substitua por autenticação real)
        setTimeout(() => {
            if (credentials.email === 'admin@ampevel.com' && credentials.password === 'admin123') {
                // Salvar token/sessão (exemplo simples com localStorage)
                localStorage.setItem('adminAuthenticated', 'true');
                router.push('/admin');
            } else {
                setError('Email ou senha incorretos');
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-block">
                        <Image
                            src="/logo.png"
                            alt="Ampevel Veículos"
                            width={200}
                            height={80}
                            className="h-16 w-auto mb-4"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Login Administrativo
                    </h1>
                    <p className="text-gray-600">
                        Acesse o painel de controle
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="admin@ampevel.com"
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Senha
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3 bg-gradient-to-r from-[#003366] to-[#0099CC] hover:from-[#002244] hover:to-[#007799] text-white rounded-lg font-semibold transform transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-2">Credenciais de demonstração:</p>
                        <p className="text-sm text-blue-700">Email: admin@ampevel.com</p>
                        <p className="text-sm text-blue-700">Senha: admin123</p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => router.push('/')}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        ← Voltar para o site
                    </button>
                </div>
            </div>
        </div>
    );
}
