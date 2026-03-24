---
title: Quick Start
description: Get up and running with the Optio Teachable SDK in minutes.
---

This guide walks you through setting up a TypeScript project from scratch and making your first API call with the Optio Teachable SDK.

---

## Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- A Teachable account with an API key (find yours from your dashboard `Settings -> API keys`)

---

## Installation

### 1. Create a new project

```bash
mkdir my-teachable-app
cd my-teachable-app
npm init -y
```

### 2. Install TypeScript and ts-node

[ts-node](https://typestrong.org/ts-node/) lets you run TypeScript files directly without a separate compile step — ideal for scripts and quick integrations.

```bash
npm install --save-dev typescript ts-node @types/node
```

### 3. Create a `tsconfig.json`

```bash
npx tsc --init
```

Then replace the contents of `tsconfig.json` with this recommended configuration:

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 4. Install the SDK and dotenv

```bash
npm install optio-teachable dotenv
```

[dotenv](https://github.com/motdotla/dotenv) loads environment variables from a `.env` file so your API key never appears in your source code.

---

## Configuration

### 1. Create a `.env` file

In the root of your project, create a `.env` file:

```bash
TEACHABLE_API_KEY=your-api-key-here
```

### 2. Add `.env` to `.gitignore`

If you're using Git, make sure your API key is never committed:

```bash
echo ".env" >> .gitignore
```

:::caution
Never commit your API key to source control. If you accidentally expose it, revoke it immediately in your Teachable dashboard under **Settings → API Keys**.
:::

---

## Your First Script

Create a file called `index.ts` in your project root:

```typescript
import { config } from 'dotenv';
import { TeachableClient } from 'optio-teachable';

// Load environment variables from .env
config();

async function main() {
    const teachable = new TeachableClient(process.env.TEACHABLE_API_KEY!);

    try {
        const { courses } = await teachable.v1.courses.getList();
        console.log(`Found ${courses.length} courses:`);
        courses.forEach(course => {
            console.log(` - ${course.name} (published: ${course.is_published})`);
        });
    } catch (error) {
        console.error('API call failed:', error);
    }
}

main();
```

### Run it

```bash
npx ts-node index.ts
```

You should see your Teachable courses listed in the terminal.

---

## Exploring Further

Here are a few more examples to get you started:

**Fetch a paginated user list:**
```typescript
const { users, meta } = await teachable.v1.users.getList(1, 20);
console.log(`Page 1 of ${meta?.number_of_pages} — ${meta?.total} users total`);
```

**Look up a user by email:**
```typescript
const { users } = await teachable.v1.users.getByEmail('student@example.com');
const user = users[0];
console.log(`Found user: ${user?.name} (ID: ${user?.id})`);
```

**Filter transactions by date range:**
```typescript
const { transactions } = await teachable.v1.transactions.getList(1, 50, {
    startDate: '2026-01-01',
    endDate: '2026-03-31',
});
console.log(`Found ${transactions.length} transactions in Q1 2026`);
```

**Get a course with full lecture structure:**
```typescript
const { course } = await teachable.v1.courses.getById(123);
console.log(`${course.name} has ${course.lecture_sections?.length} sections`);
```

---

## Debug Mode

Pass `true` as the second argument to `TeachableClient` to enable request and response logging — useful when exploring the API or troubleshooting unexpected responses:

```typescript
const teachable = new TeachableClient(process.env.TEACHABLE_API_KEY!, true);
```

This will log all outgoing requests and full response bodies to the console, prefixed with `[Teachable Debug]`.

:::tip
Debug mode is best used with `getRaw` when exploring undocumented endpoints:
```typescript
const data = await teachable.v1.getRaw('/enrollments');
```
:::

---

## Using TypeScript Types

All response types are exported from the SDK and can be used to type your own functions:

```typescript
import type { Course, UserDetail, Transaction } from 'optio-teachable';

function formatCourse(course: Course): string {
    return `${course.name} — ${course.is_published ? 'Live' : 'Draft'}`;
}
```

---

## Next Steps

- Browse the full [API Reference](/api) to see all available methods and types
- Have a question or found a bug? [Open an issue on GitHub](https://github.com/Ellf/optio-teachable/issues)