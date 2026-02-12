import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import fs from 'fs';

const BUCKET_NAME = 'car-images';
const PROJECT_ID = 'fzvlzdouefwwvqewuztg'; // Extracted from endpoint

const client = new S3Client({
    region: 'us-west-2',
    endpoint: 'https://fzvlzdouefwwvqewuztg.storage.supabase.co/storage/v1/s3',
    credentials: {
        accessKeyId: '53ec2b5f9700229409d6ad2408f2e601',
        secretAccessKey: '23884f11a500e5bc517c147648482f1cdbae683d510bf6790a3ed9ce88fdab3f'
    },
    forcePathStyle: true
});

async function testUpload() {
    try {
        console.log('Listing objects in bucket...');
        const listCmd = new ListObjectsV2Command({ Bucket: BUCKET_NAME });
        const listRes = await client.send(listCmd);
        console.log('Objects found:', listRes.Contents?.length || 0);
        if (listRes.Contents && listRes.Contents.length > 0) {
            console.log('First 3 objects:', listRes.Contents.slice(0, 3).map(o => o.Key));

            // Generate public URL for the first object
            const firstKey = listRes.Contents[0].Key;
            const publicUrl = `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${firstKey}`;
            console.log('Public URL for first object:', publicUrl);
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

testUpload();
