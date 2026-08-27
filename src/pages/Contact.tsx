import { type FormEvent, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Linkedin,
  Facebook,
  Instagram,
  Send,
  Building2,
  ArrowUpRight,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const OFFICE_ADDRESS = "Banshankri, Bengaluru, Karnataka, India";
const MAP_QUERY = "Banashankari,Bengaluru,Karnataka,India";
const MAP_EMBED_SRC = `https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&hl=en&z=14&output=embed`;
const MAP_EXTERNAL_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;
const CONTACT_EMAIL = "sales@jointlly.com";
const CONTACT_PHONE = "+91 9611268009";
const CONTACT_PHONE_HREF = "tel:+919611268009";

const contactMethods = [
  {
    icon: Mail,
    label: "Email us",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    hint: "Reply within one business day",
    accent: "from-[#1A5C35] to-[#0D3B21]",
  },
  {
    icon: Phone,
    label: "Call us",
    value: CONTACT_PHONE,
    href: CONTACT_PHONE_HREF,
    hint: "Mon–Sat · 9 AM – 6 PM IST",
    accent: "from-[#C9952A] to-[#8a6420]",
  },
  {
    icon: MapPin,
    label: "Visit us",
    value: OFFICE_ADDRESS,
    href: MAP_EXTERNAL_HREF,
    hint: "Banashankari, Bengaluru",
    accent: "from-[#52b788] to-[#1A5C35]",
    external: true,
  },
];

const ContactMethodCard = ({
  method,
  index,
}: {
  method: (typeof contactMethods)[0];
  index: number;
}) => {
  const Icon = method.icon;
  return (
    <motion.a
      href={method.href}
      target={method.external ? "_blank" : undefined}
      rel={method.external ? "noopener noreferrer" : undefined}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.32, 0.72, 0, 1] }}
      viewport={{ once: true }}
      className="p-1.5 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 group transition-all duration-700 ease-spring hover:scale-[1.01]"
    >
      <div className="h-full rounded-[calc(2rem-0.375rem)] bg-white dark:bg-[#071f12] border border-border/40 dark:border-border/10 overflow-hidden flex items-center shadow-soft relative">
        <div
          className={cn(
            "flex w-16 sm:w-20 shrink-0 h-full min-h-[100px] items-center justify-center bg-gradient-to-br",
            method.accent
          )}
        >
          <Icon className="h-5 w-5 text-white drop-shadow-sm" strokeWidth={1.5} />
        </div>
        <div className="flex flex-1 items-center justify-between gap-3 p-5 min-w-0">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A5C35]/80">
              {method.label}
            </p>
            <p className="mt-1 font-semibold text-[#0D3B21] dark:text-white text-sm sm:text-base leading-snug break-words">
              {method.value}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{method.hint}</p>
          </div>
          <ArrowUpRight
            className="h-5 w-5 shrink-0 text-[#1A5C35]/35 transition-all group-hover:text-[#1A5C35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.5}
          />
        </div>
      </div>
    </motion.a>
  );
};

const OfficeMap = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "p-1.5 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-soft",
      className
    )}
  >
    <div className="h-full rounded-[calc(2rem-0.375rem)] bg-white dark:bg-[#071f12] border border-border/40 dark:border-border/10 overflow-hidden flex flex-col justify-between">
      <div className="relative min-h-[220px] flex-grow w-full bg-[#e8f5ec]">
        <iframe
          title="Jointlly office — Banashankari, Bengaluru"
          src={MAP_EMBED_SRC}
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[calc(2rem-0.375rem)]" />
      </div>

      <div className="relative border-t border-border/40 bg-gradient-to-r from-[#FAF9F6] to-white dark:from-[#071f12] dark:to-[#092214] px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1A5C35] to-[#0D3B21] shadow-md">
            <MapPin className="h-5 w-5 text-white" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="font-times text-base font-bold text-[#0D3B21] dark:text-white">Our office</p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{OFFICE_ADDRESS}</p>
          </div>
        </div>
        
        {/* Button-in-button */}
        <a
          href={MAP_EXTERNAL_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-between rounded-full bg-gradient-to-r from-[#1A5C35] to-[#0D3B21] pl-5 pr-1.5 py-1.5 text-xs font-bold text-white shadow-md transition-colors"
        >
          <span className="pr-4 font-sans tracking-wide">Open in Maps</span>
          <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
          </div>
        </a>
      </div>
    </div>
  </div>
);

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("general");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const topicLabel =
      topic === "support"
        ? "Support"
        : topic === "landowner"
          ? "Landowner"
          : topic === "builder"
            ? "Builder"
            : "General inquiry";
    const subject = encodeURIComponent(`Jointlly contact — ${topicLabel}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D3B21]/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 jointlly-grid opacity-25 pointer-events-none" />
        <motion.div
          className="absolute -top-20 right-0 w-[min(100%,520px)] h-80 bg-[radial-gradient(circle,rgba(82,183,136,0.2),transparent_70%)] pointer-events-none"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Header Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#1A5C35]/15 dark:border-[#52b788]/20 bg-[#1A5C35]/5 dark:bg-[#52b788]/5 text-[10px] uppercase tracking-[0.2em] font-medium text-[#1A5C35] dark:text-[#52b788]">
                <Sparkles className="h-3 w-3" />
                <span>We're here to help</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight">
                Contact <span className="font-times text-[#0D3B21] dark:text-white">Jointlly</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed">
                Landowners, builders, or partners—reach out and our Bengaluru team will guide you through the platform with absolute clarity.
              </p>
            </motion.div>

            {/* Direct Lines Bezel Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
              className="lg:col-span-5 p-2 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10"
            >
              <div className="rounded-[calc(2.5rem-0.5rem)] bg-gradient-to-br from-[#0D3B21] via-[#1A5C35] to-[#2d6e48] p-6 text-white relative overflow-hidden shadow-soft">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,transparent_50%)] pointer-events-none" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 mb-5">
                  Direct lines
                </p>
                <div className="space-y-3">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex items-center gap-4 rounded-2xl bg-white/10 border border-white/20 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                  >
                    <Mail className="h-5 w-5 shrink-0 text-white/80" strokeWidth={1.5} />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/60">Email</p>
                      <p className="font-semibold text-sm sm:text-base">{CONTACT_EMAIL}</p>
                    </div>
                  </a>
                  <a
                    href={CONTACT_PHONE_HREF}
                    className="flex items-center gap-4 rounded-2xl bg-white/10 border border-white/20 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                  >
                    <Phone className="h-5 w-5 shrink-0 text-white/80" strokeWidth={1.5} />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/60">Phone</p>
                      <p className="font-semibold text-sm sm:text-base">{CONTACT_PHONE}</p>
                    </div>
                  </a>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Contact Method Cards */}
      <section className="relative pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {contactMethods.map((method, index) => (
              <ContactMethodCard key={method.label} method={method} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="relative pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1A5C35]/[0.02] to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Form - Double Bezel */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              viewport={{ once: true }}
              className="p-2 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-soft"
            >
              <div className="h-full rounded-[calc(2.5rem-0.5rem)] bg-white dark:bg-[#071f12] border border-border/40 dark:border-border/10 overflow-hidden flex flex-col justify-between">
                
                {/* Form Header */}
                <div className="relative shrink-0 overflow-hidden px-6 sm:px-8 py-6 border-b border-border/40">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0D3B21] via-[#1A5C35] to-[#2d6e48]" />
                  <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.1)_0%,transparent_45%)]" />
                  <div className="relative flex items-center gap-4 text-white">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 border border-white/30 backdrop-blur-sm">
                      <MessageSquare className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="font-times text-xl sm:text-2xl !text-white">Send a message</h2>
                      <p className="text-xs text-white/70 mt-0.5">We respond within one business day</p>
                    </div>
                  </div>
                </div>

                {/* Form Inputs */}
                <form onSubmit={handleSubmit} className="flex flex-1 flex-col p-6 sm:p-8 space-y-5 bg-white dark:bg-[#071f12]">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-name" className="text-xs font-semibold text-[#0D3B21] dark:text-white">
                        Full name
                      </Label>
                      <Input
                        id="contact-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                        className="h-11 border-border/60 bg-[#FAF9F6] dark:bg-background/40 focus-visible:ring-[#1A5C35] focus-visible:border-[#1A5C35] transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-email" className="text-xs font-semibold text-[#0D3B21] dark:text-white">
                        Email
                      </Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com"
                        required
                        className="h-11 border-border/60 bg-[#FAF9F6] dark:bg-background/40 focus-visible:ring-[#1A5C35] focus-visible:border-[#1A5C35] transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-topic" className="text-xs font-semibold text-[#0D3B21] dark:text-white">
                      Topic
                    </Label>
                    <select
                      id="contact-topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="flex h-11 w-full rounded-lg border border-border/60 bg-[#FAF9F6] dark:bg-background/40 px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1A5C35] focus-visible:border-[#1A5C35] transition-all duration-300"
                    >
                      <option value="general">General inquiry</option>
                      <option value="support">Support</option>
                      <option value="landowner">Landowner / Property owner</option>
                      <option value="builder">Construction company / Builder</option>
                    </select>
                  </div>

                  <div className="flex flex-1 flex-col space-y-1.5 min-h-[140px]">
                    <Label htmlFor="contact-message" className="text-xs font-semibold text-[#0D3B21] dark:text-white">
                      Message
                    </Label>
                    <Textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your project or question…"
                      required
                      className="min-h-[140px] flex-grow border-border/60 bg-[#FAF9F6] dark:bg-background/40 focus-visible:ring-[#1A5C35] focus-visible:border-[#1A5C35] transition-all duration-300 resize-none"
                    />
                  </div>

                  {/* Primary button-in-button */}
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-between rounded-full bg-gradient-to-r from-[#1A5C35] to-[#0D3B21] hover:from-[#217041] hover:to-[#0f4728] pl-6 pr-2 py-2 text-sm font-bold text-white shadow-lg transition-colors mt-2"
                  >
                    <span className="font-sans tracking-wide">Send Message</span>
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Send className="h-4 w-4" strokeWidth={2.5} />
                    </div>
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Map */}
            <OfficeMap className="flex-1 min-h-[400px]" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
