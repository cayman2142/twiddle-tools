import { useEffect, useLayoutEffect, useState, type RefObject } from 'react';

/** Whether the element is at least `min` px wide; null before the first measure. */
export function useWideEnough(ref: RefObject<HTMLElement | null>, min: number): boolean | null {
  const [wide, setWide] = useState<boolean | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWide(el.getBoundingClientRect().width >= min);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, min]);
  return wide;
}

/** Latches true the first time the element comes within `margin` of the viewport. */
export function useNearViewport(ref: RefObject<HTMLElement | null>, margin = '200px'): boolean {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNear(true);
      },
      { rootMargin: margin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, margin, near]);
  return near;
}

export function useReducedMotion(): boolean {
  const [reduced] = useState(
    () => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  return reduced;
}
