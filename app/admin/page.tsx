'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CarFormData {
    id?: number;
    image: string;
    title: string;
    description: string;
    year: number;
    km: string;
    transmission: string;
    price: string;
    fuel: string;
    extras: string;
}

const initialFormData: CarFormData = {
    image: '',
    title: '',
    description: '',
    year: new Date().getFullYear(),
    km: '',
    transmission: 'Manual',
    price: '',
    fuel: 'Gasolina',
    extras: ''
};

export default function AdminPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [cars, setCars] = useState<CarFormData[]>([]);
    const [formData, setFormData] = useState<CarFormData>(initialFormData);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        // Verificar autenticação
        const auth = localStorage.getItem('adminAuthenticated');
        if (auth !== 'true') {
            router.push('/login');
        } else {
            setIsAuthenticated(true);
            // Carregar carros salvos (exemplo com localStorage)
            const savedCars = localStorage.getItem('cars');
            if (savedCars) {
                setCars(JSON.parse(savedCars));
            }
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('adminAuthenticated');
        router.push('/login');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setFormData({ ...formData, image: result });
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId !== null) {
            // Editar carro existente
            const updatedCars = cars.map(car =>
                car.id === editingId ? { ...formData, id: editingId } : car
            );
            setCars(updatedCars);
            localStorage.setItem('cars', JSON.stringify(updatedCars));
        } else {
            // Adicionar novo carro
            const newCar = { ...formData, id: Date.now() };
            const updatedCars = [...cars, newCar];
            setCars(updatedCars);
            localStorage.setItem('cars', JSON.stringify(updatedCars));
        }

        // Reset form
        setFormData(initialFormData);
        setImagePreview('');
        setEditingId(null);
    };

    const handleEdit = (car: CarFormData) => {
        setFormData(car);
        setImagePreview(car.image);
        setEditingId(car.id || null);
    };

    const handleDelete = (id: number) => {
        if (confirm('Tem certeza que deseja excluir este veículo?')) {
            const updatedCars = cars.filter(car => car.id !== id);
            setCars(updatedCars);
            localStorage.setItem('cars', JSON.stringify(updatedCars));
        }
    };

    const handleCancel = () => {
        setFormData(initialFormData);
        setImagePreview('');
        setEditingId(null);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/logo.png"
                                alt="Ampevel"
                                width={150}
                                height={50}
                                className="h-10 w-auto"
                            />
                            <span className="text-xl font-semibold text-gray-900">Painel Administrativo</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {editingId ? 'Editar Veículo' : 'Adicionar Novo Veículo'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Foto do Veículo
                                </label>
                                <div className="mt-1 flex items-center gap-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                                {imagePreview && (
                                    <div className="mt-4 relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome/Modelo
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Ex: Toyota Corolla XEi"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descrição
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Descreva o veículo..."
                                />
                            </div>

                            {/* Year and KM */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ano
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1900"
                                        max="2099"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quilometragem
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.km}
                                        onChange={(e) => setFormData({ ...formData, km: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="50.000 km"
                                    />
                                </div>
                            </div>

                            {/* Transmission and Fuel */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Câmbio
                                    </label>
                                    <select
                                        value={formData.transmission}
                                        onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    >
                                        <option value="Manual">Manual</option>
                                        <option value="Automático">Automático</option>
                                        <option value="CVT">CVT</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Combustível
                                    </label>
                                    <select
                                        value={formData.fuel}
                                        onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    >
                                        <option value="Gasolina">Gasolina</option>
                                        <option value="Etanol">Etanol</option>
                                        <option value="Flex">Flex</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="Elétrico">Elétrico</option>
                                        <option value="Híbrido">Híbrido</option>
                                    </select>
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Valor
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="R$ 85.000"
                                />
                            </div>

                            {/* Extras */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Adicionais
                                </label>
                                <textarea
                                    rows={2}
                                    value={formData.extras}
                                    onChange={(e) => setFormData({ ...formData, extras: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Ex: Manual, Chave reserva, Revisões em dia..."
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#003366] to-[#0099CC] hover:from-[#002244] hover:to-[#007799] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                                >
                                    {editingId ? 'Salvar Alterações' : 'Adicionar Veículo'}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Cars List */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Veículos Cadastrados ({cars.length})
                        </h2>

                        {cars.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <p className="mt-4 text-gray-500">Nenhum veículo cadastrado ainda</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cars.map((car) => (
                                    <div key={car.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                                        <div className="flex">
                                            {car.image && (
                                                <div className="relative w-48 h-32 flex-shrink-0">
                                                    <Image
                                                        src={car.image}
                                                        alt={car.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 p-4">
                                                <h3 className="font-bold text-lg text-gray-900">{car.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{car.description}</p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className="text-xs px-2 py-1 bg-[#003366]/10 text-[#003366] rounded">
                                                        {car.year}
                                                    </span>
                                                    <span className="text-xs px-2 py-1 bg-[#0099CC]/10 text-[#0099CC] rounded">
                                                        {car.km}
                                                    </span>
                                                    <span className="text-xs px-2 py-1 bg-[#0099CC]/10 text-[#0099CC] rounded">
                                                        {car.price}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2 mt-3">
                                                    <button
                                                        onClick={() => handleEdit(car)}
                                                        className="px-3 py-1 bg-[#003366]/10 text-[#003366] rounded-lg text-sm font-medium hover:bg-[#003366]/20 transition-colors"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(car.id!)}
                                                        className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                                                    >
                                                        Excluir
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
