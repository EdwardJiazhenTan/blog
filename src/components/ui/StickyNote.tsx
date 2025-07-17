'use client';

import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

interface StickyNoteProps {
  id: string;
  content: string;
  color?: 'yellow' | 'cream' | 'peach' | 'mint' | 'lavender';
  initialPosition?: { x: number; y: number };
  rotation?: number;
  className?: string;
}

const colorMap = {
  yellow: 'bg-yellow-100',
  cream: 'bg-orange-50', 
  peach: 'bg-pink-50',
  mint: 'bg-green-50',
  lavender: 'bg-purple-50',
};

export function StickyNote({
  id,
  content,
  color = 'yellow',
  initialPosition = { x: 0, y: 0 },
  rotation = 0,
  className
}: StickyNoteProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const noteRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!noteRef.current) return;
    
    const rect = noteRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      setPosition({
        x: e.clientX + window.scrollX - dragOffset.x,
        y: e.clientY + window.scrollY - dragOffset.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={noteRef}
      className={clsx(
        'sticky-note',
        colorMap[color],
        'absolute w-56 h-56 p-6 cursor-move select-none',
        'transition-all duration-300 ease-out',
        'font-handwriting',
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        transform: `rotate(${rotation}deg) ${isDragging ? 'scale(1.08) rotate(0deg)' : ''}`,
        transformOrigin: 'center center',
        borderColor: 'var(--foreground)',
        color: 'var(--foreground)',
        zIndex: isDragging ? 9999 : 100,
        boxShadow: isDragging 
          ? '0 20px 40px rgba(0,0,0,0.2)' 
          : '0 8px 25px rgba(0,0,0,0.12)',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Folded corner effect */}
      <div 
        className="absolute top-0 right-0 w-8 h-8 opacity-30"
        style={{
          background: 'linear-gradient(135deg, transparent 50%, var(--foreground) 50%)',
          clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
        }}
      />
      
      {/* Soft tape effect */}
      <div 
        className="sticky-note-tape absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-8 opacity-60"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      />
      
      <div className="relative h-full flex items-center justify-center text-center">
        <div className="text-base leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </div>
      </div>
      
      {/* Subtle shadow behind */}
      <div 
        className="absolute inset-0 -z-10 rounded-3xl opacity-20"
        style={{ 
          transform: 'translate(6px, 6px)',
          backgroundColor: 'var(--foreground)'
        }} 
      />
    </div>
  );
}