# MulmoScript Preprocessor Specification

## Overview

The MulmoScript Preprocessor is a tool that enables content creators to generate multiple output variations from a single source script. This document describes the architecture, data model, and usage patterns for the preprocessor.

## Background

### Problem Statement

When creating video or audio content from scripts, content creators often need multiple versions of the same content:

- **Full version**: Complete content with detailed explanations
- **Summary version**: Condensed version highlighting key points
- **Teaser version**: Short promotional clips for social media

Traditional approaches require maintaining separate script files for each version, leading to:

- **Duplication**: Same content copied across multiple files
- **Synchronization issues**: Updates must be applied to all versions manually
- **Inconsistency**: Versions can drift apart over time

### Solution

The MulmoScript Preprocessor introduces a **variant-based approach** where a single source script contains all version-specific content. The preprocessor extracts the appropriate content based on the selected profile.

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  source.json    │ --> │  preprocessor    │ --> │  output.json    │
│  (with variants)│     │  --profile xxx   │     │  (standard)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## Data Model

### Extended MulmoScript Schema

The preprocessor extends the standard MulmoScript schema with additional fields for variant management and metadata.

#### Beat Variants

Each beat can define profile-specific overrides:

```typescript
interface BeatVariant {
  text?: string;        // Override the spoken text
  skip?: boolean;       // Exclude this beat from output
  image?: MulmoImage;   // Override the visual content
  imagePrompt?: string; // Override the image generation prompt
}
```

#### Beat Metadata

Beats can include metadata for filtering and context:

```typescript
interface BeatMeta {
  tags?: string[];              // Categorization tags
  section?: string;             // Section identifier
  context?: string;             // Additional context for AI tools
  keywords?: string[];          // Search keywords
  expectedQuestions?: string[]; // Anticipated viewer questions
}
```

#### Output Profiles

Scripts can define named profiles with display information:

```typescript
interface OutputProfile {
  name: string;         // Display name
  description?: string; // Profile description
}
```

### Complete Example

```json
{
  "$mulmocast": { "version": "1.1" },
  "title": "Introduction to GraphAI",
  "lang": "en",

  "outputProfiles": {
    "summary": {
      "name": "3-Minute Summary",
      "description": "Key points only"
    },
    "teaser": {
      "name": "30-Second Teaser",
      "description": "Social media promotional clip"
    }
  },

  "beats": [
    {
      "speaker": "Host",
      "text": "Today we'll explore GraphAI in depth, covering concepts, architecture, and practical examples.",
      "variants": {
        "summary": { "text": "Let's explore GraphAI basics." },
        "teaser": { "text": "Discover GraphAI!" }
      },
      "meta": {
        "tags": ["intro"],
        "section": "opening"
      }
    },
    {
      "speaker": "Host",
      "text": "First, let me explain the historical context and motivation behind GraphAI...",
      "variants": {
        "summary": { "text": "GraphAI was created to simplify AI workflows." },
        "teaser": { "skip": true }
      },
      "meta": {
        "tags": ["background", "history"],
        "section": "chapter1"
      }
    }
  ]
}
```

## Creating Extended Scripts

### Step 1: Start with Standard MulmoScript

Begin with a complete, full-version script:

```json
{
  "title": "My Presentation",
  "beats": [
    { "speaker": "Host", "text": "Welcome to this detailed presentation..." }
  ]
}
```

### Step 2: Define Output Profiles

Add the `outputProfiles` section to declare available profiles:

```json
{
  "outputProfiles": {
    "summary": {
      "name": "Summary Version",
      "description": "5-minute overview"
    }
  }
}
```

### Step 3: Add Variants to Beats

For each beat, add profile-specific overrides:

```json
{
  "text": "Welcome to this detailed presentation about our comprehensive solution...",
  "variants": {
    "summary": { "text": "Welcome to the overview." }
  }
}
```

### Step 4: Add Metadata for Filtering

Include metadata to enable section and tag-based filtering:

```json
{
  "text": "...",
  "meta": {
    "section": "intro",
    "tags": ["welcome", "overview"]
  }
}
```

### Variant Strategies

| Strategy | Use Case | Example |
|----------|----------|---------|
| Text replacement | Shorten or simplify content | `"text": "Brief version"` |
| Skip | Remove non-essential beats | `"skip": true` |
| Image override | Use different visuals | `"image": { ... }` |
| No variant | Use original content | (omit the profile key) |

## Using the Preprocessor

### Command-Line Interface

#### Basic Processing

```bash
# Apply a profile and save to file
mulmocast-preprocessor script.json --profile summary -o summary.json

# Output to stdout for piping
mulmocast-preprocessor script.json --profile teaser | mulmo movie -
```

#### Filtering

```bash
# Extract specific section
mulmocast-preprocessor script.json --section chapter1

# Filter by tags
mulmocast-preprocessor script.json --tags intro,conclusion

# Combine profile and filters
mulmocast-preprocessor script.json --profile summary --section chapter1
```

#### List Available Profiles

```bash
mulmocast-preprocessor profiles script.json

# Output:
# Available profiles:
#   default: 10 beats
#   summary (3-Minute Summary): 8 beats, 2 skipped
#   teaser (30-Second Teaser): 3 beats, 7 skipped
```

### Programmatic API

```typescript
import {
  processScript,
  applyProfile,
  listProfiles,
  filterBySection,
  filterByTags
} from "mulmocast-preprocessor";

// Load script
const script = JSON.parse(fs.readFileSync("script.json", "utf-8"));

// List available profiles
const profiles = listProfiles(script);
console.log(profiles);

// Process with options
const result = processScript(script, {
  profile: "summary",
  section: "chapter1",
  tags: ["important"]
});

// Save output
fs.writeFileSync("output.json", JSON.stringify(result, null, 2));
```

### Processing Pipeline

The preprocessor applies transformations in the following order:

1. **Section Filter** - Extract beats matching the specified section
2. **Tag Filter** - Extract beats containing any of the specified tags
3. **Profile Application** - Apply text/image overrides and skip marked beats
4. **Field Stripping** - Remove `variants`, `meta`, and `outputProfiles` from output

This order ensures that filtering occurs while metadata is still available, and the final output is a standard MulmoScript compatible with downstream tools.

## Output Format

The preprocessor outputs standard MulmoScript without extended fields:

**Input (Extended):**
```json
{
  "text": "Detailed explanation...",
  "variants": { "summary": { "text": "Brief." } },
  "meta": { "section": "intro" }
}
```

**Output (Standard):**
```json
{
  "text": "Brief."
}
```

This ensures compatibility with existing MulmoScript consumers that do not understand extended fields.

## Best Practices

### Authoring Guidelines

1. **Write the full version first** - Complete content serves as the source of truth
2. **Use meaningful section names** - Enable logical content extraction
3. **Apply consistent tagging** - Facilitate cross-cutting filters
4. **Test all profiles** - Verify narrative flow for each output variant

### Profile Design

1. **Maintain narrative coherence** - Each profile should tell a complete story
2. **Avoid orphaned references** - If skipping a beat, ensure subsequent beats don't reference it
3. **Consider transitions** - Shortened versions may need adjusted transitions

### Performance Considerations

- Extended scripts are processed entirely in memory
- Large scripts (1000+ beats) may benefit from section-based processing
- Output files are standard JSON with no external dependencies

## Compatibility

| Component | Requirement |
|-----------|-------------|
| Node.js | 22.x or later |
| MulmoScript | 1.1 or later |
| mulmocast | 2.1.35 or later |

The preprocessor maintains backward compatibility:

- Scripts without `variants` are processed as-is
- Scripts without `meta` can still use profile-based variants
- The `default` profile always returns original content

## Related Resources

- [MulmoScript Specification](https://github.com/receptron/mulmocast)
- [mulmocast-cli Documentation](https://github.com/receptron/mulmocast-cli)
- [GraphAI Project](https://github.com/receptron/graphai)
