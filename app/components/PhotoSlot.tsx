'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { PhotoSlot as PhotoSlotType } from '@/lib/supabase/types';

interface PhotoSlotProps {
    slot: PhotoSlotType;
    label: string;
    description: string;
    icon: React.ReactNode;
    value?: string | null;
    onUpload: (file: File) => Promise<void>;
    onRemove?: () => void;
    required?: boolean;
    loading?: boolean;
    error?: string | null;
}

const slotImages: Record<PhotoSlotType, string> = {
    front: '🚗',
    rear: '🔙',
    left: '⬅️',
    right: '➡️',
    engine: '⚙️',
    interior_driver: '👨‍🦱',
    interior_passenger: '👥',
    trunk: '🎒',
};

export default function PhotoSlot({
    slot,
    label,
    description,
    icon,
    value,
    onUpload,
    onRemove,
    required = false,
    loading = false,
    error = null,
}: PhotoSlotProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

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
            // Validações básicas
            if (!file.type.startsWith('image/')) {
                throw new Error('Selecione uma imagem válida');
            }
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('Imagem muito grande (máx 5MB)');
            }
            await onUpload(file);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao upload';
            setUploadError(message);
        }
    };

    return (
        <div className="flex flex-col gap-2 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-[#0099CC] transition-colors">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{slotImages[slot]}</span>
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {label}
                            {required && <span className="text-red-500 ml-1">*</span>}
                        </h3>
                        <p className="text-sm text-gray-600">{description}</p>
                    </div>
                </div>
                {value && !loading && (
                    <button
                        onClick={onRemove}
                        className="px-2 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded"
                    >
                        Remover
                    </button>
                )}
            </div>

            {/* Upload Area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all ${isDragging
                        ? 'border-[#0099CC] bg-blue-50'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    disabled={loading}
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                            handleFileSelect(e.target.files[0]);
                        }
                    }}
                    className="hidden"
                />

                {value ? (
                    // Preview
                    <div className="relative w-full h-full">
                        <Image
                            src={value}
                            alt={label}
                            fill
                            className="object-cover rounded-md"
                        />
                        {loading && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-md">
                                <div className="animate-spin">
                                    <svg
                                        className="w-8 h-8 text-white"
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
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Placeholder
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {loading ? (
                            <div className="animate-spin">
                                <svg
                                    className="w-8 h-8 text-[#0099CC]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        ) : (
                            <>
                                <svg
                                    className="w-10 h-10 text-gray-400 mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <p className="text-sm font-medium text-gray-700 text-center">
                                    Arraste ou clique para upload
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {(uploadError || error) && (
                <p className="text-sm text-red-600">{uploadError || error}</p>
            )}
        </div>
    );
}
