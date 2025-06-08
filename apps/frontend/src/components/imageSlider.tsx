// components/ImageSlider.tsx
import React from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { FaX } from "react-icons/fa6";

interface ImageSliderProps {
  images: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  fullscreen?: boolean;
  onClose?: () => void;
  setIsFullscreen: (state: boolean) => void;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  currentIndex,
  setCurrentIndex,
  fullscreen = false,
  onClose,
  setIsFullscreen,
}) => {
  const prevImage = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prevImage();
    else if (e.key === "ArrowRight") nextImage();
    else if (e.key === "Escape" && fullscreen && onClose) onClose();
  };

  return (
    <div
      className={fullscreen ? "fixed inset-0 bg-black bg-opacity-95 z-50" : ""}
      // tabIndex={fullscreen ? 0 : undefined}
      onKeyDown={fullscreen ? handleKeyDown : undefined}
    >
      {fullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="fixed top-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-full z-20 cursor-pointer"
        >
          <FaX />
        </button>
      )}

      {/* Main Image */}
      <div
        className={`relative ${fullscreen ? "h-full flex items-center justify-center" : "h-96"} w-full`}
      >
        <img
          onClick={() => setIsFullscreen(true)}
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className={`object-contain w-full z-10 cursor-pointer ${fullscreen ? "max-h-full" : "h-full object-cover"}`}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full z-10"
            >
              <BiChevronLeft />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full z-10"
            >
              <BiChevronRight />
            </button>
          </>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 rounded-full text-sm z-10">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full ${
                  currentIndex === idx ? "bg-white scale-125" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
