'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

interface Props {
  images: { src: string; alt: string; caption?: string }[];
  /** seconds for one full loop; lower = faster */
  speed?: number;
  /** scroll direction */
  direction?: 'left' | 'right';
}

/**
 * Infinite auto-scrolling photo marquee.
 * - Duplicates the image set so the loop is seamless.
 * - Pauses on hover and supports click-and-drag / touch swipe to nudge.
 * - Respects prefers-reduced-motion via CSS.
 */
export function PhotoMarquee({ images, speed = 40, direction = 'right' }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const dragState = useRef<{ startX: number; scrollLeft: number; dragging: boolean }>({
    startX: 0, scrollLeft: 0, dragging: false,
  });

  if (!images.length) return null;

  const items = [...images, ...images]; // duplicate for seamless loop

  const onDown = (e: React.PointerEvent) => {
    if (!trackRef.current) return;
    dragState.current = {
      startX: e.pageX,
      scrollLeft: trackRef.current.scrollLeft,
      dragging: true,
    };
    setPaused(true);
    trackRef.current.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragState.current.dragging || !trackRef.current) return;
    const dx = e.pageX - dragState.current.startX;
    trackRef.current.scrollLeft = dragState.current.scrollLeft - dx;
  };
  const onUp = (e: React.PointerEvent) => {
    dragState.current.dragging = false;
    setPaused(false);
    trackRef.current?.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      className="relative overflow-hidden group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-brand-gray to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-brand-gray to-transparent" />

      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        style={{ scrollbarWidth: 'none' }}
      >
        <div
          className="flex gap-4 animate-marquee will-change-transform"
          style={{
            animationDuration: `${speed}s`,
            animationDirection: direction === 'right' ? 'reverse' : 'normal',
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {items.map((img, i) => (
            <figure
              key={i}
              className="relative shrink-0 w-72 md:w-80 aspect-[4/3] rounded-xl overflow-hidden border bg-white shadow-md"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                draggable={false}
                sizes="320px"
                className="object-cover pointer-events-none"
              />
              {img.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs md:text-sm p-3">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
