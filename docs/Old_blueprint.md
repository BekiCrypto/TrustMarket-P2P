# P2P TrustMarket — Detailed Implementation & Launch Plan

**Purpose:** expanded, end-to-end document covering product, technical, compliance, security, ops, and go-to-market steps required to deliver the Firebase + Smart-Contract escrow P2P marketplace described in the PRD.

---

## Table of contents

1. Executive summary
2. Deliverables & milestones (detailed)
3. Project plan & timeline (12 months, granular tasks)
4. Team & hiring plan (roles, responsibilities)
5. Technical design — components & data model
6. Smart-contract escrow — spec, events, governance (non-executable)
7. Firebase implementation details (Firestore, Storage, Security Rules)
8. APIs & integration points (endpoints, events, webhooks)
9. KYC / AML / Compliance implementation (flows, screening, retention)
10. Reputation system — algorithm & anti-abuse measures
11. Trade lifecycle & arbitration — UI/UX and admin workflows
12. Security, privacy & cryptography measures
13. Testing, audits & QA plan (smart contract + platform)
14. Operations & Trust & Safety playbook (SOPs, runbooks)
15. Monitoring, logging & observability (metrics, dashboards)
16. Cost & resource estimates (high-level)
17. Pilot & launch plan (phased rollout)
18. Acceptance criteria & launch checklist
19. Appendix: sample schemas, event lists, arbitration rubric, doc templates

---

# 1. Executive summary

This document converts the PRD into an actionable implementation program designed to deliver a compliant, auditable, escrow-backed P2P marketplace on Firebase with a transparent smart-contract escrow option. It addresses product scope, engineering tasks, compliance integration, T&S operations, and launch readiness.

---

# 2. Deliverables & milestones (detailed)

**Phase 0 — Research & Legal (Deliverables)**

* Legal opinion & licensing requirements memo (local counsel).
* Compliance program draft: KYC/AML policy, SAR reporting process.
* Partner shortlist: banks, custodians, KYC vendors, blockchain infra.
* Threat model & risk register.

**Phase 1 — MVP Design & Infra**

* UX wireframes: onboarding, listing flow, trade screen, chat, arbitration console.
* Data model & API contract.
* Firebase project skeleton + environment strategy (dev/stage/prod).
* Mock escrow simulator (no real funds): PoC smart-contract event workflow on local testnet.

**Phase 2 — Core Implementation**

* Frontend (web + mobile) basic flows: onboarding, listing, search, chat.
* Backend services on Cloud Functions / Cloud Run: trade engine, notifications, indexing.
* Firestore schema & security rules implemented.
* KYC integration (provider + UI) & PEP/sanctions check integration.
* Reputation engine prototype.
* Admin & T&S console (basic).

**Phase 3 — Smart Contract & Audits**

* Smart contract implementation on testnet; event indexer (TheGraph or custom).
* Unit tests + formal verification (as feasible) + 3rd-party audit(s).
* Integrate smart contract with platform (escrow service).
* Custodian integration (if fiat flows required).

**Phase 4 — Hardening & Pilot**

* Pen tests, bug bounty, SOC-like processes.
* AML dashboard and exportable SAR function.
* Onboarding pilot cohort and monitor metrics.
* Iterate on UI/ux & policy.

**Phase 5 — Scale & Launch**

* Scale infra, ops hiring, partner contracts finalized.
* Public launch in approved jurisdictions; continuous monitoring & compliance.

---

# 3. Project plan & timeline (12 months, detailed sprints)

Assume 2-week sprints. Team size baseline (see Section 4). Timeline below is indicative; adjust per hiring and legal timelines.

**Month 0–1 (Sprint 0–2) — Research & planning**

* Sprint 0: Kickoff, legal counsel onboarding, threat model, tech stack finalization.
* Sprint 1: Wireframes, high-level API & data model, compliance draft.

**Month 2–3 (Sprint 3–6) — Core MVP build start**

* Sprint 3: Firebase skeleton, auth flow (email/phone), basic UI skeleton.
* Sprint 4: Listing creation & search, basic Firestore rules.
* Sprint 5: In-platform chat (encrypted client-side), trade state machine (mock escrow).
* Sprint 6: KYC integration (basic tier), phone/email verification flows.

**Month 4–5 (Sprint 7–10) — Escrow PoC & Reputation**

* Sprint 7: Smart-contract PoC on testnet; event emitter + indexer.
* Sprint 8: Integrate testnet escrow with trade engine (simulation).
* Sprint 9: Reputation engine (score calc, decay), UI badges.
* Sprint 10: Admin/T&S console basic features (view trades, disputes).

**Month 6–7 (Sprint 11–14) — Compliance & Hardening**

* Sprint 11: AML dashboard: alerts, triage workflows, SAR export.
* Sprint 12: Add PEP/sanctions screening, enhanced KYC tier.
* Sprint 13: Initial security review, unit tests, CI/CD pipelines.
* Sprint 14: Smart-contract unit tests + static analysis.

**Month 8–9 (Sprint 15–18) — Audit & Pilot prep**

* Sprint 15: Third-party smart contract audit 1 — address findings.
* Sprint 16: Pen test for platform; address issues.
* Sprint 17: Pilot cohort onboarding (limited users), monitoring.
* Sprint 18: Feedback loop, iterate UX and policy updates.

**Month 10–12 (Sprint 19–24) — Launch readiness & scale**

* Sprint 19: Bug bounty launch & continuous monitoring.
* Sprint 20: Custodian integrations finalised (if applicable).
* Sprint 21: Legal sign-offs, SLAs with partners.
* Sprint 22–24: Gradual rollout, regional scaling and operations staffing.

---

# 4. Team & hiring plan

**Core hires (initial)**

* Product Manager (owner of roadmap & stakeholder alignment)
* Compliance Officer (full-time or consultant) — must be local + expert in VASP rules
* Backend Engineer (Firebase / Cloud Functions, Node/TypeScript)
* Frontend Engineer (React web + React Native)
* Blockchain Engineer (smart-contracts, Solidity/Rust, indexer)
* DevOps / SRE (infrastructure, monitoring)
* Trust & Safety Lead (operations, arbitration processes)
* QA Engineer (test automation)
* UX/UI Designer (craft wireframes & system design)

**Supplemental / vendor partners**

* Legal counsel (local + crypto/fintech specialist)
* KYC provider (Trulioo, Onfido, Sumsub or similar) — vendor
* Sanctions/PEP screening vendor (Refinitiv, ComplyAdvantage, etc.)
* Smart contract auditors (Consensys Diligence, Quantstamp, Trail of Bits, etc.)
* Payment/custody partners (local banks, licensed custodians)

---

# 5. Technical design — components & data model

## High-level components

* **Frontend (Web + Mobile)** — React + React Native; authentication flows; UI for listings, trade, chat.
* **API / Backend** — Firebase Cloud Functions or Cloud Run (Node/TypeScript). Business logic for trade state machine, notifications, KYC orchestration.
* **Database** — Firestore for offers, trades, chat (with encryption where needed).
* **Storage** — Firebase Storage (KYC docs encrypted server-side, access controls).
* **Smart-contract layer** — escrow contract(s) on chosen chain; an indexer listens to events and updates Firestore.
* **Admin Console** — internal app for T&S, AML analysts, arbitration.
* **Monitoring & Logging** — Stackdriver (Cloud Monitoring), logs exported to secure log store.
* **CI/CD** — GitHub Actions or equivalent; gated deployments for contracts and platform.
* **Secrets Management** — Cloud KMS / Secret Manager.

## Key data entities (sample)

* `users` collection:

  * `userId`, `publicHandle`, `email`, `phoneHash`, `kycTier`, `kycStatus`, `reputationScore`, `createdAt`, `flags[]`
* `kyc_docs` (encrypted storage refs):

  * `docId`, `userId`, `docType`, `encryptedUrl`, `hash`, `verifiedBy`, `verifiedAt`
* `listings`:

  * `listingId`, `sellerId`, `asset`, `assetSymbol`, `price`, `minLimit`, `maxLimit`, `paymentMethods[]`, `status`, `createdAt`
* `trades`:

  * `tradeId`, `listingId`, `buyerId`, `sellerId`, `state`, `escrowId`, `fundingTx`, `createdAt`, `updatedAt`
* `escrows`:

  * `escrowId`, `contractAddress`, `chain`, `fundingTx`, `state`, `events[]`
* `chats`:

  * `chatId`, `tradeId`, `messages[{senderId, timestamp, encryptedPayloadRef}]`
* `disputes`:

  * `disputeId`, `tradeId`, `filedBy`, `evidence[]`, `status`, `decision`, `arbitratorId`, `appeal[]`
* `audit_logs`:

  * `logId`, `actorId`, `action`, `targetId`, `timestamp`, `metadata`

---

# 6. Smart-contract escrow — spec, events, governance (non-executable)

**Design goals**

* Minimal logic: fund custody, release/refund conditions, dispute settlement via authorized arbitrator(s), event emission for every state change.
* Transparent event logs for indexing.
* Simple upgrade policy with governance (multisig), limited emergency functions, all operations auditable.

**Roles**

* `Buyer`
* `Seller`
* `Arbitrator` (address or multisig)
* `Governance` (multisig for emergency pause/upgrade)

**States**

* `Created` — contract entry created for trade.
* `Funded` — buyer funded escrow.
* `InProgress` — seller acknowledged.
* `Disputed` — dispute filed; funds locked.
* `Resolved` — decision executed; funds directed.
* `Released` — funds released to seller.
* `Refunded` — funds refunded to buyer.
* `Cancelled` — trade cancelled before funding (if allowed).

**Events (emit on change)**

* `TradeCreated(tradeId, buyer, seller, amount, asset, timestamp)`
* `Funded(tradeId, funder, txHash, amount, timestamp)`
* `InProgress(tradeId, timestamp)`
* `Disputed(tradeId, party, disputeId, timestamp)`
* `ArbitrationVerdict(tradeId, verdictId, winner, splitPercent, signature, timestamp)`
* `Released(tradeId, recipient, amount, txHash, timestamp)`
* `Refunded(tradeId, recipient, amount, txHash, timestamp)`
* `Paused(governanceAddr, timestamp)`
* `Unpaused(governanceAddr, timestamp)`

**Arbitration model (off-chain signature)**

* Arbitrator reviews evidence off-chain and signs a verdict payload: `{tradeId, splitBuyerPercent, splitSellerPercent, timestamp}`. The smart contract verifies the arbitrator's signature (or uses a multisig oracle or a minimal oracle that can accept off-chain signed verdicts) and executes fund distribution.

**Security constraints**

* Limit functions accessible only to roles.
* No owner backdoor to silently withdraw funds — any governance action (pause/upgrade) must be transparent and require multisig.
* Gas-efficient logic: keep on-chain operations minimal; heavy lifting off-chain.

**Non-executable sample ABI-like schema (informational only)**

* `function createTrade(bytes32 tradeId, address buyer, address seller, uint256 amount, address asset) external;`
* `function fundTrade(bytes32 tradeId) payable external;`
* `function raiseDispute(bytes32 tradeId, bytes32 disputeId) external;`
* `function executeVerdict(bytes32 tradeId, uint8 buyerShare, bytes signature) external;`
* `function release(bytes32 tradeId) external;`
* `function refund(bytes32 tradeId) external;`
* `event Funded(bytes32 tradeId, address funder, uint256 amount);` etc.

> Note: This is a high-level contract design. Implementation must be done by an experienced blockchain engineer and undergo independent audits. Do not deploy without legal review in target jurisdictions.

---

# 7. Firebase implementation details

## Project and environment

* Create separate Firebase projects/environments: `dev`, `staging`, `prod`.
* Enforce IAM least privilege: restrict service accounts and human access. Use organization policies.

## Firestore structure & rules (high-level)

* Use collection-per-entity structure as in data model.
* Security rules:

  * Allow read/write based on authenticated user and role (e.g., only a listing owner can edit/cancel a listing).
  * Use granular rules for `chats` (only trade participants and T&S staff can read messages).
  * Restrict `kyc_docs` access to backend service account (no direct client access).
* Example rule principles:

  * `allow read: if request.auth.uid == resource.data.ownerId || hasRole('admin')`
  * `allow write: if request.auth.uid == resource.data.ownerId && validFields && !changingImmutableFields`

## Storage (KYC docs)

* Store KYC documents in encrypted object storage; use signed URLs generated server-side with short expiry.
* Keep access logs and retain KYC docs per regulatory retention schedule.

## Authentication & session

* Firebase Authentication for email/password and phone. Link social login only if identity security is maintained.
* Use MFA for admin accounts and provide optional MFA for users as an enhanced security tier.

## Cloud Functions / Backend

* Implement business logic in Cloud Functions (Node/TypeScript) or Cloud Run microservices.
* Key functions:

  * `createListing`, `updateListing`, `deleteListing`
  * `initiateTrade`, `fundTrade` (escrow integration), `raiseDispute`, `submitEvidence`
  * `indexContractEvents` — listens to smart contract events and updates Firestore
  * `runReputationJob` — periodic batch to update reputation scores
  * `amlScanner` — background job analyzing transactions and flags

## Indexing & event handling

* Use a reliable indexer (e.g., TheGraph or a custom indexer running on Cloud Run) to subscribe to contract events.
* Events should be idempotent and reconciled: store last processed block and handle reorgs.

---

# 8. APIs & integration points

## Public API (sample endpoints)

* `POST /v1/users` — create user
* `POST /v1/auth/verify-phone` — phone verification
* `POST /v1/kyc/start` — start KYC (initiate provider flow)
* `GET /v1/listings` — search listings (filters: asset, price, paymentMethod, region)
* `POST /v1/listings` — create listing
* `POST /v1/trades` — create trade (buyer)
* `POST /v1/trades/{id}/fund` — fund trade (trigger escrow)
* `POST /v1/trades/{id}/message` — send message in trade chat
* `POST /v1/trades/{id}/dispute` — raise dispute
* `GET /v1/users/{id}/reputation` — get reputation info

## Webhooks & External integrations

* KYC provider: webhook for verification completion.
* Custodian / payment provider: signed webhook for payment receipts and confirmations.
* Smart contract indexer: webhook or direct DB update for events.
* Notification services: FCM webhooks or events.

## Admin & internal APIs

* `GET /admin/trades` — filter by flags, suspicious score
* `POST /admin/trades/{id}/forceRelease` — instruct escrow to release (requires audit log)
* `POST /admin/disputes/{id}/decide` — create verdict (signed by arbitrator)

**Security for APIs**

* Mutual TLS for partners, signed payloads, request signature verification for webhooks.
* Rate-limiting & throttling; anomaly detection on APIs.

---

# 9. KYC / AML / Compliance implementation

## KYC flow (tiered)

* **Basic**: email + phone verification. Low limits (e.g., $100 daily).
* **Verified**: user uploads ID + selfie; provider verifies identity and returns `kycStatus` and `kycConfidence`. Conduct PEP & sanctions screening.
* **Enhanced / Institutional**: business verification, proof of funds, enhanced due diligence.

## Data retention & privacy

* Store KYC docs encrypted; retention schedule documented (e.g., retain verified KYC for 5–7 years or per local requirement).
* Only internal compliance roles and service account can access raw KYC docs.
* Public-facing profile shows pseudonymous handle and verification tier, not PII.

## AML detection rules (automated)

* Velocity rules: more than X trades above threshold in 24 hours.
* Pattern detection: repeated cancellations with same counterparties; circular trades.
* High-risk geolocation or sanctioned country involvement.
* Large-value trades above KYC tier limits requiring manual review.

## SAR export & reporting

* SAR report format: include user identifiers, trade IDs, timestamps, evidence links, summary narrative, risk score.
* Automated export (CSV / JSON) and manual sign-off before transmission to authorities.
* Audit trail for all accesses to SAR materials.

## Sanctions & PEP screening

* Onboarding: screen new KYC results against sanctions lists and PEP lists.
* Periodic rescreening: nightly or weekly depending on risk.

---

# 10. Reputation system — algorithm & anti-abuse

## Reputation inputs

* `completedTradesScore` — weighted by volume and recency.
* `disputeRatePenalty` — penalty for disputes lost.
* `kycTierBonus` — verified tiers contribute positively.
* `peerRatingsAvg` — average ratings from counterparties.
* `fraudFlagsPenalty` — automated flags reduce score.

## Formula (example)

Let:

* `CTS` = normalized completed trades score (0–100)
* `DRP` = disputes lost rate (0–100)
* `KTB` = kyc tier bonus (0–20)
* `PR` = peer rating normalized (0–100)
* `FFP` = fraud flags penalty (0–100)

`reputationScore = clamp( 0 , 100 , 0.5*PR + 0.3*CTS + 0.2*KTB - 0.6*DRP - 0.4*FFP )`

* Implement decay: every 30 days without trade, multiply `reputationScore` by `0.98` (configurable).
* Keep `publicReputationTier` buckets: `New (0–29)`, `Trusted (30–69)`, `Top (70–100)`.

## Anti-abuse (Sybil & collusion mitigations)

* Require phone verification + email for basic; require verified KYC for higher limits.
* Rate-limit new accounts and limit trade volume for recent accounts.
* Graph-analysis detection: detect dense clusters of accounts trading only among themselves.
* Use device fingerprinting & IP heuristics (careful re: privacy laws).
* Monitor rating patterns: sudden spike in incoming 5-star ratings from low-rep accounts triggers review.

---

# 11. Trade lifecycle & arbitration — UI/UX and admin workflows

## Trade lifecycle (user-facing)

1. **Listing page** — buyer views offer, sees seller rating and KYC badge.
2. **Initiate trade** — buyer confirms amount and triggers escrow funding step.
3. **Fund escrow** — buyer follows on-chain or off-chain payment flow.
4. **Seller acknowledgement** — seller marks payment received or provides proof.
5. **Buyer confirms receipt** or raises dispute within the payment window.
6. **If dispute** — go to arbitration flow with evidence upload.
7. **Arbitrator decides** — based on rubric; smart contract executes verdict.
8. **Trade complete** — reputations updated and receipts generated.

## Arbitration UI (admin)

* Case dashboard with triage filters (high-value, suspicious).
* Evidence viewer: chat transcripts, receipts, images (display metadata).
* Suggestion panel: AI-assisted evidence summarization and suggested split (non-binding).
* Decision composer: arbitrator picks verdict and enters rationale; digital signature captured.
* Audit log capture: every action recorded with timestamp and operator ID.

## Evidence handling

* Standardize evidence file types (JPEG/PNG/PDF/TEXT).
* Require metadata (timestamp, device info, payment reference).
* Use structured evidence forms for receipts (date, amount, bank ref).

## AI-assisted suggestions (policy)

* Use AI to *summarize* and *suggest* possible outcomes — always present as non-binding guidance.
* Keep raw evidence available to arbitrators; log AI output and keep it auditable.
* Ensure human-in-the-loop: final decision must be made by a trained arbitrator.

---

# 12. Security, privacy & cryptography measures

## Data protection

* TLS everywhere; enforce HSTS.
* Encrypt sensitive data at rest (Cloud KMS-managed keys).
* KYC docs encrypted client-side or server-side with limited access.

## Keys & secrets

* Use Secret Manager; rotate keys periodically.
* Multisig for governance keys (smart contract admin actions).

## Chat encryption

* End-to-end encryption (E2EE) option: messages encrypted client-side; server stores ciphertext. For arbitration, user consent flow to decrypt for T&S.
* If E2EE prevents arbitration access, offer an opt-in “share for dispute” consent flow.

## Admin access controls

* RBAC for admin console: least privilege.
* MFA for all admin accounts.
* Session timeouts & IP allowlists for sensitive operations.

## Penetration testing & vulnerability disclosure

* Annual pen tests and a public bug bounty program post-audit.
* Vulnerability response SLA (e.g., triage within 24 hours).

---

# 13. Testing, audits & QA plan

## Smart contract

* Unit tests (100% coverage on core paths).
* Property-based tests for invariants (no fund loss).
* Static analysis (Slither, MythX).
* Formal verification where feasible.
* Multiple third-party audits (at least two) and remediation.
* Testnet deployment & public test suite.

## Platform

* Unit & integration tests for backend services.
* End-to-end tests for critical flows (onboarding, trade, escrow).
* UI/UX acceptance tests (Cypress / Playwright).
* Performance testing for search, indexing, and trade volume spikes.
* Penetration testing & fuzzing for inputs.

---

# 14. Operations & Trust & Safety playbook (SOPs, runbooks)

## T&S roles & SLAs

* **Triage analyst** — respond to high-risk alerts (SLA: 2 hours)
* **Arbitrator** — resolve disputes (SLA: median 72 hours)
* **Escalation manager** — handle legal requests / law-enforcement (SLA: 24 hours)

## SOP examples

* **High-value hold rule:** any trade > $X automatically flagged for manual review before release.
* **Fraud pattern detection:** auto-freeze accounts showing rapid cancellations or multiple chargebacks.
* **Lawful request handling:** process for handling subpoenas — legal review + audit log.

## Incident runbook (security compromise)

1. Triage & contain (isolate systems).
2. Notify CTO & Compliance Officer.
3. Revoke affected credentials; rotate keys.
4. Assess scope and impact; engage legal counsel.
5. Prepare public notification (if required); communicate to partners.
6. Post-incident review & remediation steps.

---

# 15. Monitoring, logging & observability

## Key metrics to monitor

* User metrics: signups, KYC pass rate, churn
* Trades: initiated, funded, completed, cancelled
* Escrow: funds in escrow, fund/release times
* Disputes: filed per day, resolution time
* Fraud signals: flagged accounts, SAR generated

## Dashboards

* **Ops dashboard:** system health, queues, critical errors
* **T&S dashboard:** top flagged trades, unresolved disputes, high-risk users
* **Smart-contract dashboard:** on-chain events, failed txs, gas usage

## Logging & retention

* Structured logs for all admin actions (immutable where possible).
* Retain logs per regulatory needs (e.g., 5–7 years).
* Audit log tamper-evidence (append-only storage or remote archive).

---

# 16. Cost & resource estimates (high-level)

**One-time / ongoing estimates (USD):**

* Engineering (initial 6–9 months): $250k–$600k (team salaries vary by region)
* Smart contract audits (per audit): $15k–$100k depending on firm & scope
* KYC provider: $1–$5 per verification (varies by vendor & region)
* Cloud hosting & monitoring (initial): $500–$5,000 / month (scale with usage)
* Legal & compliance retainer (initial): $20k–$100k (depends on jurisdiction & complexity)
* Bug bounty program: $5k–$50k (depending on scope)
* Misc (insurance, licensing deposits): variable

> These numbers are illustrative. Obtain vendor quotes for precise budgeting.

---

# 17. Pilot & launch plan (phased rollout)

**Pilot (soft launch) — limited cohort**

* Invite-only users; small geo region or whitelist.
* Lower limits; high-touch T&S monitoring.
* Objectives: validate flows, dispute handling, smart-contract interactions, KYC pipeline.

**Beta**

* Gradually increase user volume and geographic coverage.
* Add payment/custodian partners incrementally.
* Start paid promotions to seed liquidity.

**General Availability (GA)**

* Full launch in jurisdictions where legal sign-off received.
* Public bug bounty, marketing push, market-making initiatives (if allowed).

**Post-launch monitoring**

* Weekly review meetings for first 12 weeks focusing on disputes, SARs, security incidents, and user feedback.

---

# 18. Acceptance criteria & launch checklist

**Product / Technical**

* User onboarding works end-to-end for all KYC tiers.
* Listing creation & search functional; filters tested.
* Trade lifecycle completes successfully using testnet escrow.
* Smart contract audited (at least one independent audit) and remediation done.
* Admin console: dispute flows tested; arbitration actions logged.
* Reputation engine running and producing reputations.

**Compliance**

* Legal opinion confirming allowed operations in target pilot jurisdiction.
* KYC provider integrated and tested; sanctions screening active.
* AML dashboard functional and can export SAR data.

**Security**

* Pen test completed and critical/major findings remediated.
* Secrets and key management in place; admin MFA enforced.
* Backup & DR plan documented and tested.

**Operations**

* T&S team trained; SOPs & runbooks published.
* Incident response playbook validated.
* Monitoring and alerting configured.

**Business**

* Partners (custodian/payment/KYC) contracts signed for pilot region.
* Budget approved for pilot and operations.

---

# 19. Appendix

## A. Sample Firestore rules (conceptual)

* `listings` — only owner can write; read is public.
* `trades` — participants + T&S read/write as allowed.
* `kyc_docs` — only service account can read; admin console can access via backend.

## B. Sample arbitration rubric (scoring)

* Evidence strength (0–10)
* Payment proof credibility (0–10)
* Timeline & communication behavior (0–10)
* Reputation differential (0–10)
* Decision: allocate funds proportionally to weighted score; provide rationale.

## C. Sample SAR fields (for export)

* `reportId`, `userIds[]`, `tradeIds[]`, `amounts[]`, `currencies[]`, `narrative`, `evidenceRefs[]`, `analystId`, `timestamp`

## D. Smart contract event list (summary)

See Section 6 — event names and payloads. Ensure indexer subscribes to all.

## E. UI screen list (deliverable for designers)

1. Landing / hero
2. Signup / login
3. KYC stepper (basic -> verified -> enhanced)
4. Listings grid & search
5. Listing detail & trade initiation modal
6. Trade screen (status, escrow status, chat)
7. Chat screen (trade context)
8. Dispute submission wizard
9. Admin console: trade list / dispute queue / SAR export
10. Profile & reputation page
11. Notifications center