---
title: Why This SDK is Read-Only
description: The reasoning behind the intentional read-only scope of the Optio Teachable SDK.
---

The Optio Teachable SDK covers every GET endpoint available in the Teachable v1 API. It does not implement any POST, PATCH, PUT, or DELETE operations. This is a deliberate design decision, not a limitation — and this page explains why.

---

## What "read-only" means in practice

Every method in this SDK fetches data. Nothing you do with this SDK will modify your Teachable school. You can call any method as many times as you like without risk of:

- Accidentally enrolling or unenrolling students
- Creating new students
- Modifying existing students
- Marking lessons complete

This makes the SDK safe to use in scripts, reporting tools, data pipelines, and integrations where you want to read Teachable data without any risk of side effects.

---

## The full read surface

The SDK covers all v1 GET endpoints across every resource:

| Resource          | Endpoints covered                     |
|-------------------|---------------------------------------|
| **Users**         | List, get by ID, get by email         |
| **Courses**       | List, get by ID, enrolments, lectures |
| **Transactions**  | List, get by ID                       |
| **Pricing Plans** | List, get by ID                       |
| **Webhooks**      | List, get events                      |

---

## Why not implement write operations?

### 1. Trust and safety

A read-only SDK can be handed to a developer, dropped into a codebase, or run in a script with confidence. Write operations change that calculus significantly — a bug in an enrolment method could affect real students and real payments. That kind of responsibility belongs in a supported, tested, and well-documented product — not a lightweight open source wrapper.

### 2. The Teachable v1 write API is limited

The Teachable v1 API has relatively few write endpoints, and the ones that exist are narrow in scope. Building write support around a limited and inconsistently documented API would result in a fragile implementation that could break silently when Teachable changes something on their end.

### 3. v2 is coming

Teachable are actively developing a v2 API with a significantly expanded and better-documented endpoint surface. Write operations are better tackled properly against v2 rather than bolted onto v1.

---

## What if I need to write data?

For write operations against your Teachable school, your options are:

**Use the Teachable dashboard** — for one-off or infrequent changes, the dashboard is the safest and most reliable option.

**Use `getRaw` for exploration** — if you need to test an undocumented or write endpoint, the `getRaw` method lets you make a raw GET request to any v1 endpoint without schema validation:

```typescript
const data = await teachable.v1.getRaw('/your-endpoint');
```

Note that `getRaw` is GET-only — it does not support POST or PATCH requests.

**Optio enterprise** — full write support, webhook management, enrolment automation, and more are available as part of the Optio platform. Visit [useoptio.com](https://useoptio.com) for details.

---

## A note on the Teachable v1 API itself

During development of this SDK, several inconsistencies were found between the official Teachable API documentation and the actual live API behaviour — nullable fields documented as required, undocumented response fields, and endpoints that behave differently from their documentation.

Where this SDK diverges from the official docs, it reflects observed real-world API behaviour. The schemas are built from actual API responses, not just documentation.

If you encounter a validation error or unexpected response shape, [open an issue on GitHub](https://github.com/Ellf/optio-teachable/issues) — it likely means Teachable have changed something and the schema needs updating.