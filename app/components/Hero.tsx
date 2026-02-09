import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative bg-gray-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-6">
                        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
                            Sua Nova Jornada Começa na{' '}
                            <span className="text-[#003366]">
                                Ampevel Veículos
                            </span>
                        </h1>

                        <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                            Encontre o carro perfeito que combina com seu estilo de vida e suas necessidades.
                            Oferecemos uma seleção premium de veículos novos e seminovos com a qualidade e
                            confiança que você merece.
                        </p>

                        <div className="pt-4">
                            <Link
                                href="/veiculos"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-[#003366] to-[#0099CC] hover:from-[#002244] hover:to-[#007799] text-white rounded-lg font-semibold transform transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                Explorar Veículos
                            </Link>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-transform hover:scale-[1.02]">
                            <Image
                                src="placeholder-image.jpg"
                                alt="Carro esportivo branco de luxo em ambiente urbano"
                                width={800}
                                height={600}
                                className="w-full h-auto object-cover"
                                priority
                            />
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-6 -right-6 w-72 h-72 bg-[#0099CC]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
                        <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-[#0099CC]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
