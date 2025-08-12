const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying with account:', deployer.address);

  const Registry = await ethers.getContractFactory('CarAuctionRegistry');
  const registry = await Registry.deploy();

  await registry.waitForDeployment();

  console.log('CarAuctionRegistry deployed at:', registry.target);
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
