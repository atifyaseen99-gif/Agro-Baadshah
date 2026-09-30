import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { sliderService } from '../../services';

export const CropSlider: React.FC = () => {
  const [slides, setSlides] = useState(() => sliderService.getActive());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    setSlides(sliderService.getActive());
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleNext();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      handlePrev();
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-stone-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide Image Background with overlay */}
      <div className="relative h-[340px] sm:h-[420px] md:h-[480px] lg:h-[520px] w-full">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000"
              />

              {/* Gradient Scrim for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />

              {/* Slide Content Overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
                  <div className="max-w-2xl text-white space-y-4">
                    <span className="inline-block text-xs sm:text-sm font-semibold tracking-wider text-emerald-400 uppercase">
                      Agro Baadshah Crop Solutions · Khanpur
                    </span>

                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-serif tracking-tight leading-tight text-white drop-shadow-sm">
                      {slide.title}
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg text-stone-200 line-clamp-2 md:line-clamp-3 leading-relaxed drop-shadow">
                      {slide.subtitle}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <Link
                        to={slide.buttonLink || '/shop'}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg transition-colors shadow-lg shadow-emerald-900/40"
                      >
                        <span>{slide.buttonText || 'View Products'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <Link
                        to="/shop"
                        className="inline-flex items-center px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-lg backdrop-blur-sm transition-colors border border-white/20"
                      >
                        All Agri-Inputs
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm opacity-80 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm opacity-80 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Indicators Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 transition-all rounded-full ${
                idx === currentIndex ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
