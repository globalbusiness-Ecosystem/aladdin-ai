'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Slide {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  bgColor: string;
}

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const slides: Slide[] = [
    {
      title: 'GlobalBusiness Ecosystem',
      subtitle: '25 Pi apps under one roof',
      description: 'Explore all premium platforms',
      buttonText: 'Explore All',
      bgColor: 'from-[#1a1a1a] to-[#0A0A0A]'
    },
    {
      title: 'Invest with Pi',
      subtitle: 'Real estate, cars, trade & more',
      description: 'Grow your wealth globally',
      buttonText: 'Start Now',
      bgColor: 'from-[#1a1a1a] to-[#0A0A0A]'
    },
    {
      title: 'AI Sales Agent',
      subtitle: 'Ask Aladdin anything',
      description: 'Your personal commerce assistant',
      buttonText: 'Chat Now',
      bgColor: 'from-[#1a1a1a] to-[#0A0A0A]'
    }
  ];

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlay, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
  };

  const slide = slides[currentSlide];

  return (
    <div className="relative w-full h-80 overflow-hidden rounded-xl">
      {/* Background with dark overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} transition-all duration-500`}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Slide content */}
      <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-semibold text-[#C9A84C] tracking-wide mb-2 uppercase">
          Global Business
        </p>
        <h2 className="text-4xl font-bold text-white mb-3">{slide.title}</h2>
        <p className="text-lg text-[#C9A84C] font-semibold mb-2">{slide.subtitle}</p>
        <p className="text-sm text-[#999999] mb-8 max-w-md">{slide.description}</p>

        {/* CTA Button */}
        <Button
          className="bg-[#C9A84C] text-[#0A0A0A] hover:bg-[#C9A84C]/90 font-semibold px-8 py-2 rounded-lg"
          onClick={() => {
            if (slide.buttonText === 'Chat Now') {
              window.dispatchEvent(new CustomEvent('navigateToChat'));
            }
          }}
        >
          {slide.buttonText}
        </Button>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-[#C9A84C]" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-[#C9A84C]" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-[#C9A84C] w-8'
                : 'bg-white/30 w-2 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
