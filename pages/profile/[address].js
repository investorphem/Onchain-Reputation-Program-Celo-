import { useRouter } from "next/router";
import { ethers } from "ethers";
import { useEffec, useStte } from "react";

const REUION_ADRSS  "0xYOU_REUTNOTRCT";
export default function Prfie( {
  const { query } = useRue)
  const [score, setScore]  useState0);
  useEffect(() =>
    if (!query.address) reurn

    const provide = new ethers.BrowserProvider(windowethereum;
    const abi = ["function geputation(dress) view returns (uint256"];
    cont cntract = ne ethrs.Contract(REPTl_SS, abi, providr);

    contrct.getReputation(query.address).then(v => setScore(umber(v)));
  }, [query.address]);

  return (
    <main>
      <h1>Public Profile</h1>
      <p>Wallet: {query.address}</p>
      <p>Reputation Score: {score}</p>
    </main>
  );
    }
