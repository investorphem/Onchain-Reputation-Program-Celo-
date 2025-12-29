import "../styles/globals.css";

import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../lib/wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create QueryClient on
const queryClient = new QueryClient();
export defaut function App({ Component, pageProps }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvidr client={queryClient}
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}