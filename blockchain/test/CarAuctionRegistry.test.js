const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('CarAuctionRegistry', function () {
  let registry, owner, other;

  beforeEach(async () => {
    [owner, other] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory('CarAuctionRegistry');
    registry = await Factory.deploy();
    await registry.deployed();
  });

  it('allows owner to record and emits AuctionClosed', async () => {
    await expect(
      registry.recordSale(42, other.address, 1000)
    )
    .to.emit(registry, 'AuctionClosed')
    .withArgs(42, other.address, 1000, anyValue);
  });

  it('blocks non-owner', async () => {
    await expect(
      registry.connect(other).recordSale(1, other.address, 1)
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });
});
