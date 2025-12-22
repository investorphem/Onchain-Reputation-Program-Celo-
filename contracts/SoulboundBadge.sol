// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract SoulboundBadge is ERC721URIStorage, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public tokenIdCounter;

    // user => list of tokenIds
    mapping(address => uint256[]) private userBadges;

    constructor(address admin) ERC721("SoulboundBadge", "SBB") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    function mintBadge(address to, string memory uri)
        external
        onlyRole(MINTER_ROLE)
    {
        tokenIdCounter++;
        _safeMint(to, tokenIdCounter);
        _setTokenURI(tokenIdCounter, uri);
        userBadges[to].push(tokenIdCounter);
    }

    function getBadges(address user) external view returns (string[] memory) {
        uint256[] memory ids = userBadges[user];
        string[] memory uris = new string[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            uris[i] = tokenURI(ids[i]);
        }
        return uris;
    }

    // 🔒 Soulbound enforcement
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(from == address(0), "Soulbound: transfer disabled");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}