import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser, signOut } from '@/lib/actions/auth'
import { getCars } from '@/lib/actions/cars'
import { DeleteCarButton } from './delete-car-button'

export default async function AdminDashboard() {
    const user = await getUser()

    if (!user) {
        redirect('/admin/login')
    }

    const cars = await getCars()

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Painel Admin - Carros</h1>
                    <div className="flex gap-4">
                        <Link
                            href="/admin/dashboard/new"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            + Adicionar Carro
                        </Link>
                        <form action={signOut}>
                            <button
                                type="submit"
                                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Sair
                            </button>
                        </form>
                    </div>
                </div>

                {cars.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500 mb-4">Nenhum carro cadastrado</p>
                        <Link
                            href="/admin/dashboard/new"
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Adicionar Primeiro Carro
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cars.map((car) => (
                            <div
                                key={car.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                {car.images[0] && (
                                    <img
                                        src={typeof car.images[0] === 'string' ? car.images[0] : car.images[0].url}
                                        alt={car.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2">{car.title}</h3>
                                    <p className="text-xl text-blue-600 font-bold mb-2">
                                        R$ {car.price.toLocaleString('pt-BR')}
                                    </p>
                                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                                        <p>Ano: {car.year}</p>
                                        <p>KM: {car.km.toLocaleString('pt-BR')}</p>
                                        <p>Câmbio: {car.transmission}</p>
                                        <p>Combustível: {car.fuel}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/dashboard/edit/${car.id}`}
                                            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-center transition-colors"
                                        >
                                            Editar
                                        </Link>
                                        <DeleteCarButton car={car} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
