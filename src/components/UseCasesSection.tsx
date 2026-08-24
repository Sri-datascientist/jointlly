import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import residentialImage from "@/assets/Whisk_a135ddc32c118f79e3d48919eebd2e60dr.png";
import commercialImage from "@/assets/Whisk_aa9a318247185209de14cb316c79dfb7dr.png";
import industrialImage from "@/assets/Whisk_2ea788f2abc7f0d9921482f04b888b05dr.png";
import interiorImage from "@/assets/Whisk_c308816b1f9ae84b40d45d8f627acc50dr.png";
import { getUseCaseTheme, type UseCaseId } from "./cardThemes";
import { cn } from "@/lib/utils";

const useCases = [
  {
    id: "residential",
    title: "Residential Project",
    subtitle: "Duplex House",
    image: residentialImage,
    icon: "🏠",
    tag: "Residential Construction",
    highlight: "Residential",
    strapline:
      "Residential construction focuses on developing low rise structures like villas and duplexes that are designed for both everyday living and wealth creation.",
    bullets: [
      "Privately owned 2–3 storey structures like duplexes, villas, or low rise apartments.",
      "Designed for family living or rental income with strategic land utility.",
    ],
  },
  {
    id: "commercial",
    title: "Commercial Project",
    subtitle: "Multi-storey Office",
    image: commercialImage,
    icon: "🏢",
    tag: "Commercial Construction",
    highlight: "Commercial",
    strapline:
      "Commercial construction focuses on creating high capacity spaces like office hubs, hotels, and specialized rental complexes that serve businesses and communities.",
    bullets: [
      "Expertly engineered non residential structures built to stricter regulations.",
      "Office towers, hotels, school campuses, and PG buildings at scale.",
    ],
  },
  {
    id: "industrial",
    title: "Industrial Project",
    subtitle: "Modern Factory",
    image: industrialImage,
    icon: "🏭",
    tag: "Industrial Construction",
    highlight: "Industrial",
    strapline:
      "In industrial construction, each structure is engineered as a high performance power shell that protects massive machinery and supports extreme operating conditions.",
    bullets: [
      "Reinforced foundations and massive steel frames for high volume operations.",
      "Built for heavy machinery and intense production demands.",
    ],
  },
  {
    id: "interior",
    title: "Interior Design",
    subtitle: "Luxury Residential",
    image: interiorImage,
    icon: "✨",
    tag: "Interior Architecture / Designer",
    highlight: "Interior",
    strapline:
      "Interior Architecture is the strategic process of turning a building's internal volume into a space that is both operationally efficient and visually refined.",
    bullets: [
      "Blends structural knowledge with modern aesthetics.",
      "Optimizes spatial flow, materials, and detailing for usable beauty.",
    ],
  },
] as const;

const PRODUCT_PATHS: Record<UseCaseId, string> = {
  residential: "/products/residential",
  commercial: "/products/commercial",
  industrial: "/products/industrial",
  interior: "/products/interior",
};

type UseCase = (typeof useCases)[number];

const UseCaseDetailContent = ({
  useCase,
  showBullets = true,
}: {
  useCase: UseCase;
  showBullets?: boolean;
}) => {
  const id = useCase.id as UseCaseId;

  return (
    <>
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-3xl sm:text-4xl leading-none drop-shadow-md">{useCase.icon}</span>
        <span className="font-westack text-2xl sm:text-3xl font-semibold text-white drop-shadow-md">
          {useCase.highlight}
        </span>
      </div>
      <p className="text-sm sm:text-base leading-relaxed text-white/95 drop-shadow-sm">
        {useCase.strapline}
      </p>
      <p className="mt-2.5 text-sm sm:text-base font-medium text-white/80 drop-shadow-sm">
        {useCase.subtitle}
      </p>
      {showBullets && (
        <ul className="mt-4 space-y-2">
          {useCase.bullets.map((bullet) => (
            <li
              key={bullet}
              className="text-sm sm:text-base text-white/90 leading-snug flex gap-2.5 drop-shadow-sm"
            >
              <span className="text-[#52b788] shrink-0 font-bold">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
      <Link
        to={PRODUCT_PATHS[id]}
        className="mt-5 inline-flex items-center text-sm sm:text-base font-semibold text-white hover:text-[#b8f0d0] underline-offset-4 hover:underline drop-shadow-sm"
      >
        Explore {useCase.highlight} →
      </Link>
    </>
  );
};

/** Partial bottom scrim — darkens lower area for text without covering the full image */
function UseCaseImageScrim({ strong = false }: { strong?: boolean }) {
  return (
    <>
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 pointer-events-none",
          strong ? "h-[72%]" : "h-[58%]",
          "bg-gradient-to-t from-black/95 via-black/70 to-transparent",
        )}
      />
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/10 pointer-events-none" />
    </>
  );
}

/** Desktop: horizontal hover-expand accordion */
const UseCaseAccordionPanel = ({
  useCase,
  index,
  isWide,
  anyActive,
  onHover,
  onLeave,
}: {
  useCase: UseCase;
  index: number;
  isWide: boolean;
  anyActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}) => {
  const id = useCase.id as UseCaseId;
  const theme = getUseCaseTheme(id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      viewport={{ once: true, margin: "-40px" }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={cn(
        "relative min-w-[4.5rem] basis-0 rounded-2xl overflow-hidden cursor-pointer",
        "transition-[flex-grow] duration-500 ease-out will-change-[flex-grow]",
        isWide ? "grow-[6]" : anyActive ? "grow-[0.4]" : "grow",
      )}
      style={{ minHeight: "100%" }}
    >
      <img
        src={useCase.image}
        alt={useCase.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500 pointer-events-none",
          theme.accentGradientClassName,
          isWide ? "opacity-25" : "opacity-15",
        )}
      />
      <UseCaseImageScrim strong={isWide} />

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end p-3 transition-opacity duration-300",
          isWide ? "opacity-0 pointer-events-none" : "opacity-100",
        )}
      >
        <span className="text-2xl leading-none mb-1.5 drop-shadow-md">{useCase.icon}</span>
        <span className="font-westack text-sm font-semibold text-white text-center leading-tight drop-shadow-md">
          {useCase.highlight}
        </span>
      </div>

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-5 md:p-7 lg:p-8 transition-all duration-400",
          isWide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
        )}
      >
        <UseCaseDetailContent useCase={useCase} />
      </div>
    </motion.div>
  );
};

/** Mobile: small strips on the left, large detail panel on the right */
const MobileUseCaseGallery = ({
  selectedIndex,
  onSelect,
}: {
  selectedIndex: number;
  onSelect: (index: number) => void;
}) => {
  const selected = useCases[selectedIndex];
  const theme = getUseCaseTheme(selected.id as UseCaseId);

  return (
    <div className="flex h-[min(70vh,480px)] gap-2 w-full">
      <div className="flex flex-col gap-2 w-[26%] min-w-[4.5rem] shrink-0">
        {useCases.map((useCase, index) => {
          const isSelected = selectedIndex === index;
          return (
            <button
              key={useCase.id}
              type="button"
              aria-label={useCase.highlight}
              aria-pressed={isSelected}
              onClick={() => onSelect(index)}
              className={cn(
                "relative flex-1 min-h-0 rounded-xl overflow-hidden transition-all duration-300",
                isSelected
                  ? "ring-2 ring-[#52b788] ring-offset-2 ring-offset-background scale-[1.02]"
                  : "opacity-85",
              )}
            >
              <img
                src={useCase.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-1 z-10">
                <span className="text-xl leading-none drop-shadow-md">{useCase.icon}</span>
                <span
                  className={cn(
                    "font-westack text-[11px] font-semibold text-white text-center leading-tight line-clamp-2 drop-shadow-md",
                    !isSelected && "hidden",
                  )}
                >
                  {useCase.highlight}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="relative flex-1 min-w-0 rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={selected.image}
              alt={selected.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className={cn(
                "absolute inset-0 opacity-20 pointer-events-none",
                theme.accentGradientClassName,
              )}
            />
            <UseCaseImageScrim strong />
            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-5 sm:p-6">
              <UseCaseDetailContent useCase={selected} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const UseCasesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileSelectedIndex, setMobileSelectedIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  const anyActive = hoveredIndex !== null;

  return (
    <section
      ref={containerRef}
      className="relative bg-background flex flex-col items-center py-10 sm:py-12 md:py-16 overflow-hidden"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 jointlly-grid opacity-40" />

      <motion.div
        className="relative z-20 text-center px-4 sm:px-6 mb-6 sm:mb-8 md:mb-12"
        style={{ opacity }}
      >
        <div className="mb-5 flex justify-center">
          <Link
            to="/auth"
            state={{ userType: "landowner", authMode: "login" }}
            className="font-times inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#52b788] px-10 py-4 text-2xl sm:text-3xl md:text-4xl font-normal tracking-[0.06em] text-white shadow-sm transition hover:bg-[#45a377]"
          >
            Property Owner
          </Link>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
          <span className="text-gradient-primary">One Platform,</span>
          <br />
          <span className="text-foreground">Every Project Type</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          Explore residential, commercial, industrial, and interior projects all from one place.
        </p>
      </motion.div>

      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6">
        {/* Mobile: master-detail layout */}
        <div className="lg:hidden">
          <MobileUseCaseGallery
            selectedIndex={mobileSelectedIndex}
            onSelect={setMobileSelectedIndex}
          />
        </div>

        {/* Desktop: hover-expand accordion */}
        <div
          className="hidden lg:flex h-[min(72vh,560px)] gap-3 w-full"
          role="list"
        >
          {useCases.map((useCase, index) => (
            <UseCaseAccordionPanel
              key={useCase.id}
              useCase={useCase}
              index={index}
              isWide={hoveredIndex === index}
              anyActive={anyActive}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
