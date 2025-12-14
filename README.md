
# Onchain Reputation & Impact Program (Celo)

## Overview
This project is an onchain reputation and impact tracking system built on the Celo blockchain. It enables programs, communities, and public-good initiatives to verify real contributions, assign transparent reputation scores, issue soulbound achievement badges, and display public wallet-based user profiles.

The system is designed to be open, portable, and resistant to manipulation, allowing contributors to own their reputation while organizers gain reliable insight into participation and impact.

---

## Problem
Community programs, open-source initiatives, and public-good projects often rely on off-chain tools such as spreadsheets, screenshots, or centralized databases to track participation and impact. These methods are difficult to verify, easy to manipulate, and not portable across platforms.

As a result:
- Contributors lack a trusted, verifiable reputation they can reuse
- Organizers struggle to measure engagement accurately
- Sybil behavior and false claims are difficult to prevent
- Impact data is fragmented and siloed

There is no standard, onchain way to represent verified participation and contribution.

---

## Solution
This project introduces an onchain reputation system deployed on Celo that records verified contributions directly on the blockchain.

The system provides:
- Onchain reputation scores tied to wallet addresses
- Non-transferable (soulbound) achievement badges
- Trusted attestations to verify real-world or onchain actions
- Public, wallet-based profiles that display reputation and achievements

By leveraging Celo’s low-cost, mobile-first infrastructure, the solution enables inclusive participation while maintaining transparency, auditability, and long-term usability.

---

## Key Features
- Track real contributions such as building, helping, donating, and participating
- Assign and update reputation scores onchain
- Issue soulbound badges representing achievements and milestones
- Display public user profiles accessible via wallet address
- Reduce sybil attacks through trusted attestations

---

## Technology Stack

### Blockchain
- Celo (Alfajores Testnet / Celo Mainnet)
- Solidity (v0.8.18)
- OpenZeppelin Contracts

### Smart Contracts
- `ReputationRegistry.sol` – Manages onchain reputation scores
- `SoulboundBadge.sol` – Issues non-transferable ERC-721 achievement badges
- `AttestationRegistry.sol` – Stores verified attestations linked to users

### Frontend
- Next.js (React)
- Ethers.js
- Wagmi (wallet connections)
- Basic CSS for styling

### Tooling
- Hardhat (contract compilation & deployment)
- Node.js & npm

---

## Scripts Used

### Development Scripts
- `npm run dev` – Starts the Next.js development server
- `npm run build` – Builds the frontend for production
- `npm run start` – Runs the production build locally
- `npm run compile` – Compiles smart contracts using Hardhat

---

## Project Structure

## Architecture Overview

The system is composed of three core layers: Smart Contracts, Frontend Application, and Users / Integrators.  
All reputation and achievement data is stored onchain, while the frontend acts as a read/write interface.

┌──────────────────────────┐
                    │        Users              │
                    │ (Wallets: Valora, MetaMask│
                    │  WalletConnect)           │
                    └───────────┬──────────────┘
                                │
                                │ Wallet Connection
                                ▼
┌───────────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                       │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ Dashboard (index.js)                                   │ │
│ │ - View reputation score                                │ │
│ │ - View badges                                          │ │
│ │ - View attestations                                    │ │
│ └───────────────────────────────────────────────────────┘ │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ Public Profile (/profile/[address])                    │ │
│ │ - Public reputation display                            │ │
│ │ - Shareable profile link                               │ │
│ └───────────────────────────────────────────────────────┘ │
└───────────────────────────┬───────────────────────────────┘
                            │
                            │ Read / Write (ethers.js)
                            ▼
┌───────────────────────────────────────────────────────────┐
│                    Celo Blockchain                         │
│                                                           │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ ReputationRegistry.sol                                 │ │
│ │ - Stores reputation scores                             │ │
│ │ - Updates via authorized accounts                      │ │
│ └───────────────────────────────────────────────────────┘ │
│                                                           │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ SoulboundBadge.sol                                     │ │
│ │ - Mints non-transferable ERC-721 badges                │ │
│ │ - Represents achievements & milestones                 │ │
│ └───────────────────────────────────────────────────────┘ │
│                                                           │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ AttestationRegistry.sol                                │ │
│ │ - Stores verified contribution attestations            │ │
│ │ - Reduces sybil and false claims                       │ │
│ └───────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
