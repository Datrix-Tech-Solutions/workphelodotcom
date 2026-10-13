"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const LINK_DISTANCE = 140;
const GRAB_DISTANCE = 160;
const SPEED = 0.45;
const MAX_PARTICLES = 140;
const AREA_PER_PARTICLE = 14000;

/** Canvas particle network that fills the enclosing .hero. */
export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !hero || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let mouse: { x: number; y: number } | null = null;
    let frame = 0;
    let visible = true;

    const spawn = (x = Math.random() * width, y = Math.random() * height) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = SPEED * (0.4 + Math.random() * 0.6);
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 1 + Math.random() * 2,
      };
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = hero.clientWidth;
      height = hero.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.min(
        MAX_PARTICLES,
        Math.round((width * height) / AREA_PER_PARTICLE),
      );
      if (particles.length > target) particles.length = target;
      while (particles.length < target) particles.push(spawn());
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgb(255 255 255 / 0.55)";
        ctx.fill();
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > LINK_DISTANCE) continue;
          ctx.strokeStyle = `rgb(255 255 255 / ${0.28 * (1 - d / LINK_DISTANCE)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        if (mouse) {
          const d = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          if (d < GRAB_DISTANCE) {
            ctx.strokeStyle = `rgb(249 115 22 / ${0.8 * (1 - d / GRAB_DISTANCE)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    };

    const step = () => {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;
      }
    };

    const loop = () => {
      step();
      draw();
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (frame || reduced.matches || !visible || document.hidden) return;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const toLocal = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMove = (e: PointerEvent) => {
      mouse = toLocal(e);
    };
    const onLeave = () => {
      mouse = null;
    };
    const onClick = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a, button, input, select")) return;
      const { x, y } = toLocal(e);
      for (let i = 0; i < 4; i++) particles.push(spawn(x, y));
      if (particles.length > MAX_PARTICLES + 20) {
        particles.splice(0, particles.length - MAX_PARTICLES - 20);
      }
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onMotionChange = () => {
      if (reduced.matches) {
        stop();
        ctx.clearRect(0, 0, width, height);
      } else start();
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (!frame) draw();
    });
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });

    resize();
    draw();
    resizeObserver.observe(hero);
    intersectionObserver.observe(hero);
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    hero.addEventListener("click", onClick as EventListener);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onMotionChange);
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      hero.removeEventListener("click", onClick as EventListener);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="hero__particles" aria-hidden="true" />
  );
}
