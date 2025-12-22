import { ethers } from "ethers";
import { getDivviClient, getDivviTag, reportDivvi } from "../lib/divvi";

/**
 * sendTrackedTx
 * Sends a transaction to any contract and automatically tracks it with Divvi.
 *
 * @param {string} contractAddress - The target contract address
 * @param {Array} abi - The ABI of the contract
 * @param {string} functionName - The function to call
 * @param {Array} args - Arguments for the function
 * @returns {string} txHash
 */
export async function sendTrackedTx({ contractAddress, abi, functionName, args }) {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No Ethereum provider found");
  }

  // Step 1: Setup Divvi client
  const client = await getDivviClient();
  const [account] = await client.getAddresses();

  // Step 2: Setup ethers provider and signer
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // Step 3: Encode transaction data
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const data = contract.interface.encodeFunctionData(functionName, args);

  // Step 4: Generate Divvi referral tag
  const referralTag = getDivviTag(account);

  // Step 5: Send transaction with referral tag appended
  const txResponse = await client.sendTransaction({
    account,
    to: contractAddress,
    data: data + referralTag,
  });

  // Step 6: Report transaction to Divvi
  const chainId = await client.getChainId();
  await reportDivvi(txResponse, chainId);

  console.log(`Transaction sent: ${txResponse}`);
  return txResponse;
}