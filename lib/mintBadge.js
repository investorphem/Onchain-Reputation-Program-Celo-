import { ethers } from "ethers";
import { SOULBOUND_BADGE_ABI } from "./abis/soulboundBadge";

export async function mintBadge(to, uri) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_SOULBOUND_BADGE_ADDRESS,
    SOULBOUND_BADGE_ABI,
    signer
  );

  const tx = await contract.mintBadge(to, uri);
  await tx.wait();
}