export const SOULBOUND_BADGE_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function tokenIdCounter() view returns (uint256)",
  "function owner() view returns (address)",
  "function mintBadge(address to, string uri)"
];