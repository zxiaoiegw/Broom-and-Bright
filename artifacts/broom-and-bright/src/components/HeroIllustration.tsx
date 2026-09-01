import { useEffect, useRef } from 'react';
import { HERO_ILLUSTRATION_SVG } from '@/components/heroIllustrationSvg';

/**
 * Depth per SVG group. Wall / windows barely move; the cleaners, bucket, sign
 * and bubbles up front travel further, so the scene separates under the cursor.
 */
const DEPTH: Record<string, number> = {
  'freepik--background-simple--inject-36': 0.03,
  'freepik--Windows--inject-36': 0.05,
  'freepik--Pictures--inject-36': 0.05,
  'freepik--Floor--inject-36': 0.06,
  'freepik--file-cabinet--inject-36': 0.09,
  'freepik--table-2--inject-36': 0.11,
  'freepik--table-1--inject-36': 0.11,
  'freepik--Plant--inject-36': 0.17,
  'freepik--character-2--inject-36': 0.18,
  'freepik--character-1--inject-36': 0.27,
  'freepik--Bucket--inject-36': 0.36,
  'freepik--Sign--inject-36': 0.33,
  'freepik--bubbles': 0.6,
};

const MAX = 46;

export function HeroIllustration({ className = '' }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const svg = host.querySelector<SVGSVGElement>('#hero-illustration');
    if (!svg) return;

    const groups = Array.from(svg.children).filter(
      (n): n is SVGGElement => n.tagName.toLowerCase() === 'g',
    );
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const surface: HTMLElement = host.closest('section') ?? host;

    const apply = (nx: number, ny: number) => {
      for (const g of groups) {
        const d = DEPTH[g.id] ?? 0.1;
        g.style.transform = `translate(${(nx * MAX * d).toFixed(2)}px, ${(
          ny * MAX * d
        ).toFixed(2)}px)`;
      }
    };

    const onMove = (event: Event) => {
      const e = event as PointerEvent;
      if (reduce.matches || e.pointerType === 'touch') return;
      const r = svg.getBoundingClientRect();
      let nx = (e.clientX - (r.left + r.width / 2)) / r.width;
      let ny = (e.clientY - (r.top + r.height / 2)) / r.height;
      nx = Math.max(-0.6, Math.min(0.6, nx));
      ny = Math.max(-0.6, Math.min(0.6, ny));
      apply(nx, ny);
    };
    const onLeave = () => apply(0, 0);

    surface.addEventListener('pointermove', onMove);
    surface.addEventListener('pointerleave', onLeave);
    return () => {
      surface.removeEventListener('pointermove', onMove);
      surface.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: HERO_ILLUSTRATION_SVG }}
    />
  );
}
