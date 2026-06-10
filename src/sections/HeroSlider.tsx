"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const SLIDES = [
  "/assets/slide-1.png",
  "/assets/slide-2.png",
  "/assets/slide-3.png",
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1)),
    []
  );
  const prev = () =>
    setCurrent((p) => (p === 0 ? SLIDES.length - 1 : p - 1));

  // Auto-advance every 5s.
  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <section className="relative h-[500px] overflow-hidden text-white md:h-[600px]">
      {/* Slides */}
      {SLIDES.map((src, index) => (
        <div
          key={src}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === current ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 md:px-8">
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-4xl font-bold uppercase leading-tight md:text-5xl lg:text-6xl">
            Be on the go
            <br />
            with the best
            <br />
            kicks
          </h1>
          <Link
            href="/shop"
            className="mt-6 inline-block rounded-md bg-black px-6 py-2.5 font-medium text-white transition-colors hover:bg-gray-800"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              "h-3 w-3 rounded-full transition-all",
              current === index ? "scale-125 bg-white" : "bg-white/50"
            )}
          />
        ))}
      </div>
    </section>
  );
}
