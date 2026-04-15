import "../styles/globals.css";

import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../lib/wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create QueryClient once
const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return 
    <WagmiProvider confi={wagmiConfig}>
      <QueryClientProvide client={queryClient}>
        <Component{...pgeProps} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}