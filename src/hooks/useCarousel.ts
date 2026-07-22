import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseCarouselOptions {
  itemCount: number;
  autoPlayInterval?: number;
  autoPlay?: boolean;
}

export const useCarousel = ({
  itemCount,
  autoPlayInterval = 5000,
  autoPlay = true,
}: UseCarouselOptions) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const goToNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % itemCount);
  }, [itemCount]);

  const goToPrev = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? itemCount - 1 : prev - 1));
  }, [itemCount]);

  const goTo = useCallback((index: number) => {
    if (index >= 0 && index < itemCount) {
      setCurrent(index);
    }
  }, [itemCount]);

  // Auto-play effect
  useEffect(() => {
    if (!autoPlay || isPaused) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, isPaused, autoPlayInterval, goToNext]);

  const pauseAutoPlay = (resumeAfterMs: number = 10000) => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), resumeAfterMs);
  };

  const resumeAutoPlay = () => {
    setIsPaused(false);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
  };

  return {
    current,
    goToNext,
    goToPrev,
    goTo,
    pauseAutoPlay,
    resumeAutoPlay,
    isPaused,
  };
};
