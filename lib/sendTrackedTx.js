import { ethers } from "ethers";
import { getDivviClient, getDivviTag, reportDivvi } from "./divvi";

export async function sendTrackedTx({ contractName, abi, functionName, args }) {
  if (!window.ethereum) throw new Error("Wallet not found");

  // 1️⃣ Resolve contract address
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
      throw new Error("Invalid contract name");
  }

  // 2️⃣ Request wallet access (THIS triggers popup)
  await window.ethereum.request({ method: "eth_requestAccounts" });

  // 3️⃣ Create provider & signer
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const account = await signer.getAddress();

  // 4️⃣ Create contract WITH signer
  const contract = new ethers.Contract(contractAddress, abi, signer);

  // 5️⃣ Encode calldata
  const data = contract.interface.encodeFunctionData(functionName, args);

  // 6️⃣ Append Divvi referral tag
  const referralTag = getDivviTag(account);
  const finalData = data + referralTag;

  // 7️⃣ Send tx via signer (MetaMask popup)
  const tx = await signer.sendTransaction({
    to: contractAddress,
    data: finalData,
  });

  await tx.wait();

  // 8️⃣ Report tx to Divvi
  const client = await getDivviClient();
  const chainId = await provider.getNetwork();
  await reportDivvi(tx.hash, Number(chainId.chainId));

  return tx.hash;
}