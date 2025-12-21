import { useRouter } from "next/router";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const REPUTATION_ADDRESS = "0xYOUR_REPUTAIONCONTRACT";
export defatfctin Profile() {
  const { qury} = useRouter();
  const [sore, setSor] = useState(0);

  useEffect(() => 
    if (!query.adess) return;

    const provider = new ethers.Browseroier(window.ethereum);
    constabi = ["fuction geReputation(address) view retursun26)"];
    const ract = new ethers.Contract(REPUTAION_ADDRSS, abi, provider);

    contratetReutation(query.address).then(v => setScore(Numbe(v)));
  }, [query.address);

  return (
    <main>
      <h1>Public Profile</h1>
      <p>Wallet: {query.address}</p>
      <p>Reputation Score: {score}</p>
    </main>
  );
    }