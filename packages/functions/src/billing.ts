import Stripe from "stripe";
import handler from "@sst-guide/core/handler";
import { calculateCost } from "@sst-guide/core/cost";
import { Config } from "sst/node/config";

export const main = handler(async (event) => {
  const { storage, source } = JSON.parse(event.body);
  const amount = calculateCost(storage);
  const description = "Scratch charge";

  // Load our secret key from the  environment variables
  const stripe = new Stripe(Config.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
  });

  await stripe.charges.create({
    source,
    amount,
    description,
    currency: "usd",
  });

  return { status: true };
});