import { fetchGalleryImages } from './api/galleryAPI';

document.addEventListener("DOMContentLoaded", async () => {
    const imageGallery = document.getElementById("image-gallery")!;
    const images = await fetchGalleryImages();

    console.log('Fetched images:', images);

    images.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "Trail Forward Gallery Image";
        imageGallery.appendChild(img);
    });
});
