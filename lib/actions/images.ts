'use server'

import { createClient, createServiceClient } from '@/utils/supabase/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const BUCKET_NAME = 'car-images'

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    endpoint: process.env.AWS_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true, // Needed for Supabase S3 compatibility
})

export async function uploadCarImage(
    file: File,
    carId?: string
): Promise<string> {
    const fileName = `${carId || 'temp'}/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`

    try {
        const fileBuffer = await file.arrayBuffer()

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: Buffer.from(fileBuffer),
            ContentType: file.type,
            CacheControl: '3600',
            ACL: 'public-read', // Ensure the file is public
        })

        await s3Client.send(command)

        // Construct the public URL manually since we're using S3 protocol
        // Pattern: https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>/<key>
        const projectId = process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1].split('.')[0]
        const publicUrl = `https://${projectId}.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${fileName}`

        return publicUrl
    } catch (err) {
        // Re-throw with helpful message
        const message = err instanceof Error ? err.message : String(err)
        console.error('S3 Upload Error:', err)
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
