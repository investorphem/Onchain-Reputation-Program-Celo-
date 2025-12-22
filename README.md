Onchain Reputation & Impact Program (Celo)

Overview

This project is an onchain reputation and impact tracking system built on the Celo blockchain. It enables programs, communities, and public-good initiatives to verify real contributions, assign transparent reputation scores, issue soulbound achievement badges, and display public wallet-based user profiles.

The system is designed to be open, portable, and resistant to manipulation, allowing contributors to own their reputation while organizers gain reliable insight into participation and impact.


---

Problem

Community programs, open-source initiatives, and public-good projects often rely on off-chain tools such as spreadsheets, screenshots, or centralized databases to track participation and impact. These methods are difficult to verify, easy to manipulate, and not portable across platforms.

As a result:

Contributors lack a trusted, verifiable reputation they can reuse

Organizers struggle to measure engagement accurately

Sybil behavior and false claims are difficult to prevent

Impact data is fragmented and siloed


There is no standard, onchain way to represent verified participation and contribution.


---

Solution

This project introduces an onchain reputation system deployed on Celo that records verified contributions directly on the blockchain.

The system provides:

Onchain reputation scores tied to wallet addresses

Non-transferable (soulbound) achievement badges

Trusted attestations to verify real-world or onchain actions

Public, wallet-based profiles that display reputation and achievements

Divvi referral tracking for attribution


By leveraging Celo’s low-cost, mobile-first infrastructure, the solution enables inclusive participation while maintaining transparency, auditability, and long-term usability.


---

Key Features

Track real contributions such as building, helping, donating, and participating

Assign and update reputation scores onchain

Issue soulbound badges representing achievements and milestones

Display public user profiles accessible via wallet address

Reduce sybil attacks through trusted attestations

Track referrals automatically via Divvi SDK



---

Technology Stack

Blockchain

Celo (Alfajores Testnet / Mainnet)

Solidity (v0.8.18)

OpenZeppelin Contracts


Smart Contracts

ReputationRegistry.sol – Manages onchain reputation scores

SoulboundBadge.sol – Issues non-transferable ERC-721 achievement badges

AttestationRegistry.sol – Stores verified attestations linked to users


Frontend

Next.js (React 18)

Ethers.js (v6)

Wagmi (v2) for wallet connection

Viem for advanced wallet client handling

TailwindCSS / Basic CSS for styling


Tooling

Hardhat (contract compilation & deployment)

Node.js & npm



---

Environment Variables

Create a .env.local file in the root:

NEXT_PUBLIC_REPUTATION_ADDRESS=0x36f1B6fB30b5436f1e07f0842Ca75a460078ECB2
NEXT_PUBLIC_ATTESTED_ADDRESS=0xf002cC276ab30fb67D00f214fE078f3198211235
NEXT_PUBLIC_SOULBOUND_ADDRESS=<YOUR_SOULBOUND_BADGE_ADDRESS>
NEXT_PUBLIC_DIVVI_CONSUMER=0xec24bAfBc989a9bE5f6F0eAD8848753B5E4aE0B6


---

Scripts

Development

npm run dev       # Start Next.js development server
npm run build     # Build frontend for production
npm run start     # Run production build locally
npm run compile   # Compile smart contracts using Hardhat


---

Project Structure

/lib
  sendTrackedTx.js      # Handles onchain transactions and Divvi tracking
  divvi.js              # Divvi SDK helper functions
/pages
  index.js              # Main dashboard UI
  profile/[address].js  # Public profile pages
/styles
  globals.css           # Styling
.env.local              # Contract addresses and Divvi consumer key


---

Architecture Overview

The system is composed of three layers: Smart Contracts, Frontend Application, and Users / Integrators.
All reputation and achievement data is stored onchain; the frontend acts as a read/write interface.

┌──────────────────────────┐
│          Users           │
│ Wallets: MetaMask, Valora│
│ WalletConnect            │
└───────────┬─────────────┘
            │ Wallet Connection
            ▼
┌─────────────────────────────┐
│ Frontend (Next.js)          │
│ ┌─────────────────────────┐ │
│ │ Dashboard (index.js)    │ │
│ │ - View reputation score │ │
│ │ - View badges           │ │
│ │ - Record contributions  │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Public Profile          │ │
│ │ - Reputation display    │ │
│ │ - Badges & attestations │ │
│ └─────────────────────────┘ │
└───────────┬─────────────────┘
            │ Read/Write (ethers.js)
            ▼
┌─────────────────────────────┐
│ Celo Blockchain             │
│ ┌─────────────────────────┐ │
│ │ ReputationRegistry.sol   │ │
│ │ - Stores reputation     │ │
│ │ - Updates via functions │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ SoulboundBadge.sol       │ │
│ │ - Mint non-transferable │ │
│ │   ERC-721 badges        │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ AttestationRegistry.sol  │ │
│ │ - Stores attestations   │ │
│ │ - Reduces sybil attacks │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘


---

How It Works

1. Connect Wallet: Users connect a Celo-compatible wallet.


2. Fetch Reputation: Reads current score from ReputationRegistry.


3. Record Contribution: Updates onchain reputation and tracks referral with Divvi.


4. Issue Attestation: Attestations stored in AttestationRegistry.


5. Mint Badge: Soulbound badges awarded for verified contributions.


6. Public Profile: Display all reputation, attestations, and badges tied to wallet.




---

Future Improvements

Complete implementation of SoulboundBadge contract.

Off-chain verification of actions contributing to reputation.

Enhanced UI for badges, attestations, and contribution history.

Deploy on Celo mainnet with real-world programs.



---

License

MIT License