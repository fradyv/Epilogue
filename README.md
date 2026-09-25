# Epilogue

Epilogue is a decentralized web app (DApp) for university students. It combines an AI companion powered by Google Gemini with optional on-chain records on **BOT Chain**. Students can talk through three support modes—mental resilience, productivity coaching, and safety reporting without an email or password account. Sign in uses MetaMask, sensitive report text is never written to the blockchain only cryptographic hashes are stored on-chain as tamper-evident anchors.

Built for **Girl Meets Tech: Build Week Hackathon Vol.2** (AI Advice Bot track).

## What it does

- **Landing page** — Introduces Epilogue, Herlambang, and how Web3 login works.
- **Wallet login** — Connect MetaMask; Laravel creates a session from your wallet address.
- **AI chat (3 modes)**
  - **Resilience** — CBT style support for imposter syndrome, burnout, and academic stress.
  - **Productivity** — Study planning and time blocking coaching.
  - **Safety** — Trauma informed support for bullying, harassment, and campus safety concerns.
- **Crisis escalation** — When the AI detects a crisis, a banner shows hotline and campus reporting guidance.
- **On-chain features (BOT Chain)**
  - **Safety:** `logSafetyReport(reportHash, anonymous)` — Laravel SHA-256 hashes your report text; you submit only the hash via MetaMask.
  - **Resilience / Productivity (optional):** `mintAdvice(category, contentHash)` — Mint a hash of an AI reply as an on chain record.

Smart contract source: [`contracts/EpilogueRegistry.sol`](contracts/EpilogueRegistry.sol). ABI: [`contracts/abi/Epilogue.json`](contracts/abi/Epilogue.json).

## How to use the app (end users)

1. Open the site and click **Connect Wallet** (MetaMask or any Web3 wallet).
2. Approve connection and, if prompted, switch to **BOT Chain** (testnet or mainnet, depending on deployment).
3. Enter **Chat** and choose a mode.
4. Type your message and send, the AI replies in English with conversation context.
5. **Safety mode + crisis:** If the escalation banner appears, read the hotline info. To anchor a report on-chain, click **Log report on-chain (anonymous)** and confirm the transaction in your Web3 wallet. Only a hash is stored on chain, **not your full message text**.
6. **Resilience / Productivity:** Optionally use **Mint this advice on-chain** under an AI message to record a hash of that advice.

## Local development

### Requirements

- PHP 8.2+, Composer, Node.js 18+, npm
- MySQL or SQLite (configure in `.env`)
- [MetaMask](https://metamask.io/) browser extension (or any Web3 wallet extension you have)
- Google Gemini API key

### Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Configure `.env`:

- `GEMINI_API_KEY` — from Google AI Studio
- Database (`DB_*`) if using MySQL
- BOT Chain / contract (for frontend builds):

```env
VITE_BOT_CHAIN_ID=968          # or 677 for mainnet
VITE_BOT_CHAIN_RPC=https://rpc.bohr.life   # or https://rpc.botchain.ai for mainnet
VITE_EPILOGUE_CONTRACT=0x...   # your deployed EpilogueRegistry address
```

```bash
php artisan migrate
npm install
npm run dev
php artisan serve
```

Visit `http://localhost:8000`. Restart `npm run dev` after changing any `VITE_*` variable.

**PHP version:** This project requires **PHP 8.4+** (Symfony 8.1 in `composer.lock`). Local and CI should use PHP 8.4. The repo includes `.php-version` and `nixpacks.toml` for [Railway](https://railway.com).

### Railway

1. Connect the GitHub repo as a **Web Service**.
2. Add a **PostgreSQL** or **MySQL** plugin (or use SQLite only for quick tests—not ideal for production).
3. Set environment variables before deploy (especially `VITE_*` so `npm run build` embeds BOT Chain settings):
   - `APP_KEY`, `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://your-railway-domain`
   - `GEMINI_API_KEY`
   - `DATABASE_URL` (from Railway database)
   - `VITE_BOT_CHAIN_ID`, `VITE_BOT_CHAIN_RPC`, `VITE_EPILOGUE_CONTRACT`
4. Push commits including `.php-version`, `nixpacks.toml`, and `composer.lock`. Redeploy.

Nixpacks runs `composer install --no-dev`, `npm ci && npm run build`, then starts with migrations + `php artisan serve`.

### Deploy contract (Remix)

1. Open [`contracts/EpilogueRegistry.sol`](contracts/EpilogueRegistry.sol) in [Remix IDE](https://remix.ethereum.org/).
2. Compile with Solidity **0.8.20+**.
3. Deploy with **Injected Provider (MetaMask)** on BOT Chain testnet (968) or mainnet (677).
4. Copy the contract address into `VITE_EPILOGUE_CONTRACT` and rebuild the frontend.

Explorers: [Bohr testnet scan](https://scan.bohr.life) · [BOT mainnet scan](https://scan.botchain.ai)


### EpilogueRegistry contract addresses

Contract name: **`EpilogueRegistry`** (see `contracts/EpilogueRegistry.sol`).

| Network | Chain ID | RPC | Contract address |
|--------|----------|-----|------------------|
| BOT Chain Testnet (Bohr) | 968 | `https://rpc.bohr.life` | `0x1615AA1688FE267A70D31726832cA29c2374f2c2` |
| BOT Chain Mainnet | 677 | `https://rpc.botchain.ai` | `0x4Fbdd660BE9Ab2825e06B7Af8eACd86bdcB5fC6A` |

Verify on explorers:

- Testnet: `https://scan.bohr.life/address/0x1615AA1688FE267A70D31726832cA29c2374f2c2`
- Mainnet: [https://scan.botchain.ai/address/0x4Fbdd660BE9Ab2825e06B7Af8eACd86bdcB5fC6A](https://scan.botchain.ai/address/0x4Fbdd660BE9Ab2825e06B7Af8eACd86bdcB5fC6A)


## Project structure (high level)

- `app/Http/Controllers/` — Chat, wallet auth, safety report hashing
- `resources/js/Pages/` — Landing and Chat (Inertia + React)
- `routes/web.php` — Web routes, auth, chat API
- `contracts/` — Solidity and ABI for judges and frontend

## License

MIT (application code). Smart contract: SPDX-License-Identifier MIT in `EpilogueRegistry.sol`.
