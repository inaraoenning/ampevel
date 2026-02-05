'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Car {
    id: string;
    title: string;
    year: number;
    price: number;
    km: number;
    transmission: string;
    fuel: string;
    images: string[];
    description?: string | null;
}

interface CarGridProps {
    cars: Car[];
}

export default function CarGrid({ cars }: CarGridProps) {

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Todos os <span className="text-[#003366]">Veículos</span> ({cars.length})
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Confira nossa coleção completa de veículos premium
                    </p>
                </div>

                {/* Cars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cars.map((car) => (
                        <div
                            key={car.id}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {/* Car Image */}
                            <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                {Array.isArray(car.images) && car.images.length > 0 ? (
                                    <Image
                                        src={car.images[0]}
                                        alt={car.title}
                                        fill
                                        className="object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        Imagem indisponível
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 bg-[#0099CC] text-white text-sm font-semibold rounded-full">
                                        {car.year}
                                    </span>
                                </div>
                            </div>

                            {/* Car Details */}
                            <div className="p-6">
                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-[#0099CC] transition-colors">
                                    {car.title}
                                </h3>

                                {/* Price */}
                                <div className="mb-4">
                                    <span className="text-3xl font-bold text-[#0099CC]">
                                        R$ {car.price.toLocaleString('pt-BR')}
                                    </span>
                                </div>

                                {/* Specifications */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <svg className="w-5 h-5 text-[#003366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <span className="font-medium">{car.km.toLocaleString('pt-BR')} km</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <svg className="w-5 h-5 text-[#003366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="font-medium">{car.transmission}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <svg className="w-5 h-5 text-[#003366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                                        </svg>
                                        <span className="font-medium">{car.fuel}</span>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <Link
                                    href={`/veiculos/${car.id}`}
                                    className="block w-full px-6 py-3 bg-gradient-to-r from-[#003366] to-[#0099CC] hover:from-[#002244] hover:to-[#007799] text-white text-center rounded-lg font-semibold transform transition-all hover:scale-105 hover:shadow-lg"
                                >
                                    Ver Detalhes
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        href="/veiculos"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-[#003366] text-[#003366] rounded-lg font-semibold hover:bg-[#003366] hover:text-white transition-all transform hover:scale-105"
                    >
                        Ver Todos os Veículos
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
