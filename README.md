# Subscription SaaS Starter

A billing-domain starter focused on the part that usually gets messy: keeping product access in sync with subscription events.

This repo models free/pro/team entitlements, usage limits, checkout activation, upgrades/downgrades, failed payments, cancellation and event history. It is intentionally provider-neutral at the core so a Stripe webhook handler can translate Stripe events into these domain events instead of mixing payment-provider objects through the whole app.

## Includes

- plan entitlements
- feature/usage gating
- subscription lifecycle state machine
- past-due handling
- cancel-at-period-end state
- event log
- tests around the risky transitions

```bash
npm test
```

## Design choice

Payment providers should tell the app **what happened**. The app should decide **what that means for access**. Keeping those two concerns separate makes webhook handling easier to test and prevents billing logic from leaking everywhere.

A production implementation would add durable storage, idempotency keys, signed webhook verification, customer mappings and the actual checkout/customer-portal endpoints.
