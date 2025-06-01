"use client";

import { useEffect, useState } from "react";
import { parseEther, formatEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import React from "react";
import { base } from "viem/chains";

const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ERC721EnumerableForbiddenBatchMint",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC721IncorrectOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721InsufficientApproval",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC721InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "ERC721InvalidOperator",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC721InvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC721InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC721InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721NonexistentToken",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "ERC721OutOfBoundsIndex",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "safeMint",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "baseURI",
        type: "string",
      },
    ],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "_baseTokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRemainingSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasMinted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_SUPPLY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Replace with your actual deployed contract address
const CONTRACT_ADDRESS = "0x62aDdE8200084C5C4932B29A266163246B4941CA";

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#1a1a1a",
    color: "white",
    fontFamily: "system-ui, -apple-system, sans-serif",
    backgroundImage:
      "radial-gradient(circle at 25% 25%, #3b0764 0%, transparent 50%), radial-gradient(circle at 75% 75%, #1e1b4b 0%, transparent 50%)",
    backgroundSize: "100% 100%",
    position: "relative" as const,
    overflow: "hidden",
  },
  animatedBackground: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(-45deg, #1a1a1a, #2d1b69, #1a1a1a, #581c87)",
    backgroundSize: "400% 400%",
    animation: "gradientShift 15s ease infinite",
    zIndex: -1,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem 2rem",
    borderBottom: "1px solid rgba(55, 65, 81, 0.3)",
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(26, 26, 26, 0.8)",
    position: "relative" as const,
    zIndex: 10,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  logoIcon: {
    width: "2.5rem",
    height: "2.5rem",
    backgroundColor: "white",
    borderRadius: "0.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
  },
  logoDiamond: {
    width: "1.75rem",
    height: "1.75rem",
    backgroundColor: "black",
    transform: "rotate(45deg)",
    animation: "spin 20s linear infinite",
  },
  nav: {
    display: "flex",
    gap: "2.5rem",
  },
  navLink: {
    color: "#9ca3af",
    textDecoration: "none",
    transition: "all 0.3s ease",
    padding: "0.5rem 0",
    fontSize: "0.95rem",
    fontWeight: "500",
  },
  navLinkActive: {
    color: "#3b82f6",
    borderBottom: "2px solid #3b82f6",
    paddingBottom: "0.5rem",
  },
  main: {
    maxWidth: "90rem",
    margin: "0 auto",
    padding: "4rem 2rem",
    position: "relative" as const,
    zIndex: 1,
  },
  heroSection: {
    textAlign: "center" as const,
    marginBottom: "4rem",
  },
  heroTitle: {
    fontSize: "4.5rem",
    fontWeight: "900",
    marginBottom: "1.5rem",
    lineHeight: "1.1",
    background:
      "linear-gradient(135deg, #ffffff 0%, #f97316 50%, #3b82f6 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    animation: "textGlow 3s ease-in-out infinite alternate",
  },
  heroDescription: {
    color: "#d1d5db",
    fontSize: "1.25rem",
    marginBottom: "3rem",
    lineHeight: "1.8",
    maxWidth: "48rem",
    margin: "0 auto 3rem",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "4rem",
    alignItems: "start",
    marginBottom: "5rem",
  },
  statsSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
  },
  statCard: {
    backgroundColor: "rgba(17, 24, 39, 0.8)",
    padding: "2rem",
    borderRadius: "1rem",
    border: "1px solid rgba(55, 65, 81, 0.5)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative" as const,
    overflow: "hidden",
  },
  statLabel: {
    fontSize: "0.875rem",
    color: "#9ca3af",
    marginBottom: "0.75rem",
    fontWeight: "600",
    letterSpacing: "0.05em",
  },
  statValue: {
    fontSize: "2.25rem",
    fontWeight: "900",
    position: "relative" as const,
    zIndex: 1,
  },
  mintCard: {
    backgroundColor: "rgba(17, 24, 39, 0.9)",
    borderRadius: "1.5rem",
    border: "1px solid rgba(55, 65, 81, 0.5)",
    padding: "2.5rem",
    backdropFilter: "blur(20px)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    position: "relative" as const,
    overflow: "hidden",
  },
  mintCardBorder: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(45deg, #3b82f6, #f97316, #3b82f6)",
    padding: "1px",
    borderRadius: "1.5rem",
    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    maskComposite: "exclude",
    animation: "borderGlow 3s linear infinite",
  },
  mintTitle: {
    fontSize: "1.75rem",
    fontWeight: "800",
    textAlign: "center" as const,
    marginBottom: "2rem",
    background: "linear-gradient(135deg, #ffffff 0%, #f97316 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },
  nftPreview: {
    width: "10rem",
    height: "10rem",
    margin: "0 auto 2rem",
    // background: "linear-gradient(135deg, #f97316, #ea580c, #dc2626)",
    borderRadius: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.75rem",
    fontWeight: "900",
    boxShadow: "0 20px 40px rgba(249, 115, 22, 0.3)",
    animation: "float 6s ease-in-out infinite",
    position: "relative" as const,
    overflow: "hidden",
  },
  nftGlow: {
    position: "absolute" as const,
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background:
      "conic-gradient(from 0deg, transparent, rgba(249, 115, 22, 0.3), transparent)",
    animation: "rotate 4s linear infinite",
  },
  mintButton: {
    width: "100%",
    padding: "1.25rem 2rem",
    background: "linear-gradient(135deg, #2563eb, #3b82f6, #1d4ed8)",
    borderRadius: "1rem",
    color: "white",
    fontWeight: "800",
    fontSize: "1.125rem",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative" as const,
    overflow: "hidden",
    letterSpacing: "0.05em",
  },
  mintButtonDisabled: {
    background: "rgba(75, 85, 99, 0.8)",
    cursor: "not-allowed",
    opacity: 0.7,
  },
  status: {
    marginTop: "2rem",
    padding: "1.25rem",
    borderRadius: "1rem",
    textAlign: "center" as const,
    fontWeight: "600",
    backdropFilter: "blur(10px)",
  },
  connectSection: {
    textAlign: "center" as const,
    padding: "2rem",
  },
  progressSection: {
    marginTop: "5rem",
    backgroundColor: "rgba(17, 24, 39, 0.8)",
    borderRadius: "1.5rem",
    padding: "2.5rem",
    border: "1px solid rgba(55, 65, 81, 0.5)",
    backdropFilter: "blur(10px)",
  },
  progressBar: {
    width: "100%",
    backgroundColor: "rgba(55, 65, 81, 0.8)",
    borderRadius: "1rem",
    height: "1.5rem",
    overflow: "hidden",
    position: "relative" as const,
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #f97316, #ea580c, #dc2626)",
    borderRadius: "1rem",
    transition: "width 1s ease-out",
    position: "relative" as const,
    overflow: "hidden",
  },
  progressGlow: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
    animation: "shimmer 2s infinite",
  },
  soldOutBadge: {
    backgroundColor: "rgba(220, 38, 38, 0.2)",
    border: "1px solid rgba(220, 38, 38, 0.5)",
    color: "#fca5a5",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    fontWeight: "700",
    textAlign: "center" as const,
    marginBottom: "1.5rem",
  },
};

// Add keyframes as a style tag
const keyframes = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes textGlow {
    0% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
    100% { text-shadow: 0 0 40px rgba(249, 115, 22, 0.8); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes spin {
    0% { transform: rotate(45deg); }
    100% { transform: rotate(405deg); }
  }
  @keyframes borderGlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

export default function Home() {
  const [status, setStatus] = useState("");
  const [supply, setSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(500); // Default from contract
  const [remaining, setRemaining] = useState(500);
  const [isLoading, setIsLoading] = useState(false);
  const [isSoldOut, setIsSoldOut] = useState(false);

  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  // Fetch contract data
  useEffect(() => {
    const fetchContractData = async () => {
      if (!publicClient) return;

      try {
        const [totalSupply, maxSupplyData] = await Promise.all([
          publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "totalSupply",
          }),
          publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "MAX_SUPPLY",
          }),
        ]);

        const currentSupply = Number(totalSupply);
        const maxSupplyNum = Number(maxSupplyData);
        const remainingSupply = maxSupplyNum - currentSupply;

        setSupply(currentSupply);
        setMaxSupply(maxSupplyNum);
        setRemaining(remainingSupply);
        setIsSoldOut(remainingSupply <= 0);
      } catch (error) {
        console.error("Error fetching contract data:", error);
        setStatus("Error loading contract data");
      }
    };

    fetchContractData();

    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(fetchContractData, 30000);
    return () => clearInterval(interval);
  }, [publicClient]);

  const handleMint = async () => {
    if (!walletClient || !address) {
      setStatus("Please connect your wallet");
      return;
    }

    if (isSoldOut) {
      setStatus("Sorry, all NFTs have been minted!");
      return;
    }

    setIsLoading(true);
    setStatus("Preparing transaction...");

    try {
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "safeMint",
        args: [],
        value: BigInt(0), // Free mint
        chain: base,
        account: address,
      });

      setStatus("Transaction submitted. Waiting for confirmation...");

      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        if (receipt.status === "success") {
          setStatus("Mint successful! 🎉");

          // Refresh contract data
          const newSupply = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "totalSupply",
          });

          const currentSupply = Number(newSupply);
          const remainingSupply = maxSupply - currentSupply;

          setSupply(currentSupply);
          setRemaining(remainingSupply);
          setIsSoldOut(remainingSupply <= 0);
        } else {
          setStatus("Transaction failed");
        }
      }
    } catch (error: any) {
      console.error("Mint error:", error);
      if (error.message?.includes("Max supply reached")) {
        setStatus("Sorry, all NFTs have been minted!");
        setIsSoldOut(true);
      } else {
        setStatus(`Mint failed: ${error.shortMessage || error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStyle = () => {
    if (status.includes("successful")) {
      return {
        ...styles.status,
        backgroundColor: "rgba(6, 78, 59, 0.8)",
        border: "1px solid rgba(5, 150, 105, 0.5)",
        color: "#10b981",
      };
    } else if (status.includes("failed") || status.includes("Error")) {
      return {
        ...styles.status,
        backgroundColor: "rgba(127, 29, 29, 0.8)",
        border: "1px solid rgba(220, 38, 38, 0.5)",
        color: "#f87171",
      };
    } else {
      return {
        ...styles.status,
        backgroundColor: "rgba(120, 53, 15, 0.8)",
        border: "1px solid rgba(217, 119, 6, 0.5)",
        color: "#fbbf24",
      };
    }
  };

  const progressPercentage = maxSupply > 0 ? (supply / maxSupply) * 100 : 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      <div style={styles.container}>
        <div style={styles.animatedBackground}></div>

        {/* Header */}
        <header style={styles.header}>
          <div style={styles.logo}>
            <img
              src="/stackLogo.png"
              alt="StackFi Logo"
              style={{
                width: "8.5rem",
                height: "5.5rem",
                borderRadius: "0.25rem",
                boxShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
              }}
            />
          </div>
          <nav style={styles.nav}>
            <a
              href="#"
              style={{ ...styles.navLink, ...styles.navLinkActive }}
              onMouseOver={(e: any) => (e.target.style.color = "#60a5fa")}
              onMouseOut={(e: any) => (e.target.style.color = "#3b82f6")}
            >
              Home
            </a>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <ConnectButton />
          </div>
        </header>

        <main style={styles.main}>
          {/* Hero Section */}
          <div style={styles.heroSection}>
            <h1 style={styles.heroTitle}>StackFi NFT MINT</h1>
            <p style={styles.heroDescription}>
              Unlock exclusive access to StackFi's composable DeFi ecosystem
              with advanced NFT utilities and governance rights across protocols
            </p>
          </div>

          <div style={styles.mainGrid}>
            {/* Left Side - Stats */}
            <div style={styles.statsSection}>
              <div
                style={styles.statCard}
                onMouseOver={(e: any) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 25px 50px rgba(249, 115, 22, 0.15)";
                }}
                onMouseOut={(e: any) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={styles.statLabel}>TOTAL MINTED</div>
                <div style={{ ...styles.statValue, color: "#f97316" }}>
                  {supply.toLocaleString()}
                </div>
              </div>

              <div
                style={styles.statCard}
                onMouseOver={(e: any) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 25px 50px rgba(16, 185, 129, 0.15)";
                }}
                onMouseOut={(e: any) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={styles.statLabel}>REMAINING</div>
                <div
                  style={{
                    ...styles.statValue,
                    color: remaining > 0 ? "#10b981" : "#ef4444",
                  }}
                >
                  {remaining.toLocaleString()}
                </div>
              </div>

              <div
                style={styles.statCard}
                onMouseOver={(e: any) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 25px 50px rgba(59, 130, 246, 0.15)";
                }}
                onMouseOut={(e: any) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={styles.statLabel}>MAX SUPPLY</div>
                <div style={{ ...styles.statValue, color: "#3b82f6" }}>
                  {maxSupply.toLocaleString()}
                </div>
              </div>

              <div
                style={styles.statCard}
                onMouseOver={(e: any) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 25px 50px rgba(255, 255, 255, 0.15)";
                }}
                onMouseOut={(e: any) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={styles.statLabel}>MINT PRICE</div>
                <div style={{ ...styles.statValue, color: "#10b981" }}>
                  FREE
                </div>
              </div>
            </div>

            {/* Right Side - Mint Interface */}
            <div style={styles.mintCard}>
              <div style={styles.mintCardBorder}></div>
              <h2 style={styles.mintTitle}>MINT StackFi NFT</h2>

              <div style={styles.nftPreview}>
                <div style={styles.nftGlow}></div>
                <div style={styles.logo}>
                  <img
                    src="/nft.png"
                    alt="StackFi Logo"
                    style={{
                      width: "8.5rem",
                      height: "5.5rem",
                      borderRadius: "0.25rem",
                      boxShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
                    }}
                  />
                </div>
              </div>

              {isSoldOut && (
                <div style={styles.soldOutBadge}>
                  🔥 SOLD OUT - All {maxSupply} NFTs Minted!
                </div>
              )}

              {isConnected ? (
                <div>
                  <button
                    onClick={handleMint}
                    disabled={isLoading || isSoldOut}
                    style={{
                      ...styles.mintButton,
                      ...(isLoading || isSoldOut
                        ? styles.mintButtonDisabled
                        : {}),
                    }}
                    onMouseOver={(e: any) => {
                      if (!isLoading && !isSoldOut) {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 20px 40px rgba(37, 99, 235, 0.4)";
                      }
                    }}
                    onMouseOut={(e: any) => {
                      if (!isLoading && !isSoldOut) {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }
                    }}
                  >
                    {isLoading
                      ? "MINTING..."
                      : isSoldOut
                      ? "SOLD OUT"
                      : "MINT FREE NFT"}
                  </button>
                </div>
              ) : (
                <div style={styles.connectSection}>
                  <p
                    style={{
                      color: "#9ca3af",
                      marginBottom: "2rem",
                      fontSize: "1.125rem",
                    }}
                  >
                    Connect your wallet to start minting
                  </p>
                  <div
                    style={{
                      backgroundColor: "rgba(55, 65, 81, 0.8)",
                      borderRadius: "1rem",
                      padding: "1.5rem",
                      border: "1px solid rgba(75, 85, 99, 0.5)",
                      backdropFilter: "blur(10px)",
                      display: "inline-block",
                    }}
                  >
                    <ConnectButton />
                  </div>
                </div>
              )}

              {status && (
                <div style={getStatusStyle()}>
                  <p style={{ margin: 0, fontSize: "1rem" }}>{status}</p>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div style={styles.progressSection}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ fontSize: "1.5rem", fontWeight: "800", margin: 0 }}>
                MINT PROGRESS
              </h3>
              <span
                style={{
                  color: "#9ca3af",
                  fontSize: "1.125rem",
                  fontWeight: "600",
                }}
              >
                {supply.toLocaleString()} / {maxSupply.toLocaleString()} (
                {Math.round(progressPercentage)}%)
              </span>
            </div>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progressPercentage}%`,
                }}
              >
                <div style={styles.progressGlow}></div>
              </div>
            </div>

            {remaining > 0 && (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "1rem",
                  color: "#10b981",
                  fontSize: "1.125rem",
                  fontWeight: "600",
                }}
              >
                {remaining} NFTs remaining
              </div>
            )}
          </div>

          {/* Features Section */}
          <div
            style={{
              marginTop: "6rem",
              textAlign: "center" as const,
            }}
          >
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "900",
                marginBottom: "1.5rem",
                lineHeight: "1.2",
              }}
            >
              <span style={{ color: "white" }}>3 PILLARS OF </span>
              <span style={{ color: "#f97316" }}>StackFi UTILITY</span>
            </h2>
            <p
              style={{
                color: "#d1d5db",
                fontSize: "1.125rem",
                marginBottom: "4rem",
                maxWidth: "64rem",
                margin: "0 auto 4rem",
                lineHeight: "1.7",
              }}
            >
              StackFi's NFTs intelligently unlock exclusive features across DeFi
              protocols and NFT marketplaces. By holding StackFi NFTs, you gain
              access to advanced leverage strategies, governance rights, and
              premium platform features with enhanced capital efficiency.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: "2rem",
                maxWidth: "80rem",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(17, 24, 39, 0.8)",
                  border: "1px solid rgba(55, 65, 81, 0.5)",
                  borderRadius: "1.5rem",
                  padding: "2.5rem",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  position: "relative" as const,
                  overflow: "hidden",
                }}
                onMouseOver={(e: any) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow =
                    "0 30px 60px rgba(249, 115, 22, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(249, 115, 22, 0.5)";
                }}
                onMouseOut={(e: any) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(55, 65, 81, 0.5)";
                }}
              >
                <div
                  style={{
                    width: "5rem",
                    height: "5rem",
                    borderRadius: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                    margin: "0 auto 1.5rem",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                    backgroundColor: "#ea580c",
                  }}
                >
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      backgroundColor: "#f97316",
                      borderRadius: "0.5rem",
                      animation: "float 4s ease-in-out infinite",
                    }}
                  ></div>
                </div>
                <h3
                  style={{
                    color: "#f97316",
                    fontWeight: "800",
                    marginBottom: "1rem",
                    fontSize: "1.25rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  GOVERNANCE RIGHTS
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#d1d5db",
                    marginBottom: "1.25rem",
                    lineHeight: "1.6",
                  }}
                >
                  Participate in protocol governance with weighted voting power
                  based on NFT rarity
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#9ca3af",
                    lineHeight: "1.5",
                  }}
                >
                  Vote on leverage parameters, fee structures, and protocol
                  upgrades
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "rgba(17, 24, 39, 0.8)",
                  border: "1px solid rgba(55, 65, 81, 0.5)",
                  borderRadius: "1.5rem",
                  padding: "2.5rem",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  position: "relative" as const,
                  overflow: "hidden",
                }}
                onMouseOver={(e: any) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow =
                    "0 30px 60px rgba(59, 130, 246, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)";
                }}
                onMouseOut={(e: any) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(55, 65, 81, 0.5)";
                }}
              >
                <div
                  style={{
                    width: "5rem",
                    height: "5rem",
                    borderRadius: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                    margin: "0 auto 1.5rem",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                    backgroundColor: "#1d4ed8",
                  }}
                >
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      backgroundColor: "#3b82f6",
                      borderRadius: "50%",
                      animation: "float 4s ease-in-out infinite 1s",
                    }}
                  ></div>
                </div>
                <h3
                  style={{
                    color: "#3b82f6",
                    fontWeight: "800",
                    marginBottom: "1rem",
                    fontSize: "1.25rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  PREMIUM ACCESS
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#d1d5db",
                    marginBottom: "1.25rem",
                    lineHeight: "1.6",
                  }}
                >
                  Access exclusive leverage strategies with enhanced capital
                  efficiency up to 10x
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#9ca3af",
                    lineHeight: "1.5",
                  }}
                >
                  Priority access to new protocols and advanced trading features
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "rgba(17, 24, 39, 0.8)",
                  border: "1px solid rgba(55, 65, 81, 0.5)",
                  borderRadius: "1.5rem",
                  padding: "2.5rem",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  position: "relative" as const,
                  overflow: "hidden",
                }}
                onMouseOver={(e: any) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow =
                    "0 30px 60px rgba(16, 185, 129, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.5)";
                }}
                onMouseOut={(e: any) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(55, 65, 81, 0.5)";
                }}
              >
                <div
                  style={{
                    width: "5rem",
                    height: "5rem",
                    borderRadius: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                    margin: "0 auto 1.5rem",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                    backgroundColor: "#059669",
                  }}
                >
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      backgroundColor: "#10b981",
                      borderRadius: "0.5rem",
                      transform: "rotate(45deg)",
                      animation: "float 4s ease-in-out infinite 2s",
                    }}
                  ></div>
                </div>
                <h3
                  style={{
                    color: "#10b981",
                    fontWeight: "800",
                    marginBottom: "1rem",
                    fontSize: "1.25rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  YIELD OPTIMIZATION
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#d1d5db",
                    marginBottom: "1.25rem",
                    lineHeight: "1.6",
                  }}
                >
                  Earn additional rewards through protocol fee sharing
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#9ca3af",
                    lineHeight: "1.5",
                  }}
                >
                  Compound returns through automated yield strategies and
                  airdrops
                </p>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div
            style={{
              marginTop: "6rem",
              textAlign: "center",
              backgroundColor: "rgba(17, 24, 39, 0.6)",
              borderRadius: "2rem",
              padding: "3rem",
              border: "1px solid rgba(55, 65, 81, 0.3)",
              backdropFilter: "blur(20px)",
            }}
          >
            <h3
              style={{
                fontSize: "2rem",
                fontWeight: "800",
                marginBottom: "2rem",
                background: "linear-gradient(135deg, #ffffff 0%, #f97316 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Why Choose Genesis NFTs?
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "3rem",
                maxWidth: "60rem",
                margin: "0 auto",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "3rem",
                    marginBottom: "1rem",
                    filter: "drop-shadow(0 0 10px rgba(249, 115, 22, 0.5))",
                  }}
                >
                  🚀
                </div>
                <h4
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    marginBottom: "0.75rem",
                    color: "#f97316",
                  }}
                >
                  Exclusive Access
                </h4>
                <p
                  style={{
                    color: "#d1d5db",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                  }}
                >
                  First access to new features, protocols, and investment
                  opportunities
                </p>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "3rem",
                    marginBottom: "1rem",
                    filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))",
                  }}
                >
                  💎
                </div>
                <h4
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    marginBottom: "0.75rem",
                    color: "#3b82f6",
                  }}
                >
                  Premium Rewards
                </h4>
                <p
                  style={{
                    color: "#d1d5db",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                  }}
                >
                  Enhanced yield farming for NFT holders
                </p>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "3rem",
                    marginBottom: "1rem",
                    filter: "drop-shadow(0 0 10px rgba(16, 185, 129, 0.5))",
                  }}
                >
                  🔥
                </div>
                <h4
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    marginBottom: "0.75rem",
                    color: "#10b981",
                  }}
                >
                  Community Power
                </h4>
                <p
                  style={{
                    color: "#d1d5db",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                  }}
                >
                  Shape the future of DeFi through community governance and
                  voting
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderTop: "1px solid rgba(55, 65, 81, 0.3)",
            padding: "2rem",
            textAlign: "center",
            backdropFilter: "blur(10px)",
            marginTop: "4rem",
          }}
        >
          <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
            <p
              style={{
                color: "#9ca3af",
                marginBottom: "1rem",
                fontSize: "0.95rem",
              }}
            >
              © 2025 StackFi. All rights reserved.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "2rem",
                color: "#9ca3af",
                fontSize: "0.9rem",
              }}
            >
              <a
                href="https://twitter.com/StackFi"
                style={{
                  color: "#9ca3af",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseOver={(e: any) => (e.target.style.color = "#f97316")}
                onMouseOut={(e: any) => (e.target.style.color = "#9ca3af")}
              >
                Twitter
              </a>
              <a
                href="https://t.me/StackFi"
                style={{
                  color: "#9ca3af",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseOver={(e: any) => (e.target.style.color = "#f97316")}
                onMouseOut={(e: any) => (e.target.style.color = "#9ca3af")}
              >
                Telegram
              </a>
              <a
                href="https://discord.gg/StackFi"
                style={{
                  color: "#9ca3af",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseOver={(e: any) => (e.target.style.color = "#f97316")}
                onMouseOut={(e: any) => (e.target.style.color = "#9ca3af")}
              >
                Discord
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
