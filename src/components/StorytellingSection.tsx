import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, User, Building2, MapPin, Mail, Phone, Sparkles, ShieldCheck, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

// Assets imports (supporting both high-res videos and image fallbacks)
import residentialVideo from "@/assets/residential.mp4";
import commercialVideo from "@/assets/commercial.mp4";
import industrialVideo from "@/assets/industrial.mp4";
import interiorVideo from "@/assets/interior.mp4";

import residentialImage from "@/assets/Residential.jpeg";
import commercialImage from "@/assets/Commercial .jpeg";
import industrialImage from "@/assets/Industrial.jpeg";
import interiorImage from "@/assets/Interior.jpeg";
import carraraBg from "@/assets/bengaluru_carrara.png";
import midnightBg from "@/assets/bengaluru_midnight_blue.png";

const verticals = [
  {
    id: "residential",
    tag: "Residential",
    title: "Low-Rise Duplexes & Villas",
    description: "Low-rise structures balancing personal living comfort with long-term capital appreciation.",
    video: residentialVideo,
    image: residentialImage,
  },
  {
    id: "commercial",
    tag: "Commercial",
    title: "High-Capacity Spaces",
    description: "Income-driven commercial buildings, hotels, and corporate offices built for scale.",
    video: commercialVideo,
    image: commercialImage,
  },
  {
    id: "industrial",
    tag: "Industrial",
    title: "High-Performance Power Shells",
    description: "Reinforced structures engineered to house heavy machinery and withstand extreme operating conditions.",
    video: industrialVideo,
    image: industrialImage,
  },
  {
    id: "interior",
    tag: "Interior",
    title: "Architecture with Intent",
    description: "Transforming building volumes into operationally efficient, highly refined environments.",
    video: interiorVideo,
    image: interiorImage,
  },
] as const;

const RevealText = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [dims, setDims] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDims = () => {
      if (!containerRef.current) return;
      setDims({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    };

    updateDims();
    // Delay slightly to allow full content load
    const timer = setTimeout(updateDims, 300);
    window.addEventListener("resize", updateDims);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateDims);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const zoom = 1.45;
  const lensSize = 230; // Increased size of the lens circle
  const halfLens = lensSize / 2;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-visible select-none py-4 cursor-none"
    >
      {/* Background Main Text */}
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-times text-center leading-[1.35] tracking-tight text-[#1A2E1A] dark:text-[#F0F0F0]">
        {children}
      </div>

      {/* Magnifying Glass Lens Overlay */}
      {isHovering && dims.width > 0 && (
        <div
          className="absolute pointer-events-none rounded-full border-2 border-[#C9952A]/70 dark:border-[#D4AF37]/70 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md"
          style={{
            width: `${lensSize}px`,
            height: `${lensSize}px`,
            left: `${mousePos.x - halfLens}px`,
            top: `${mousePos.y - halfLens}px`,
            overflow: "hidden",
            boxShadow: "0 0 35px rgba(212,175,55,0.35), inset 0 0 25px rgba(0,0,0,0.4)",
          }}
        >
          {/* Inner Text (Zoomed & Aligned to mouse position) */}
          <div
            className="absolute text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-times text-center leading-[1.35] tracking-tight text-[#1A2E1A] dark:text-[#FFFFFF]"
            style={{
              width: `${dims.width}px`,
              height: `${dims.height}px`,
              left: `${-mousePos.x * zoom + halfLens}px`,
              top: `${-mousePos.y * zoom + halfLens}px`,
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              whiteSpace: "normal",
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const StorytellingSection = () => {
  const [userRole, setUserRole] = useState<"landowner" | "builder" | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    projectType: "residential",
    specialization: "construction",
    companyName: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelection = (role: "landowner" | "builder") => {
    setUserRole(role);
    setSubmitted(false);
    // Smooth scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API registration call
    console.log("Submitting lead registration details:", { role: userRole, ...formData });
    
    setSubmitted(true);
    toast.success("Details registered. Our Bengaluru desk will verify and call you soon.");
    
    // Reset form data except fields that might be reused
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "",
      projectType: "residential",
      specialization: "construction",
      companyName: "",
    });
  };

  return (
    <section className="relative bg-background py-14 sm:py-20 md:py-24 overflow-hidden">
      {/* Premium ambient backdrop grids & blurs */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 jointlly-grid opacity-35 dark:opacity-25 pointer-events-none" />
      
      {/* Architectural Wireframe SVG Backdrop (Left & Right - Matching screenshot) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden dark:block opacity-30">
        {/* Left Building Wireframe Structure */}
        <svg
          className="absolute -left-12 bottom-0 w-[420px] h-[580px] text-[#D4AF37]/30"
          viewBox="0 0 400 600"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        >
          <line x1="40" y1="580" x2="160" y2="280" />
          <line x1="160" y1="280" x2="320" y2="340" />
          <line x1="320" y1="340" x2="200" y2="580" />
          <line x1="40" y1="580" x2="200" y2="580" />
          <line x1="40" y1="460" x2="160" y2="220" />
          <line x1="160" y1="220" x2="320" y2="280" />
          <line x1="40" y1="340" x2="160" y2="160" />
          <line x1="160" y1="160" x2="320" y2="220" />
          <line x1="160" y1="280" x2="160" y2="160" />
          <line x1="320" y1="340" x2="320" y2="220" />
          <line x1="40" y1="580" x2="40" y2="340" />
          <circle cx="160" cy="160" r="3" fill="#D4AF37" opacity="0.8" />
          <circle cx="320" cy="220" r="3" fill="#D4AF37" opacity="0.8" />
          <circle cx="160" cy="280" r="2" fill="#D4AF37" opacity="0.6" />
        </svg>

        {/* Right Building Wireframe & Glowing Node Structure */}
        <svg
          className="absolute -right-16 top-12 w-[480px] h-[640px] text-[#D4AF37]/30"
          viewBox="0 0 450 650"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        >
          <line x1="100" y1="200" x2="420" y2="120" />
          <line x1="420" y1="120" x2="380" y2="520" />
          <line x1="100" y1="200" x2="60" y2="580" />
          <line x1="60" y1="580" x2="380" y2="520" />
          <line x1="100" y1="200" x2="380" y2="520" />
          <line x1="60" y1="320" x2="380" y2="260" />
          <line x1="100" y1="360" x2="420" y2="280" />
          <circle cx="420" cy="120" r="4" fill="#D4AF37" className="animate-pulse" />
          <circle cx="100" cy="200" r="3" fill="#D4AF37" opacity="0.8" />
          <circle cx="380" cy="260" r="3.5" fill="#D4AF37" className="animate-pulse" />
        </svg>
      </div>

      <div
        className="absolute left-[-10%] top-1/4 w-[45vw] h-[45vw] opacity-15 dark:opacity-[0.05] pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(circle, #D4AF37, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute right-[-10%] bottom-1/4 w-[45vw] h-[45vw] opacity-15 dark:opacity-[0.05] pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(circle, #52b788, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* SECTION 1: The Core Value Proposition Reveal */}
        <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20">
          <RevealText>
            Developing real estate is complex. Mistrust,{" "}
            <span className="text-[#C9952A] dark:text-[#D4AF37] underline decoration-[#C9952A]/30 dark:decoration-[#D4AF37]/30 decoration-wavy decoration-2 underline-offset-4">
              delays
            </span>
            , and lack of transparency derail projects.{" "}
            <span className="text-[#C9952A] dark:text-[#D4AF37] font-extrabold">
              Jointlly
            </span>{" "}
            acts as a neutral{" "}
            <span className="text-[#C9952A] dark:text-[#D4AF37] font-semibold">
              trust layer
            </span>
            —pre-screening builders, verifying{" "}
            <span className="text-[#C9952A] dark:text-[#D4AF37] font-semibold">
              legal land records
            </span>
            , and securing{" "}
            <span className="text-[#C9952A] dark:text-[#D4AF37] font-semibold">
              contract terms
            </span>
            .
          </RevealText>

          {/* Golden Pill Emblem Divider (Matching user screenshot) */}
          <div className="flex items-center justify-center gap-3 mt-8 sm:mt-10">
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C9952A]/60 dark:via-[#D4AF37]/60 to-transparent" />
            <div className="px-2.5 py-0.5 rounded-full border border-[#C9952A]/50 dark:border-[#D4AF37]/50 bg-[#C9952A]/10 dark:bg-[#D4AF37]/10 text-[10px] font-mono font-bold text-[#C9952A] dark:text-[#D4AF37] tracking-wider uppercase">
              01
            </div>
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C9952A]/60 dark:via-[#D4AF37]/60 to-transparent" />
          </div>
        </div>

        {/* SECTION 2: Minimal Project Vertical Showcase */}
        <div className="mb-24 sm:mb-32">
          <div className="text-center mb-10 sm:mb-12">
            <h3 className="text-xl sm:text-2xl font-bold font-times text-[#0D3B21] dark:text-[#f8fcf9] mb-3">
              Verticals We Facilitate
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Facilitating robust, clean contracts across four critical real-estate construction domains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {verticals.map((v, index) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.32, 0.72, 0, 1] }}
                className="p-2 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 group transition-all duration-700 ease-spring hover:scale-[1.01]"
              >
                {/* Inner Core container (Double-Bezel architecture) */}
                <div className="h-full rounded-[calc(2.5rem-0.5rem)] relative overflow-hidden aspect-[16/10] bg-muted/10 dark:bg-muted/5 border border-border/40 dark:border-border/10 cursor-default">
                  {/* Visual Asset (Video loops with image fallback) */}
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <video
                      src={v.video}
                      poster={v.image}
                      className="w-full h-full object-cover scale-100 group-hover:scale-[1.04] transition-transform duration-1000 ease-out grayscale group-hover:grayscale-0 opacity-40 dark:opacity-30 group-hover:opacity-75 dark:group-hover:opacity-55"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                    {/* Premium overlay gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
                  </div>

                  {/* Editorial content */}
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col justify-end text-white z-10">
                    <p className="text-[#F3B24A] font-bold text-xs uppercase tracking-widest mb-1.5">
                      {v.tag}
                    </p>
                    <h4 className="font-times text-xl sm:text-2xl font-semibold mb-2">
                      {v.title}
                    </h4>
                    <p className="text-white/85 text-xs sm:text-sm leading-relaxed max-w-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-out">
                      {v.description}
                    </p>
                  </div>

                  {/* Corner glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none border border-white/20 rounded-[calc(2.5rem-0.5rem)]" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION 3: Integrated Lead Generation Hub - Double Bezel Card */}
        <div className="p-3 rounded-[3rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-2xl relative">
          
          {/* Ambient card background glow */}
          <div className="absolute -inset-4 bg-[radial-gradient(circle_at_50%_0%,rgba(243,178,74,0.06),transparent_60%)] pointer-events-none rounded-[3.5rem]" />
          
          <div ref={formRef} className="h-full rounded-[calc(3rem-0.75rem)] bg-white dark:bg-[#050b14] border border-border/60 dark:border-border/10 p-5 sm:p-14 relative overflow-hidden shadow-xl">
            {/* Background Images with premium overlays */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <img
                src={carraraBg}
                alt="Bengaluru Carrara"
                className="w-full h-full object-cover opacity-65 dark:opacity-0 transition-opacity duration-700 block dark:hidden"
              />
              <img
                src={midnightBg}
                alt="Bengaluru Midnight Blue"
                className="w-full h-full object-cover opacity-0 dark:opacity-90 transition-opacity duration-700 hidden dark:block"
              />
              {/* Premium overlay gradients (reduced transparency for high-contrast visibility) */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/97 via-white/94 to-[#FAF9F6]/98 dark:from-[#0B1A30]/75 dark:via-[#061020]/65 dark:to-[#030810]/80" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-[#1A5C35]/[0.01] to-transparent pointer-events-none z-0" />
            
            {/* Centered title section with glassmorphic backdrop panel */}
            <div className="relative z-10 text-center max-w-2xl mx-auto mb-10 sm:mb-14 bg-white/80 dark:bg-[#061020]/75 backdrop-blur-md border border-[#1A5C35]/15 dark:border-white/10 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-lg">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border/80 dark:border-border/15 bg-white/80 dark:bg-white/5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#C9952A] dark:text-[#F3B24A] mb-5 sm:mb-6 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-[#1A5C35] dark:text-[#52b788]" />
                <span>Verification Desk</span>
              </div>
              <h3 className="text-3xl sm:text-5xl font-extrabold font-times text-[#0D3B21] dark:text-white mb-4 sm:mb-5 leading-tight tracking-tight">
                Get Started with <span className="block text-[#1A5C35] dark:text-[#52b788] mt-1 sm:mt-2 text-4xl sm:text-6xl font-black">Jointlly</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#0D3B21]/90 dark:text-white/90 font-bold leading-relaxed max-w-xl mx-auto px-2">
                Select your role below to submit project specifications directly to our verification desk.
              </p>
              <div className="w-16 h-[3px] bg-[#1A5C35] dark:bg-[#52b788] mx-auto mt-8 rounded-full shadow-sm" />
            </div>

            {/* Role selection buttons - Interactive Bento Tiles (Horizontal reference design with theme colors) */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
              <button
                type="button"
                onClick={() => handleRoleSelection("landowner")}
                className={cn(
                  "relative flex items-center gap-6 p-6 sm:p-7 rounded-[2rem] border text-left transition-all duration-700 ease-spring hover:scale-[1.02] active:scale-[0.99] group/card overflow-hidden w-full",
                  userRole === "landowner"
                    ? "border-[#52b788] bg-gradient-to-br from-[#1A5C35] via-[#227041] to-[#52b788] text-white shadow-[0_20px_50px_rgba(26,92,53,0.45)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] ring-2 ring-[#52b788]/30"
                    : "border-[#1A5C35]/50 dark:border-[#52b788]/25 bg-gradient-to-br from-[#0D3B21] to-[#1A5C35] text-white/90 hover:border-[#1A5C35] hover:shadow-lg backdrop-blur-sm"
                )}
              >


                {/* Circular Icon Wrapper */}
                <div className={cn(
                  "h-14 w-14 min-w-14 rounded-full flex items-center justify-center border shadow-sm transition-all duration-500",
                  userRole === "landowner"
                    ? "bg-white/20 border-white/30 text-white"
                    : "bg-white/5 border-white/10 text-white/60"
                )}>
                  <User className="h-6 w-6" strokeWidth={2} />
                </div>

                {/* Text Content */}
                <div className="flex-1 flex flex-col items-start text-left pr-2">
                  <span className="font-extrabold text-lg text-white transition-colors duration-500">
                    I Have Land
                  </span>
                  <span className={cn(
                    "text-xs mt-1.5 font-bold leading-relaxed transition-colors duration-500",
                    userRole === "landowner" ? "text-white/90" : "text-white/60"
                  )}>
                    Verify details, discover and match with validated builders.
                  </span>
                </div>

                {/* Right Arrow Indicator */}
                <div className={cn(
                  "h-9 w-9 min-w-9 rounded-full flex items-center justify-center transition-all duration-500",
                  userRole === "landowner"
                    ? "bg-white text-[#1A5C35] shadow-md rotate-90"
                    : "bg-white/10 text-white/70 group-hover/card:bg-[#1A5C35] group-hover/card:text-white group-hover/card:translate-x-1"
                )}>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300" strokeWidth={2.5} />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelection("builder")}
                className={cn(
                  "relative flex items-center gap-6 p-6 sm:p-7 rounded-[2rem] border text-left transition-all duration-700 ease-spring hover:scale-[1.02] active:scale-[0.99] group/card overflow-hidden w-full",
                  userRole === "builder"
                    ? "border-[#F3B24A] bg-gradient-to-br from-[#9a7228] via-[#C9952A] to-[#F3B24A] text-white shadow-[0_20px_50px_rgba(201,149,42,0.45)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] ring-2 ring-[#F3B24A]/30"
                    : "border-[#C9952A]/50 dark:border-[#F3B24A]/25 bg-gradient-to-br from-[#805e1a] to-[#a87c22] text-white/90 hover:border-[#C9952A] hover:shadow-lg backdrop-blur-sm"
                )}
              >


                {/* Circular Icon Wrapper */}
                <div className={cn(
                  "h-14 w-14 min-w-14 rounded-full flex items-center justify-center border shadow-sm transition-all duration-500",
                  userRole === "builder"
                    ? "bg-white/20 border-white/30 text-white"
                    : "bg-white/5 border-white/10 text-white/60"
                )}>
                  <Building2 className="h-6 w-6" strokeWidth={2} />
                </div>

                {/* Text Content */}
                <div className="flex-1 flex flex-col items-start text-left pr-2">
                  <span className="font-extrabold text-lg text-white transition-colors duration-500">
                    I Build &amp; Design
                  </span>
                  <span className={cn(
                    "text-xs mt-1.5 font-bold leading-relaxed transition-colors duration-500",
                    userRole === "builder" ? "text-white/90" : "text-white/60"
                  )}>
                    Showcase builder profile, bid on construction or JVs.
                  </span>
                </div>

                {/* Right Arrow Indicator */}
                <div className={cn(
                  "h-9 w-9 min-w-9 rounded-full flex items-center justify-center transition-all duration-500",
                  userRole === "builder"
                    ? "bg-white text-[#C9952A] shadow-md rotate-90"
                    : "bg-white/10 text-white/70 group-hover/card:bg-[#C9952A] group-hover/card:text-white group-hover/card:translate-x-1"
                )}>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300" strokeWidth={2.5} />
                </div>
              </button>
            </div>

            {/* Form Area */}
            <AnimatePresence mode="wait">
              {userRole && (
                <motion.div
                  key={userRole}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  className="overflow-hidden relative z-10"
                >
                  {submitted ? (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center text-center py-8 px-4"
                    >
                      <CheckCircle2 className="h-12 w-12 text-[#1A5C35] dark:text-[#52b788] mb-4 animate-bounce" />
                      <h4 className="font-times text-2xl font-semibold text-[#0D3B21] dark:text-white mb-2">
                        Details Submitted Successfully
                      </h4>
                      <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                        Thank you. Our Jointlly Bengaluru verification desk will reach out to you within 24 hours at the contact details provided to match you with opportunities.
                      </p>
                    </motion.div>
                  ) : (
                    <form 
                      onSubmit={handleSubmit} 
                      className="max-w-2xl mx-auto space-y-6 p-6 sm:p-8 rounded-[2rem] bg-white/95 dark:bg-[#061020]/90 backdrop-blur-md border border-[#1A5C35]/15 dark:border-white/10 shadow-xl mt-6 relative z-10"
                    >
                      <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#1A5C35] dark:text-[#F3B24A] mb-4 font-times text-center border-b border-[#1A5C35]/10 dark:border-white/10 pb-3">
                        {userRole === "landowner" ? "Landowner Project Specifications" : "Builder Profile Specifications"}
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D3B21]/90 dark:text-white/90">Contact Name</label>
                          <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            className="w-full text-sm px-4 py-3 rounded-xl border border-[#1A5C35]/30 dark:border-white/20 bg-[#fafafa] dark:bg-[#040a14] text-[#0D3B21] dark:text-white placeholder-[#0D3B21]/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#1A5C35]/30 dark:focus:ring-[#52b788]/30 focus:border-[#1A5C35] dark:focus:border-[#52b788] transition-all duration-300 shadow-inner"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D3B21]/90 dark:text-white/90">
                            {userRole === "landowner" ? "Property Location" : "Business Location"}
                          </label>
                          <input
                            required
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="e.g. Indiranagar, Bengaluru"
                            className="w-full text-sm px-4 py-3 rounded-xl border border-[#1A5C35]/30 dark:border-white/20 bg-[#fafafa] dark:bg-[#040a14] text-[#0D3B21] dark:text-white placeholder-[#0D3B21]/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#1A5C35]/30 dark:focus:ring-[#52b788]/30 focus:border-[#1A5C35] dark:focus:border-[#52b788] transition-all duration-300 shadow-inner"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D3B21]/90 dark:text-white/90">Email Address</label>
                          <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="e.g. name@email.com"
                            className="w-full text-sm px-4 py-3 rounded-xl border border-[#1A5C35]/30 dark:border-white/20 bg-[#fafafa] dark:bg-[#040a14] text-[#0D3B21] dark:text-white placeholder-[#0D3B21]/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#1A5C35]/30 dark:focus:ring-[#52b788]/30 focus:border-[#1A5C35] dark:focus:border-[#52b788] transition-all duration-300 shadow-inner"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D3B21]/90 dark:text-white/90">Phone Number</label>
                          <input
                            required
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="e.g. +91 98765 43210"
                            className="w-full text-sm px-4 py-3 rounded-xl border border-[#1A5C35]/30 dark:border-white/20 bg-[#fafafa] dark:bg-[#040a14] text-[#0D3B21] dark:text-white placeholder-[#0D3B21]/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#1A5C35]/30 dark:focus:ring-[#52b788]/30 focus:border-[#1A5C35] dark:focus:border-[#52b788] transition-all duration-300 shadow-inner"
                          />
                        </div>
                      </div>

                      {userRole === "landowner" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D3B21]/90 dark:text-white/90">Intended Project Type</label>
                            <select
                              name="projectType"
                              value={formData.projectType}
                              onChange={handleInputChange}
                              className="w-full text-sm px-4 py-3 rounded-xl border border-[#1A5C35]/30 dark:border-white/20 bg-[#fafafa] dark:bg-[#040a14] text-[#0D3B21] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1A5C35]/30 dark:focus:ring-[#52b788]/30 focus:border-[#1A5C35] dark:focus:border-[#52b788] transition-all duration-300 shadow-inner"
                            >
                              <option value="residential">Residential Construction (Villas, Duplexes)</option>
                              <option value="commercial">Commercial Construction (Offices, Hotels)</option>
                              <option value="industrial">Industrial Shells (Warehouses, Factories)</option>
                              <option value="interior">Interior Design / Architecture</option>
                              <option value="reconstruction">Reconstruction / Joint Venture</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D3B21]/90 dark:text-white/90">Company Name</label>
                            <input
                              required
                              type="text"
                              name="companyName"
                              value={formData.companyName}
                              onChange={handleInputChange}
                              placeholder="Enter business name"
                              className="w-full text-sm px-4 py-3 rounded-xl border border-[#1A5C35]/30 dark:border-white/20 bg-[#fafafa] dark:bg-[#040a14] text-[#0D3B21] dark:text-white placeholder-[#0D3B21]/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#1A5C35]/30 dark:focus:ring-[#52b788]/30 focus:border-[#1A5C35] dark:focus:border-[#52b788] transition-all duration-300 shadow-inner"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D3B21]/90 dark:text-white/90">Core Specialization</label>
                            <select
                              name="specialization"
                              value={formData.specialization}
                              onChange={handleInputChange}
                              className="w-full text-sm px-4 py-3 rounded-xl border border-[#1A5C35]/30 dark:border-white/20 bg-[#fafafa] dark:bg-[#040a14] text-[#0D3B21] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1A5C35]/30 dark:focus:ring-[#52b788]/30 focus:border-[#1A5C35] dark:focus:border-[#52b788] transition-all duration-300 shadow-inner"
                            >
                              <option value="construction">Contract Construction</option>
                              <option value="joint-venture">Joint Ventures (JV Partners)</option>
                              <option value="interior">Interior Architecture & Design</option>
                              <option value="renovation">Reconstruction & Structural Repair</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Primary Button with nested Island Icon (Button-in-Button architecture) */}
                      <motion.button
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        type="submit"
                        className="w-full inline-flex items-center justify-between rounded-full bg-gradient-to-r from-[#1A5C35] to-[#0D3B21] hover:from-[#217041] hover:to-[#0f4728] pl-6 pr-2 py-2 text-sm font-bold text-white shadow-lg transition-colors mt-3"
                      >
                        <span className="font-sans tracking-wide">Submit Specifications</span>
                        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                        </div>
                      </motion.button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trust badge footer */}
            <div className="flex justify-center mt-10 pt-6 border-t border-border/30 dark:border-white/10 relative z-10">
              <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-6 py-2.5 rounded-full border border-border/80 dark:border-border/15 bg-white/85 dark:bg-white/5 backdrop-blur-md shadow-sm text-[11px] font-bold text-[#0D3B21]/80 dark:text-white/80">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#1A5C35] dark:text-[#52b788]" strokeWidth={2} />
                  <span>Secure</span>
                </div>
                <div className="h-4 w-px bg-border/80 dark:bg-border/15 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#C9952A] dark:text-[#F3B24A]" strokeWidth={2} />
                  <span>Verified</span>
                </div>
                <div className="h-4 w-px bg-border/80 dark:bg-border/15 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                  <span>Transparent</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default StorytellingSection;
