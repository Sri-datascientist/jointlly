import { type ReactNode } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";

type GatekeeperFee =
  | { type: "single"; amount: string; label?: string }
  | { type: "range"; min: string; max: string };

type GatekeeperRow = {
  category: string;
  payer: "Landowner" | "Professional";
  fee: GatekeeperFee;
  notes?: string;
};

type SuccessFeeRow = {
  category: string;
  percentRange: string;
  tiers: { label: string; percent: string }[];
  payer: "Professional";
};

const formatRupee = (amount: string) => `₹${amount}/-`;

const PricingSectionHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="flex items-start gap-3 mb-6 sm:mb-8">
    <div className="w-10 h-10 shrink-0 rounded-xl border border-[#1A5C35]/20 bg-gradient-to-br from-[#1A5C35]/15 to-[#52b788]/10 flex items-center justify-center shadow-sm">
      <CheckCircle2 className="w-5 h-5 text-[#1A5C35]" />
    </div>
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-[#0D3B21]">{title}</h2>
      <p className="text-sm sm:text-base text-muted-foreground mt-1">{description}</p>
    </div>
  </div>
);

const PayerBadge = ({ payer }: { payer: string }) => (
  <div className="shrink-0 rounded-xl border border-[#1A5C35]/15 bg-white/70 px-3 py-2 text-right backdrop-blur-sm">
    <span className="block text-[10px] uppercase tracking-wider text-[#1A5C35]/70 font-semibold">
      Payer
    </span>
    <span className="text-sm font-semibold text-[#0D3B21]">{payer}</span>
  </div>
);

const GatekeeperFeeDisplay = ({ fee }: { fee: GatekeeperFee }) => {
  if (fee.type === "range") {
    return (
      <div className="w-full rounded-xl border border-[#1A5C35]/12 bg-white/80 px-4 py-4 text-center shadow-[0_2px_8px_rgba(26,92,53,0.06)]">
        <p className="text-[10px] uppercase tracking-wider font-semibold text-[#1A5C35]/70 mb-1.5">
          Fee range
        </p>
        <p className="text-base sm:text-lg font-bold tabular-nums text-[#0D3B21] leading-snug">
          {formatRupee(fee.min)}
          <span className="mx-2 text-sm font-semibold text-[#1A5C35]/55">to</span>
          {formatRupee(fee.max)}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-[#1A5C35]/12 bg-white/80 px-4 py-4 text-center shadow-[0_2px_8px_rgba(26,92,53,0.06)]">
      <p className="text-[10px] uppercase tracking-wider font-semibold text-[#1A5C35]/70 mb-1.5">
        Entry fee
      </p>
      <p className="text-base sm:text-lg font-bold tabular-nums text-[#0D3B21]">
        {formatRupee(fee.amount)}
      </p>
      {fee.label ? (
        <p className="mt-1 text-xs font-medium text-[#1A2E1A]/55 capitalize">{fee.label}</p>
      ) : null}
    </div>
  );
};

const gatekeeperPricing: GatekeeperRow[] = [
  {
    category: "Landowner entry",
    payer: "Landowner",
    fee: { type: "single", amount: "99", label: "one-time" },
    notes: "Nominal entry fee for landowners.",
  },
  {
    category: "Interiors",
    payer: "Professional",
    fee: { type: "range", min: "1,499", max: "3,999" },
  },
  {
    category: "Renovation/Repaint",
    payer: "Professional",
    fee: { type: "range", min: "1,999", max: "3,999" },
  },
  {
    category: "Construction",
    payer: "Professional",
    fee: { type: "single", amount: "3,999", label: "fixed" },
  },
  {
    category: "Joint Development",
    payer: "Professional",
    fee: { type: "range", min: "5,999", max: "9,999" },
  },
];

const successFeePricing: SuccessFeeRow[] = [
  {
    category: "Construction",
    percentRange: "0.75% – 0.5%",
    tiers: [
      { label: "Deal ₹5Cr", percent: "0.75%" },
      { label: "Deal ₹1Cr – ₹5Cr", percent: "0.6%" },
      { label: "Deal up to ₹1Cr", percent: "0.5%" },
    ],
    payer: "Professional",
  },
  {
    category: "Joint Development",
    percentRange: "0.75% – 0.5%",
    tiers: [
      { label: "Deal ₹5Cr", percent: "0.75%" },
      { label: "Deal ₹1Cr – ₹5Cr", percent: "0.6%" },
      { label: "Deal up to ₹1Cr", percent: "0.5%" },
    ],
    payer: "Professional",
  },
];

const pricingCardShell =
  "group relative overflow-hidden rounded-2xl border border-[#1A5C35]/20 shadow-[0_4px_24px_rgba(26,92,53,0.1),inset_0_1px_0_rgba(255,255,255,0.8)]";

const GatekeeperCard = ({ row, index }: { row: GatekeeperRow; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay: index * 0.06 }}
    viewport={{ once: true, amount: 0.25 }}
    className={pricingCardShell}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#f8fcf9] via-white to-[#e8f5ec]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(82,183,136,0.1),transparent_55%)]" />

    <div className="relative border-b border-[#1A5C35]/12 bg-gradient-to-r from-[#1A5C35]/10 via-[#52b788]/8 to-transparent px-5 sm:px-6 py-4 sm:py-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-times text-xl sm:text-2xl text-[#0D3B21] tracking-tight leading-tight">
          {row.category}
        </h3>
        <PayerBadge payer={row.payer} />
      </div>
    </div>

    <div className="relative p-5 sm:p-6 space-y-4 text-center">
      <GatekeeperFeeDisplay fee={row.fee} />
      {row.notes ? (
        <p className="text-sm text-[#1A2E1A]/65 leading-relaxed border-t border-[#1A5C35]/10 pt-4">
          {row.notes}
        </p>
      ) : null}
    </div>
  </motion.div>
);

const SuccessFeeCard = ({ row, index }: { row: SuccessFeeRow; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay: index * 0.08 }}
    viewport={{ once: true, amount: 0.25 }}
    className={pricingCardShell}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#f8fcf9] via-white to-[#e8f5ec]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(82,183,136,0.12),transparent_55%)]" />

    <div className="relative border-b border-[#1A5C35]/12 bg-gradient-to-r from-[#1A5C35]/12 via-[#52b788]/10 to-transparent px-5 sm:px-6 py-4 sm:py-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-times text-xl sm:text-2xl text-[#0D3B21] tracking-tight">{row.category}</h3>
          <p className="mt-2 inline-flex items-center rounded-full border border-[#1A5C35]/25 bg-white/70 px-3 py-1 text-xs sm:text-sm font-medium text-[#1A5C35] backdrop-blur-sm">
            Fee range: {row.percentRange}
          </p>
        </div>
        <PayerBadge payer={row.payer} />
      </div>
    </div>

    <div className="relative space-y-2.5 p-5 sm:p-6">
      {row.tiers.map((tier) => (
        <div
          key={tier.label}
          className="flex items-center justify-between gap-4 rounded-xl border border-[#1A5C35]/12 bg-white/85 px-4 py-3 shadow-[0_2px_8px_rgba(26,92,53,0.06)] transition-colors group-hover:border-[#1A5C35]/18"
        >
          <span className="text-sm text-[#1A2E1A]/75 font-medium">{tier.label}</span>
          <span className="shrink-0 text-sm font-semibold tabular-nums text-[#0D3B21]">
            {tier.percent}
          </span>
        </div>
      ))}
    </div>
  </motion.div>
);

const InfoNote = ({ children }: { children: ReactNode }) => (
  <div className="mt-6 sm:mt-8 rounded-2xl border border-[#1A5C35]/15 bg-gradient-to-br from-[#f4faf6] to-white px-4 sm:px-5 py-4 shadow-[0_2px_12px_rgba(26,92,53,0.06)]">
    <p className="text-sm text-[#1A2E1A]/70 leading-relaxed">{children}</p>
  </div>
);

const Pricing = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />

      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-12 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 jointlly-grid opacity-30" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              <span className="text-gradient-primary">Pricing</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Transparent fees for entry, matching, and successful outcomes. All amounts are in INR (₹).
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-10 sm:py-12 md:py-16">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <PricingSectionHeader
            title="Gatekeeper (Entry) Fees"
            description="One-time entry fee (landowners) and category-based access fees (professionals)."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {gatekeeperPricing.map((row, index) => (
              <GatekeeperCard key={row.category} row={row} index={index} />
            ))}
          </div>

          <InfoNote>
            Gatekeeper fees for professionals may vary within the range based on the deal size.
          </InfoNote>
        </div>
      </section>

      <section className="relative py-10 sm:py-12 md:py-16">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <PricingSectionHeader
            title="Success Fees"
            description="Applies only where enabled (Construction and Joint Development)."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            {successFeePricing.map((row, index) => (
              <SuccessFeeCard key={row.category} row={row} index={index} />
            ))}
          </div>

          <InfoNote>
            Final payable amounts may depend on deal value tiers and specific workflow rules in the
            platform.
          </InfoNote>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
