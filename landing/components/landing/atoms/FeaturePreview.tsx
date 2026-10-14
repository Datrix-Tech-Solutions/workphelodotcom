'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { snappySpring } from '@/landing/lib/animations';

export function FeaturePreview({
  children,
  image,
  featureName,
}: {
  children: React.ReactNode;
  image: string;
  featureName: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState<'left' | 'right'>('right');
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
  const itemRef = useRef<HTMLLIElement>(null);
  const rafRef = useRef<number>(0);

  const updatePosition = useCallback(() => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const cardRect = itemRef.current.closest('[data-module-card]')?.getBoundingClientRect();
    if (!cardRect) return;

    const popupW = 340;
    const gap = 20;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const spaceRight = vw - cardRect.right - gap;
    const spaceLeft = cardRect.left - gap;
    const side = spaceRight >= popupW ? 'right' : spaceLeft >= popupW ? 'left' : 'right';
    setPos(side);

    let left: number;
    if (side === 'right') {
      left = cardRect.right + gap;
      if (left + popupW > vw - 16) left = vw - popupW - 16;
    } else {
      left = cardRect.left - popupW - gap;
      if (left < 16) left = 16;
    }

    const popupEstH = 220;
    let top = rect.top + rect.height / 2 - popupEstH / 2;
    if (top < 16) top = 16;
    if (top + popupEstH > vh - 16) top = vh - popupEstH - 16;

    setPopupStyle({ position: 'fixed', top, left, width: popupW, zIndex: 99999 });

    const itemCenterY = rect.top + rect.height / 2;
    let arrowLeft: number;
    let arrowRotation: number;
    if (side === 'right') {
      arrowLeft = cardRect.right + gap - 5;
      arrowRotation = 45;
    } else {
      arrowLeft = cardRect.left - gap - 5;
      arrowRotation = -135;
    }
    setArrowStyle({
      position: 'fixed',
      top: itemCenterY - 5,
      left: arrowLeft,
      transform: `rotate(${arrowRotation}deg)`,
      zIndex: 99999,
    });
  }, []);

  const handleMouseMove = () => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updatePosition);
  };

  useEffect(() => {
    if (!hovered) return;
    const onScroll = () => updatePosition();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', updatePosition);
      cancelAnimationFrame(rafRef.current);
    };
  }, [hovered, updatePosition]);

  const popup = (
    <AnimatePresence>
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.95 }}
          transition={{ ...snappySpring }}
          className="hidden lg:block pointer-events-none"
          style={popupStyle}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/20 border border-gray-200/80 bg-white p-2">
            <div className="px-2 py-1.5 mb-1.5">
              <p className="text-xs font-semibold text-foreground/80 truncate">{featureName}</p>
            </div>
            <div className="relative rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={image}
                alt={featureName}
                width={672}
                height={384}
                className="w-full h-auto block"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent pointer-events-none" />
            </div>
            <div className="absolute top-3 right-3">
              <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const arrow = (
    <AnimatePresence>
      {hovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ ...snappySpring }}
          className="w-2.5 h-2.5 bg-white border border-gray-200/80 pointer-events-none hidden lg:block"
          style={{
            ...arrowStyle,
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent',
            [pos === 'right' ? 'borderLeftColor' : 'borderRightColor']: 'white',
          }}
        />
      )}
    </AnimatePresence>
  );

  return (
    <li
      ref={itemRef}
      className="relative"
      onMouseEnter={() => { updatePosition(); setHovered(true); }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start gap-2.5 group/feat cursor-default">
        <CheckCircle2 className="shrink-0 h-4.5 w-4.5 mt-0.5 text-foreground/20 group-hover/feat:text-foreground/50 transition-colors duration-300" />
        <span className="text-[15px] text-muted-foreground leading-relaxed group-hover/feat:text-foreground transition-colors duration-300">
          {children}
        </span>
      </div>
      {typeof window !== 'undefined' && createPortal(popup, document.body)}
      {typeof window !== 'undefined' && createPortal(arrow, document.body)}
    </li>
  );
}
