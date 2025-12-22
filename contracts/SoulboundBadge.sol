// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulboundBadge is ERC721URIStorage, Ownable {
    uint256 public tokenIdCounter;

    constructor() 
        ERC721("SoulboundBadge", "SBB") 
        Ownable(msg.sender) 
    {}

    function mintBadge(address to, string memory uri) external onlyOwner {
        tokenIdCounter++;
        _safeMint(to, tokenIdCounter);
        _setTokenURI(tokenIdCounter, uri);
    }

    // ✅ OpenZeppelin v5 soulbound enforcement
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);

        // Allow minting (from == address(0))
        if (from != address(0)) {
            revert("Soulbound: transfer disabled");
        }

        return super._update(to, tokenId, auth);
    }
}