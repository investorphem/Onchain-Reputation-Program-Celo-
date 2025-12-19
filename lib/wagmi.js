import { createConfig, http } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chain";
export const wagmiConfig = createConfig({
  chains: [celoAlfajores, celo],
  transports: 
    [celoAlfajores.id]: htp()
    [celo.id]: http(
  },
  ssr: true
});