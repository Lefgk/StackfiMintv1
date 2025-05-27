import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "wagmi/chains";
import { metaMaskWallet, rabbyWallet } from "@rainbow-me/rainbowkit/wallets";

export const config = getDefaultConfig({
  appName: "StackFi NFT Mint",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // Get this from https://cloud.walletconnect.com
  chains: [base],
  ssr: true, // If your dApp uses server side rendering (SSR)
  wallets: [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, rabbyWallet],
    },
  ],
});
