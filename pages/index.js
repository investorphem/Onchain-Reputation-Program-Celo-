import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { injected } from "wagmi/connectors";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { sendTrackedTx } from "../lib/sendTrackedTx";

// Environment variables
const REPUTATION_ADDRESS = process.env.NEXT_PUBLIC_REPUTATION_ADDESS;
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
  "function getBadges(address user) view returns (string[])",
  "function MINTER_ROLE() view returns (bytes32)"
];

// Reputation thresholds for automatic badges
const BADGE_THRESHOLDS = [
  { points: 10, badge: "Bronze Contributor" },
  { points: 25, badge: "Silver Contributor" },
  { points: 50, badge: "Gold Contributor" }
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const [score, setScore] = useState(0);
  const [attestations, setAttestations] = useState([]);
  const [badges, setBadges] = useState([]);
  const [pendingTx, setPendingTx] = useState(false);

  // Check and switch network if needed
  const NETWORK_ID = 44787; // Celo Alfajores
  useEffect(() => {
    if (isConnected && chain?.id !== NETWORK_ID && switchNetwork) {
      switchNetwork(NETWORK_ID);
    }
  }, [isConnected, chain, switchNetwork]);

  // Fetch reputation
  useEffect(() => {
    if (!isConnected || !window.ethereum) return;

    const fetchReputation = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(REPUTATION_ADDRESS, REPUTATION_ABI, provider);
        const v = await contract.getReputation(address);
        setScore(Number(v));
      } catch (err) {
        console.error("Failed to fetch reputation:", err);
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

  // Fetch badges
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

  // Auto-mint badges based on reputation thresholds
  useEffect(() => {
    if (!isConnected || !window.ethereum || score === 0) return;

    const mintEligibleBadges = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(SOULBOUND_ADDRESS, SOULBOUND_ABI, signer);

        for (const threshold of BADGE_THRESHOLDS) {
          if (score >= threshold.points && !badges.includes(threshold.badge)) {
            setPendingTx(true);
            await sendTrackedTx({
              contractName: "soulbound",
              abi: SOULBOUND_ABI,
              functionName: "mintBadge",
              args: [address, threshold.badge]
            });
            setPendingTx(false);
          }
        }
      } catch (err) {
        console.error("Failed to auto-mint badges:", err);
        setPendingTx(false);
      }
    };

    mintEligibleBadges();
  }, [score, badges, isConnected, address]);

  // General transaction handler
  const handleTx = async (contractName, functionName, args) => {
    setPendingTx(true);
    try {
      await sendTrackedTx({ contractName, abi: contractName === "reputation" ? REPUTATION_ABI : ATTESTED_ABI, functionName, args });
      alert(`${functionName} executed + Divvi tracked!`);
      setPendingTx(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setPendingTx(false);
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

          <button onClick={() => handleTx("reputation", "increaseReputation", [address, 10])} disabled={pendingTx} style={{ marginTop: "1rem", padding: "10px 16px", fontSize: "16px", cursor: "pointer" }}>
            {pendingTx ? "Pending..." : "Record Contribution"}
          </button>

          <button onClick={() => {
            const desc = prompt("Enter attestation description:");
            if (desc) handleTx("attested", "attest", [address, desc]);
          }} disabled={pendingTx} style={{ marginTop: "1rem", marginLeft: "1rem", padding: "10px 16px", fontSize: "16px", cursor: "pointer" }}>
            {pendingTx ? "Pending..." : "Attest User"}
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