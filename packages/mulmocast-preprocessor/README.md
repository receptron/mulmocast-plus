# mulmocast-preprocessor

Preprocessor for MulmoScript that enables generating multiple variations (full, summary, teaser, etc.) from a single script.

## Installation

```bash
npm install mulmocast-preprocessor
```

## Features

- **Profile-based variants**: Generate different versions (summary, teaser) from one script
- **Section filtering**: Extract beats by section
- **Tag filtering**: Extract beats by tags
- **Profile listing**: List available profiles with beat counts
- **CLI tool**: Command-line interface for processing scripts

## CLI Usage

```bash
# Process script with profile
mulmocast-preprocessor script.json --profile summary -o summary.json

# Output to stdout (for piping)
mulmocast-preprocessor script.json --profile teaser

# Filter by section
mulmocast-preprocessor script.json --section chapter1

# Filter by tags
mulmocast-preprocessor script.json --tags concept,demo

# Combine profile and filters
mulmocast-preprocessor script.json --profile summary --section chapter1

# List available profiles
mulmocast-preprocessor profiles script.json
```

### CLI Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--profile <name>` | `-p` | Profile name to apply (default: "default") |
| `--output <path>` | `-o` | Output file path (default: stdout) |
| `--section <name>` | `-s` | Filter by section name |
| `--tags <tags>` | `-t` | Filter by tags (comma-separated) |
| `--help` | `-h` | Show help |
| `--version` | `-v` | Show version |

## Programmatic Usage

### Basic Example

```typescript
import { processScript, listProfiles, applyProfile } from "mulmocast-preprocessor";
import type { ExtendedScript } from "mulmocast-preprocessor";

const script: ExtendedScript = {
  title: "My Presentation",
  beats: [
    {
      text: "Full introduction text here...",
      variants: {
        summary: { text: "Brief intro" },
        teaser: { skip: true }
      },
      meta: { section: "intro", tags: ["important"] }
    },
    {
      text: "Main content...",
      meta: { section: "main", tags: ["core"] }
    }
  ]
};

// List available profiles
const profiles = listProfiles(script);
// [{ name: "default", beatCount: 2 }, { name: "summary", beatCount: 2 }, { name: "teaser", beatCount: 1, skippedCount: 1 }]

// Generate summary version
const summary = applyProfile(script, "summary");
// First beat's text is replaced with "Brief intro"

// Process with multiple options
const result = processScript(script, {
  profile: "summary",
  section: "intro"
});
```

## API

### `processScript(script, options)`

Main processing function that applies profile and filters.

**Parameters:**
- `script: ExtendedScript` - Input script with variants/meta
- `options: ProcessOptions` - Processing options
  - `profile?: string` - Profile name to apply
  - `section?: string` - Filter by section
  - `tags?: string[]` - Filter by tags (OR logic)

**Returns:** `MulmoScript` - Standard MulmoScript with variants/meta stripped

### `applyProfile(script, profileName)`

Apply a profile to the script, replacing text/image and skipping marked beats.

**Parameters:**
- `script: ExtendedScript` - Input script
- `profileName: string` - Profile name

**Returns:** `MulmoScript` - Processed script

### `listProfiles(script)`

Get list of available profiles from script.

**Parameters:**
- `script: ExtendedScript` - Input script

**Returns:** `ProfileInfo[]` - Array of profile info with beat counts

### `filterBySection(script, section)`

Filter beats by section.

### `filterByTags(script, tags)`

Filter beats by tags (extracts beats that have any of the specified tags).

## Extended Schema

### ExtendedBeat

```typescript
interface ExtendedBeat extends MulmoBeat {
  variants?: Record<string, BeatVariant>;
  meta?: BeatMeta;
}
```

### BeatVariant

```typescript
interface BeatVariant {
  text?: string;       // Override text
  skip?: boolean;      // Skip this beat
  image?: MulmoImage;  // Override image
  imagePrompt?: string; // Override imagePrompt
}
```

### BeatMeta

```typescript
interface BeatMeta {
  tags?: string[];
  section?: string;
  context?: string;
  keywords?: string[];
  expectedQuestions?: string[];
}
```

## License

MIT
