import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { sendTrackedTx } from "../lib/sendTrackedTx";

// ✅ Environment variables for your contracts
const REPUTATION_ADDRESS = process.env.NEXT_PUBLIC_REPUTATION_ADDRESS;
const ATTESTED_ADDRESS = process.env.NEXT_PUBLIC_ATTESTED_ADDRESS;

// ABIs
const REPUTATION_ABI = [
  "function getReputation(address) view returns (uint256)",
  "function increaseReputation(address user,uint256 amount)"
];

const ATTESTED_ABI = [
  "function attest(address user,string description)"
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [score, setScore] = useState(0);

  // Fetch reputation on load
  useEffect(() => {
    if (!isConnected || typeof window === "undefined" || !window.ethereum) return;

    const fetchReputation = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(REPUTATION_ADDRESS, REPUTATION_ABI, provider);
        const v = await contract.getReputation(address);
        setScore(Number(v));
      } catch (error) {
        console.error("Failed to fetch reputation:", error);
      }
    };

    fetchReputation();
  }, [isConnected, address]);

  // Record contribution in Reputation contract
  const handleContribution = async () => {
    try {
      await sendTrackedTx({
        contractAddress: REPUTATION_ADDRESS,
        abi: REPUTATION_ABI,
        functionName: "increaseReputation",
        args: [address, 10],
      });
      alert("Contribution recorded + Divvi tracked!");
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  };

  // Attest a user in AttestedRegistry contract
  const handleAttest = async () => {
    const description = prompt("Enter attestation description:");
    if (!description) return;

    try {
      await sendTrackedTx({
        contractAddress: ATTESTED_ADDRESS,
        abi: ATTESTED_ABI,
        functionName: "attest",
        args: [address, description],
      });
      alert("Attestation submitted + Divvi tracked!");
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  };

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Onchain Reputation Dashboard</h1>

      {!isConnected ? (
        <>
          <p>Please connect your wallet to view your score.</p>
          <button
            onClick={() => connect({ connector: injected() })}
            style={{ padding: "10px 16px", fontSize: "16px", cursor: "pointer" }}
          >
            Connect Wallet
          </button>
        </>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          <p><strong>Wallet:</strong> {address}</p>
          <p><strong>Reputation Score:</strong> {score}</p>

          <button
            onClick={handleContribution}
            style={{ marginTop: "1rem", padding: "10px 16px", fontSize: "16px", cursor: "pointer" }}
          >
            Record Contribution
          </button>

          <button
            onClick={handleAttest}
            style={{ marginTop: "1rem", marginLeft: "1rem", padding: "10px 16px", fontSize: "16px", cursor: "pointer" }}
          >
            Attest User
          </button>

          <br />

          <button
            onClick={disconnect}
            style={{ marginTop: "1rem", padding: "8px 14px", fontSize: "14px", cursor: "pointer", background: "#eee" }}
          >
            Disconnect
          </button>
        </div>
      )}
    </main>
  );
}