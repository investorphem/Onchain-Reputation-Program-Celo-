# Onchain Reputation & Impact Program (Celo)

## Overview
The Onchain Reputation & Impact Program is a decentralized system built on the Celo blockchain that tracks real contributions, assigns transparent onchain reputation scores, records trusted attestations, and (optionally) issues soulbound achievement badges.  

It enables communities, public-good programs, hackathons, DAOs, and open-source projects to verify participation and impact without relying on centralized databases.

Contributors fully own their reputation through their wallet, making it portable, verifiable, and resistant to manipulation.

---

## Problem
Most community programs track participation using off-chain tools such as:
- Google Sheets
- Screenshots
- Forms
- Centralized databases

These approaches suffer from major issues:
- No cryptographic verification
- Easy to manipulate or fake
- Reputation is not portable
- Sybil attacks are hard to prevent
- Contributors cannot reuse their impact history elsewhere

There is no standard, composable way to represent verified contributions onchain.

---

## Solution
This project introduces an **onchain reputation layer on Celo** that records verified actions directly on the blockchain.

The system:
- Stores reputation scores onchain
- Records trusted attestations about user actions
- Allows programs to increase reputation transparently
- Exposes public, wallet-based reputation profiles
- Is mobile-friendly and low-cost thanks to Celo

Instead of trusting screenshots or claims, reputation is derived from **onchain transactions and attestations**.

---

## How It Works

1. **Wallet Connection**
   - A user connects their wallet (MetaMask, Valora, WalletConnect).
   - The wallet address becomes their unique identity.

2. **Reading Reputation**
   - The frontend reads the user’s reputation from `ReputationRegistry`.
   - Anyone can view reputation for any wallet address.

3. **Recording Contributions**
   - When a user performs a verified action (builds, helps, donates, participates):
     - An authorized account or contract calls `increaseReputation(user, amount)`.
     - The score is updated onchain.

4. **Attestations**
   - Trusted issuers (programs, organizers, DAOs) call:
     `attest(user, description)`
   - This creates an immutable record of *what the user did* and *who verified it*.

5. **Public Profiles**
   - A public dashboard displays:
     - Wallet address
     - Reputation score
     - Attestations
     - (Future) soulbound badges

6. **Portability**
   - Because data is onchain:
     - Any app can read it
     - Users carry reputation across platforms

---

## Architecture Overview

```
┌──────────────────────────┐
│          Users           │
│ (Wallets: MetaMask,     │
│  Valora, WalletConnect) │
└───────────┬─────────────┘
            │ Wallet Connection
            ▼
┌──────────────────────────────────────────────┐
│              Frontend (Next.js)               │
│                                              │
│  • Connect wallet (wagmi)                     │
│  • Read reputation score                     │
│  • Submit contribution transactions          │
│  • Display attestations & profile             │
└───────────────────┬──────────────────────────┘
                    │ ethers.js / wagmi
                    ▼
┌──────────────────────────────────────────────┐
│                Celo Blockchain                │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ ReputationRegistry.sol                  │  │
│  │ - Stores reputation scores              │  │
│  │ - increaseReputation()                  │  │
│  │ - getReputation()                       │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ AttestationRegistry.sol                 │  │
│  │ - attest(user, description)             │  │
│  │ - getAttestations(user)                 │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ SoulboundBadge.sol (Planned)             │  │
│  │ - Non-transferable badges               │  │
│  │ - Achievement milestones                │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

---

## Smart Contracts

### ReputationRegistry
- Stores onchain reputation scores
- Reputation is mapped to wallet addresses
- Only authorized callers can increase scores

Key functions:
- `getReputation(address user) → uint256`
- `increaseReputation(address user, uint256 amount)`

---

### AttestationRegistry
- Stores trusted attestations about user actions
- Each attestation includes:
  - Issuer address
  - Description
  - Timestamp

Key functions:
- `attest(address user, string description)`
- `getAttestations(address user)`

---

### SoulboundBadge (Planned)
- Non-transferable ERC-721 badges
- Represents achievements, milestones, or certifications
- Badges cannot be sold or transferred

---

## Technology Stack

### Blockchain
- Celo (Alfajores / Mainnet)
- Solidity ^0.8.x
- OpenZeppelin Contracts

### Frontend
- Next.js 14
- React 18
- ethers.js (v6)
- wagmi
- viem

### Tooling
- Hardhat
- Node.js
- npm

---

## Scripts

```bash
npm run dev       # Start frontend locally
npm run build     # Build production frontend
npm run start     # Run production build
npm run compile   # Compile smart contracts
```

---

## Environment Variables

Create a `.env.local` file (do NOT commit it):

```env
NEXT_PUBLIC_REPUTATION_ADDRESS=0xYourReputationRegistry
NEXT_PUBLIC_ATTESTATION_ADDRESS=0xYourAttestationRegistry
```

---

## Why This Matters
- Contributors own their reputation
- Communities get verifiable participation data
- Reputation becomes composable across apps
- Sybil attacks are reduced via attestations
- Mobile-first and accessible on Celo

---

## Future Improvements
- Soulbound badge minting
- Public profile routes `/profile/[address]`
- DAO-based attestation permissions
- Reputation decay & weighting
- Integration with more identity systems

---

## License
MIT