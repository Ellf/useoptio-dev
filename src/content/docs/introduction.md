---
title: Introduction
description: An overview of the Optio Teachable Lite SDK.
---

Welcome to the **Optio Teachable SDK**, a high-performance, type-safe wrapper for the Teachable v1 API.

This is the **Lite** version of the SDK, which means we have intentionally focused on the "Core Four" pillars of Teachable integration to keep your bundle size small and your implementation clean.

## Current Scope (v1)

The Lite version currently provides full TypeScript coverage and Zod validation for:

* **Courses:** List, fetch, and search your curriculum.
* **Users:** Manage student records and enrollments.
* **Transactions:** Track revenue and sale data.
* **Webhooks:** Strongly-typed payloads for Teachable events.

## Prerequisites

Before you start, you will need:

1.  A **Teachable API Key** (Found in your Teachable school settings under *Settings > API*).
2.  **Node.js 18** or higher.

## Why "Lite"?

Most Teachable integrations only use 20% of the available endpoints. By stripping away legacy features and rarely-used metadata, we provide a faster developer experience with zero-guesswork types.

---

**Next Step:** Head over to the [Quick Start](/quickstart/) guide to make your first authorized request.