/**
 * Credit bundle configuration
 * Amount in minor units (e.g., 1000 = $10.00)
 */
export const CREDIT_BUNDLES = {
  bundle_10: { amountMinor: 1000, credits: 100 },
  bundle_25: { amountMinor: 2500, credits: 300 },
  bundle_50: { amountMinor: 5000, credits: 750 },
} as const;

export type BundleId = keyof typeof CREDIT_BUNDLES;
