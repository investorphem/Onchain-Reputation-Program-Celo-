import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { sendTrackedTx } from "../lib/sendTrackedTx";

// ✅ Environment variables for contract addresses
const REPUTATION_ADDRESS = process.env.NEXT_PUBLIC_REPUTATION_ADDRESS;
const ATTESTATION_ADDRESS = process.env.NEXT_PUBLIC_ATTESTATION_ADDRESS;

// ABIs
const REPUTATION_ABI = [
  "function getReputation(address user) view returns (uint256)",
  "function increaseReputation(address user, uint256 amount)"
];

const ATTESTATION_ABI = [
  "function getAttestations(address user) view returns (tuple(address issuer,string description,uint256 timestamp)[])",
  "function attest(address user, string description)"
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [score, setScore] = useState(0);
  const [attestations, setAttestations] = useState([]);

  // Fetch reputation and attestations
  useEffect(() => {
    if (!isConnected || typeof window === "undefined" || !window.ethereum) return;

    const fetchData = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Reputation
        const repContract = new ethers.Contract(REPUTATION_ADDRESS, REPUTATION_ABI, provider);
        const rep = await repContract.getReputation(address);
        setScore(Number(rep));

        // Attestations
        const attContract = new ethers.Contract(ATTESTATION_ADDRESS, ATTESTATION_ABI, provider);
        const ats = await attContract.getAttestations(address);
        setAttestations(ats);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, [isConnected, address]);

  // Record contribution (Reputation)
  async function handleContribution() {
    try {
      await sendTrackedTx({
        contractAddress: REPUTATION_ADDRESS,
        abi: REPUTATION_ABI,
        functionName: "increaseReputation",
        args: [address, 10],
      });

      setTimeout(() => window.location.reload(), 2000);
      alert("Contribution recorded + Divvi tracked!");
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  }

  // Record attestation
  async function handleAttestation() {
    const description = prompt("Enter attestation description:");
    if (!description) return;

    try {
      await sendTrackedTx({
        contractAddress: ATTESTATION_ADDRESS,
        abi: ATTESTATION_ABI,
        functionName: "attest",
        args: [address, description],
      });

      setTimeout(() => window.location.reload(), 2000);
      alert("Attestation recorded + Divvi tracked!");
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  }

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Onchain Reputation Dashboard</h1>

      {!isConnected ? (
        <>
          <p>Please connect your wallet to view your score and attestations.</p>
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

          <h3 style={{ marginTop: "2rem" }}>Attestations</h3>
          {attestations.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {attestations.map((att, i) => (
                <li key={i}>
                  <strong>Issuer:</strong> {att.issuer} <br />
                  <strong>Description:</strong> {att.description} <br />
                  <strong>Timestamp:</strong> {new Date(att.timestamp * 1000).toLocaleString()}
                  <hr />
                </li>
              ))}
            </ul>
          ) : (
            <p>No attestations yet.</p>
          )}

          <button
            onClick={handleAttestation}
            style={{ marginTop: "1rem", padding: "10px 16px", fontSize: "16px", cursor: "pointer" }}
          >
            Add Attestation
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