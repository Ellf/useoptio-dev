---
title: Quick Start
description: Get up and running in minutes.
---

## Installation
```bash
npm install teachable-api-wrapper
```

## Basic Usage
```typescript
import { TeachableClient } from 'teachable-api-wrapper';

const teachable = new TeachableClient(process.env.TEACHABLE_API_KEY);

const { users } = await teachable.v1.users.getList(1, 20);
```