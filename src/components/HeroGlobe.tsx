import { useEffect, useRef, useState } from "react";
import ThreeDModelViewer from "./ThreeDModelViewer";

const MODEL_VIEWER_ID = "hero-3d-globe";
const HERO_GLOBE_SRC = "/models/hero-globe.glb";
const HERO_GLOBE_INITIAL_ORBIT = "38deg 72deg 105%";
const HERO_GLOBE_INITIAL_TURNTABLE_DEG = 180;

/**
 * Hero 3D globe — defers WebGL + 23MB GLB until after first paint / idle.
 */
const HeroGlobe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    const begin = () => {
      if (!cancelled) setShouldLoad(true);
    };

    const idleHandle =
      typeof requestIdleCallback !== "undefined"
        ? requestIdleCallback(begin, { timeout: 1500 })
        : window.setTimeout(begin, 400);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) begin();
      },
      { rootMargin: "80px" },
    );
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (typeof cancelIdleCallback !== "undefined") {
        cancelIdleCallback(idleHandle as number);
      } else {
        clearTimeout(idleHandle as number);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-globe h-full w-full overflow-hidden rounded-full">
      <ThreeDModelViewer
        id={MODEL_VIEWER_ID}
        src={HERO_GLOBE_SRC}
        alt="3D globe"
        className="h-full w-full"
        transparent
        rotateOnly
        loadWhen={shouldLoad}
        initialCameraOrbit={HERO_GLOBE_INITIAL_ORBIT}
        initialTurntableRotationDeg={HERO_GLOBE_INITIAL_TURNTABLE_DEG}
      />
    </div>
  );
};

export default HeroGlobe;
