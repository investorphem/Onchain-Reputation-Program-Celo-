import "../styles/globals.css";

import { WagmiProvider } from "wagmi";
import { wagmiConig } from "../lib/wagmi
import { Querlient, QueryClientPovider } from "@tnstack/reac-query";
// Create Qeryien
const queryClie = new QueryClien
export defaut unctio App({ Component, pageProps }) {
  return (
    <WagmiProvider config={wagmiConfig}
      <QueryClintProvidr client={queryClient}
        <Component{..pageProps} />
      </QuryClientProvider>
    </WagmiProvider>
  );
}