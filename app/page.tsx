"use client";

import { useEffect, useState } from "react";
import { parseEther, formatEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import React from "react";

export const CONTRACT_ABI = [
  "function mint(uint256 quantity) payable",
  "function totalSupply() view returns (uint256)",
  "function MAX_SUPPLY() view returns (uint256)",
  "function MINT_PRICE() view returns (uint256)",
  "function setMintEnabled(bool enabled)",
] as const;

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

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
  buyButton: {
    backgroundColor: "#374151",
    color: "white",
    padding: "0.75rem 1.25rem",
    borderRadius: "0.5rem",
    border: "1px solid #4b5563",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "0.9rem",
    fontWeight: "500",
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
  statCardGlow: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)",
    transform: "translateX(-100%)",
    transition: "transform 0.6s ease",
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
    background: "linear-gradient(135deg, #f97316, #ea580c, #dc2626)",
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
  quantitySection: {
    marginBottom: "2rem",
  },
  quantityLabel: {
    display: "block",
    fontSize: "0.875rem",
    color: "#9ca3af",
    marginBottom: "1rem",
    fontWeight: "600",
    letterSpacing: "0.05em",
  },
  quantityControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(55, 65, 81, 0.8)",
    borderRadius: "1rem",
    padding: "1.5rem",
    border: "1px solid rgba(75, 85, 99, 0.5)",
    backdropFilter: "blur(10px)",
  },
  quantityButton: {
    width: "3rem",
    height: "3rem",
    borderRadius: "50%",
    backgroundColor: "rgba(75, 85, 99, 0.8)",
    border: "1px solid rgba(107, 114, 128, 0.5)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "1.25rem",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  },
  quantityInput: {
    width: "6rem",
    height: "4rem",
    textAlign: "center" as const,
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    fontWeight: "900",
    fontSize: "1.5rem",
    outline: "none",
  },
  totalCost: {
    backgroundColor: "rgba(55, 65, 81, 0.8)",
    borderRadius: "1rem",
    padding: "1.5rem",
    border: "1px solid rgba(75, 85, 99, 0.5)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    backdropFilter: "blur(10px)",
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
  mintButtonGlow: {
    position: "absolute" as const,
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
    transition: "left 0.5s ease",
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
  pillarsSection: {
    marginTop: "6rem",
    textAlign: "center" as const,
  },
  pillarsTitle: {
    fontSize: "3rem",
    fontWeight: "900",
    marginBottom: "1.5rem",
    lineHeight: "1.2",
  },
  pillarsDescription: {
    color: "#d1d5db",
    fontSize: "1.125rem",
    marginBottom: "4rem",
    maxWidth: "64rem",
    margin: "0 auto 4rem",
    lineHeight: "1.7",
  },
  pillarsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "2rem",
    maxWidth: "80rem",
    margin: "0 auto",
  },
  pillarCard: {
    backgroundColor: "rgba(17, 24, 39, 0.8)",
    border: "1px solid rgba(55, 65, 81, 0.5)",
    borderRadius: "1.5rem",
    padding: "2.5rem",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative" as const,
    overflow: "hidden",
  },
  pillarIcon: {
    width: "5rem",
    height: "5rem",
    borderRadius: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1.5rem",
    margin: "0 auto 1.5rem",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
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
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("");
  const [supply, setSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [price, setPrice] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!isConnected || !publicClient) return;

    const fetchContractData = async () => {
      try {
        const [totalSupply, maxSupplyData, mintPrice] = await Promise.all([
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
          publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "MINT_PRICE",
          }),
        ]);

        setSupply(Number(totalSupply));
        setMaxSupply(Number(maxSupplyData));
        setPrice(formatEther(mintPrice as bigint));
      } catch (error) {
        console.error("Error fetching contract data:", error);
        setStatus("Error loading contract data");
      }
    };

    fetchContractData();
  }, [isConnected, publicClient]);

  const handleMint = async () => {
    if (!walletClient || !address) {
      setStatus("Please connect your wallet");
      return;
    }

    setIsLoading(true);
    setStatus("Preparing transaction...");

    try {
      const mintValue = parseEther((quantity * parseFloat(price)).toString());

      // const hash = await walletClient.writeContract({
      //   address: CONTRACT_ADDRESS,
      //   abi: CONTRACT_ABI,
      //   functionName: "mint",
      //   args: [BigInt(quantity)],
      //   value: mintValue,
      // });

      setStatus("Transaction submitted. Waiting for confirmation...");

      // if (publicClient) {
      //   const receipt = await publicClient.waitForTransactionReceipt({ hash });
      //   if (receipt.status === "success") {
      //     setStatus("Mint successful! 🎉");
      //     const newSupply = await publicClient.readContract({
      //       address: CONTRACT_ADDRESS,
      //       abi: CONTRACT_ABI,
      //       functionName: "totalSupply",
      //     });
      //     setSupply(Number(newSupply));
      //   } else {
      //     setStatus("Transaction failed");
      //   }
      // }
    } catch (error: any) {
      console.error("Mint error:", error);
      setStatus(`Mint failed: ${error.shortMessage || error.message}`);
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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      <div style={styles.container}>
        <div style={styles.animatedBackground}></div>

        {/* Header */}
        <header style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <div style={styles.logoDiamond}></div>
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "800" }}>StackFi</h1>
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
            <a
              href="#"
              style={styles.navLink}
              onMouseOver={(e: any) => (e.target.style.color = "#ffffff")}
              onMouseOut={(e: any) => (e.target.style.color = "#9ca3af")}
            >
              Dashboard
            </a>
            <a
              href="#"
              style={styles.navLink}
              onMouseOver={(e: any) => (e.target.style.color = "#ffffff")}
              onMouseOut={(e: any) => (e.target.style.color = "#9ca3af")}
            >
              Governance
            </a>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              style={styles.buyButton}
              onMouseOver={(e: any) =>
                (e.target.style.backgroundColor = "#4b5563")
              }
              onMouseOut={(e: any) =>
                (e.target.style.backgroundColor = "#374151")
              }
            >
              <div>Buy StackFi</div>
              <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>$100</div>
            </button>
            <ConnectButton />
          </div>
        </header>

        <main style={styles.main}>
          {/* Hero Section */}
          <div style={styles.heroSection}>
            <h1 style={styles.heroTitle}>GENESIS NFT MINT</h1>
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
                <div style={styles.statCardGlow}></div>
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
                <div style={styles.statLabel}>MAX SUPPLY</div>
                <div style={{ ...styles.statValue, color: "#10b981" }}>
                  {maxSupply.toLocaleString()}
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
                <div style={styles.statLabel}>MINT PRICE</div>
                <div style={{ ...styles.statValue, color: "#3b82f6" }}>
                  {price} ETH
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
                <div style={styles.statLabel}>PROGRESS</div>
                <div style={{ ...styles.statValue, color: "white" }}>
                  {supply > 0 && maxSupply > 0
                    ? Math.round((supply / maxSupply) * 100)
                    : 0}
                  %
                </div>
              </div>
            </div>

            {/* Right Side - Mint Interface */}
            <div style={styles.mintCard}>
              <div style={styles.mintCardBorder}></div>
              <h2 style={styles.mintTitle}>MINT GENESIS NFT</h2>
              <div style={styles.nftPreview}>
                <div style={styles.nftGlow}></div>
                <span style={{ position: "relative", zIndex: 1 }}>NFT</span>
              </div>

              {isConnected ? (
                <div>
                  {/* Quantity Selector */}
                  <div style={styles.quantitySection}>
                    <label style={styles.quantityLabel}>QUANTITY</label>
                    <div style={styles.quantityControls}>
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={isLoading || quantity <= 1}
                        style={styles.quantityButton}
                        onMouseOver={(e: any) =>
                          !e.target.disabled &&
                          (e.target.style.backgroundColor =
                            "rgba(107, 114, 128, 0.8)")
                        }
                        onMouseOut={(e: any) =>
                          !e.target.disabled &&
                          (e.target.style.backgroundColor =
                            "rgba(75, 85, 99, 0.8)")
                        }
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e: any) =>
                          setQuantity(
                            Math.max(1, Math.min(5, Number(e.target.value)))
                          )
                        }
                        min={1}
                        max={5}
                        style={styles.quantityInput}
                        disabled={isLoading}
                      />
                      <button
                        onClick={() => setQuantity(Math.min(5, quantity + 1))}
                        disabled={isLoading || quantity >= 5}
                        style={styles.quantityButton}
                        onMouseOver={(e: any) =>
                          !e.target.disabled &&
                          (e.target.style.backgroundColor =
                            "rgba(107, 114, 128, 0.8)")
                        }
                        onMouseOut={(e: any) =>
                          !e.target.disabled &&
                          (e.target.style.backgroundColor =
                            "rgba(75, 85, 99, 0.8)")
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total Cost */}
                  <div style={styles.totalCost}>
                    <span style={{ color: "#9ca3af", fontWeight: "600" }}>
                      TOTAL COST
                    </span>
                    <span style={{ fontSize: "1.5rem", fontWeight: "900" }}>
                      {(quantity * parseFloat(price)).toFixed(4)} ETH
                    </span>
                  </div>

                  {/* Mint Button */}
                  <button
                    onClick={handleMint}
                    disabled={isLoading || !CONTRACT_ADDRESS}
                    style={{
                      ...styles.mintButton,
                      ...(isLoading
                        ? { opacity: 0.7, cursor: "not-allowed" }
                        : {}),
                    }}
                    onMouseOver={(e: any) => {
                      if (!isLoading) {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 20px 40px rgba(37, 99, 235, 0.4)";
                      }
                    }}
                    onMouseOut={(e: any) => {
                      if (!isLoading) {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }
                    }}
                  >
                    <div style={styles.mintButtonGlow}></div>
                    {isLoading ? "MINTING..." : "MINT NFT"}
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
          {supply > 0 && maxSupply > 0 && (
            <div style={styles.progressSection}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <h3
                  style={{ fontSize: "1.5rem", fontWeight: "800", margin: 0 }}
                >
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
                  {Math.round((supply / maxSupply) * 100)}%)
                </span>
              </div>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${(supply / maxSupply) * 100}%`,
                  }}
                >
                  <div style={styles.progressGlow}></div>
                </div>
              </div>
            </div>
          )}

          {/* Features Section */}
          <div style={styles.pillarsSection}>
            <h2 style={styles.pillarsTitle}>
              <span style={{ color: "white" }}>3 PILLARS OF </span>
              <span style={{ color: "#f97316" }}>GENESIS UTILITY</span>
            </h2>
            <p style={styles.pillarsDescription}>
              StackFi's Genesis NFTs intelligently unlock exclusive features
              across DeFi protocols and NFT marketplaces. By holding Genesis
              NFTs, you gain access to advanced leverage strategies, governance
              rights, and premium platform features with enhanced capital
              efficiency.
            </p>

            <div style={styles.pillarsGrid}>
              <div
                style={styles.pillarCard}
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
                  style={{ ...styles.pillarIcon, backgroundColor: "#ea580c" }}
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
                style={styles.pillarCard}
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
                  style={{ ...styles.pillarIcon, backgroundColor: "#1d4ed8" }}
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
                  efficiency up to 15x
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
                style={styles.pillarCard}
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
                  style={{ ...styles.pillarIcon, backgroundColor: "#059669" }}
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
                  Earn additional rewards through NFT staking and protocol fee
                  sharing
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
                  Enhanced yield farming and staking rewards for NFT holders
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
                href="https://twitter.com/stackfi"
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
                href="https://t.me/stackfi"
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
                href="https://discord.gg/stackfi"
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
