# Condominium Membership Onboarding (Roster-Claim Model)

## Summary

Implement an onboarding flow based on a **roster-claim model**:

- The first syndic/admin is created through a separate bootstrap flow.
- After the condominium is created, the syndic/admin uploads a single **CSV containing apartment holders**.
- Holders self-register using **email OTP + document match + apartment match**.
- Residents who are not holders join through a **holder approval request**.
- **Document uniqueness is enforced per condominium**.

This removes the need for individual invitations while maintaining **strong access control**.

---

# Scope and Goals

- Reduce operational effort for the syndic/admin from **“send N invites”** to **“upload 1 file”**.
- Prevent unauthorized registrations caused by **leaked links**.
- Keep resident onboarding **self-service with auditable approvals**.
- Preserve the current **first-user onboarding flow** and extend the **Identity module to support the condominium membership lifecycle**.

---

# Public API / Interface Changes

## 1. `POST /api/condominiums/{condominiumId}/onboarding/roster/import`

**Auth:** Syndic or PropertyManager of that condominium.

**Input:** CSV file (`multipart/form-data`) with the following columns:

- `apartment_code`
- `holder_full_name`
- `holder_document`
- `holder_email`

**Behavior**

- Performs a **preview validation** and rejects invalid rows with **structured errors**.
- On success, performs **upsert of apartment holder records**.

**Output**

```json
{
  "importId": "...",
  "totalRows": 0,
  "acceptedRows": 0,
  "rejectedRows": 0,
  "errors": []
}
```

---

## 2. `POST /api/onboarding/claim/start`

**Public endpoint**

**Input**

```json
{
  "condominiumId": "...",
  "apartmentCode": "...",
  "email": "...",
  "document": "..."
}
```

**Behavior**

- Checks whether the row exists in the roster and **has not been claimed**.
- If the match is valid:
  - sends an **OTP to the email**
  - creates a **short-lived claim session**

**Output**

```json
{
  "claimSessionId": "...",
  "maskedEmail": "..."
}
```

---

## 3. `POST /api/onboarding/claim/verify`

**Public endpoint**

**Input**

```json
{
  "claimSessionId": "...",
  "otpCode": "..."
}
```

**Behavior**

- Verifies OTP
- Creates or links the user
- Creates holder membership (**Resident or holder role depending on business rules**)
- Marks the apartment holder as **claimed**

**Output**

- membership summary
- next-step flags

---

## 4. `POST /api/apartments/{apartmentId}/join-requests`

**Auth:** logged-in resident/dependent

**Input**

```json
{
  "relationship": "...",
  "note": "..."
}
```

**Behavior**

- Creates a **pending request** for the apartment holder.

**Output**

```json
{
  "requestId": "...",
  "status": "Pending"
}
```

---

## 5. `POST /api/apartments/{apartmentId}/join-requests/{requestId}/approve`

**Auth:** apartment holder only

**Behavior**

- Grants membership role (**Dependent / Resident**)
- Closes the request

**Output**

- updated membership

---

## 6. `GET /api/onboarding/roster/template`

**Auth:** condominium admin

**Output**

- downloadable **CSV template**
- data rules documentation

---

# Domain Model and Data Additions

## 1. Entity: `CondominiumApartment`

Fields:

- `Id`
- `CondominiumId`
- `ApartmentCode`
- `IsActive`

---

## 2. Entity: `ApartmentHolderRoster`

Fields:

- `Id`
- `CondominiumApartmentId`
- `HolderName`
- `HolderDocument`
- `HolderEmail`
- `ClaimedByUserId` (nullable)
- `ClaimedAt` (nullable)
- `ImportedAt`
- `ImportBatchId`

---

## 3. Entity: `OnboardingClaimSession`

Fields:

- `Id`
- `CondominiumId`
- `ApartmentId`
- `Email`
- `DocumentHash`
- `OtpHash`
- `ExpiresAt`
- `Attempts`
- `VerifiedAt`

---

## 4. Entity: `ApartmentJoinRequest`

Fields:

- `Id`
- `ApartmentId`
- `RequestedByUserId`
- `Status` (Pending / Approved / Rejected / Expired)
- `CreatedAt`
- `ResolvedAt`
- `ResolvedByUserId`

---

# Constraints

- Unique `(CondominiumId, ApartmentCode)`
- Unique `(CondominiumId, HolderDocument)` for active holder roster rows
- Unique **active claim** per `(CondominiumId, ApartmentId, HolderDocument)`
- **Idempotency key** for roster imports to avoid duplicate processing

---

# Security Controls

**OTP**

- TTL: **10 minutes**
- Max attempts: **5**
- Exponential cooldown between retries

**Rate limits**

Applied to:

- `claim/start`
- `claim/verify`

Scoped by:

- IP
- email
- condominium

**Storage best practices**

- Documents and OTP stored **hashed at rest whenever possible**
- **Never log raw OTP or documents**

**Audit trail required for**

- roster imports
- claims
- approvals
- rejections
- administrative overrides

**Additional rules**

- Require **exact match of email + document + apartment** against roster row
- Block claim if row **already claimed**
- Provide controlled **recovery flows**

---

# UX and Operational Flow

## 1. Bootstrap

Maintain the current **first syndic/admin setup flow** separately.

---

## 2. Condominium onboarding setup

1. Admin downloads the **CSV template**
2. Fills holder data
3. Uploads once

The system returns a **row-by-row validation report**.

---

## 3. Holder self-onboarding

Holder provides:

- apartment
- document
- email

Flow:

1. receives OTP
2. verifies OTP

Result:

- account created or linked
- **apartment holder status activated**

---

## 4. Additional residents

1. Resident requests access to apartment
2. Holder approves inside the application
3. Membership is automatically activated

---

## 5. Exception handling

### Incorrect email or document

- no account is created
- generic error response returned

### Claim performed by mistake

- admin can **revoke the claim**
- roster row becomes available again

### No access to registered email

- admin may update the holder email
- claim process can be restarted

---

# Implementation Plan (Engineering)

## 1. Stabilize current invite model

- Align Invite fields (`Role` vs `GuestRole`)
- Normalize membership FK naming
- Preserve bootstrap flow for the first user
- **Do not extend the old invite model for resident onboarding**

---

## 2. Add entities

Entities:

- `Apartment`
- `Roster`
- `ClaimSession`
- `JoinRequest`

Tasks:

- migrations
- indexes
- constraints
- repositories
- services in the **Identity module**

---

## 3. Build roster import pipeline

Components:

- CSV parser
- schema validator
- duplicate detection
- **dry-run validation report**

Commit phase:

- **transactional upsert**

---

## 4. Build claim APIs

### Start claim

- roster match validation
- OTP issuance

### Verify claim

- OTP verification
- user upsert
- membership creation

---

## 5. Build join-request workflow

Endpoints:

- create request
- approve request
- reject request

Rules:

- membership creation policies

---

## 6. Authorization policies

- **Condominium admin** for roster operations
- **Apartment holder** for join approvals

---

## 7. Observability

**Metrics**

- import errors
- claim success rate
- OTP failure rate
- join-request latency

**Logs**

- structured **audit logs** for all onboarding actions

---

# Test Cases and Scenarios

1. Valid CSV import is accepted and invalid rows are rejected with explicit reason.
2. Duplicate holder document in the same condominium is rejected.
3. Claim fails if apartment/email/document do not match.
4. OTP expiration and attempt limits are enforced.
5. Successful claim creates membership and marks roster row as claimed.
6. Re-claim attempts on already claimed rows are blocked.
7. Non-holder join requests can only be approved by the current holder.
8. Unauthorized actions return **403**.
9. Race condition: two concurrent claims for the same roster row — only one succeeds.
10. Recovery flow: admin revokes incorrect claim and holder can claim again.

---

# Assumptions and Defaults

- The default onboarding model is **roster-claim**, not individual invites.
- Initial roster source is **CSV upload** (no ERP integration in v1).
- The first syndic/admin uses a **separate secure bootstrap flow**.
- Document uniqueness is enforced **per condominium**.
- Non-holder registration requires **holder approval**.
- Security balance is mandatory: **exact roster match + email OTP verification**.