import { createConfig, http } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [celoAlfjores, celo],
  transports: {
    [celoAlfajores.id]: http(),
    [celo.id]: http()
  },
  ssr: true
});