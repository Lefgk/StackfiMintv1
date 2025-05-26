import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "StackFi NFT Mint",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // Get this from https://cloud.walletconnect.com
  chains: [mainnet, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
