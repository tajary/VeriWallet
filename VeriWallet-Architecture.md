# **VeriWallet: A White-Label Infrastructure for Credential Issuance and Verification**

## **Overview**

**VeriWallet** is a white-label, modular infrastructure designed to enable secure issuance and verification of digital credentials. It bridges organizations, issuers, and verifiers through a unified API layer that integrates seamlessly with the **AirKit** platform while abstracting its complexity for end users.

The system empowers four main actors:

* **VeriWallet Administrator** – Manages configurations, access permissions, issuer and verifier approvals, and system-level settings.
* **Issuer Systems** – Define and issue credentials using the AirKit Issuer Program or VeriWallet’s internal schema management tools.
* **Verifier Systems** – Validate credentials, define new verification conditions, and create associated perks without needing a direct AirKit account.
* **Credential Subjects** – End users who receive credentials and present them for verification.

---

### **Key Differentiators**

* **White-label flexibility** – Organizations can deploy and brand VeriWallet under their own ecosystem.
* **Simplified integration** – Verifiers can participate without AirKit registration.
* **Governed architecture** – All issuers and verifiers are approved and managed by the VeriWallet Administrator.
* **Secure data handling** – Layered backend design supports encryption at rest and in transit.

---

## **System Architecture**

### **Layered Design Overview**

VeriWallet is built as a **four-layer architecture**, designed for modularity, scalability, and security. Each layer abstracts complexity and allows organizations to integrate their own frontend or backend systems with minimal friction.

```
┌─────────────────────────────────────────────────┐
│         LAYER 1: APPLICATION LAYER              │
│                                                 │
│  • VeriWallet Frontend API                      │
│  • AirKit API                                   │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────┐
│         LAYER 2: BACKEND API                    │
│    (On Partner Systems)                         │
│  • VeriWallet Backend API                       │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────┐
│         LAYER 3: VERIWALLET SERVER              │
│    (Core Platform)                              │
│  • Processes requests & business logic          │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────┐
│         LAYER 4: SECURE STORAGE                 │
│    (Encrypted Database)                         │
│  • Credentials, Definitions, States             │
└─────────────────────────────────────────────────┘
```

---

### **Layer Descriptions**

#### **Layer 1 – Application Layer**

* **Components:** VeriWallet Frontend API and AirKit API
* **Purpose:** Provides the main interaction point for users and external systems.

  * The **VeriWallet Frontend API** handles user-facing requests such as credential queries and perk retrieval.
  * The **AirKit API** facilitates communication with AirKit for credential issuance and verification workflows.
* **Deployment:** Hosted on the partner’s infrastructure.

#### **Layer 2 – Integration Layer (Partner Backend)**

* **Components:** VeriWallet Backend API
* **Purpose:** Acts as an intermediary between the partner’s systems and VeriWallet’s core.

  * Handles API authentication (`apiKey`, `apiSecret`) and delegates operations to the core server.
  * Each partner (issuer or verifier) hosts this layer within their environment.

**Example Initialization:**

```js
veriwallet.init({
  server: "https://sample-veriwallet-backend.site",
  apiKey: "SampleApiKey",
  apiSecret: "SampleApiSecret"
});
```

#### **Layer 3 – Core Service Layer**

* **Components:** Central VeriWallet Server
* **Purpose:** The operational core of the system.

  * Processes issuance and verification requests.
  * Validates access rights, maintains credential states, and manages definitions.
  * Synchronizes with AirKit when needed.
* **Deployment:** Secure cloud environment managed by VeriWallet.

#### **Layer 4 – Data Layer**

* **Components:** Encrypted Data Storage
* **Purpose:** Stores credential metadata, issuer definitions, verification programs, and credential states.

  * Supports **encryption at rest** and **field-level encryption** for sensitive data.
  * Offers optional **blockchain-based storage** for decentralized credentials.

---

### **Integration with AirKit**

VeriWallet integrates natively with the **AirKit platform** for credential schema and verification program management.

* **Issuers** use their existing AirKit credentials and leverage VeriWallet's issuance service.
* **Verifiers** do **not** require AirKit accounts, enabling faster and simpler onboarding.
  This approach ensures interoperability with the AirKit ecosystem while preserving VeriWallet’s autonomy and usability.

---

### **Data Flow Summary**

1. **Issuers** define and issue credentials via the VeriWallet Backend API.
2. **The Core Service** validates definitions, stores schemas and states, and synchronizes with AirKit if necessary.
3. **Verifiers** query verification programs, define new conditions, and confirm credential validity.
4. **Subjects** use their VeriWallet app or partner interface to present credentials and redeem perks.

---

### **Key Architectural Advantages**

* **White-label deployment:** Partners can host Layers 1 and 2 — or the full stack — under their own brand.
* **Separation of concerns:** Clear boundaries between partner and core systems ensure maintainability.
* **Security-first design:** All credential operations are authenticated, encrypted, and auditable.
* **Extensibility:** New credential types, verification logics, or storage backends can be added with minimal effort.

---

## **API Design**

VeriWallet exposes a unified and developer-friendly API suite designed to facilitate both **credential issuance** and **verification** workflows.
These APIs are integrated within partner backends and communicate securely with the VeriWallet Core Service.

All endpoints follow a standard initialization pattern:

```js
veriwallet.init({
  server: "https://sample-veriwallet-backend.site",
  apiKey: "SampleApiKey",
  apiSecret: "SampleApiSecret"
});
```

---

### **1. Issuer APIs**

These APIs allow authorized issuers to define, manage, and issue credentials.

#### **a. Credential State Management**

Check if a credential has already been issued.

```js
veriwallet.issuance.getCredentialState({
  credential: 'credential-id',
  subject: { airId: 'XXXX', abstractAddress: 'XXXX', walletAddress: 'XXXX' }
});
```

**Response:**

```json
{
  "issued": true,
  "issuanceDate": "2025-10-10 10:10:10",
  "expirationDate": "2026-10-10 10:10:10"
}
```

#### **b. Issue Credential**

```js
veriwallet.issuance.issueCredential({
  credential: 'credential-id',
  subject: { airId, abstractAddress, walletAddress }
});
```

**Response:**

```json
{ "ok": true }
```

#### **c. Define Credential Issuer**

```js
veriwallet.issuance.defineCredentialIssuer({
  credential: 'credential-id',
  url: 'https://credential-url.site',
  airSchemaId: 'airkit-schema-id',
  airSchemaJson: { /* schema definition */ },
  airProgramId: 'airkit-program-id',
  expiration: '1 year'
});
```

#### **d. Check Issuer Definition State**

```js
veriwallet.issuance.getCredentialIssuerDefinitionState({
  credential: 'credential-id'
});
```

**Response:**

```json
{ "state": "published" }
```

---

### **2. Verifier APIs**

These APIs allow verifiers to define verification rules, retrieve perks, and check credential states — without needing AirKit credentials.

#### **a. Retrieve Categories**

```js
veriwallet.verification.getCategories();
```

**Response:**

```json
[
  { "id": "identity", "title": "Identity" },
  { "id": "defi", "title": "DeFi" }
]
```

#### **b. Retrieve Perks**

```js
veriwallet.verification.getPerks({ categoryId: "identity" });
```

#### **c. Get Perk Details**

```js
veriwallet.verification.getPerk({ perkId: "perk-id" });
```

**Example Output:**

```json
{
  "title": "Employment Verification Perk",
  "description": "A perk unlocked through verified employment credentials",
  "url": "https://perkurl.site",
  "categories": "identity",
  "credentialVerifications": [
    { "id": "verification-id1", "correspondingCredential": "credential-id" }
  ]
}
```

#### **d. Get Verification State**

```js
veriwallet.verification.getVerificationState({
  perkId: 'perk-id',
  credentialVerification: 'verification-id',
  subject: { airId, abstractAddress, walletAddress }
});
```

**Possible Responses:**

```json
{ "issued": true, "verified": true, "expired": false }
```

or

```json
{
  "issued": false,
  "verified": false,
  "expired": true,
  "redirectUrl": "https://corresponding-issuer-address.site"
}
```

#### **e. Define Verification**

```js
veriwallet.verification.defineVerification({
  credentialVerification: 'verification-id',
  credential: 'credential-id',
  title: 'Verification Title',
  condition: 'Credential parameter condition'
});
```

#### **f. Define Perk**

```js
veriwallet.verification.definePerk({
  perkId: 'perk-id',
  title: 'Employment Verification Perk',
  description: 'Description of the perk',
  url: 'https://perkurl.site',
  categories: 'identity',
  credentialVerifications: [{ id: 'verification-id1' }]
});
```

---

### **3. Security and Privacy**

* All API calls are **authenticated** using API keys and secrets.
* **Administrators** approve issuers and verifiers before access is granted.
* **Audit logs** track all credential and verification actions.
* **Encryption** is enforced both at rest (database layer) and in transit (TLS).
* **Data Privacy:** VeriWallet follows data minimization principles and stores no personally identifiable information beyond what is essential for credential management.

---

## **Implementation Roadmap**

1. **Phase 1 – Core Deployment:**
   Implement the VeriWallet Core Service and Data Layer with full encryption, API authentication, and admin controls.

2. **Phase 2 – Partner Integration:**
   Deploy backend APIs for initial issuer and verifier partners; test full credential issuance and verification flows.

3. **Phase 3 – White-Label Rollout:**
   Launch branded partner deployments with configurable frontends and full API documentation.


