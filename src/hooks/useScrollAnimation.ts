'use client';

import { useEffect, useRef, useState } from 'react';

export interface ScrollAnimationOptions {
  threshold?: number;
  delay?: number;
  duration?: number;
  easing?: string;
  once?: boolean;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    delay = 0,
    duration = 800,
    easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    once = true,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasTriggered || !once) {
            setTimeout(() => {
              setIsVisible(true);
              setHasTriggered(true);
            }, delay);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, delay, once, hasTriggered]);

  const animationStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`,
  };

  return { ref: elementRef, isVisible, animationStyle };
}