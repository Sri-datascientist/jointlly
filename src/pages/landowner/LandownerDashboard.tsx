import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Hammer, Handshake, Palette, Wrench, FileText, CheckCircle2, ArrowRight, Users, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandownerProjectCard } from "@/components/LandownerProjectCard";
import { createPaymentOrder, getMyTransactions, verifyPaymentTransaction } from "@/lib/api";
import {
  DashboardLoadingState,
  DashboardPromoBanner,
  DashboardQuickActionCard,
  DashboardSectionHeader,
  DashboardStatCard,
  dashboardCardShell,
  DashboardCardBackground,
} from "@/components/dashboard/DashboardUI";
import { cn } from "@/lib/utils";

type RazorpaySuccessPayload = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessPayload) => void;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
};

type RazorpayConstructor = new (options: RazorpayCheckoutOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

let razorpayScriptPromise: Promise<void> | null = null;

function ensureRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay checkout is only available in browser."));
  }
  if (window.Razorpay) return Promise.resolve();
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout SDK."));
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}

const quickActions = [
  { path: "/landowner/contract-construction", slug: "contract-construction", label: "Contract construction", icon: Hammer, desc: "I need a professional team to construct." },
  { path: "/landowner/joint-venture", slug: "joint-venture", label: "Joint venture / JD", icon: Handshake, desc: "Explore JV/JD opportunities." },
  { path: "/landowner/interior", slug: "interior", label: "Interior architecture", icon: Palette, desc: "Find an interior design professional." },
  { path: "/landowner/reconstruction", slug: "reconstruction", label: "Renovation / repaint", icon: Wrench, desc: "Repairs or improvements to my space." },
];

const LandownerDashboard = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingEntryFee, setLoadingEntryFee] = useState(true);
  const [entryFeePaid, setEntryFeePaid] = useState(false);
  const [payingEntryFee, setPayingEntryFee] = useState(false);
  const [entryFeeError, setEntryFeeError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("landownerProjects");
    if (stored) {
      setProjects(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const txns = await getMyTransactions();
        if (cancelled) return;
        const hasSuccessEntry = txns.some(
          (t) => t.transaction_type === "LANDOWNER_ENTRY" && t.status === "SUCCESS"
        );
        setEntryFeePaid(hasSuccessEntry);
      } catch (e) {
        if (!cancelled) {
          setEntryFeeError(e instanceof Error ? e.message : "Failed to load payment status.");
        }
      } finally {
        if (!cancelled) setLoadingEntryFee(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePayEntryFee = async () => {
    try {
      setPayingEntryFee(true);
      setEntryFeeError(null);
      const initiated = await createPaymentOrder({
        amount: 99,
        transaction_type: "LANDOWNER_ENTRY",
        currency: "INR",
      });
      if (!initiated.razorpay_key_id) {
        throw new Error("Payment gateway key is unavailable. Please contact support.");
      }

      await ensureRazorpayScript();
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not available. Please refresh and try again.");
      }

      const paymentResponse = await new Promise<RazorpaySuccessPayload>((resolve, reject) => {
        const rz = new window.Razorpay({
          key: initiated.razorpay_key_id,
          amount: Math.round(initiated.amount * 100),
          currency: initiated.currency,
          name: "Jointlly",
          description: "Landowner one-time entry fee",
          order_id: initiated.order_id,
          handler: resolve,
          theme: { color: "#1A5C35" },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled by user.")),
          },
        });
        rz.open();
      });

      if (paymentResponse.razorpay_order_id !== initiated.order_id) {
        throw new Error("Payment order mismatch. Please try again.");
      }

      await verifyPaymentTransaction({
        transaction_id: initiated.transaction_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      });
      setEntryFeePaid(true);
    } catch (e) {
      setEntryFeeError(e instanceof Error ? e.message : "Failed to complete entry fee payment.");
    } finally {
      setPayingEntryFee(false);
    }
  };

  const getProjectStatus = (type: string) => {
    return projects.some(p => p.type === type);
  };

  const stats = [
    { label: "Active projects", value: projects.length, icon: FileText, accent: "green" as const },
    { label: "Published listings", value: projects.length, icon: CheckCircle2, accent: "mint" as const },
    { label: "Your matches", value: 0, icon: Users, accent: "gold" as const, href: "/landowner/matches" },
  ];

  if (loadingEntryFee) {
    return <DashboardLoadingState label="Checking entry fee status…" />;
  }

  if (!entryFeePaid) {
    return (
      <div className="py-4 sm:py-8">
        <div className={cn(dashboardCardShell, "max-w-2xl mx-auto overflow-hidden")}>
          <div className="relative border-b border-[#1A5C35]/15 bg-gradient-to-r from-[#0D3B21] via-[#1A5C35] to-[#2d6e48] px-6 sm:px-8 py-6">
            <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
            <h1 className="relative font-times text-2xl sm:text-3xl !text-white">Unlock your dashboard</h1>
            <p className="relative mt-2 text-sm text-white/80">
              One-time landowner entry fee to access projects, matching, and marketplace.
            </p>
          </div>
          <div className="relative p-6 sm:p-8">
            <DashboardCardBackground />
            <div className="relative">
              <p className="text-4xl font-bold text-[#0D3B21] tabular-nums">
                ₹99<span className="text-lg font-semibold text-[#1A2E1A]/50">/-</span>
              </p>
              <p className="mt-2 text-sm text-[#1A2E1A]/65 leading-relaxed">
                Complete payment to unlock dashboard, project posting, and opportunities marketplace access.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => void handlePayEntryFee()}
                  disabled={payingEntryFee}
                  className="bg-gradient-to-r from-[#1A5C35] to-[#0D3B21] hover:opacity-95 shadow-md min-h-[44px]"
                >
                  {payingEntryFee ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Opening Razorpay…
                    </>
                  ) : (
                    "Pay ₹99 and continue"
                  )}
                </Button>
                <Link
                  to="/landowner/account/payments"
                  className="inline-flex items-center justify-center text-sm font-semibold text-[#1A5C35] hover:underline min-h-[44px]"
                >
                  View payment history
                </Link>
              </div>
              {entryFeeError ? (
                <p className="mt-4 text-sm text-destructive">{entryFeeError}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <DashboardPromoBanner
        title="Create your opportunity listing"
        description="Publish your request on Opportunities (contract construction, JV/JD, interior, or renovation) so builders can discover and match with you."
        icon={Sparkles}
        ctaLabel="Fill the form"
        ctaTo="/landowner/options"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-10 sm:mb-12">
        {stats.map((stat, index) => (
          <DashboardStatCard key={stat.label} {...stat} index={index} />
        ))}
      </div>

      {projects.length > 0 ? (
        <section className="mb-10 sm:mb-12">
          <DashboardSectionHeader
            title="Featured projects"
            subtitle="Your recently published requests"
            viewAllTo="/landowner/my-projects"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {projects.slice(0, 6).map((project, index) => (
              <LandownerProjectCard key={index} project={project} index={index} variant="compact" />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <DashboardSectionHeader
          title="Create new request"
          subtitle="Choose the type of project you want to publish"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {quickActions.map((action, i) => (
            <DashboardQuickActionCard
              key={action.path}
              to={action.path}
              label={action.label}
              description={action.desc}
              icon={action.icon}
              completed={getProjectStatus(action.slug)}
              index={i}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandownerDashboard;
