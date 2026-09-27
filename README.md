<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=200&text=SUBSCRIPTION%20SAAS&fontAlignY=38&desc=PLANS%20%E2%80%A2%20USAGE%20%E2%80%A2%20BILLING%20STATE&descAlignY=58&color=0:050505,55:202020,100:5a1616&fontColor=f5f5f5&descColor=d4d4d4" width="100%" />

![Node](https://img.shields.io/badge/Node.js-20%2B-111111?style=for-the-badge&logo=nodedotjs)
![Domain](https://img.shields.io/badge/domain-billing%20logic-2b2b2b?style=for-the-badge)
![Tests](https://img.shields.io/badge/tests-node:test-7a1f1f?style=for-the-badge)

**A billing-domain starter focused on keeping product access in sync with subscription events.**

</div>

---

## Core idea

Payment providers should tell the app **what happened**. The app should decide **what that means for access**.

That separation keeps webhook handling easier to test and stops payment-provider objects leaking across the entire product.

## Included

- free / pro / team entitlements
- feature and usage gating
- subscription lifecycle state machine
- checkout activation
- upgrades and downgrades
- failed-payment / past-due handling
- cancel-at-period-end state
- event history
- tests around risky transitions

```txt
provider event
    ↓
normalized billing event
    ↓
subscription state
    ↓
product entitlements
```

## Test

```bash
npm test
```

## Production boundary

A production implementation would add durable storage, idempotency keys, signed webhook verification, customer mappings and real checkout/customer-portal endpoints.

---

<div align="center"><sub>YukiShinobi // billing state belongs in the domain, not scattered through UI checks.</sub></div>
