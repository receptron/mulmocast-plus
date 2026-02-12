# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monorepo for MulmoCast derivative packages. Extended functionality for the MulmoCast platform.

## Commands

```bash
yarn build      # Build all packages
yarn lint       # Lint all packages
yarn format     # Format all packages
yarn test       # Run tests across all packages
```

Per-package commands (run from `packages/<name>/`):

```bash
yarn build      # tsc
yarn lint       # eslint src
yarn format     # prettier --write
yarn test       # node --import tsx --test (where available)
```

## Architecture

Yarn workspaces monorepo (`packages/*`). Shared TypeScript config at `config/tsconfig.base.json` — each package extends it via `"extends": "../../config/tsconfig.base.json"`.

### Packages

| Package | npm name | Description |
|---------|----------|-------------|
| `mulmocast-easy` | `mulmocast-easy` | MulmoCast with bundled ffmpeg for easy installation |
| `mulmocast-extended-types` | `@mulmocast/extended-types` | Zod schemas and types extending `@mulmocast/types` |
| `mulmocast-preprocessor` | `mulmocast-preprocessor` | Content preprocessor (filter, variant, profile, AI query/summarize) |
| `mulmocast-mcp` | `mulmocast-mcp` | MCP (Model Context Protocol) server for MulmoCast |

### mulmocast-extended-types — Type Structure

Source files under `packages/mulmocast-extended-types/src/`:

- **`mulmoBeat.ts`** — Extends `MulmoBeat` / `MulmoScript` from `@mulmocast/types`
  - `beatVariantSchema` / `BeatVariant` — profile-specific content overrides
  - `beatMetaSchema` / `BeatMeta` — metadata for filtering and context
  - `extendedMulmoBeatSchema` / `ExtendedMulmoBeat` — beat with variants and meta
  - `outputProfileSchema` / `OutputProfile` — profile display information
  - `referenceSchema` / `Reference` — external resource reference
  - `faqSchema` / `FAQ` — frequently asked question
  - `scriptMetaSchema` / `ScriptMeta` — script-level metadata for AI features
  - `extendedMulmoScriptSchema` / `ExtendedMulmoScript` — script with extended beats, outputProfiles, scriptMeta

- **`mulmoViewerData.ts`** — Extends `MulmoViewerBeat` / `MulmoViewerData` from `@mulmocast/types`
  - `extendedMulmoViewerBeatSchema` / `ExtendedMulmoViewerBeat` — viewer beat with variants and meta
  - `extendedMulmoViewerDataSchema` / `ExtendedMulmoViewerData` — viewer data with extended beats, outputProfiles, scriptMeta

- **`index.ts`** — Barrel file re-exporting from `mulmoBeat.js` and `mulmoViewerData.js`

### Naming Conventions

- Type names: `ExtendedMulmoScript`, `ExtendedMulmoBeat`, `ExtendedMulmoViewerBeat`, `ExtendedMulmoViewerData`
- Schema names: `extendedMulmoScriptSchema`, `extendedMulmoBeatSchema`, etc.
- Never use the old short names (`ExtendedScript`, `ExtendedBeat`, `extendedScriptSchema`, `extendedBeatSchema`)

### mulmocast-mcp

MCP server providing MulmoCast content generation tools. Migrated from standalone repository `receptron/mulmocast-mcp` (now archived).

- Entry point: `src/index.ts` (also the bin target)
- License: AGPL-3.0-only (different from other MIT-licensed packages)
- Uses `@modelcontextprotocol/sdk` for MCP protocol, `mulmocast` for generation
