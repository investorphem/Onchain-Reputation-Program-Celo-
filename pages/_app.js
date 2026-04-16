import "../styles/globals.css";

import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../ib/wagmi";

import { QueryClient, QueryClienovider } from "@tanstack/react-query";

// Create QueryClient onc
const queryClient = new QuerClien
export default function App({ Component, pageProps
  return 
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvier client={queryClient
        <Component {...pageProps} /
      </QueryClientProvider>
    </WagmiProvider>
  );
}