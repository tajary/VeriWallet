# VeriWallet

**VeriWallet** is a wallet-based identity verification platform.  
It allows users to prove their identity (e.g., KYC, proof-of-personhood) once and reuse those credentials across multiple platforms, including DeFi protocols, marketplaces, and Web3 apps.  

---

## 🚀 Problem
Web3 users often face repeated KYC checks across platforms.  
- Friction: users must redo KYC for each service.  
- Trust issues: dApps can’t easily verify unique users.  
- Compliance gaps: DeFi pools lack verified participants.  

---

## 💡 Solution
VeriWallet issues **portable, cryptographically signed credentials** linked to a user’s wallet.  
- Users prove identity once.  
- dApps can verify the credential via API or smart contract.  
- Users may optionally publish a **Claim Passport** to showcase verified attributes.  

---

## 🔑 Key Features
- **Wallet Login** – Sign-in via MetaMask, WalletConnect, or AIR Account Services.  
- **KYC Integration** – Redirect to verification provider (e.g., Onfido).  
- **Credential Issuance** – Signed credential proving verification linked to wallet.  
- **Verification API** – dApps can check a wallet’s verification status.  
- **Claim Passport (Optional)** – Public profile showing verified claims.  
- **DeFi Integration** – Unlock identity-gated pools, higher APYs, or lower loan rates.  

---

## 🛠️ Moca Stack Integration
- **AIR Account Services**: Used for wallet-based login and SSO.  
- **AIR Credential Services**: Issue and verify portable KYC credentials.  
- **Moca Chain**: Store credential proofs and revocation data for trustless verification.  

---

## 🔄 User Flow
1. **Login** → User connects wallet & signs a nonce message.  
2. **Verification** → If not verified, redirect to KYC provider.  
3. **Credential Issuance** → Backend issues signed credential linked to wallet.  
4. **Reuse** → User presents credential to other dApps.  
5. **Verification API** → dApps validate credential via API / smart contract call.  
6. **Claim Passport** (optional) → User publicly shares verified claims.  

---

## 📊 Success Metrics
- Number of wallets verified  
- Number of API integrations with partner dApps  
- Number of credential reuses per user  

---

## 🎯 Roadmap (MVP)
**Day 1**  
- Wallet login (MetaMask, WalletConnect)  
- Nonce signing & backend auth  
- Integrate 1 KYC provider  

**Day 2**  
- Issue signed credential (JSON + signature)  
- Verification API endpoint (`/verify/{wallet}`)  
- Simple Claim Passport page  

**Day 3**  
- UI/UX

---

## 📂 Project Structure (proposed)
```

/veriwalletfront   -> React/Next.js app for wallet login & UI
/backend    -> Node.js/Express or NestJS for APIs
/jwtThings  -> Codes for generating jwt token
README.md   -> Project documentation

````

---

