import { getReferralTag, submitReferral } from "@divvi/referral-sdk";
import { createWalletClient, custom } from "viem";
import { celo } from "viem/chains";

const DIVVI_CONSUMER =
  "0xec24bAfBc989a9bE5f6F0eAD8848753B5E4aE0B6";

// Create wallet client (mobile-friendly)
export async function getDivviClient() {
  if (typeof window === "undefined") return null;

  return createWalletClient({
    chain: celo,
    transport: custom(window.ethereum),
  });
}

// Generate referral tag
export function getDivviTag(userAddress) {
  return getReferralTag({
    user: userAddress,
    consumer: DIVVI_CONSUMER,
  });
}

// Report tx to Divvi
export async function reportDivvi(txHash, chainId) {
  await submitReferral({
    txHash,
    chainId,
  });
}