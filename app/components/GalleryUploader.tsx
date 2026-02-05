'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CarImage } from '@/lib/supabase/types';

interface GalleryUploaderProps {
    images: CarImage[];
    onAdd: (file: File) => Promise<string>;
    onRemove: (index: number) => void;
    onReorder?: (fromIndex: number, toIndex: number) => void;
    loading?: boolean;
    error?: string | null;
}

export default function GalleryUploader({
    images,
    onAdd,
    onRemove,
    onReorder,
    loading = false,
    error = null,
}: GalleryUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await handleFileSelect(files[0]);
        }
    };

    const handleFileSelect = async (file: File) => {
        setUploadError(null);
        try {
            if (!file.type.startsWith('image/')) {
                throw new Error('Selecione uma imagem válida');
            }
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('Imagem muito grande (máx 5MB)');
            }
            await onAdd(file);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao upload';
            setUploadError(message);
        }
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOverItem = (e: React.DragEvent, toIndex: number) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== toIndex && onReorder) {
            onReorder(draggedIndex, toIndex);
            setDraggedIndex(toIndex);
        }
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    return (
        <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-gray-200">
            <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                    Fotos Adicionais
                </h3>
                <p className="text-sm text-gray-600">
                    Adicione quantas fotos desejar para melhor apresentação
                </p>
            </div>

            {/* Upload Area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('gallery-input')?.click()}
                className={`w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all flex items-center justify-center ${
                    isDragging
                        ? 'border-[#0099CC] bg-blue-50'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <input
                    id="gallery-input"
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={loading}
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                            handleFileSelect(e.target.files[0]);
                        }
                    }}
                    className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                    <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    <p className="text-sm font-medium text-gray-700">
                        Clique ou arraste para adicionar
                    </p>
                </div>
            </div>

            {/* Error Message */}
            {(uploadError || error) && (
                <p className="text-sm text-red-600">{uploadError || error}</p>
            )}

            {/* Gallery Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOverItem(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`relative h-24 rounded-lg overflow-hidden group cursor-move transition-opacity ${
                                draggedIndex === index ? 'opacity-50' : ''
                            }`}
                        >
                            <Image
                                src={image.url}
                                alt={`Extra ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                <button
                                    onClick={() => onRemove(index)}
                                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {images.length === 0 && !uploadError && (
                <p className="text-center text-gray-500 text-sm py-4">
                    Nenhuma foto adicional adicionada ainda
                </p>
            )}
        </div>
    );
}
