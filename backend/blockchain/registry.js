const fs      = require('fs');
const path    = require('path');
const ethers  = require('ethers');
require('dotenv').config();

const artifactPath = path.join(
  __dirname,
  '../../blockchain/artifacts/contracts/CarAuctionRegistry.sol/CarAuctionRegistry.json'
);
const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
const ABI = artifact.abi;

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet   = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const registry = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  ABI,
  wallet
);

module.exports = { registry, wallet, ethers };
