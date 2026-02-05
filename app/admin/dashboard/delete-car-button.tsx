'use client'

import { useState } from 'react'
import { deleteCar } from '@/lib/actions/cars'
import { storageService } from '@/lib/services/storage'
import { Car } from '@/lib/supabase/types'

export function DeleteCarButton({ car }: { car: Car }) {
    const [deleting, setDeleting] = useState(false)

    async function handleDelete() {
        if (!confirm(`Tem certeza que deseja deletar ${car.title}?`)) return

        setDeleting(true)
        try {
            // Deletar imagens do storage
            if (car.images.length > 0) {
                const imageUrls = car.images.map((img) => img.url)
                await storageService.deleteCarImages(imageUrls)
            }
            // Deletar registro do banco
            await deleteCar(car.id)
        } catch (error) {
            console.error('Erro ao deletar carro:', error)
            alert('Erro ao deletar carro')
        } finally {
            setDeleting(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
            {deleting ? 'Deletando...' : 'Deletar'}
        </button>
    )
}
