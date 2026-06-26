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
  Users,
  Headphones,
  ArrowUpRight,
  MessageSquare,
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

const businessHours = [
  { day: "Monday – Saturday", hours: "9:00 AM – 6:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

const departments = [
  {
    title: "General Inquiries",
    email: CONTACT_EMAIL,
    description: "Questions about Jointlly and our services",
  },
  {
    title: "Support",
    email: CONTACT_EMAIL,
    description: "Help with your account or platform usage",
  },
];

const socialLinks = [
  { icon: Linkedin, href: "https://linkedin.com/company/jointlly", label: "LinkedIn" },
  { icon: Facebook, href: "https://facebook.com/jointlly", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/jointlly", label: "Instagram" },
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative flex overflow-hidden rounded-2xl border border-[#1A5C35]/15 bg-white shadow-[0_8px_30px_rgba(26,92,53,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(26,92,53,0.14)] hover:border-[#1A5C35]/30"
    >
      <div
        className={cn(
          "flex w-[4.5rem] sm:w-20 shrink-0 items-center justify-center bg-gradient-to-br",
          method.accent,
        )}
      >
        <Icon className="h-6 w-6 text-white drop-shadow-sm" />
      </div>
      <div className="flex flex-1 items-center justify-between gap-3 p-4 sm:p-5 min-w-0">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1A5C35]/80">
            {method.label}
          </p>
          <p className="mt-1 font-semibold text-[#0D3B21] text-sm sm:text-base leading-snug break-words">
            {method.value}
          </p>
          <p className="mt-0.5 text-xs text-[#1A2E1A]/55">{method.hint}</p>
        </div>
        <ArrowUpRight
          className="h-5 w-5 shrink-0 text-[#1A5C35]/35 transition-all group-hover:text-[#1A5C35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
    </motion.a>
  );
};

const OfficeMap = () => (
  <div className="relative overflow-hidden rounded-2xl border border-[#1A5C35]/20 shadow-[0_8px_32px_rgba(26,92,53,0.12)]">
    <div className="relative h-[220px] sm:h-[280px] lg:h-[320px] w-full bg-[#e8f5ec]">
      <iframe
        title="Jointlly office — Banashankari, Bengaluru"
        src={MAP_EMBED_SRC}
        className="absolute inset-0 h-full w-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#1A5C35]/10 rounded-2xl" />
    </div>

    <div className="relative border-t border-[#1A5C35]/12 bg-gradient-to-r from-[#f4faf6] to-white px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1A5C35] to-[#0D3B21] shadow-md">
          <MapPin className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="font-times text-base sm:text-lg text-[#0D3B21]">Our office</p>
          <p className="text-sm text-[#1A2E1A]/70 leading-relaxed">{OFFICE_ADDRESS}</p>
        </div>
      </div>
      <a
        href={MAP_EXTERNAL_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[#1A5C35]/25 bg-white px-4 py-2.5 text-sm font-semibold text-[#1A5C35] shadow-sm transition hover:bg-[#1A5C35] hover:text-white min-h-[44px]"
      >
        Open in Google Maps
        <ArrowUpRight className="h-4 w-4" />
      </a>
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
      `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FAF9F6]">
      <Navbar />

      {/* Hero — green gradient band */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D3B21]/8 via-transparent to-transparent" />
        <div className="absolute inset-0 jointlly-grid opacity-25" />
        <motion.div
          className="absolute -top-20 right-0 w-[min(100%,520px)] h-80 bg-[radial-gradient(circle,rgba(82,183,136,0.25),transparent_70%)]"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
            >
              <span className="inline-flex items-center rounded-full bg-[#1A5C35] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md mb-5">
                We&apos;re here to help
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
                <span className="text-gradient-primary">Contact</span>
                <br />
                <span className="font-times text-[#0D3B21]">Jointlly</span>
              </h1>
              <p className="font-westack text-base sm:text-lg text-[#1A2E1A]/70 max-w-lg leading-relaxed">
                Landowners, builders, or partners — reach out and our Bengaluru team will guide you
                through the platform with clarity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-[#1A5C35]/20 shadow-[0_12px_48px_rgba(26,92,53,0.15)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#0D3B21] via-[#1A5C35] to-[#52b788]" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_0%,transparent_50%)]" />
              <div className="relative p-6 sm:p-8 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-4">
                  Direct lines
                </p>
                <div className="space-y-4">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex items-center gap-4 rounded-xl bg-white/10 border border-white/20 p-4 backdrop-blur-sm transition hover:bg-white/20"
                  >
                    <Mail className="h-6 w-6 shrink-0" />
                    <div>
                      <p className="text-xs text-white/70">Email</p>
                      <p className="font-semibold">{CONTACT_EMAIL}</p>
                    </div>
                  </a>
                  <a
                    href={CONTACT_PHONE_HREF}
                    className="flex items-center gap-4 rounded-xl bg-white/10 border border-white/20 p-4 backdrop-blur-sm transition hover:bg-white/20"
                  >
                    <Phone className="h-6 w-6 shrink-0" />
                    <div>
                      <p className="text-xs text-white/70">Phone</p>
                      <p className="font-semibold">{CONTACT_PHONE}</p>
                    </div>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact strips */}
      <section className="relative pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {contactMethods.map((method, index) => (
              <ContactMethodCard key={method.label} method={method} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="relative py-4 sm:pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1A5C35]/[0.04] to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-2xl border border-[#1A5C35]/20 bg-white shadow-[0_12px_40px_rgba(26,92,53,0.1)]"
            >
              <div className="relative overflow-hidden px-6 sm:px-8 py-6 sm:py-7 border-b border-[#1A5C35]/15">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0D3B21] via-[#1A5C35] to-[#2d6e48]" />
                <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.12)_0%,transparent_45%)]" />
                <div className="relative flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 border border-white/30 backdrop-blur-sm">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-times text-2xl sm:text-3xl !text-white">Send a message</h2>
                    <p className="text-sm text-white/80 mt-0.5">
                      We typically respond within one business day
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 bg-white">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name" className="text-[#0D3B21] font-medium">
                      Full name
                    </Label>
                    <Input
                      id="contact-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      className="h-11 border-[#1A5C35]/25 bg-[#f8fcf9] focus-visible:ring-[#1A5C35]/40 focus-visible:border-[#1A5C35]/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-[#0D3B21] font-medium">
                      Email
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      required
                      className="h-11 border-[#1A5C35]/25 bg-[#f8fcf9] focus-visible:ring-[#1A5C35]/40 focus-visible:border-[#1A5C35]/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-topic" className="text-[#0D3B21] font-medium">
                    Topic
                  </Label>
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="flex h-11 w-full rounded-md border border-[#1A5C35]/25 bg-[#f8fcf9] px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A5C35]/40"
                  >
                    <option value="general">General inquiry</option>
                    <option value="support">Support</option>
                    <option value="landowner">Landowner / Property owner</option>
                    <option value="builder">Construction company / Builder</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message" className="text-[#0D3B21] font-medium">
                    Message
                  </Label>
                  <Textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your project or question…"
                    rows={5}
                    required
                    className="border-[#1A5C35]/25 bg-[#f8fcf9] focus-visible:ring-[#1A5C35]/40 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1A5C35] to-[#0D3B21] px-6 py-3.5 text-sm font-bold text-white shadow-[0_6px_24px_rgba(26,92,53,0.35)] transition-all hover:shadow-[0_8px_28px_rgba(26,92,53,0.45)] hover:-translate-y-0.5 min-h-[48px]"
                >
                  <Send className="h-4 w-4" />
                  Send message
                </button>
              </form>
            </motion.div>

            {/* Map + hours */}
            <div className="space-y-5 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1A5C35] to-[#0D3B21]">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-times text-xl sm:text-2xl text-[#0D3B21]">Find us on the map</h2>
                    <p className="text-sm text-[#1A2E1A]/60">Banashankari, Bengaluru</p>
                  </div>
                </div>
                <OfficeMap />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-[#1A5C35]/15 bg-white p-5 sm:p-6 shadow-[0_8px_30px_rgba(26,92,53,0.08)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9952A]/15 border border-[#C9952A]/30">
                    <Clock className="h-5 w-5 text-[#8a6420]" />
                  </div>
                  <h3 className="font-times text-lg text-[#0D3B21]">Business hours</h3>
                </div>
                <div className="space-y-2">
                  {businessHours.map((row) => (
                    <div
                      key={row.day}
                      className="flex justify-between gap-4 rounded-xl bg-gradient-to-r from-[#f4faf6] to-white border border-[#1A5C35]/10 px-4 py-3 text-sm"
                    >
                      <span className="font-semibold text-[#0D3B21]">{row.day}</span>
                      <span className="text-[#1A2E1A]/65">{row.hours}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-[#1A2E1A]/50">All times IST (Indian Standard Time)</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="relative py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">
              <span className="text-gradient-primary">Department contacts</span>
            </h2>
            <p className="mt-2 text-muted-foreground">Reach the right team for faster help</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {departments.map((dept, index) => (
              <motion.a
                key={dept.title}
                href={`mailto:${dept.email}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group flex overflow-hidden rounded-2xl border border-[#1A5C35]/15 bg-white shadow-[0_6px_24px_rgba(26,92,53,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(26,92,53,0.12)]"
              >
                <div className="w-1.5 shrink-0 bg-gradient-to-b from-[#52b788] to-[#1A5C35]" />
                <div className="flex flex-1 items-start justify-between gap-3 p-5 sm:p-6">
                  <div>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1A5C35]/10">
                      <Users className="h-5 w-5 text-[#1A5C35]" />
                    </div>
                    <h3 className="font-semibold text-lg text-[#0D3B21]">{dept.title}</h3>
                    <p className="mt-1 text-sm text-[#1A2E1A]/60">{dept.description}</p>
                    <p className="mt-3 text-sm font-bold text-[#1A5C35] group-hover:underline">
                      {dept.email}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-[#1A5C35]/40 group-hover:text-[#1A5C35]" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Social + CTA */}
      <section className="relative pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="rounded-2xl border border-[#1A5C35]/15 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(26,92,53,0.08)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h2 className="font-times text-xl sm:text-2xl text-[#0D3B21]">Follow Jointlly</h2>
              <p className="text-sm text-[#1A2E1A]/60 mt-1">Updates and community news</p>
            </div>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1A5C35] to-[#0D3B21] text-white shadow-md transition hover:scale-105 hover:shadow-lg min-h-[48px] min-w-[48px]"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#1A5C35]/25 shadow-[0_12px_48px_rgba(26,92,53,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0D3B21] via-[#1A5C35] to-[#3d8f5c]" />
            <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.14)_0%,transparent_50%)]" />
            <div className="relative px-6 sm:px-10 py-10 sm:flex sm:items-center sm:justify-between sm:gap-8">
              <div className="max-w-lg text-center sm:text-left">
                <Headphones className="h-10 w-10 text-white/90 mb-4 mx-auto sm:mx-0" />
                <h2 className="font-times text-2xl sm:text-3xl !text-white">Still have questions?</h2>
                <p className="mt-2 text-white/80 text-sm sm:text-base">
                  Our team is happy to walk you through landowners, builders, and pricing on a call.
                </p>
              </div>
              <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href={CONTACT_PHONE_HREF}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm hover:bg-white/20 min-h-[48px]"
                >
                  <Phone className="h-4 w-4" />
                  Call now
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#0D3B21] shadow-lg hover:bg-[#f0fdf4] min-h-[48px]"
                >
                  <Mail className="h-4 w-4" />
                  Email us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
