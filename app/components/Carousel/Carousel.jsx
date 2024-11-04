'use client';
import  { useState, useEffect } from 'react';

const Carousel = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

    useEffect(() => {
console.log('images', images)    }, []);

  return (
    <div className="flex flex-col items-center p-2">

      <div className="relative w-full overflow-hidden h-[480px]">
        <div className="flex transition-transform duration-500 ease-in-out w-full h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {images.length>0 && images.map((slide, index) => (
            <div key={index} className="w-full flex-shrink-0 bg-black ">
              <img src={slide} alt={index} className='m-auto h-full' />
            </div>
          ))}
        </div>

        <button
          className="absolute hover:bg-[gray] top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
          onClick={prevSlide}
        >
          &#10094;
        </button>
        <button
          className="absolute hover:bg-[gray] top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
          onClick={nextSlide}
        >
          &#10095;
        </button>
      </div>
      <div className="flex space-x-2 mt-4">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full cursor-pointer ${index === currentSlide ? 'bg-[black]' : 'bg-[black] bg-opacity-50'
              }`}
            onClick={() => setCurrentSlide(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;