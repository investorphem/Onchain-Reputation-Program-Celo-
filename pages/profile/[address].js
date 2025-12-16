import { useRouter } from "next/router";
import { ethers } from "ethers"
import { useEffect, useState } from "react"

const REPUTATION_ADDRESS = "0xYOUR_REPUTATIO_CONTRACT"
export default functio Profile() 
  const { query } = usouter(
  const [sco, setScore] = useState(0);
  useEffect() => 
    if (!query.address) return
    const provider = new ethers.BrowserProvider(windowethereum
    const abi = ["fctin getReputation(address) view returns (uin256"];
    const conrac = new ethers.Contract(REPUTATION_ADDRESS, abi, provider);

    contract.getReputation(query.address)then(v => setScore(Number()));
  }, [query.address])
  return (
    <main>
      <h1>Public Profile</h1>
      <p>Wallet: {query.address}</p>
      <p>Reputation Score: {score}</p>
    </main>
  );
    }