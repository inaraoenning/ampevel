'use server'

import { createClient, createServiceClient } from '@/utils/supabase/server'

const BUCKET_NAME = 'car-images'

export async function uploadCarImage(
    file: File,
    carId?: string
): Promise<string> {
    // Use service-role client for storage operations to avoid RLS denying inserts
    const supabase = createServiceClient()

    const fileName = `${carId || 'temp'}/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`

    try {
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
            })

        if (error) {
            // Log masked debug info for Vercel logs (no secrets)
            try {
                console.error('Upload error:', {
                    message: error.message,
                    bucket: BUCKET_NAME,
                    projectUrlLength: (process.env.NEXT_PUBLIC_SUPABASE_URL || '').length,
                })
            } catch (_) { }

            throw new Error(`Upload failed: ${error.message} (bucket: ${BUCKET_NAME})`)
        }

        const {
            data: { publicUrl },
        } = await createClient().then(s => s.storage.from(BUCKET_NAME).getPublicUrl(fileName))

        return publicUrl
    } catch (err) {
        // Re-throw with helpful message
        const message = err instanceof Error ? err.message : String(err)
        throw new Error(`Upload failed: ${message}`)
    }
}

export async function deleteCarImage(imageUrl: string): Promise<void> {
    // Use service-role client for delete operations
    const supabase = createServiceClient()
    const path = imageUrl.split(`${BUCKET_NAME}/`)[1]

    if (!path) throw new Error('Invalid image URL')

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path])

    if (error) throw new Error(`Delete failed: ${error.message}`)
}
