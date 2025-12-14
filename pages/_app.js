import "../styles/globals.css";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../lib/wagmi";

export default function App({ Component, pageProps }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <Component {...pageProps} />
    </WagmiProvider>
  );
}