---
title: Working with Webhooks
description: Understanding the Teachable webhook API and its quirks.
---

The Teachable v1 API exposes two webhook endpoints — one to list all webhooks registered on your school, and one to inspect the delivery events for a specific webhook. This guide covers how to use them effectively and documents some important behavioural quirks that the official Teachable documentation does not mention.

---

## Fetching your webhooks

```typescript
const { webhooks } = await teachable.v1.webhooks.getList();

webhooks.forEach(webhook => {
    console.log(`${webhook.id} — ${webhook.event_trigger} → ${webhook.url}`);
    console.log(`State: ${webhook.workflow_state} | Events fired: ${webhook.webhook_events_count}`);
});
```

---

## Understanding `workflow_state`

Each webhook has a `workflow_state` field. The observed values from the live API are:

| Value      | Meaning                                                                     |
|------------|-----------------------------------------------------------------------------|
| `pending`  | The webhook has been created but the endpoint URL has not yet been verified |
| `verified` | The endpoint URL was successfully verified at some point                    |
| `failed`   | The webhook has repeatedly failed to deliver and has been disabled          |

:::caution
`verified` does **not** mean the webhook is currently active or healthy. A webhook can be in a `verified` state and still be deleted or non-functional. Do not rely on `workflow_state` alone to determine whether a webhook is operational.
:::

---

## The deleted webhook problem

This is the most significant quirk of the Teachable webhook API:

**Deleted webhooks are not removed from the API response.** The `/webhooks` endpoint returns all webhooks ever created on your school, including ones that have been deleted through the Teachable dashboard. There is no `is_deleted` flag, no filtered endpoint, and no way to distinguish a deleted webhook from a dormant one via the API alone.

In practice this means:

- Your webhook list may contain entries that no longer exist in your Teachable dashboard
- `webhook_events_count` for a deleted webhook will stop incrementing but will retain its historical count
- If you're building a webhook monitoring tool, you should cross-reference against your own records of which webhooks you've intentionally created

:::tip
The most reliable way to identify active webhooks is to maintain your own record of webhook IDs when you create them through the Teachable dashboard, and filter the API response against that list.
:::

---

## `webhook_events_count`

The `webhook_events_count` field represents the **total lifetime count** of times this webhook has been triggered — not just recent events or successful deliveries. It increments regardless of whether the delivery succeeded or failed.

Use `getEvents` for a detailed breakdown of individual delivery attempts.

---

## Inspecting webhook events

The `getEvents` method returns a paginated list of individual delivery attempts for a specific webhook, with optional filters for HTTP status range and creation date.

```typescript
// All events for a webhook
const { events, meta } = await teachable.v1.webhooks.getEvents(42);
console.log(`${meta?.total} total events`);

// Only successful deliveries (2xx responses)
const { events } = await teachable.v1.webhooks.getEvents(42, 1, 20, {
    responseHttpStatusGte: 200,
    responseHttpStatusLte: 299,
});

// Only failed deliveries (any 4xx or 5xx response)
const { events } = await teachable.v1.webhooks.getEvents(42, 1, 20, {
    responseHttpStatusGte: 400,
});

// A specific status code only (e.g. 500)
const { events } = await teachable.v1.webhooks.getEvents(42, 1, 20, {
    responseHttpStatusGte: 500,
    responseHttpStatusLte: 500,
});

// Events within a specific date range
const { events } = await teachable.v1.webhooks.getEvents(42, 1, 20, {
    createdAfter: '2026-01-01T00:00:00Z',
    createdBefore: '2026-03-31T23:59:59Z',
});

// Combine status range and date filters
const { events } = await teachable.v1.webhooks.getEvents(42, 1, 20, {
    responseHttpStatusGte: 400,
    createdAfter: '2026-01-01T00:00:00Z',
    createdBefore: '2026-03-31T23:59:59Z',
});
```

---

## Event fields explained

| Field                  | Description                                                              |
|------------------------|--------------------------------------------------------------------------|
| `workflow_state`       | Delivery status — e.g. `delivered`, `failed`, `pending`                  |
| `attempt_count`        | Number of delivery attempts made for this event                          |
| `last_attempted_at`    | Timestamp of the most recent delivery attempt                            |
| `object_type`          | The Teachable resource type that triggered the event (e.g. `enrollment`) |
| `object_id`            | The ID of the resource that triggered the event                          |
| `response_http_status` | The HTTP status code returned by your endpoint on the last attempt       |

---

## Debugging failed deliveries

If you're seeing failed webhook deliveries, `getEvents` with an HTTP status filter is the quickest way to identify them:

```typescript
// Find all events that received a server error response
const { events } = await teachable.v1.webhooks.getEvents(webhookId, 1, 50, {
    responseHttpStatusGte: 500,
});

events.forEach(event => {
    console.log(`Event ${event.id}: ${event.object_type} #${event.object_id}`);
    console.log(`  Attempts: ${event.attempt_count} | Last status: ${event.response_http_status}`);
    console.log(`  Last attempted: ${event.last_attempted_at}`);
});
```

---

## Limitations

- **Read-only** — there are no POST or PATCH endpoints for webhooks in the Teachable v1 API. Webhooks can only be created and managed through the Teachable dashboard under **Settings → Webhooks**.
- **No filtering by state** — you cannot filter the webhook list by `workflow_state`. All webhooks including deleted ones are always returned.
- **No individual webhook endpoint** — there is no `/webhooks/:id` endpoint. You can only fetch the full list or the events for a specific webhook ID.