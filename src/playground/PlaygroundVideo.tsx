import { useEffect, useRef } from 'react';
import { Monitor } from 'lucide-react';
import { StageFrame } from '../app/StageFrame';
import { useReducedMotion } from './hooks';

/* Extensions do not run on phones, and the engine's panel needs ~880px. This is
 * a recording of the same playground (scripts/record-playground.mjs). */
export function PlaygroundVideo() {
  const still = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // React does not reflect `muted` as an attribute; iOS will not autoplay without it.
    video.muted = true;
    if (!still) void video.play().catch(() => {});
  }, [still]);

  return (
    <>
      <StageFrame url="forge.dev/login" className="scene-stage--video">
        <video
          ref={ref}
          className="playground-video"
          poster="/playground/demo-poster.webp"
          muted
          loop
          playsInline
          autoPlay={!still}
          controls={still}
          preload="metadata"
          aria-label="twiddle editing a sample sign-in page: recolouring the card, rewriting the title, copying the changes"
        >
          <source src="/playground/demo.webm" type="video/webm" />
          <source src="/playground/demo.mp4" type="video/mp4" />
        </video>
      </StageFrame>
      <p className="playground-note">
        <Monitor size={16} strokeWidth={2} aria-hidden="true" />
        twiddle runs in Chrome on your computer. Open this page there to try it yourself.
      </p>
    </>
  );
}
