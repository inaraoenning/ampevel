import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

const client = new S3Client({
    region: 'us-west-2',
    endpoint: 'https://fzvlzdouefwwvqewuztg.storage.supabase.co/storage/v1/s3',
    credentials: {
        accessKeyId: '53ec2b5f9700229409d6ad2408f2e601',
        secretAccessKey: '23884f11a500e5bc517c147648482f1cdbae683d510bf6790a3ed9ce88fdab3f'
    },
    forcePathStyle: true
});

async function listBuckets() {
    try {
        console.log('Attempting to list buckets...');
        const command = new ListBucketsCommand({});
        const response = await client.send(command);
        console.log('Success!');
        console.log('Buckets:', response.Buckets?.map(b => b.Name));
    } catch (err) {
        console.error('Error listing buckets:', err);
    }
}

listBuckets();
