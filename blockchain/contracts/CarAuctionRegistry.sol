// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CarAuctionRegistry is Ownable {
    // Pass msg.sender to Ownable’s constructor
    constructor() Ownable(msg.sender) {}

    /// @notice Emitted when an auction is closed on‐chain
    /// @param carId    the internal ID of the car
    /// @param winner   the address of the winning bidder
    /// @param amount   the winning bid amount (in wei)
    /// @param timestamp block timestamp of closure
    event AuctionClosed(
        uint256 indexed carId,
        address indexed winner,
        uint256 amount,
        uint256 timestamp
    );

    /// @notice Record the final sale of a car; only the owner (deployer) may call.
    /// @param carId  the internal car ID
    /// @param winner the winning bidder address
    /// @param amount the final sale price
    function recordSale(
        uint256 carId,
        address winner,
        uint256 amount
    ) external onlyOwner {
        emit AuctionClosed(carId, winner, amount, block.timestamp);
    }
}
