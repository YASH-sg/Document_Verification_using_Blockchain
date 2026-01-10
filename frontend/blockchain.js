// blockchain.js
// - Address from your original file
const contractAddress = "0xEB024254d73D078A7719CAC39deD3B0E8D6C3Fc2";

// - ABI matching your Solidity contract
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "fileHash", "type": "bytes32" },
      { "indexed": false, "internalType": "string", "name": "ipfsCid", "type": "string" },
      { "indexed": false, "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "DocumentRegistered",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "_fileHash", "type": "bytes32" },
      { "internalType": "string", "name": "_ipfsCid", "type": "string" }
    ],
    "name": "registerDocument",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "_fileHash", "type": "bytes32" }
    ],
    "name": "getCid",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// --- 1. Store Hash + CID (Issuer) ---
async function registerDocumentOnBlockchain(hash, cid) {
  if (!window.ethereum) return alert("MetaMask not installed");

  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  // Ensure hash is strictly 0x... (32 bytes)
  if (!hash.startsWith("0x")) hash = "0x" + hash;

  console.log(`Registering: Hash=${hash}, CID=${cid}`);
  
  try {
      const tx = await contract.registerDocument(hash, cid);
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      alert(`✅ Success! Document linked to IPFS CID: ${cid}`);
  } catch (error) {
      console.error("Blockchain Error:", error);
      alert("Transaction failed: " + (error.reason || error.message));
  }
}

// --- 2. Verify & Get CID (Verifier) ---
async function verifyHashOnBlockchain(hash) {
  if (!window.ethereum) return false;

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    if (!hash.startsWith("0x")) hash = "0x" + hash;

    const cid = await contract.getCid(hash);
    console.log("Found CID:", cid);
    return cid; 

  } catch (error) {
    console.warn("Hash not found on blockchain");
    return false; 
  }
}