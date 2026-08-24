import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { HeroGlobeLoader } from "@/components/HeroGlobeLoader";
import { loadModelViewer } from "@/lib/loadModelViewer";

type ThreeDModelViewerProps = {
  src: string;
  alt?: string;
  className?: string;
  transparent?: boolean;
  id?: string;
  rotateOnly?: boolean;
  initialCameraOrbit?: string;
  initialTurntableRotationDeg?: number;
  /** When false, defer fetching the GLB until true (saves bandwidth on first paint). */
  loadWhen?: boolean;
};

type ModelViewerElement = HTMLElement & {
  cameraOrbit?: string;
  minCameraOrbit?: string;
  maxCameraOrbit?: string;
  jumpCameraToGoal?: () => void;
  resetTurntableRotation?: (theta?: number) => void;
};

function rotateOnlyOrbitBounds(initialOrbit: string): { min: string; max: string } {
  const parts = initialOrbit.trim().split(/\s+/);
  const phi = parts[1] ?? "72deg";
  const radius = parts[2] ?? "105%";
  const locked = `auto ${phi} ${radius}`;
  return { min: locked, max: locked };
}

const ThreeDModelViewer = ({
  src,
  alt,
  className,
  transparent,
  id,
  rotateOnly = false,
  initialCameraOrbit,
  initialTurntableRotationDeg,
  loadWhen = true,
}: ThreeDModelViewerProps) => {
  const orbitBounds =
    rotateOnly && initialCameraOrbit ? rotateOnlyOrbitBounds(initialCameraOrbit) : null;

  const [viewerReady, setViewerReady] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);

  useEffect(() => {
    if (!loadWhen) return;
    let cancelled = false;
    loadModelViewer().then(() => {
      if (!cancelled) setViewerReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [loadWhen]);

  useEffect(() => {
    if (!id || !viewerReady || !loadWhen) return;
    if (!initialCameraOrbit && initialTurntableRotationDeg == null) return;

    const bounds =
      rotateOnly && initialCameraOrbit ? rotateOnlyOrbitBounds(initialCameraOrbit) : null;

    const applyInitialView = () => {
      const el = document.getElementById(id) as ModelViewerElement | null;
      if (!el) return;
      if (initialCameraOrbit) {
        el.cameraOrbit = initialCameraOrbit;
        if (bounds) {
          el.minCameraOrbit = bounds.min;
          el.maxCameraOrbit = bounds.max;
        }
      }
      if (initialTurntableRotationDeg != null) {
        el.resetTurntableRotation?.((initialTurntableRotationDeg * Math.PI) / 180);
      }
      el.jumpCameraToGoal?.();
    };

    const el = document.getElementById(id) as ModelViewerElement | null;
    if (!el) return;

    const onLoad = () => {
      setModelLoaded(true);
      applyInitialView();
    };

    el.addEventListener("load", onLoad);
    el.addEventListener("error", () => setModelLoaded(true));
    applyInitialView();

    return () => {
      el.removeEventListener("load", onLoad);
    };
  }, [id, initialCameraOrbit, initialTurntableRotationDeg, rotateOnly, viewerReady, loadWhen]);

  const [loaderVisible, setLoaderVisible] = useState(true);

  useEffect(() => {
    if (!modelLoaded) {
      setLoaderVisible(true);
      return;
    }
    const timer = window.setTimeout(() => setLoaderVisible(false), 450);
    return () => window.clearTimeout(timer);
  }, [modelLoaded]);

  const isLoading = !loadWhen || !viewerReady || !modelLoaded;
  const showLoader = isLoading || loaderVisible;

  return (
    <div className={cn("relative h-full w-full", className)}>
      {showLoader ? (
        <div
          className={cn(
            "absolute inset-0 z-10 flex items-center justify-center rounded-full transition-opacity duration-500 ease-out",
            modelLoaded ? "pointer-events-none opacity-0" : "opacity-100",
          )}
          aria-hidden={modelLoaded}
        >
          <HeroGlobeLoader className="h-[92%] w-[92%]" />
        </div>
      ) : null}

      {viewerReady && loadWhen ? (
        <model-viewer
          id={id}
          src={src}
          alt={alt}
          class={cn("h-full w-full", modelLoaded ? "opacity-100" : "opacity-0")}
          loading="lazy"
          reveal="auto"
          camera-controls
          auto-rotate={!reduceMotion}
          {...(initialCameraOrbit && { "camera-orbit": initialCameraOrbit })}
          {...(rotateOnly && {
            "disable-pan": true,
            "disable-zoom": true,
            "min-camera-orbit": orbitBounds?.min ?? "auto 72deg 105%",
            "max-camera-orbit": orbitBounds?.max ?? "auto 72deg 105%",
            "interaction-prompt": "none",
          })}
          exposure="1"
          shadow-intensity={isMobile ? "0" : "0.35"}
          shadow-softness="0.8"
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            transition: "opacity 0.4s ease",
            touchAction: rotateOnly ? "none" : undefined,
            ...(transparent && { backgroundColor: "transparent" }),
          }}
        />
      ) : null}
    </div>
  );
};

export default ThreeDModelViewer;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        alt?: string;
        loading?: "auto" | "lazy" | "eager";
        reveal?: "auto" | "interaction" | "manual";
        "camera-controls"?: boolean;
        "auto-rotate"?: boolean;
        "camera-orbit"?: string;
        "disable-pan"?: boolean;
        "disable-zoom"?: boolean;
        "min-camera-orbit"?: string;
        "max-camera-orbit"?: string;
        "interaction-prompt"?: "auto" | "none";
        exposure?: string;
        "shadow-intensity"?: string;
        "shadow-softness"?: string;
        class?: string;
      };
    }
  }
}
