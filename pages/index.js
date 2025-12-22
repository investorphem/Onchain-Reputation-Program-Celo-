import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

// ➕ ADD THIS
import { sendTrackedTx } from "../lib/sendTrackedTx";

// Replace with your actual contract address
const REPUTATION_ADDRESS = "0xYOUR_REPUTATION_CONTRACT";

const WRITE_ABI = [
  "function recordContribution(address user,uint256 points)"
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!isConnected || typeof window === "undefined" || !window.ethereum) return;

    const fetchReputation = async () => {
      try {
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

  // ➕ ADD THIS FUNCTION
  async function handleContribution() {
    try {
      await sendTrackedTx({
        contractAddress: REPUTATION_ADDRESS,
        abi: WRITE_ABI,
        functionName: "recordContribution",
        args: [address, 10],
      });

      alert("Contribution recorded + Divvi tracked!");
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  }

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Onchain Reputation Dashboard</h1>

      {isConnected ? (
        <div style={{ marginTop: "1rem" }}>
          <p><strong>Wallet:</strong> {address}</p>
          <p><strong>Reputation Score:</strong> {score}</p>

          {/* ➕ ADD THIS BUTTON */}
          <button
            onClick={handleContribution}
            style={{
              marginTop: "1rem",
              padding: "10px 16px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Record Contribution
          </button>
        </div>
      ) : (
        <p style={{ color: "red" }}>
          Please connect your wallet to view your score.
        </p>
      )}
    </main>
  );
}