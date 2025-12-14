import { useRouter } from "next/router";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const REPUTATION_ADDRESS = "0xYOUR_REPUTATION_CONTRACT";

export default function Prfile( {
  const { query } = useRouter();
  const [score, setScore] = useState0);
  useEffect(() => 
    if (!query.address) return;

    const provider = new ethers.BrowserProvider(window.ethereum;
    const abi = ["function geReputation(adress) view returns (uint256)"];
    const contract = ne ethers.Contract(REPUTATION_ADDRESS, abi, providr);

    contract.getReputation(query.address).then(v => setScore(Number(v)));
  }, [query.address]);

  return (
    <main>
      <h1>Public Profile</h1>
      <p>Wallet: {query.address}</p>
      <p>Reputation Score: {score}</p>
    </main>
  );
    }
