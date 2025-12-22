// lib/divvi.js
import { getReferralTag, submitReferral } from "@divvi/referral-sdk";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

// ✅ Your Divvi consumer address
const DIVVI_CONSUMER_ADDRESS = "0xec24bAfBc989a9bE5f6F0eAD8848753B5E4aE0B6";

/**
 * Get the wallet client
 */
export const getDivviClient = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No Ethereum provider found");
  }

  const walletClient = createWalletClient({
    chain: mainnet,
    transport: custom(window.ethereum),
  });

  return walletClient;
};

/**
 * Generate a Divvi referral tag for a user
 * @param {string} userAddress
 */
export const getDivviTag = (userAddress) => {
  return getReferralTag({
    user: userAddress,
    consumer: DIVVI_CONSUMER_ADDRESS,
  });
};

/**
 * Submit a transaction to Divvi for tracking
 * @param {string} txHash
 * @param {number} chainId
 */
export const reportDivvi = async (txHash, chainId) => {
  await submitReferral({
    txHash,
    chainId,
  });
};