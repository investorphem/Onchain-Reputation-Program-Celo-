// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulboundBadge is ERC721URIStorage, Ownable {
    uint256 public tokenIdCounter;

    constructor() ERC721("SoulboundBadge", "SBB") {}

    function mintBadge(address to, string memory uri) external onlyOwner {
        tokenIdCounter++;
        _mint(to, tokenIdCounter);
        _setTokenURI(tokenIdCounter, uri);
    }

    function _transfer(address, address, uint256) internal pure override {
        revert("Soulbound: transfer disabled");
    }
}
