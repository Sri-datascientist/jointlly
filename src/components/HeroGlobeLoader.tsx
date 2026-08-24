import { cn } from "@/lib/utils";

type HeroGlobeLoaderProps = {
  className?: string;
};

/**
 * Creative circular loader shown while the hero 3D globe (WebGL + GLB) loads.
 */
export function HeroGlobeLoader({ className }: HeroGlobeLoaderProps) {
  return (
    <div
      className={cn("hero-globe-loader", className)}
      role="status"
      aria-label="Loading 3D globe"
      aria-live="polite"
    >
      <div className="hero-globe-loader__halo" />
      <div className="hero-globe-loader__halo hero-globe-loader__halo--delayed" />

      <svg
        className="hero-globe-loader__wireframe"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle className="hero-globe-loader__equator" cx="100" cy="100" r="78" />
        <ellipse className="hero-globe-loader__meridian hero-globe-loader__meridian--a" cx="100" cy="100" rx="78" ry="78" />
        <ellipse className="hero-globe-loader__meridian hero-globe-loader__meridian--b" cx="100" cy="100" rx="78" ry="42" />
        <ellipse className="hero-globe-loader__meridian hero-globe-loader__meridian--c" cx="100" cy="100" rx="42" ry="78" />
        <ellipse className="hero-globe-loader__meridian hero-globe-loader__meridian--d" cx="100" cy="100" rx="78" ry="58" />
      </svg>

      <div className="hero-globe-loader__core">
        <div className="hero-globe-loader__core-inner" />
        <div className="hero-globe-loader__core-shine" />
      </div>

      <div className="hero-globe-loader__orbit hero-globe-loader__orbit--1">
        <span className="hero-globe-loader__node" />
      </div>
      <div className="hero-globe-loader__orbit hero-globe-loader__orbit--2">
        <span className="hero-globe-loader__node hero-globe-loader__node--gold" />
      </div>
      <div className="hero-globe-loader__orbit hero-globe-loader__orbit--3">
        <span className="hero-globe-loader__node hero-globe-loader__node--small" />
      </div>

      <div className="hero-globe-loader__scan" />

      <div className="hero-globe-loader__nodes" aria-hidden>
        {[
          { top: "18%", left: "62%", delay: "0s" },
          { top: "72%", left: "22%", delay: "0.4s" },
          { top: "44%", left: "84%", delay: "0.8s" },
          { top: "58%", left: "12%", delay: "1.1s" },
          { top: "28%", left: "28%", delay: "0.6s" },
        ].map((dot) => (
          <span
            key={`${dot.top}-${dot.left}`}
            className="hero-globe-loader__pin"
            style={{ top: dot.top, left: dot.left, animationDelay: dot.delay }}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroGlobeLoader;
