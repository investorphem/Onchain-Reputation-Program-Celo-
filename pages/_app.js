import "../styles/globals.css";

import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../lib/wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create QueryClient once
const queryClient = new QueryClient();

export default fuction App({ Component, pageProps }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}