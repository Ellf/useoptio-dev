---
title: Introduction
description: What is the Optio Teachable SDK and why does it exist?
---

## What is this?

`optio-teachable` is a lightweight, strictly-typed Node.js SDK for the [Teachable v1 API](https://docs.teachable.com). It handles authentication, request validation, and runtime type safety so you can focus on building — not wrestling with raw API responses.

Built on [Zod](https://zod.dev) for runtime schema validation, with full TypeScript support out of the box.

---

## Why does this exist?

The honest answer is: I built this for myself.

Working closely with Teachable-powered schools through [Purple Hippo Web Studio](https://purplehippo.io), I kept writing the same boilerplate fetch logic across projects — handling auth headers, validating responses, and mapping raw API data into something usable. Eventually it made more sense to extract that into a proper, reusable SDK.

Building it publicly served a few goals:

- **A better understanding of the Teachable API** — nothing forces you to understand an API like wrapping it properly, handling its quirks, and documenting every field.
- **A reusable foundation** — every new Teachable integration I start now begins from a working, typed baseline rather than a blank file.
- **Something useful for the community** — the Teachable developer ecosystem is relatively small. If this saves another developer an afternoon of digging through undocumented responses and unexpected nulls, it's worth having out in the open.

---

## What's covered

The v1 SDK covers every GET endpoint available in the Teachable v1 API:

| Resource          | Methods                                                                                                                     |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------|
| **Users**         | `getList`, `getById`, `getByEmail`                                                                                          |
| **Courses**       | `getList`, `getById`, `getEnrolments`, `getProgress`, `getLecture`, `getQuizIds`, `getQuiz`, `getQuizResponses`, `getVideo` |
| **Transactions**  | `getList`                                                                                                                   |
| **Pricing Plans** | `getList`, `getById`                                                                                                        |
| **Webhooks**      | `getList`, `getEvents`                                                                                                      |

All responses are validated at runtime against Zod schemas built from real API responses — not just documentation. If Teachable changes something on their end you'll get a clear, descriptive error pointing to exactly which field failed, not a silent `undefined` buried in your application.

The SDK is intentionally read-only. See [Why Read-Only?](/guides/read-only) for the reasoning behind this design decision.

---

## What's next

Teachable are actively working on a **v2 API** with a significantly expanded set of endpoints. Having built a complete, well-tested v1 foundation puts this SDK in a strong position to be one of the first — and most complete — wrappers ready when v2 lands.

If you need to explore an endpoint not yet in the v2 SDK when it arrives, the `getRaw` method lets you query any endpoint without schema validation:

```typescript
const data = await teachable.v1.getRaw('/your-endpoint');
```

---

## A note on the Teachable API docs

The official Teachable API documentation is a useful starting point, but it isn't always accurate. During development of this SDK several fields were documented as non-nullable that the real API returns as `null`, and some response shapes differed from what was documented.

Where the SDK diverges from the official docs, it reflects the actual observed API behaviour. If you hit a validation error on a field you believe should be valid, [open an issue on GitHub](https://github.com/Ellf/optio-teachable/issues) and we can update the schema.

---

## Contributing

Found a bug, missing endpoint, or undocumented field? Contributions are welcome. Head to the [GitHub repository](https://github.com/Ellf/optio-teachable) to open an issue or submit a pull request.