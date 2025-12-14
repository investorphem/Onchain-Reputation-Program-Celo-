// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AttestationRegistry is Ownable {
    struct Attestation {
        address issuer;
        string description;
        uint256 timestamp;
    }

    mapping(address => Attestation[]) private attestations;

    event Attested(address indexed user, string description);

    // Add this constructor to resolve the error
    constructor(address initialOwner) Ownable(initialOwner) {
        // The contract owner will be set to the initialOwner address provided at deployment
    }

    function attest(address user, string calldata description) external onlyOwner {
        attestations[user].push(
            Attestation(msg.sender, description, block.timestamp)
        );
        emit Attested(user, description);
    }

    function getAttestations(address user)
        external
        view
        returns (Attestation[] memory)
    {
        return attestations[user];
    }
}
