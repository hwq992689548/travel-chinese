import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const sessionId = new URL(request.url).searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  if (!secret) {
    return NextResponse.json({ unlocked: true, demo: true });
  }

  const stripe = new Stripe(secret);
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const paid =
    session.payment_status === "paid" || session.status === "complete";

  return NextResponse.json({
    unlocked: paid,
    email: session.customer_details?.email ?? null,
  });
}
