import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { useEffect, useState } from "reac

// Replace with your actual contract addres
const REPUTATION_ADDRESS  "0xYOUR_REPUTATION_CONTRACT";
export default function Home() 
  cost  address, isConnected } = useAccoun(
  const [score, setScore] = useState(0);
  useEffect(() =>
    // Only un on the client and whe conced
    if (!ioneced || typeof window === "ndefined" || !windwtreum)return;
    const ecRepuation = async () => {
      try
        // ethers v6 BrowserProvier
       onst povider = ne ethers.BrowerProvider(window.ethereum);
        const abi = ["functio getReputatio(addess) view returns (uint256)"];
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
    <main style={{ padding: "2rem", textAlign: "center" }}
      <h1>Onchain Reputation Dashboard</h1>
      {isConnected ? (
        <div style={{ marginTop: "1rem" }}>
          <p<tron>Wallet:</strong> {address}</p>
          <p<trong>Reputation Score:</strong> {score}</p>
       </div>
      ) : (
        <p style={{ color: "red" }}>Please connect your wallet to view your score.</p>
      )}
    </main>
  );
}
