/**
 * Uploads an image to Cloudflare R2 via a secure Presigned URL.
 * 
 * Flow:
 * 1. Frontend requests a signed URL from /api/authorize-upload
 * 2. Backend generates URL using hidden secrets
 * 3. Frontend uploads file directly to R2 using that URL
 * 4. Returns the public URL of the uploaded file
 */
export const uploadImageToR2 = async (file: File): Promise<string> => {
    try {
        // 1. Get Presigned URL
        const response = await fetch('/api/authorize-upload', {
            method: 'POST',
            body: JSON.stringify({
                filename: file.name,
                contentType: file.type,
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to authorize upload');
        }

        const { uploadUrl, publicUrl } = await response.json();

        // 2. Upload File to R2
        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type
            }
        });

        if (!uploadResponse.ok) {
            throw new Error('Failed to upload file to storage');
        }

        return publicUrl;
    } catch (error) {
        console.error('R2 Upload Error:', error);
        throw error;
    }
};
