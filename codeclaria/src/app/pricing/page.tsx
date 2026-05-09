"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { PLANS } from "@/lib/plans";

declare global {
  interface Window { Razorpay: any; }
}

const PLAN_KEYS = ["free", "pro", "team"] as const;

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [planLoading, setPlanLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) { setPlanLoading(false); return; }
    fetch("/api/payment/current-plan")
      .then(r => r.json())
      .then(d => { setCurrentPlan(d.plan); setPlanLoading(false); })
      .catch(() => setPlanLoading(false));
  }, [session]);

  const handlePayment = async (plan: "pro" | "team") => {
    if (!session) { router.push("/login"); return; }
    setLoading(plan);
    try {
      await loadRazorpayScript();
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "CodeClaria",
        description: `${order.planName} Plan`,
        order_id: order.order_id,
        prefill: { name: session.user?.name || "", email: session.user?.email || "" },
        theme: { color: "#8b9cf4" },
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan,
            }),
          });
          const result = await verifyRes.json();
          if (result.success) {
            setSuccess(plan);
            setCurrentPlan(plan);
          } else {
            alert("Payment verification failed. Contact support.");
          }
        },
        modal: { ondismiss: () => setLoading(null) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        alert(`Payment failed: ${response.error.description}`);
        setLoading(null);
      });
      rzp.open();
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const isPaid = currentPlan && currentPlan !== "free";
  const activePlanName = currentPlan ? PLANS[currentPlan as keyof typeof PLANS]?.name : null;

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      <div className="min-h-screen" style={{ background: "#07061a", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
        <style>{`
          @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          @keyframes glow { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
          .fade-up { animation: fadeUp 0.4s ease forwards; }
          .plan-card { transition: all 0.2s ease; }
          .plan-card:hover { transform: translateY(-4px); }
        `}</style>

        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(ellipse at top, rgba(139,156,244,0.12) 0%, transparent 60%)", zIndex: 0 }} />
        <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(#0d0c1e 1px, transparent 1px), linear-gradient(90deg, #0d0c1e 1px, transparent 1px)", backgroundSize: "48px 48px", zIndex: 0 }} />

        <div className="relative z-10 max-w-[1000px] mx-auto px-4 sm:px-6 pt-28 pb-20">

          {/* already on paid plan — show premium screen */}
          {!planLoading && (isPaid || success) ? (
            <div className="fade-up flex flex-col items-center justify-center text-center py-20">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: "rgba(139,156,244,0.12)", border: "1px solid rgba(139,156,244,0.3)", boxShadow: "0 0 40px rgba(139,156,244,0.15)" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8b9cf4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-[11px] font-semibold tracking-widest uppercase" style={{ background: "rgba(139,156,244,0.1)", border: "1px solid rgba(139,156,244,0.25)", color: "#8b9cf4" }}>
                ✦ {activePlanName} Plan
              </div>
              <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-tight mb-3" style={{ background: "linear-gradient(135deg, #fff 30%, #8b9cf4 70%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Enjoy Premium, {session?.user?.name?.split(" ")[0]}
              </h1>
              <p className="text-[15px] mb-8 max-w-[400px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                You have full access to all {activePlanName} features. Go build something great.
              </p>
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <button onClick={() => router.push("/dashboard")} className="px-6 py-3 rounded-xl text-[14px] font-semibold transition-all hover:bg-white/90" style={{ background: "#fff", color: "#07061a" }}>
                  Go to Dashboard →
                </button>
                <button onClick={() => router.push("/analyze")} className="px-6 py-3 rounded-xl text-[14px] font-medium transition-all hover:bg-white/5" style={{ border: "1px solid #1c1a32", color: "rgba(255,255,255,0.6)" }}>
                  Analyze a Repo
                </button>
              </div>

              {/* upgrade to team if on pro */}
              {currentPlan === "pro" && (
                <div className="mt-12 w-full max-w-[420px] rounded-2xl p-6" style={{ background: "#0d0c1e", border: "1px solid #161528" }}>
                  <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Want more?</p>
                  <h3 className="text-[18px] font-bold text-white mb-1">Upgrade to Team</h3>
                  <p className="text-[13px] mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Unlimited everything — comments, analyses, repos.</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-end gap-1">
                      <span className="text-[28px] font-extrabold text-white">₹999</span>
                      <span className="text-[13px] mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>/mo</span>
                    </div>
                    <ul className="text-right space-y-1">
                      {["Unlimited comments", "Unlimited analyses", "Team collaboration"].map(f => (
                        <li key={f} className="text-[12px]" style={{ color: "rgba(255,255,255,0.5)" }}>✓ {f}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => handlePayment("team")}
                    disabled={loading === "team"}
                    className="w-full py-3 rounded-xl text-[14px] font-semibold transition-all hover:opacity-90"
                    style={{ background: "#fff", color: "#07061a", opacity: loading === "team" ? 0.7 : 1 }}
                  >
                    {loading === "team" ? "Processing..." : "Upgrade to Team →"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* header */}
              <div className="fade-up text-center mb-14">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-[11px] font-semibold tracking-widest uppercase" style={{ background: "rgba(139,156,244,0.1)", border: "1px solid rgba(139,156,244,0.2)", color: "#8b9cf4" }}>
                  ✦ Pricing
                </div>
                <h1 className="text-[32px] sm:text-[42px] font-extrabold tracking-tight mb-4" style={{ background: "linear-gradient(135deg, #fff 30%, #8b9cf4 70%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Simple, transparent pricing
                </h1>
                <p className="text-[15px] max-w-[440px] mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Start free. Upgrade when you need more power.
                </p>
              </div>

              {/* plans */}
              <div className="fade-up grid grid-cols-1 sm:grid-cols-3 gap-5">
                {PLAN_KEYS.map((key) => {
                  const plan = PLANS[key];
                  const isPro = key === "pro";
                  const isFree = key === "free";
                  const isActive = currentPlan === key;

                  return (
                    <div key={key} className="plan-card rounded-2xl p-6 flex flex-col" style={{ background: isPro ? "rgba(139,156,244,0.07)" : "#0d0c1e", border: isActive ? "1px solid rgba(139,156,244,0.5)" : isPro ? "1px solid rgba(139,156,244,0.35)" : "1px solid #161528", position: "relative" }}>
                      {"badge" in plan && plan.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-1 rounded-full" style={{ background: "#8b9cf4", color: "#07061a" }}>{plan.badge}</div>
                      )}
                      {isActive && (
                        <div className="absolute -top-3 right-4 text-[10px] font-bold px-3 py-1 rounded-full" style={{ background: "rgba(34,197,94,0.15)", color: "#8b9cf4", border: "1px solid rgba(34,197,94,0.3)" }}>Current</div>
                      )}
                      <div className="mb-4">
                        <p className="text-[12px] font-semibold uppercase tracking-widest mb-2" style={{ color: isPro ? "#8b9cf4" : "rgba(255,255,255,0.4)" }}>{plan.name}</p>
                        <div className="flex items-end gap-1">
                          <span className="text-[36px] font-extrabold text-white">{plan.price === 0 ? "Free" : `₹${plan.price}`}</span>
                          {plan.price > 0 && <span className="text-[13px] mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>/mo</span>}
                        </div>
                      </div>
                      <div className="h-px mb-4" style={{ background: isPro ? "rgba(139,156,244,0.2)" : "#141328" }} />
                      <ul className="flex-1 space-y-2.5 mb-6">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                            <span style={{ color: isPro ? "#8b9cf4" : "#8b9cf4", marginTop: 1 }}>✓</span>{f}
                          </li>
                        ))}
                      </ul>
                      {isFree ? (
                        <button onClick={() => router.push(session ? "/dashboard" : "/login")} className="w-full py-3 rounded-xl text-[14px] font-semibold transition-all hover:bg-white/10" style={{ border: "1px solid #1f1d35", color: "rgba(255,255,255,0.6)" }}>
                          {isActive ? "Current Plan" : "Get Started Free"}
                        </button>
                      ) : (
                        <button onClick={() => handlePayment(key as "pro" | "team")} disabled={loading === key || isActive} className="w-full py-3 rounded-xl text-[14px] font-semibold transition-all" style={{ background: isActive ? "rgba(34,197,94,0.1)" : isPro ? "#8b9cf4" : "#fff", color: isActive ? "#8b9cf4" : isPro ? "#07061a" : "#07061a", border: isActive ? "1px solid rgba(34,197,94,0.2)" : "none", opacity: loading === key ? 0.7 : 1 }}>
                          {isActive ? "✓ Active" : loading === key ? "Processing..." : `Upgrade to ${plan.name}`}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-[12px] mt-8" style={{ color: "rgba(255,255,255,0.2)" }}>Payments secured by Razorpay · All prices in INR · Cancel anytime</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}
