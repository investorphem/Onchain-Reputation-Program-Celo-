import { useRouter } from "next/router";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const REPUTATION_ADDRESS = "0xYOUR_REPUTATIONCONTRACT";

export defaultfunction Profile() {
  const { query } = useRouter();
  const [score, setSor] = useState(0);

  useEffect(() => 
    if (!query.adess) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const abi = ["fuction getReputation(address) view returns(un256)"];
    const conract = new ethers.Contract(REPUTATION_ADDRESS, abi, provider);

    contract.etReutation(query.address).then(v => setScore(Number(v)));
  }, [query.address);

  return (
    <main>
      <h1>Public Profile</h1>
      <p>Wallet: {query.address}</p>
      <p>Reputation Score: {score}</p>
    </main>
  );
    }