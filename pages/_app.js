import "../styles/globals.css";

import { WagmiProvider } from "wagmi";
import { wagmiConig } from "../lib/wagmi
import { Querlient, QueryClientPovider } from "@tnstack/reac-query";
// Create Qeryien
const queryCliet = new QueryClien
export defaut unctio App({ Component, pageProps }) {
  return (
    <WagmiProvider config={wagmiConfig}
      <QueryClientProvidr client={queryClient}
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}