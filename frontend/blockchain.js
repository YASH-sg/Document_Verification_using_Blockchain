const contractAddress = "0x43546220a660cB1851134fA3F6287047482d9591";

const contractABI = [
  
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "hash",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "DocumentStored",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_hash",
				"type": "string"
			}
		],
		"name": "storeHash",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_hash",
				"type": "string"
			}
		],
		"name": "verifyHash",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}

];

async function storeHashOnBlockchain(hash) {
  if (!window.ethereum) {
    alert("MetaMask not installed");
    return;
  }

  // Request account access
  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  // MetaMask confirmation will pop up here
  const tx = await contract.storeHash(hash);
  await tx.wait();

  alert("✅ Hash stored on blockchain successfully!");
}
// ... existing code (contractAddress, contractABI, storeHashOnBlockchain) ...

// Adapted from your readHash.js for the Browser
async function verifyHashOnBlockchain(hash) {
  try {
    // 1. Check for MetaMask
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return false;
    }

    // 2. Use BrowserProvider (connects to your MetaMask wallet)
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // 3. Create Contract Instance (Read-only connection is fine for verification)
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    // 4. Call the verifyHash function (matches ABI in readHash.js)
    console.log("Verifying hash on blockchain:", hash);
    const isValid = await contract.verifyHash(hash);
    
    console.log("Is Valid?", isValid);
    return isValid;

  } catch (error) {
    console.error("Error verifying hash:", error);
    alert("Check console for error details");
    return false;
  }
}


// - APPEND THIS TO THE END OF THE FILE

async function getIssuerHistory() {
  if (!window.ethereum) return [];

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    // 1. Get the current block number
    const currentBlock = await provider.getBlockNumber();
    
    // 2. Calculate a safe starting block (e.g., 40,000 blocks ago)
    // This prevents the "exceed maximum block range" error
    let fromBlock = currentBlock - 40000;
    if (fromBlock < 0) fromBlock = 0;

    // Filter: Look for 'DocumentStored' events where 'sender' is the user
    const filter = contract.filters.DocumentStored(null, userAddress);
    
    // 3. Fetch events ONLY within the safe range
    console.log(`Scanning from block ${fromBlock} to ${currentBlock}...`);
    const events = await contract.queryFilter(filter, fromBlock, "latest");

    // Format the data (Newest first)
    return events.reverse().map(event => ({
      docHash: event.args[0], 
      txHash: event.transactionHash,
      block: event.blockNumber
    }));

  } catch (err) {
    console.error("Error fetching history:", err);
    return [];
  }
}