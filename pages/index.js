import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

// Replace with your actua
const REPUTATION_ADDRESS = "0xYOUR_REPUTATION_CONTRACT";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Only run on the client and when connected
    if (!isConnected || typeof window === "undefined" || !window.ethereum) return;

    const fetchReputation = async () => {
      try {
        // ethers v6 BrowserProvider
        const provider = new ethers.BrowserProvider(window.ethereum);
        const abi = ["function getReputation(address) view returns (uint256)"];
        const contract = new ethers.Contract(REPUTATION_ADDRESS, abi, provider);

        const v = await contract.getReputation(address);
        setScore(Number(v));
      } catch (error) {
        console.error("Failed to fetch reputation:", error);
      }
    };

    fetchReputation();
  }, [isConnected, address]);

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Onchain Reputation Dashboard</h1>
      {isConnected ? (
        <div style={{ marginTop: "1rem" }}>
          <p><strong>Wallet:</strong> {address}</p>
          <p><strong>Reputation Score:</strong> {score}</p>
        </div>
      ) : (
        <p style={{ color: "red" }}>Please connect your wallet to view your score.</p>
      )}
    </main>
  );
}