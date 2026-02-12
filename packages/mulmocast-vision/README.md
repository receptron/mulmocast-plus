[![npm version](https://badge.fury.io/js/mulmocast-vision.svg)](https://badge.fury.io/js/mulmocast-vision)
# mulmocast-vision

**mulmocast-vision** is a tool that uses LLMs via MCP (Model Context Protocol) to automatically generate presentation slides, similar to PowerPoint.
With **80+ business-oriented slide templates**, you can quickly create proposals, strategy decks, and other professional materials.

## Setup

Add the following to your MCP client configuration (e.g., `claude_desktop_config.json`):

```json
"mulmocast-vision": {
  "command": "npx",
  "args": [
    "mulmocast-vision@latest"
  ],
  "transport": {
    "stdio": true
  }
}
```

## Usage

1. Launch an MCP-compatible client (e.g., Claude Desktop)
2. Give an instruction like "Compare corporate analysis of AI companies such as OpenAI Anthropic Replicate. About 20 slides."
3. Generated slides are saved automatically under `~/Documents/mulmocast-vision/{date}`

## Commands

```bash
yarn build      # Compile TypeScript (tsc)
yarn lint       # Run ESLint on src/ and tests/
yarn format     # Format with Prettier
```

## License

AGPL-3.0-or-later
