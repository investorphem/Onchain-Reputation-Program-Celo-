// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ReputationRegistry is Ownable {
    mapping(address => uint256) public reputation;

    event ReputationUpdated(address indexed user, uint256 newScore);

    // --- FIX START ---
    // Add a constructor that takes the owner's address and passes it to Ownable
    constructor(address initialOwner) Ownable(initialOwner) {
        // You can add other initialization logic here if needed
    }
    // --- FIX END ---

    function increaseReputation(address user, uint256 amount) external onlyOwner {
        reputation[user] += amount;
        emit ReputationUpdated(user, reputation[user]);
    }

    function getReputation(address user) external view returns (uint256) {
        return reputation[user];
    }
}
