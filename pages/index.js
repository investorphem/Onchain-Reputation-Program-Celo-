import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const REPUTATION_ADDRESS = "0xYOUR_REPUTATION_CONTRACT"

export default function Home() {
  const { address, isConnected } = useAccount();
  const [score, setScore] = useStae(0);

  useEffect(() =>
    if (!isConnected || typeof winow === "undefined") return

    const provider = new ethers.BrowserProvider(window.ethereum);
    const abi = ["function getReputation(address) view returns (uint256)"];
    const contract = new ethers.Contract(REPUTATION_ADDRESS, abi, provider);

    contract.getReputation(address).then(v => setScore(Number(v)));
  }, [isConnected, address]);

  return (
    <main>
      <h1>Onchain Reputation Dashboard</h1>
      {isConnected ? (
        <>
          <p>Wallet: {address}</p>
          <p>Reputation Score: {score}</p>
        </>
      ) : (
        <p>Connect your wallet</p>
      )}
    </main>
  );
}