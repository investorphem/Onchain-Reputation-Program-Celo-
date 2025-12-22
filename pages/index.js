import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { sendTrackedTx } from "../lib/sendTrackedTx";

// Environment variables
const REPUTATION_ADDRESS = process.env.NEXT_PUBLIC_REPUTATION_ADDRESS;
const ATTESTED_ADDRESS = process.env.NEXT_PUBLIC_ATTESTED_ADDRESS;
const SOULBOUND_ADDRESS = process.env.NEXT_PUBLIC_SOULBOUND_ADDRESS;

// ABIs (MATCH DEPLOYED CONTRACTS)
const REPUTATION_ABI = [
  "function getReputation(address) view returns (uint256)",
  "function increaseReputation(address user,uint256 amount)"
];

const ATTESTED_ABI = [
  "function attest(address user,string description)",
  "function getAttestations(address user) view returns (tuple(address issuer,string description,uint256 timestamp)[])"
];

const SOULBOUND_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)"
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

    (async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(REPUTATION_ADDRESS, REPUTATION_ABI, provider);
      const v = await contract.getReputation(address);
      setScore(Number(v));
    })();
  }, [isConnected, address]);

  // Fetch attestations
  useEffect(() => {
    if (!isConnected || !window.ethereum) return;

    (async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(ATTESTED_ADDRESS, ATTESTED_ABI, provider);
      const data = await contract.getAttestations(address);
      setAttestations(data);
    })();
  }, [isConnected, address]);

  // Fetch soulbound badges (CORRECT WAY)
  useEffect(() => {
    if (!isConnected || !window.ethereum) return;

    (async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(SOULBOUND_ADDRESS, SOULBOUND_ABI, provider);

      const balance = await contract.balanceOf(address);
      const list = [];

      for (let i = 1; i <= Number(balance); i++) {
        const uri = await contract.tokenURI(i);
        list.push(uri);
      }

      setBadges(list);
    })();
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
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
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
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      alert("Transaction failed");
    }
  };

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Onchain Reputation Dashboard</h1>

      {!isConnected ? (
        <>
          <p>Please connect your wallet to view your dashboard.</p>
          <button onClick={() => connect({ connector: injected() })}>
            Connect Wallet
          </button>
        </>
      ) : (
        <>
          <p><strong>Wallet:</strong> {address}</p>
          <p><strong>Reputation:</strong> {score}</p>

          <button onClick={handleContribution}>Record Contribution</button>
          <button onClick={handleAttest} style={{ marginLeft: "1rem" }}>
            Attest
          </button>

          <h2 style={{ marginTop: "2rem" }}>Attestations</h2>
          {attestations.length === 0 ? <p>None</p> : attestations.map((a, i) => (
            <p key={i}>{a.description}</p>
          ))}

          <h2 style={{ marginTop: "2rem" }}>Soulbound Badges</h2>
          {badges.length === 0 ? <p>No badges yet</p> : badges.map((b, i) => (
            <p key={i}>{b}</p>
          ))}

          <button onClick={disconnect} style={{ marginTop: "1rem" }}>
            Disconnect
          </button>
        </>
      )}
    </main>
  );
}