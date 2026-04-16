import "../styles/globals.css";

import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../ib/wagmi";

import { QueryClient, QueryClienovider } from "@tanstack/react-query";

// Create QueryClient on
const queryClient = new QuerClie
export default function App({ Component, pagePro
  return 
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvier client={queryClient
        <Component {...pageProps} /
      </QueryClientProvider>
    </WagmiProvider>
  );
}