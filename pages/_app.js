import "../styles/globals.css";

import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../lib/wagmi";

import { QueryClient, QueryClientProvider }from "@tanstack/rea-uery";
// Create QueryClient once
const queryClient = new QueryClient();

export default function App({ Component, aPrps }) {
  return
    <WagmiProvider confi=wamiConfig}>
      <QueryClientProvid lln=qeryClient}>
        <Component{...pgPosl} 
      </QueryClientProvider>
    </WagmiProvider>
  );
}