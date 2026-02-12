[![npm version](https://badge.fury.io/js/mulmocast-mcp.svg)](https://badge.fury.io/js/mulmocast-mcp)
# mulmocast-mcp

MCP (Model Context Protocol) server for MulmoCast.

## Usage

```json
    "mulmocast": {
      "command": "npx",
      "args": [
        "mulmocast-mcp@latest"
      ],
      "env": {
        "OPENAI_API_KEY": "xxx",
        "REPLICATE_API_TOKEN": "xxx",
        "ANTHROPIC_API_KEY": "xxx"
      },
      "transport": {
        "stdio": true
      }
    }
```

## Commands

```bash
yarn build      # Compile TypeScript (tsc)
yarn lint       # Run ESLint on src/
yarn format     # Format with Prettier
```
