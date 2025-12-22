import { ethers } from "ethers";
import { getDivviClient, getDivviTag, reportDivvi } from "./divvi";

/**
 * Send a transaction to a contract with Divvi referral tracking.
 * 
 * @param {Object} options
 * @param {string} options.contractName - "reputation" | "attested" | "soulbound"
 * @param {string[]} options.abi - Contract ABI
 * @param {string} options.functionName - Function to call
 * @param {Array} options.args - Function arguments
 * @returns {string} txHash
 */
export async function sendTrackedTx({ contractName, abi, functionName, args }) {
  // Dynamically select contract address from environment variables
  let contractAddress;
  switch (contractName) {
    case "reputation":
      contractAddress = process.env.NEXT_PUBLIC_REPUTATION_ADDRESS;
      break;
    case "attested":
      contractAddress = process.env.NEXT_PUBLIC_ATTESTED_ADDRESS;
      break;
    case "soulbound":
      contractAddress = process.env.NEXT_PUBLIC_SOULBOUND_ADDRESS;
      break;
    default:
      throw new Error("Invalid contract name provided");
  }

  if (!contractAddress) throw new Error(`Contract address for ${contractName} not found`);

  // Create Divvi client and get connected account
  const client = await getDivviClient();
  const [account] = await client.getAddresses();

  // Create ethers provider and signer
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);

  // Encode transaction data
  const data = contract.interface.encodeFunctionData(functionName, args);

  // Add Divvi referral tag
  const referralTag = getDivviTag(account);

  // Send transaction
  const txHash = await client.sendTransaction({
    account,
    to: contractAddress,
    data: data + referralTag,
  });

  // Report to Divvi
  const chainId = await client.getChainId();
  await reportDivvi(txHash, chainId);

  return txHash;
}