# Google Password Manager Assistant 🔑

A workaround for using **Google Password Manager (GPM)** in non-Chrome Chromium browsers that don’t have native access to Google Password Manager for autofill.  
This extension bridges that gap.

---

## What It Does

- **Detects Login Fields** – Automatically finds password fields on any website.  
- **One-Click Access** – Shows a subtle, non-intrusive banner to open GPM.  
- **Auto-Search** – Opens passwords.google.com in a popup and automatically types the domain name into the search bar.

---

## Why?

If you like the GPM ecosystem but prefer a different browser interface (Arc, Perplexity, etc.), you typically lose easy access to your passwords.  
This restores that workflow without needing to switch back to Chrome.

---

## Development

Built with **TypeScript** and **Bun**.

### Install
```bash
bun install
```

### Build
```bash
bun run build.ts
```

### Installation
1. Run `bun run build.ts`.
2. Go to `chrome://extensions`.
3. Enable Developer Mode.
4. Click Load Unpacked -> select `./dist`.
