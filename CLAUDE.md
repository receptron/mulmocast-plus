# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monorepo for MulmoCast CLI derivative packages. Extended functionality for the MulmoCast platform.

## Commands

```bash
yarn build      # Build all packages
yarn lint       # Lint all packages
yarn format     # Format all packages
yarn test       # Run tests across all packages
```

## Architecture

Yarn workspaces monorepo with packages:
- `packages/mulmocast-easy/` - Simplified MulmoCast interface
- `packages/mulmocast-extended-types/` - Extended type definitions
- `packages/mulmocast-preprocessor/` - Content preprocessor
