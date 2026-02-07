# mulmocast-plus

Monorepo for MulmoCast extension packages.

## Packages

| Package | Description | npm |
|---------|-------------|-----|
| [mulmocast-easy](./packages/mulmocast-easy) | MulmoCast with zero configuration (ffmpeg/Chrome bundled) | [![npm](https://img.shields.io/npm/v/mulmocast-easy)](https://www.npmjs.com/package/mulmocast-easy) |
| [mulmocast-preprocessor](./packages/mulmocast-preprocessor) | Profile variants, filtering, AI summarization & Q&A | [![npm](https://img.shields.io/npm/v/mulmocast-preprocessor)](https://www.npmjs.com/package/mulmocast-preprocessor) |
| [@mulmocast/extended-types](./packages/mulmocast-extended-types) | Type definitions and Zod schemas for ExtendedScript | [![npm](https://img.shields.io/npm/v/@mulmocast/extended-types)](https://www.npmjs.com/package/@mulmocast/extended-types) |

## Development

### Prerequisites

- Node.js >= 22
- Yarn 1.x

### Setup

```bash
yarn install
```

### Commands

```bash
yarn build    # Build all packages
yarn lint     # Lint all packages
yarn format   # Format all packages
yarn test     # Test all packages
```

## Related

- [mulmocast](https://github.com/receptron/mulmocast) - Core MulmoCast engine
- [mulmocast-cli](https://github.com/receptron/mulmocast-cli) - MulmoCast CLI
- [GraphAI](https://github.com/receptron/graphai) - AI orchestration framework
- [mulmocast.com](https://mulmocast.com/) - Official website & desktop app

## License

MIT
