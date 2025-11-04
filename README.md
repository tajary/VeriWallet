# VeriWallet

**VeriWallet** is a wallet-based identity verification and credential passport platform.
It enables users to prove their identity once (e.g., KYC, proof-of-personhood) and reuse those credentials seamlessly across DeFi protocols, marketplaces, and Web3 applications.

---

## 🚀 Problem

Web3 users face repetitive and fragmented verification processes:

* **Friction** – Every platform requires users to redo KYC.
* **Trust Gaps** – dApps struggle to distinguish between unique and duplicate users.
* **Compliance Risks** – DeFi pools and DAOs often lack verifiable, compliant participants.

---

## 💡 Solution

VeriWallet provides **portable, cryptographically signed credentials** linked to a user’s wallet.

* Users verify once, then reuse credentials across multiple platforms.
* dApps verify credentials easily via API or smart contract calls.
* Users may optionally showcase a **Claim Passport** with selected verified attributes.

---

## 🔑 Key Features

* **Wallet Login** – Connect via MetaMask, WalletConnect, or AIR Account Services.
* **KYC Integration** – Redirect to trusted verification providers (e.g., Onfido).
* **Credential Issuance** – Signed, tamper-proof credentials bound to the user’s wallet.
* **Verification API** – Easy integration for dApps to check a wallet’s verification status.
* **Claim Passport (Optional)** – Public profile displaying verified claims.
* **DeFi Integration** – Unlock gated pools, higher APYs, or preferential loan rates.

---

## 🛠️ Moca Stack Integration

* **AIR Account Services** – Wallet-based login & single sign-on.
* **AIR Credential Services** – Credential issuance and verification.
* **Moca Chain** – On-chain storage of credential proofs & revocation data.

---

## 🔄 User Flow

1. **Login** – User connects wallet & signs a nonce for authentication.
2. **Verification** – If not verified, redirect to the KYC provider.
3. **Credential Issuance** – Backend issues a signed credential linked to the wallet.
4. **Reuse** – User presents the credential to dApps for instant verification.
5. **Verification API** – dApps validate credentials via API or smart contract call.
6. **Claim Passport (Optional)** – User chooses to share verified claims publicly.

---

## 📊 Success Metrics

* **Verified Wallets** – Total number of wallets with issued credentials.
* **dApp Integrations** – Number of partner platforms using the verification API.
* **Credential Reuse Rate** – Average number of times each credential is reused.

---

## 🎯 Roadmap (MVP)

**Day 1**

* Wallet login (MetaMask, WalletConnect).
* Nonce signing & backend authentication.
* Integrate one KYC provider.

**Day 2**

* Issue signed credential (JSON + signature).
* Build verification API endpoint (`/verify/{wallet}`).
* Simple Claim Passport page.

**Day 3**

* Improve UI/UX.

---

## 📂 Project Structure

```
/veriwalletfront   -> React app for wallet login & UI
/backend           -> PHP APIs
/jwtThings         -> JWT token generation logic
README.md          -> Project documentation
```

---

## 🔄 Version 2 – Wave 2 of Moca Hackathon

In this release, the focus was on **enhancing the UI/UX** and creating a clearer and more rewarding user journey for collecting credentials and unlocking perks.

### ✨ New Features:

* **Top navigation bar** for easier navigation between sections
* **User progress chart** at the top showing collected vs total credentials
* **Credential detail view** now displays which perks each credential is used for
* **Improved Perks section:**

  * Required credentials are clearly listed
  * Color-coded status for each:

    * 🔴 Red = Not obtained
    * 🟡 Yellow = Obtained but not yet verified
    * 🟢 Green = Verified
  * When all required credentials are green, the perk’s external site becomes accessible
* **One-click credential claiming** directly from the perks page

This version gives users a smoother and more intuitive experience, helping them understand their progress and reach their rewards more easily.

---

## 🌐 Version 3 – Wave 3: Partnership & Usage Expansion

In Wave 3, VeriWallet evolves beyond individual verification to enable **collaborative credential ecosystems**.
We introduce two major modules: **Partnership** and **Usage**.

### 🔗 Partnership Module

* Enables **issuers** (e.g., identity providers, educational orgs, KYC services) to issue credentials via **Moca AirKit**.
* Issuers can send these credentials directly to VeriWallet through our **integration API**.
* All credentials remain compliant with Moca standards for interoperability.

### 🧩 Usage Module

* Allows **perk providers** (e.g., dApps, DeFi projects, marketplaces) to define **perks** that depend on specific credentials.
* Each perk can define **multi-schema credential conditions** (e.g., user must have both KYC credential and Proof-of-Donation credential).
* This goes **beyond AirKit’s limitation**, which supports only single-schema conditions.
* Users automatically unlock access once all required credential conditions are met.

### 🚀 Why It Matters

* Enables **cross-issuer collaboration** through a shared verification layer.
* Supports **composable access rules** spanning multiple credential schemas.
* Expands AirKit’s capability by introducing **multi-schema logic** and **API-level interoperability**.

---

### Example Use Case

A DeFi platform can require:

* `KYC Credential` issued by Onfido via AirKit
* `Proof-of-Community Membership` issued by another issuer
  Only when both credentials are verified, the user gains access to premium liquidity pools.

