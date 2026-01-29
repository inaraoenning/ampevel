'use client';

import Image from 'next/image';
import { useState } from 'react';

interface Car {
    id: number;
    image: string;
    title: string;
    year: number;
    price?: string;
}

const cars: Car[] = [
    {
        id: 1,
        image: '/car-sedan.png',
        title: 'Audi A4 Sedan Premium',
        year: 2023,
        price: 'R$ 285.000'
    },
    {
        id: 2,
        image: '/car-suv.png',
        title: 'Porsche Cayenne SUV',
        year: 2024,
        price: 'R$ 645.000'
    },
    {
        id: 3,
        image: '/car-sports.png',
        title: 'Toyota GR86 Sport',
        year: 2023,
        price: 'R$ 345.000'
    }
];

export default function CarCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === cars.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? cars.length - 1 : prevIndex - 1
        );
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Veículos <span className="text-[#0099CC]">Disponíveis</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore nossa seleção premium de veículos novos e seminovos
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Main Carousel */}
                    <div className="relative overflow-hidden rounded-2xl bg-gray-50 shadow-2xl">
                        {/* Slides */}
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {cars.map((car) => (
                                <div key={car.id} className="min-w-full">
                                    <div className="relative aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200">
                                        <Image
                                            src={car.image}
                                            alt={car.title}
                                            fill
                                            className="object-cover"
                                            priority={car.id === 1}
                                        />
                                    </div>

                                    {/* Car Info */}
                                    <div className="p-8 bg-white">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                    {car.title}
                                                </h3>
                                                <div className="flex items-center gap-3">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#003366]/10 text-[#003366]">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {car.year}
                                                    </span>
                                                    {car.price && (
                                                        <span className="text-2xl font-bold text-[#0099CC]">
                                                            {car.price}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button className="px-6 py-3 bg-[#003366] hover:bg-[#002244] text-white rounded-lg font-semibold transform transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-900/30">
                                                Ver Detalhes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                            aria-label="Anterior"
                        >
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                            aria-label="Próximo"
                        >
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-6">
                        {cars.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`h-2 rounded-full transition-all ${index === currentIndex
                                    ? 'w-8 bg-[#0099CC]'
                                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Ir para slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
