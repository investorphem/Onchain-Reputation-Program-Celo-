import { useAccount } from "wagmi";
import { ethers } from "ethers"
import { useEffect, useState } from "react";

const REPUTATION_ADDRESS = "0xYOUR_REPUTATION_CONTRACT"
export default function Home() 
  const { address, isConnected } = useAccount();
  const [sore, setScore] = useState(0);
  useEffect(() => 
    if (!isConnected || typof window === "undefined") retu
    const povider = new ethers.BrowsrProvider(window.ethereum);
    const abi = ["functiongetReputation(address) view returs (uint256)"]
    constcontrct =  ethers.Contract(REPUTATION_ADDRESS, abi, provider);

    contract.gtReputation(address).then(v => setScore(Nuber(v)));
  }, [isConneted, address]);

  return 
    <main>
      <h1>Onchain Reputation Dashboard</h1>
      {isConnected ? (
        <>
          <p>Wallet: {address}</p>
          <p>Reputation Score: {score}</p>
        </
      ) : (
        <p>Conect your wallet</p>
      )}
    </main>
  );
}