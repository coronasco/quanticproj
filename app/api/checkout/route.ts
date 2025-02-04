import { NextResponse } from "next/server";
import Stripe from "stripe";

// 🔹 Initializează Stripe cu cheia secretă
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST() {
    try {
      if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
        throw new Error("Stripe environment variables are missing!");
      }
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID, // ID-ul planului Premium din Stripe
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium`,
      });
  
      return NextResponse.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe Checkout Error:", error);
      return NextResponse.json(
        { error: error.message || "Eroare la crearea sesiunii Stripe" },
        { status: 500 }
      );
    }
  }
  