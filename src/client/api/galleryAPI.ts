/**
 * This function will fetch a list of image files from the server.
 * 
 * @returns {Promise<string[]>} - A promise that resolves to an array of image URLs
 */

export async function fetchGalleryImages(): Promise<string[]> {
    try {
        const response = await fetch('/api/gallery');
        const imgURLs = await response.json();

        // Check if the response contains valid image URLs
        if (!imgURLs) {
            console.error('No images found in the gallery.');
            return [];
        }
        return imgURLs;

    } catch (error) {
        console.error('Error fetching gallery images:', error);
        return [];
    }

} 