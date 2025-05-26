"use client"; // if using app directory
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI } from "@/lib/abi";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("");
  const [supply, setSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [price, setPrice] = useState("0");

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const p = new ethers.BrowserProvider(window.ethereum);
      p.getSigner().then((s) => {
        setProvider(p);
        setSigner(s);
        const c = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, s);
        setContract(c);
        c.totalSupply().then((supply) => setSupply(Number(supply)));
        c.MAX_SUPPLY().then((max) => setMaxSupply(Number(max)));
        c.MINT_PRICE().then((p) => setPrice(ethers.formatEther(p)));
      });
    }
  }, []);

  const handleMint = async () => {
    if (!contract) return;
    try {
      const tx = await contract.mint(quantity, {
        value: ethers.parseEther((quantity * parseFloat(price)).toString()),
      });
      setStatus("Waiting for confirmation...");
      await tx.wait();
      setStatus("Mint successful!");
    } catch (e) {
      setStatus("Mint failed: " + (e.reason || e.message));
    }
  };

  return (
    <main
      style={{
        maxWidth: 600,
        margin: "auto",
        textAlign: "center",
        paddingTop: 50,
      }}
    >
      <h1>StackFI DAO Genesis Mint</h1>
      <p>
        {supply} / {maxSupply} minted
      </p>
      <p>Price: {price} ETH per NFT</p>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        min={1}
        max={5}
      />
      <br />
      <br />
      <button onClick={handleMint}>Mint</button>
      <p>{status}</p>
    </main>
  );
}
