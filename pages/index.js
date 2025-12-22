import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { sendTrackedTx } from "../lib/sendTrackedTx";

// ✅ Environment variables for your contracts
const REPUTATION_ADDRESS = process.env.NEXT_PUBLIC_REPUTATION_ADDRESS;
const ATTESTED_ADDRESS = process.env.NEXT_PUBLIC_ATTESTED_ADDRESS;
const SOULBOUND_ADDRESS = process.env.NEXT_PUBLIC_SOULBOUND_ADDRESS;

// ABIs
const REPUTATION_ABI = [
  "function getReputation(address) view returns (uint256)",
  "function increaseReputation(address user,uint256 amount)"
];

const ATTESTED_ABI = [
  "function attest(address user,string description)",
  "function getAttestations(address user) view returns (tuple(address issuer,string description,uint256 timestamp)[])"
];

const SOULBOUND_ABI = [
  "function mintBadge(address user,string badgeName)",
  "function getBadges(address user) view returns (string[])"
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [score, setScore] = useState(0);
  const [attestations, setAttestations] = useState([]);
  const [badges, setBadges] = useState([]);

  // Fetch reputation
  useEffect(() => {
    if (!isConnected || !window.ethereum) return;

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

  // Fetch attestations
  useEffect(() => {
    if (!isConnected || !window.ethereum) return;

    const fetchAttestations = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(ATTESTED_ADDRESS, ATTESTED_ABI, provider);
        const data = await contract.getAttestations(address);
        setAttestations(data);
      } catch (err) {
        console.error("Failed to fetch attestations:", err);
      }
    };

    fetchAttestations();
  }, [isConnected, address]);

  // Fetch Soulbound badges
  useEffect(() => {
    if (!isConnected || !window.ethereum) return;

    const fetchBadges = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(SOULBOUND_ADDRESS, SOULBOUND_ABI, provider);
        const data = await contract.getBadges(address);
        setBadges(data);
      } catch (err) {
        console.error("Failed to fetch badges:", err);
      }
    };

    fetchBadges();
  }, [isConnected, address]);

  // Record contribution
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

  // Attest user
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
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  };

  // Mint Soulbound badge
  const handleMintBadge = async () => {
    const badgeName = prompt("Enter badge name:");
    if (!badgeName) return;

    try {
      await sendTrackedTx({
        contractAddress: SOULBOUND_ADDRESS,
        abi: SOULBOUND_ABI,
        functionName: "mintBadge",
        args: [address, badgeName],
      });
      alert("Badge minted + Divvi tracked!");
      setTimeout(() => window.location.reload(), 2000);
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
          <p>Please connect your wallet to view your dashboard.</p>
          <button onClick={() => connect({ connector: injected() })} style={{ padding: "10px 16px", fontSize: "16px", cursor: "pointer" }}>
            Connect Wallet
          </button>
        </>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          <p><strong>Wallet:</strong> {address}</p>
          <p><strong>Reputation Score:</strong> {score}</p>

          <button onClick={handleContribution} style={{ marginTop: "1rem", padding: "10px 16px", fontSize: "16px", cursor: "pointer" }}>
            Record Contribution
          </button>

          <button onClick={handleAttest} style={{ marginTop: "1rem", marginLeft: "1rem", padding: "10px 16px", fontSize: "16px", cursor: "pointer" }}>
            Attest User
          </button>

          <button onClick={handleMintBadge} style={{ marginTop: "1rem", marginLeft: "1rem", padding: "10px 16px", fontSize: "16px", cursor: "pointer" }}>
            Mint Soulbound Badge
          </button>

          <h2 style={{ marginTop: "2rem" }}>Your Attestations</h2>
          {attestations.length === 0 ? <p>No attestations found.</p> : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {attestations.map((a, i) => (
                <li key={i} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
                  <p><strong>Issuer:</strong> {a.issuer}</p>
                  <p><strong>Description:</strong> {a.description}</p>
                  <p><strong>Timestamp:</strong> {new Date(a.timestamp * 1000).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}

          <h2 style={{ marginTop: "2rem" }}>Your Badges</h2>
          {badges.length === 0 ? <p>No badges earned yet.</p> : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {badges.map((b, i) => (
                <li key={i} style={{ marginBottom: "0.5rem", padding: "6px 10px", border: "1px solid #ccc", borderRadius: "6px" }}>
                  {b}
                </li>
              ))}
            </ul>
          )}

          <button onClick={disconnect} style={{ marginTop: "1rem", padding: "8px 14px", fontSize: "14px", cursor: "pointer", background: "#eee" }}>
            Disconnect
          </button>
        </div>
      )}
    </main>
  );
}