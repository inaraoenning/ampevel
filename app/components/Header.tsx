'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center group">
                            <Image
                                src="/logo.png"
                                alt="Ampevel Veículos Logo"
                                width={180}
                                height={60}
                                className="h-12 w-auto transform transition-transform group-hover:scale-105"
                                priority
                            />
                        </Link>
                    </div>


                    {/* CTA Button */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/admin/login"
                            className="px-6 py-2.5 bg-gradient-to-r from-[#003366] to-[#0099CC] hover:from-[#002244] hover:to-[#007799] text-white rounded-full font-medium transform transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
                        >
                            Login Administrativo
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top">
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/"
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/about"
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sobre
                            </Link>
                            <Link
                                href="/services"
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Serviços
                            </Link>
                            <Link
                                href="/contact"
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contato
                            </Link>
                            <Link
                                href="/admin/login"
                                className="mt-2 mx-4 px-4 py-2.5 bg-gradient-to-r from-[#003366] to-[#0099CC] text-white rounded-full font-medium text-center"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Entrar
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
