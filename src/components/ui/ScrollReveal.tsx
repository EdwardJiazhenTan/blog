'use client';

import { ReactNode, CSSProperties } from 'react';
import { useScrollAnimation, ScrollAnimationOptions } from '@/hooks/useScrollAnimation';

interface ScrollRevealProps extends ScrollAnimationOptions {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  animation?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale' | 'bounce';
}

export function ScrollReveal({
  children,
  className = '',
  style = {},
  animation = 'slide-up',
  ...options
}: ScrollRevealProps) {
  const { ref, isVisible, animationStyle } = useScrollAnimation(options);

  const getAnimationTransform = () => {
    if (isVisible) return 'translateY(0) translateX(0) scale(1)';
    
    switch (animation) {
      case 'fade':
        return 'translateY(0) translateX(0) scale(1)';
      case 'slide-up':
        return 'translateY(30px) translateX(0) scale(1)';
      case 'slide-left':
        return 'translateY(0) translateX(30px) scale(1)';
      case 'slide-right':
        return 'translateY(0) translateX(-30px) scale(1)';
      case 'scale':
        return 'translateY(0) translateX(0) scale(0.9)';
      case 'bounce':
        return 'translateY(40px) translateX(0) scale(0.95)';
      default:
        return 'translateY(30px) translateX(0) scale(1)';
    }
  };

  const getAnimationEasing = () => {
    switch (animation) {
      case 'bounce':
        return 'cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      case 'scale':
        return 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      default:
        return options.easing || 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
  };

  const customAnimationStyle = {
    opacity: isVisible ? 1 : 0,
    transform: getAnimationTransform(),
    transition: `opacity ${options.duration || 800}ms ${getAnimationEasing()}, transform ${options.duration || 800}ms ${getAnimationEasing()}`,
    ...style,
  };

  return (
    <div
      ref={ref}
      className={className}
      style={customAnimationStyle}
    >
      {children}
    </div>
  );
}