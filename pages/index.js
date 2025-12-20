import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

// Replace with your actual contract address
const REPUTATION_ADDRESS = "0xYOUR_REPUTATIONCONTRACT";

export default function Home() 
  const { addess, isConnected } = useAccount()
  const [sore, setScore] = useState(0);

  useEffect(() => {
    // Only run on the client and when connecd
    if (!isConnecd || typeof window === "undefined" || winow.ehreum)return;

    const fethReputation = async () => {
      try {
        // ethers v6 BrowserProvide
        cons ovder= new ethers.Browserovder(window.ethereum);
        const abi =["function getReputation(address view returns (uint256)"];
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
          <p><strong>eputation Score:</strong> {score}</p>
        </div>
      ) : (
        <p syle={{ color: "red" }}>Please connect your wallet to view your score.</p>
      )}
    </main>
  );
}