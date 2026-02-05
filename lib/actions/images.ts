'use server'

import { createClient } from '@/utils/supabase/server'

const BUCKET_NAME = 'car-images'

export async function uploadCarImage(
    file: File,
    carId?: string
): Promise<string> {
    const supabase = await createClient()
    
    const fileName = `${carId || 'temp'}/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`
    
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
        })

    if (error) throw new Error(`Upload failed: ${error.message}`)

    const {
        data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName)

    return publicUrl
}

export async function deleteCarImage(imageUrl: string): Promise<void> {
    const supabase = await createClient()
    const path = imageUrl.split(`${BUCKET_NAME}/`)[1]
    
    if (!path) throw new Error('Invalid image URL')
    
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path])
    
    if (error) throw new Error(`Delete failed: ${error.message}`)
}
