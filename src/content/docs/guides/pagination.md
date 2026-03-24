---
title: Pagination
description: How to paginate through Teachable API results, including large datasets beyond 10,000 records.
---

All list endpoints in the Optio Teachable SDK return paginated responses. This guide covers standard pagination, reading pagination metadata, and how to work around the 10,000 record limit using `search_after`.

---

## Standard pagination

Every list method accepts `page` and `per` parameters:

```typescript
// Fetch page 1 with 20 results per page (default)
const { users, meta } = await teachable.v1.users.getList(1, 20);

// Fetch page 2 with 50 results per page
const { users, meta } = await teachable.v1.users.getList(2, 50);
```

:::note
The `per` parameter defaults to `20` if not explicitly set. The maximum observed value is `100` — passing a higher value does not return more results per page. For bulk exports, use `per: 100` and paginate through all pages.
:::

The same pattern applies across all resources:

```typescript
const { courses }      = await teachable.v1.courses.getList(1, 50);
const { transactions } = await teachable.v1.transactions.getList(1, 100);
const { pricing_plans } = await teachable.v1.pricingPlans.getList(1, 20);
```

---

## Reading pagination metadata

Every list response includes a `meta` object with full pagination details:

```typescript
const { users, meta } = await teachable.v1.users.getList(1, 20);

console.log(`Total users: ${meta?.total}`);
console.log(`Current page: ${meta?.page}`);
console.log(`Total pages: ${meta?.number_of_pages}`);
console.log(`Showing records ${meta?.from} to ${meta?.to}`);
console.log(`Results per page: ${meta?.per_page}`);
```

---

## Fetching all pages

For smaller datasets, you can loop through all pages using `number_of_pages`:

```typescript
async function getAllUsers() {
    const allUsers = [];
    const firstPage = await teachable.v1.users.getList(1, 100);
    allUsers.push(...firstPage.users);

    const totalPages = firstPage.meta?.number_of_pages ?? 1;

    for (let page = 2; page <= totalPages; page++) {
        const { users } = await teachable.v1.users.getList(page, 100);
        allUsers.push(...users);
    }

    return allUsers;
}
```

:::caution
This approach works well for smaller schools but will hit the 10,000 record limit for larger datasets. See [Paginating beyond 10,000 records](#paginating-beyond-10000-records) below.
:::

---

## Paginating beyond 10,000 records

The Teachable v1 API has a hard limit of **10,000 records** for standard page-based pagination on the `/users` endpoint. If your school has more than 10,000 users, standard pagination will not return records beyond that threshold.

To work around this, use the `searchAfter` filter, passing the `id` of the last user returned in the previous page. Teachable will return the next set of records starting after that ID.

```typescript
async function getAllUsersLargeSchool() {
    const allUsers = [];
    let searchAfter: number | undefined = undefined;

    while (true) {
        const { users } = await teachable.v1.users.getList(1, 100, {
            searchAfter,
        });

        if (users.length === 0) break;

        allUsers.push(...users);

        // Use the last user's ID as the cursor for the next request
        searchAfter = users[users.length - 1]?.id;

        // If we got fewer results than requested, we've reached the end
        if (users.length < 100) break;
    }

    return allUsers;
}
```

:::tip
Even for schools under 10,000 users, using `searchAfter` is a more reliable pattern for bulk exports since it is not affected by users being added or removed between page requests.
:::

---

## `search_after` vs standard pagination

|                                     | Standard pagination | `search_after` |
|-------------------------------------|---------------------|----------------|
| **Works beyond 10,000 records**     | ❌                   | ✅              |
| **Supports random page access**     | ✅                   | ❌              |
| **Stable during concurrent writes** | ❌                   | ✅              |
| **Available on all endpoints**      | ✅                   | Users only     |

---

## Limitations

- **`search_after` is only available on `/users`** — other endpoints do not support cursor-based pagination. For large transaction or course datasets, use date range filters to break requests into smaller chunks:

```typescript
// Break large transaction exports into monthly chunks
const q1 = await teachable.v1.transactions.getList(1, 100, {
    startDate: '2026-01-01',
    endDate: '2026-01-31',
});
```

- **`search_after` expects a user ID (`int32`)** — pass the `id` field of the last user in the previous response, not a page number or token.

- **Do not combine `search_after` with `page`** — when using `search_after`, always pass `page: 1`. The `search_after` value acts as the cursor and replaces page-based offset entirely.