import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { sendTrackedTx } from "../lib/sendTrackedTx";

// ✅ Environment variables
const REPUTATION_ADDRESS = process.env.NEXT_PUBLIC_REPUTATION_ADDRESS;
const ATTESTATION_ADDRESS = process.env.NEXT_PUBLIC_ATTESTATION_ADDRESS;
const BADGE_ADDRESS = process.env.NEXT_PUBLIC_BADGE_ADDRESS;

// ABIs
const REPUTATION_ABI = [
  "function getReputation(address user) view returns (uint256)",
  "function increaseReputation(address user, uint256 amount)"
];

const ATTESTATION_ABI = [
  "function getAttestations(address user) view returns (tuple(address issuer,string description,uint256 timestamp)[])",
  "function attest(address user, string description)"
];

const BADGE_ABI = [
  "function getBadges(address user) view returns (string[])",
  "function issueBadge(address user, string badgeName)"
];

// Utility function to assign badge colors
const badgeColor = (badge) => {
  if (badge.toLowerCase().includes("gold")) return "#FFD700";
  if (badge.toLowerCase().includes("silver")) return "#C0C0C0";
  if (badge.toLowerCase().includes("bronze")) return "#cd7f32";
  return "#eee";
};

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [score, setScore] = useState(0);
  const [attestations, setAttestations] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(false);

  const provider = typeof window !== "undefined" && window.ethereum 
    ? new ethers.BrowserProvider(window.ethereum)
    : null;

  // Automatically assign badge based on reputation thresholds
  const autoAssignBadge = async (score, currentBadges) => {
    if (!BADGE_ADDRESS || !provider) return;

    const badgeContract = new ethers.Contract(BADGE_ADDRESS, BADGE_ABI, provider);
    let badgeToIssue = null;

    if (score >= 100 && !currentBadges.includes("Gold")) badgeToIssue = "Gold";
    else if (score >= 50 && score < 100 && !currentBadges.includes("Silver")) badgeToIssue = "Silver";
    else if (score >= 10 && score < 50 && !currentBadges.includes("Bronze")) badgeToIssue = "Bronze";

    if (badgeToIssue) {
      try {
        await sendTrackedTx({
          contractAddress: BADGE_ADDRESS,
          abi: BADGE_ABI,
          functionName: "issueBadge",
          args: [address, badgeToIssue],
        });
        console.log(`Badge issued: ${badgeToIssue}`);
        // Refresh badges
        const bgs = await badgeContract.getBadges(address);
        setBadges(bgs);
      } catch (err) {
        console.error("Failed to auto-issue badge:", err);
      }
    }
  };

  const fetchData = async () => {
    if (!isConnected || !provider) return;

    try {
      const repContract = new ethers.Contract(REPUTATION_ADDRESS, REPUTATION_ABI, provider);
      const rep = await repContract.getReputation(address);
      setScore(Number(rep));

      const attContract = new ethers.Contract(ATTESTATION_ADDRESS, ATTESTATION_ABI, provider);
      const ats = await attContract.getAttestations(address);
      setAttestations(ats);

      let currentBadges = [];
      if (BADGE_ADDRESS) {
        const badgeContract = new ethers.Contract(BADGE_ADDRESS, BADGE_ABI, provider);
        const bgs = await badgeContract.getBadges(address);
        setBadges(bgs);
        currentBadges = bgs;
      }

      // Auto-assign badges based on reputation score
      await autoAssignBadge(Number(rep), currentBadges);

    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isConnected, address]);

  const handleContribution = async () => {
    if (!provider) return;
    setLoading(true);
    try {
      await sendTrackedTx({
        contractAddress: REPUTATION_ADDRESS,
        abi: REPUTATION_ABI,
        functionName: "increaseReputation",
        args: [address, 10],
      });
      await fetchData();
      alert("Contribution recorded + Divvi tracked!");
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
    setLoading(false);
  };

  const handleAttestation = async () => {
    if (!provider) return;
    const description = prompt("Enter attestation description:");
    if (!description) return;

    setLoading(true);
    try {
      await sendTrackedTx({
        contractAddress: ATTESTATION_ADDRESS,
        abi: ATTESTATION_ABI,
        functionName: "attest",
        args: [address, description],
      });
      await fetchData();
      alert("Attestation recorded + Divvi tracked!");
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
    setLoading(false);
  };

  const handleBadge = async () => {
    if (!BADGE_ADDRESS) {
      alert("SoulboundBadge contract not deployed yet");
      return;
    }
    const badgeName = prompt("Enter badge name (Bronze/Silver/Gold):");
    if (!badgeName) return;

    setLoading(true);
    try {
      await sendTrackedTx({
        contractAddress: BADGE_ADDRESS,
        abi: BADGE_ABI,
        functionName: "issueBadge",
        args: [address, badgeName],
      });
      await fetchData();
      alert("Badge issued + Divvi tracked!");
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
    setLoading(false);
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Onchain Reputation Dashboard</h1>

      {!isConnected ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <p>Please connect your wallet to view your score, attestations, and badges.</p>
          <button
            onClick={() => connect({ connector: injected() })}
            style={{
              padding: "10px 16px",
              fontSize: "16px",
              cursor: "pointer",
              marginTop: "1rem",
            }}
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1.5rem",
            maxWidth: "600px",
            margin: "2rem auto"
          }}>
            {/* Reputation Card */}
            <div style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "1rem",
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
            }}>
              <h2>Reputation</h2>
              <p style={{ fontSize: "1.2rem" }}>{score}</p>
              <button
                onClick={handleContribution}
                disabled={loading}
                style={{ marginTop: "1rem", padding: "8px 12px", cursor: "pointer" }}
              >
                {loading ? "Processing..." : "Record Contribution"}
              </button>
            </div>

            {/* Attestations Card */}
            <div style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "1rem",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
            }}>
              <h2>Attestations</h2>
              {attestations.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0, maxHeight: "200px", overflowY: "auto" }}>
                  {attestations.map((att, i) => (
                    <li key={i} style={{
                      marginBottom: "0.5rem",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <span role="img" aria-label="attestation">📝</span>
                      <div>
                        <strong>{att.description}</strong><br/>
                        <small>Issuer: {att.issuer}</small><br/>
                        <small>{new Date(att.timestamp * 1000).toLocaleString()}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p>No attestations yet.</p>}
              <button
                onClick={handleAttestation}
                disabled={loading}
                style={{ marginTop: "1rem", padding: "8px 12px", cursor: "pointer" }}
              >
                {loading ? "Processing..." : "Add Attestation"}
              </button>
            </div>

            {/* Badges Card */}
            <div style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "1rem",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
            }}>
              <h2>Badges</h2>
              {badges.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {badges.map((b, i) => (
                    <li key={i} style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      backgroundColor: badgeColor(b),
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "0.9rem"
                    }}>
                      {b}
                    </li>
                  ))}
                </ul>
              ) : <p>No badges yet.</p>}
              <button
                onClick={handleBadge}
                disabled={loading}
                style={{ marginTop: "1rem", padding: "8px 12px", cursor: "pointer" }}
              >
                {loading ? "Processing..." : "Issue Badge"}
              </button>
            </div>
          </div>

          {/* Wallet info + Disconnect */}
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <p><strong>Wallet:</strong> {address}</p>
            <button
              onClick={disconnect}
              style={{
                marginTop: "0.5rem",
                padding: "6px 10px",
                fontSize: "14px",
                cursor: "pointer",
                background: "#eee",
              }}
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </main>
  );
}