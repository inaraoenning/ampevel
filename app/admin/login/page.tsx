import { signIn } from '@/lib/actions/auth'

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo e Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Ampevel Admin
                    </h1>
                    <p className="text-gray-600">Faça login para gerenciar os carros</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form action={signIn} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="seu@email.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-gradient-to-r from-[#003366] to-[#0099CC] hover:from-[#002244] hover:to-[#007799] text-white rounded-lg font-semibold transform transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
                        >
                            Entrar
                        </button>
                    </form>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <a
                        href="/"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        ← Voltar para o site
                    </a>
                </div>
            </div>
        </div>
    )
}
