import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import authOption from "@/lib/auth";
import connectDb from "@/lib/db";
import Subscription from "@/model/subscription.model";
import User from "@/model/user.model";
import Usage from "@/model/usage.model";
import { PLANS } from "@/lib/plans";

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOption);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Payment signature mismatch");
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // activate subscription
    const planDetails = PLANS[plan as "pro" | "team"];
    const startDate = new Date();
    const endDate = planDetails.duration
      ? new Date(startDate.getTime() + planDetails.duration * 24 * 60 * 60 * 1000)
      : null;

    await connectDb();
    await Subscription.findOneAndUpdate(
      { githubId: session.user.id },
      {
        plan,
        status: "active",
        amount: planDetails.price,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        startDate,
        endDate,
      },
      { upsert: true }
    );

    // also update plan on User model for quick access
    await User.updateOne(
      { githubId: session.user.id },
      { plan: plan === "pro" ? "pro_monthly" : "pro_yearly" }
    );

    // reset usage counters on upgrade so user gets fresh limits
    await Usage.findOneAndUpdate(
      { githubId: session.user.id, month: currentMonth() },
      { commentsUsed: 0, analysesUsed: 0 },
      { upsert: true }
    );

    console.log(`✅ Payment verified — ${session.user.id} upgraded to ${plan}`);
    return NextResponse.json({ success: true, plan });
  } catch (error: any) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
