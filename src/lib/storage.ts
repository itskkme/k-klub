import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Uploads an image to Firebase Storage and returns the download URL.
 * 
 * @param file The file object to upload
 * @param onProgress Optional callback for progress updates (0-100)
 * @returns Promise resolving to the download URL
 */
export const uploadImageToFirebase = (
    file: File,
    onProgress?: (progress: number) => void
): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Create a unique filename: products/{timestamp}_{random}_{original_name}
        // Using a sanitized name to avoid path issues
        const uniqueId = Date.now().toString() + Math.random().toString(36).substring(2, 8);
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const path = `products/${uniqueId}_${sanitizedName}`;

        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress) {
                    onProgress(progress);
                }
            },
            (error) => {
                // Handle unsuccessful uploads
                console.error("Firebase Storage Upload Error:", error);
                reject(error);
            },
            () => {
                // Handle successful uploads on complete
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                }).catch(reject);
            }
        );
    });
};
