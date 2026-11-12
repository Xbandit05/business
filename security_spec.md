# Security Specification — AgriBridge Rwanda Firestore Security

## 1. Data Invariants

1. **User Identity Invariant**: A user document at `/users/{userId}` can only be created or modified if `request.auth.uid == userId`. No user may forge another user's identity or profile.
2. **PII Isolation Invariant**: Personal data (email, phone number, specific portfolio assignments) can only be read by the owner user (`request.auth.uid == userId`) or an authorized administrator.
3. **Listing Invariant**: A produce listing at `/produce_listings/{listingId}` can only be created or updated if `request.auth.uid == request.resource.data.farmerId`. Non-owners cannot tamper with farmgate prices, quantities, or commodity attributes.
4. **Order Integrity Invariant**: An order at `/orders/{orderId}` must involve the authentic buyer (`request.auth.uid == request.resource.data.buyerId`) and authentic farmer. State updates must enforce affected keys.
5. **Negotiation Invariant**: A direct price negotiation at `/negotiations/{threadId}` can only be accessed or messaged by the designated buyer (`request.auth.uid == thread.buyerId`) or seller farmer (`request.auth.uid == thread.farmerId`).
6. **Immutable Fields**: `createdAt`, `userId`, `farmerId`, and `buyerId` cannot be changed post-creation (`request.resource.data.createdAt == resource.data.createdAt`).

---

## 2. The "Dirty Dozen" Threat Payloads

1. **Identity Spoof**: An unauthenticated attacker attempts to write to `/users/user_target_victim`.
2. **Ghost Field Injection**: A user attempts to inject `"isAdmin": true` or `"isSuperAdmin": true` during profile creation.
3. **Price Tampering**: A competitor attempts to update a farmer's listing asking price from 380 RWF to 10 RWF.
4. **Order Hijack**: An attacker attempts to create an order claiming another user's `buyerId`.
5. **Cross-User Negotiation Read**: A third party attempts to read private price bids between Clarisse and Idris in `/negotiations/{threadId}`.
6. **Path Traversal / Long ID Poisoning**: An attacker tries to write with a 2KB garbage string for `listingId`.
7. **Negative Quantity Attack**: An attacker attempts to submit an order with `quantityKg: -5000`.
8. **Negative Price Attack**: An attacker attempts to submit a bid with `pricePerKgRwf: -100`.
9. **Commission Bypass**: An attacker creates an order setting `commissionAmountRwf: 0` or modifying commission status.
10. **Timestamp Manipulation**: An attacker submits a fraudulent historical or future timestamp instead of `request.time`.
11. **Blanket Query Scraping**: A client attempts to perform `collection("users").get()` without filtering by owner.
12. **Terminal State Mutation**: Attempting to alter an order after its status has reached `'completed'`.

---

## 3. Security Assertions

- All write operations require an authenticated Google user (`request.auth != null`).
- Default-deny catch-all rule `match /{document=**} { allow read, write: if false; }` must be the first match block.
- Single-document path variables must validate via `isValidId()`.
- Every collection must have a dedicated `isValid[Entity]()` validation helper.
