import { ethers } from "ethers";
import { getDivviClient, getDivviTag, reportDivvi } from "./divvi";

// Reusable function to send Divvi-tracked transactions
export async function sendTrackedTx({
  contractAddress,
  abi,
  functionName,
  args,
}) {
  if (typeof window === "undefined") {
    throw new Error("Client-side only");
  }

  const client = await getDivviClient();
  const [account] = await client.getAddresses();

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);

  const data = contract.interface.encodeFunctionData(
    functionName,
    args
  );

  const referralTag = getDivviTag(account);

  const txHash = await client.sendTransaction({
    account,
    to: contractAddress,
    data: data + referralTag,
  });

  const chainId = await client.getChainId();
  await reportDivvi(txHash, chainId);

  return txHash;
}