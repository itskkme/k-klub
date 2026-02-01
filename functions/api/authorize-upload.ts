import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface Env {
    R2_ACCOUNT_ID: string;
    R2_ACCESS_KEY_ID: string;
    R2_SECRET_ACCESS_KEY: string;
    R2_BUCKET_NAME: string;
    R2_PUBLIC_DOMAIN: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const { request, env } = context;

        // 1. Validate Env functionality (Optional: Add Auth check here)
        if (!env.R2_ACCOUNT_ID || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY || !env.R2_BUCKET_NAME) {
            return new Response(JSON.stringify({ error: 'Missing R2 Configuration on Server' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 2. Parse Request Body
        const { filename, contentType } = await request.json() as { filename: string; contentType: string };

        if (!filename || !contentType) {
            return new Response(JSON.stringify({ error: 'Missing filename or contentType' }), { status: 400 });
        }

        // 3. Initialize S3 Client
        const S3 = new S3Client({
            region: 'auto',
            endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: env.R2_ACCESS_KEY_ID,
                secretAccessKey: env.R2_SECRET_ACCESS_KEY,
            },
        });

        // 4. Generate Unique Key
        const key = `products/${Date.now()}_${filename.replace(/\s+/g, '-')}`;

        // 5. Create Signed URL
        const url = await getSignedUrl(S3, new PutObjectCommand({
            Bucket: env.R2_BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        }), { expiresIn: 3600 }); // 1 hour expiration

        // 6. Return Data
        return new Response(JSON.stringify({
            uploadUrl: url,
            key: key,
            publicUrl: `${env.R2_PUBLIC_DOMAIN}/${key}`
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
