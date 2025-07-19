import { fetchGalleryImages } from './api/galleryAPI.js';

let images: string[];
const imageGallery = document.getElementById("image-gallery")!;


document.addEventListener("DOMContentLoaded", async () => {

    images = await fetchGalleryImages();
    console.log('Gallery images list:', images);

    initializeImages(images, 0, 5);
    console.log('Initial images displayed:', images.slice(0, 5));


});

document.getElementById("next")?.addEventListener("click", () => {
    handleImageNavigation('next');
});

document.getElementById("prev")?.addEventListener("click", () => {
    handleImageNavigation('prev');
});

function initializeImages(imageArr: string[], start: number, end: number): void {

    const initialImages = imageArr.slice(start, end);

    initialImages.forEach(src => {

        const img = loadImage(src);
        if (src === initialImages[2]) {
            img.classList.add("active");
        }
        imageGallery.appendChild(img);
    });

}

function loadImage(src: string): HTMLDivElement {
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("image-container");

    const img = document.createElement("img");
    img.classList.add("gallery-image");
    img.src = src;
    img.alt = "Trail Forward Gallery Image";

    imgContainer.appendChild(img);

    return imgContainer;
}

function handleImageNavigation(direction: 'next' | 'prev'): void {
    const currentImages = document.querySelectorAll('.gallery-image') as NodeListOf<HTMLImageElement>;
    const currentImageContainers = document.querySelectorAll('.image-container') as NodeListOf<HTMLDivElement>;

    Array.from(currentImageContainers).forEach(container => {
        container.classList.remove('active');
    });

    const firstCurrentImage = currentImages[0];
    const lastCurrentImage = currentImages[currentImages.length - 1];

    if (direction === 'next') {
        const nextImg = findImageIndex(images, lastCurrentImage) === images.length - 1 ? 0 : findImageIndex(images, lastCurrentImage) + 1;
        imageGallery.append(loadImage(images[nextImg]));
        currentImageContainers[0].remove(); // Remove the first image to maintain the count
    } else {
        const prevImg = findImageIndex(images, firstCurrentImage) === 0 ? images.length - 1 : findImageIndex(images, firstCurrentImage) - 1;
        imageGallery.prepend(loadImage(images[prevImg]));
        currentImageContainers[currentImageContainers.length - 1].remove(); // Remove the last image to maintain the count
    }

    // Updated NodeList after navigation
    const updatedContainers = document.querySelectorAll('.image-container') as NodeListOf<HTMLDivElement>;
    // Set the middle image as active
    const middleIndex = Math.floor(updatedContainers.length / 2);
    updatedContainers[middleIndex].classList.add('active');

    // Log the current position in the image array
    const updatedImages = document.querySelectorAll('.gallery-image') as NodeListOf<HTMLImageElement>;
    console.log(`Current position in image array: ${findImageIndex(images, updatedImages[middleIndex])}`);
}

function findImageIndex(imgArr: string[], img: HTMLImageElement): number {
    const imgSrc = returnSrcString(img);
    const imgIndex = imgArr.findIndex(img => img === imgSrc);
    return imgIndex;
}

function returnSrcString(img: HTMLImageElement): string {
    const splitSrc = img.src.split('/').splice(-2);
    const parsedSrc = `/${splitSrc.join('/')}`;
    return parsedSrc;
}