# useoptio.dev

Documentation site for the [Optio Teachable SDK](https://github.com/Ellf/optio-teachable), built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

Live at [useoptio.dev](https://useoptio.dev)

---

## Development

```bash
npm install
npm run dev
```

Starts the local dev server at `http://localhost:4321`.

> **Note:** The API reference is generated from the `optio-teachable` SDK source at build time via `starlight-typedoc`. Run `npm run build` to regenerate the API reference pages after SDK changes.

---

## Building

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── assets/
├── content/
│   └── docs/
│       ├── guides/
│       │   ├── pagination.md
│       │   ├── read-only.md
│       │   └── webhooks.md
│       ├── introduction.md
│       └── quickstart.md
└── content.config.ts
astro.config.mjs
package.json
```

---

## Deployment

Deployed to [GitHub Pages](https://pages.github.com) via GitHub Actions. Pushes to `main` trigger an automatic redeploy.

**Build command:** `npm run build`
**Publish directory:** `dist`

---

## Related

- [optio-teachable](https://github.com/Ellf/optio-teachable) — the SDK this site documents
- [npm package](https://www.npmjs.com/package/optio-teachable)
- [Purple Hippo Web Studio](https://purplehippo.co.uk)