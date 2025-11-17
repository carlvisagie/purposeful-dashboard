/**
 * Stripe Products Configuration
 * Defines coaching packages and pricing for the Purposeful Live Coaching platform
 */

export const PRODUCTS = {
  STARTER: {
    id: "starter",
    name: "Starter Package",
    description: "Perfect for small teams and pilot programs - Up to 50 users with core emotional tracking",
    priceMonthly: 250000, // $2,500 in cents
    stripePriceId: process.env.STRIPE_PRICE_STARTER_MONTHLY || "",
    features: [
      "Up to 50 users",
      "Core emotional tracking",
      "Monthly reporting",
      "Email support",
      "Basic AI insights"
    ]
  },
  PROFESSIONAL: {
    id: "professional",
    name: "Professional Package",
    description: "Comprehensive solution for growing organizations - Up to 250 users with advanced analytics",
    priceMonthly: 750000, // $7,500 in cents
    stripePriceId: process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY || "",
    features: [
      "Up to 250 users",
      "Advanced analytics",
      "Weekly reporting",
      "Priority support",
      "Full AI insights",
      "Custom integrations",
      "Dedicated coach"
    ],
    featured: true
  },
  ENTERPRISE: {
    id: "enterprise",
    name: "Enterprise Package",
    description: "Tailored solutions for large organizations - Unlimited users with white-label options",
    priceMonthly: 0, // Custom pricing - contact sales
    stripePriceId: "", // No Stripe price ID - requires custom quote
    features: [
      "Unlimited users",
      "White-label option",
      "Real-time dashboards",
      "24/7 support",
      "Full customization",
      "API access",
      "Dedicated team",
      "Insurance integration"
    ],
    contactSales: true
  }
} as const;

export type ProductId = keyof typeof PRODUCTS;

/**
 * Get product by ID
 */
export function getProduct(id: ProductId) {
  return PRODUCTS[id];
}

/**
 * Get all products as array
 */
export function getAllProducts() {
  return Object.values(PRODUCTS);
}

/**
 * Get purchasable products (excludes enterprise/contact sales)
 */
export function getPurchasableProducts() {
  return Object.values(PRODUCTS).filter(p => !('contactSales' in p) || !p.contactSales);
}
