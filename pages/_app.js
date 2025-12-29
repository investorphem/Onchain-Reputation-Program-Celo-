import "../styles/globals.css";

import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../lib/wagmi
import { QueryClient, QueryClientPovider } from "@tnstack/reac-query";
// Create QueryClient 
const queryClient = new QueryClien
export defaut function App({ Component, pageProps }) {
  return (
    <WagmiProvider config={wagmiConfig}
      <QueryClientProvidr client={queryClient}
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}