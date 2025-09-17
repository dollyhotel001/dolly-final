"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const slides = [
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1758039205082-256c2fde63bb?q=80&w=1110&auto=format&fit=crop",
  },
  {
    type: "video",
    src: "/hotel-tour.mp4",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
  },
];

export default function HeroCarousel() {
  const autoplay = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );
  const videoRefs = React.useRef<(HTMLVideoElement | null)[]>([]);
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      const currentIndex = api.selectedScrollSnap();
      const slide = slides[currentIndex];

      if (slide.type === "video") {
        const video = videoRefs.current[currentIndex];
        if (!video) return;

        // Stop autoplay while video plays
        autoplay.current.stop();

        // Reset and play video every time we come back
        video.currentTime = 0;
        video.play();

        video.onended = () => {
          autoplay.current.play(); // resume autoplay
          api.scrollNext(); // move to next slide
        };
      }
    };

    // Attach listener
    api.on("select", handleSelect);

    // Run once on mount
    handleSelect();

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Carousel
        plugins={[autoplay.current]}
        setApi={setApi}
        className="w-full h-full"
        opts={{ loop: true }}
      >
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="relative w-full h-screen">
              {slide.type === "image" ? (
                <>
                  <Image
                    src={slide.src}
                    alt={`Slide ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </>
              ) : (
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={slide.src}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center text-white z-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-yellow-400">Dolly Hotel</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Experience luxury, comfort, and unparalleled service in the heart of
            the city
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Book Now
            </a>
            <a
              href="/rooms"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              View Rooms
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
