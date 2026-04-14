import Head from "next/head";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { sendTrackedTx } from "../lib/sendTrackedTx";

// Environment variables
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
  "function mintBadge(address user,string badgeName)"
  "function getBadges(address user) view returns (string[])"
]

const BADGE_THRESHOLDS = [
  { points: 10, badge: "Bronze Contributor" },
  { points: 25, badge: "Silver Contributor" },
  { points: 50, badge: "Gold Contributor" }
];

export default function Home() {

  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [score, setScore] = useState(0);
  const [attestations, setAttestations] = useState([]);
  const [badges, setBadges] = useState([]);
  const [pendingTx, setPendingTx] = useState(false);

  // Fetch reputation
  useEffect(() => {
    if (!isConnected || !window.ethereum) return;

    const fetchReputation = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(REPUTATION_ADDRESS, REPUTATION_ABI, provider);
      const v = await contract.getReputation(address);
      setScore(Number(v));
    };

    fetchReputation();
  }, [isConnected, address]);

  // Fetch attestations
  useEffect(() => {
    if (!isConnected || !window.ethereum) return;

    const fetchAttestations = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(ATTESTED_ADDRESS, ATTESTED_ABI, provider);
      const data = await contract.getAttestations(address);
      setAttestations(data);
    };

    fetchAttestations();
  }, [isConnected, address]);

  // Fetch badges
  useEffect(() => {
    if (!isConnected || !window.ethereum) return;

    const fetchBadges = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(SOULBOUND_ADDRESS, SOULBOUND_ABI, provider);
      const data = await contract.getBadges(address);
      setBadges(data);
    };

    fetchBadges();
  }, [isConnected, address]);

  // Auto mint badges
  useEffect(() => {
    if (!isConnected || !window.ethereum || score === 0) return;

    const mintEligibleBadges = async () => {

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
    };

    mintEligibleBadges();

  }, [score, badges, isConnected, address]);

  // Transaction handler
  const handleTx = async (contractName, functionName, args) => {

    setPendingTx(true);

    try {

      await sendTrackedTx({
        contractName,
        abi: contractName === "reputation" ? REPUTATION_ABI : ATTESTED_ABI,
        functionName,
        args
      });

      alert("Transaction successful!");
      window.location.reload();

    } catch (err) {

      console.error(err);
      alert("Transaction failed");

    }

    setPendingTx(false);
  };

  return (
    <>
      <Head>

        <title>Onchain Reputation Dashboard</title>

        <meta
          name="talentapp:project_verification"
          content="b7469046f8f4698a34a4a86aaeb82202b0be2c8d613507f63f4f9dcad239b0a83d1302d501095f669a3ac1b59df0074a24eb50689e095961a0dc4ae672457cbe"
        />

        <meta property="og:title" content="Onchain Reputation Dashboard" />
        <meta property="og:description" content="Track reputation, attest users, and earn soulbound badges onchain." />
        <meta property="og:image" content="/preview.png" />

      </Head>

      <main style={{ padding: "2rem", textAlign: "center" }}>

        <h1>Onchain Reputation Dashboard</h1>

        {!isConnected ? (
          <>
            <p>Connect wallet to continue</p>

            <button
              onClick={() => connect({ connector: injected() })}
              style={{ padding: "10px 16px", fontSize: "16px" }}
            >
              Connect Wallet
            </button>
          </>
        ) : (

          <div>

            <p><strong>Wallet:</strong> {address}</p>
            <p><strong>Reputation:</strong> {score}</p>

            <button
              onClick={() => handleTx("reputation","increaseReputation",[address,10])}
              disabled={pendingTx}
              style={{ padding: "10px 16px", marginTop: "10px" }}
            >
              {pendingTx ? "Pending..." : "Record Contribution"}
            </button>

            <button
              onClick={() => {
                const desc = prompt("Enter attestation:");
                if (desc) handleTx("attested","attest",[address,desc]);
              }}
              disabled={pendingTx}
              style={{ padding: "10px 16px", marginLeft: "10px" }}
            >
              Attest User
            </button>

            <h2 style={{ marginTop: "40px" }}>Attestations</h2>

            {attestations.length === 0 ? (
              <p>No attestations</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {attestations.map((a,i)=>(
                  <li key={i}>
                    <p><strong>Issuer:</strong> {a.issuer}</p>
                    <p>{a.description}</p>
                  </li>
                ))}
              </ul>
            )}

            <h2 style={{ marginTop: "40px" }}>Badges</h2>

            {badges.length === 0 ? (
              <p>No badges yet</p>
            ) : (
              <ul style={{ listStyle: "none" }}>
                {badges.map((b,i)=>(
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}

            <button
              onClick={disconnect}
              style={{ marginTop: "20px" }}
            >
              Disconnect
            </button>

          </div>
        )}

      </main>
    </>
  );
}