'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PhotoSlot from '@/app/components/PhotoSlot';
import GalleryUploader from '@/app/components/GalleryUploader';
import { CarImage, PhotoSlot as PhotoSlotType } from '@/lib/supabase/types';
import { uploadCarImage, deleteCarImage } from '@/lib/actions/images';
import { createCar } from '@/lib/actions/cars';

const PHOTO_SLOTS: Array<{
    slot: PhotoSlotType;
    label: string;
    description: string;
}> = [
        { slot: 'front', label: 'Frente', description: 'Vista frontal completa do carro' },
        { slot: 'rear', label: 'Traseira', description: 'Vista traseira completa' },
        { slot: 'left', label: 'Lateral Esquerda', description: 'Lado esquerdo do carro' },
        { slot: 'right', label: 'Lateral Direita', description: 'Lado direito do carro' },
        { slot: 'engine', label: 'Motor', description: 'Compartimento do motor aberto' },
        { slot: 'interior_driver', label: 'Interior (Motorista)', description: 'Visão do banco do motorista' },
        { slot: 'interior_passenger', label: 'Interior (Passageiro)', description: 'Visão do banco de trás' },
        { slot: 'trunk', label: 'Porta-Malas', description: 'Porta-malas aberto' },
    ];

export default function CarPhotosPage() {
    const router = useRouter();
    const [carData, setCarData] = useState({
        title: '',
        price: 0,
        year: new Date().getFullYear(),
        km: 0,
        transmission: 'Manual',
        fuel: 'Gasolina',
        description: '',
    });

    const [images, setImages] = useState<Record<PhotoSlotType, CarImage | null>>({
        front: null,
        rear: null,
        left: null,
        right: null,
        engine: null,
        interior_driver: null,
        interior_passenger: null,
        trunk: null,
    });

    const [galleryImages, setGalleryImages] = useState<CarImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploadingSlot, setUploadingSlot] = useState<PhotoSlotType | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSlotUpload = async (slot: PhotoSlotType, file: File) => {
        try {
            setUploadingSlot(slot);
            setError(null);
            const url = await uploadCarImage(file);
            setImages((prev) => ({
                ...prev,
                [slot]: {
                    url,
                    slot,
                    isPrimary: slot === 'front',
                    uploadedAt: new Date().toISOString(),
                },
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao upload');
        } finally {
            setUploadingSlot(null);
        }
    };

    const handleSlotRemove = async (slot: PhotoSlotType) => {
        try {
            if (images[slot]?.url) {
                await deleteCarImage(images[slot]!.url);
            }
            setImages((prev) => ({
                ...prev,
                [slot]: null,
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao deletar');
        }
    };

    const handleGalleryAdd = async (file: File) => {
        try {
            setError(null);
            const url = await uploadCarImage(file);
            const newImage: CarImage = {
                url,
                slot: null,
                order: galleryImages.length,
                uploadedAt: new Date().toISOString(),
            };
            setGalleryImages((prev) => [...prev, newImage]);
            return url;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao upload');
            throw err;
        }
    };

    const handleGalleryRemove = async (index: number) => {
        try {
            const image = galleryImages[index];
            if (image?.url) {
                await deleteCarImage(image.url);
            }
            setGalleryImages((prev) => prev.filter((_, i) => i !== index));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao deletar');
        }
    };

    const handleGalleryReorder = (fromIndex: number, toIndex: number) => {
        const newImages = [...galleryImages];
        const [movedImage] = newImages.splice(fromIndex, 1);
        newImages.splice(toIndex, 0, movedImage);
        setGalleryImages(newImages);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validar slots obrigatórios
            const missingSlots = PHOTO_SLOTS.filter(
                (slot) => !images[slot.slot]
            ).map((s) => s.label);

            if (missingSlots.length > 0) {
                throw new Error(
                    `Fotos obrigatórias faltando: ${missingSlots.join(', ')}`
                );
            }

            // Montar array de imagens
            const allImages: CarImage[] = [
                ...Object.values(images).filter((img) => img !== null) as CarImage[],
                ...galleryImages,
            ];

            // Criar carro
            const car = await createCar({
                ...carData,
                images: allImages,
            });

            router.push(`/admin/dashboard`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar');
        } finally {
            setLoading(false);
        }
    };

    const missingSlots = PHOTO_SLOTS.filter((s) => !images[s.slot]).length;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Adicionar Novo Carro
                    </h1>
                    <p className="text-gray-600">
                        Preencha os dados do carro e adicione fotos em padrão para melhor apresentação
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Informações Básicas
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={carData.title}
                                    onChange={(e) =>
                                        setCarData((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099CC]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Preço (R$)
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={carData.price}
                                    onChange={(e) =>
                                        setCarData((prev) => ({
                                            ...prev,
                                            price: parseFloat(e.target.value),
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099CC]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ano
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={carData.year}
                                    onChange={(e) =>
                                        setCarData((prev) => ({
                                            ...prev,
                                            year: parseInt(e.target.value),
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099CC]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    KM
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={carData.km}
                                    onChange={(e) =>
                                        setCarData((prev) => ({
                                            ...prev,
                                            km: parseInt(e.target.value),
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099CC]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Transmissão
                                </label>
                                <select
                                    value={carData.transmission}
                                    onChange={(e) =>
                                        setCarData((prev) => ({
                                            ...prev,
                                            transmission: e.target.value,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099CC]"
                                >
                                    <option>Manual</option>
                                    <option>Automática</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Combustível
                                </label>
                                <select
                                    value={carData.fuel}
                                    onChange={(e) =>
                                        setCarData((prev) => ({
                                            ...prev,
                                            fuel: e.target.value,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099CC]"
                                >
                                    <option>Gasolina</option>
                                    <option>Diesel</option>
                                    <option>Álcool</option>
                                    <option>Híbrido</option>
                                    <option>Elétrico</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descrição ou Dados Adicionais
                            </label>
                            <textarea
                                rows={4}
                                value={carData.description}
                                onChange={(e) =>
                                    setCarData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099CC]"
                            />
                        </div>
                    </div>

                    {/* Photo Slots */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Fotos Obrigatórias
                            </h2>
                            <span className="text-sm font-medium bg-blue-50 text-[#0099CC] px-3 py-1 rounded-full">
                                {PHOTO_SLOTS.length - missingSlots} / {PHOTO_SLOTS.length}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {PHOTO_SLOTS.map((slot) => (
                                <PhotoSlot
                                    key={slot.slot}
                                    slot={slot.slot}
                                    label={slot.label}
                                    description={slot.description}
                                    icon={slot.label}
                                    value={images[slot.slot]?.url}
                                    loading={uploadingSlot === slot.slot}
                                    required
                                    onUpload={(file) =>
                                        handleSlotUpload(slot.slot, file)
                                    }
                                    onRemove={() => handleSlotRemove(slot.slot)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Gallery */}
                    <GalleryUploader
                        images={galleryImages}
                        onAdd={handleGalleryAdd}
                        onRemove={handleGalleryRemove}
                        onReorder={handleGalleryReorder}
                    />

                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading || missingSlots > 0}
                            className="flex-1 px-6 py-3 bg-[#0099CC] hover:bg-[#007799] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all"
                        >
                            {loading ? 'Salvando...' : `Publicar Carro (${missingSlots} fotos faltando)`}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-all"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
