import { createClient } from '@/utils/supabase/client'

const BUCKET_NAME = 'car-images'

export const storageService = {
    // Upload de uma imagem
    async uploadImage(file: File, carId: string): Promise<string> {
        const supabase = createClient()
        const fileExt = file.name.split('.').pop()
        const fileName = `${carId}/${Date.now()}.${fileExt}`
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
            })
        if (error) throw error
        // Retornar URL pública
        const {
            data: { publicUrl },
        } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName)
        return publicUrl
    },
    // Upload de múltiplas imagens
    async uploadImages(files: File[], carId: string): Promise<string[]> {
        const uploadPromises = files.map((file) => this.uploadImage(file, carId))
        return Promise.all(uploadPromises)
    },
    // Deletar imagem
    async deleteImage(imageUrl: string | undefined | null): Promise<void> {
        if (!imageUrl) return
        const supabase = createClient()
        const path = imageUrl.split(`${BUCKET_NAME}/`)[1]
        const { error } = await supabase.storage.from(BUCKET_NAME).remove([path])
        if (error) throw error
    },
    // Deletar todas as imagens de um carro
    async deleteCarImages(imageUrls: string[]): Promise<void> {
        const deletePromises = imageUrls.map((url) => this.deleteImage(url))
        await Promise.all(deletePromises)
    },
}