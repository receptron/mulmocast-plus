# MulmoScript Preprocessor Specification

## Quick Start: What You Can Do

Before diving into details, here's what the preprocessor enables:

### Generate Multiple Versions from One Script

```bash
# Your single source script contains everything
$ cat presentation.json
{
  "title": "GraphAI Introduction",
  "beats": [
    {
      "text": "Today we'll cover GraphAI in detail...",
      "variants": {
        "summary": { "text": "Quick GraphAI overview." },
        "teaser": { "skip": true }
      }
    }
  ]
}

# Generate full 10-minute version
$ mulmocast-preprocessor presentation.json -o full.json
$ mulmo movie full.json  # → 10-minute video

# Generate 3-minute summary
$ mulmocast-preprocessor presentation.json --profile summary -o summary.json
$ mulmo movie summary.json  # → 3-minute video

# Generate 30-second teaser
$ mulmocast-preprocessor presentation.json --profile teaser -o teaser.json
$ mulmo movie teaser.json  # → 30-second video
```

### AI-Powered Summarization (Coming Soon)

```bash
# Automatically generate summary variants using AI
$ mulmocast-preprocessor summarize presentation.json --profile summary

Analyzing 15 beats...
Generated summary variants:
  Beat 1: "Today we'll cover GraphAI in detail..." → "Quick GraphAI intro."
  Beat 2: "Let me explain the history..." → [skip]
  Beat 3: "The core concept is..." → "GraphAI uses agent-based workflows."
  ...

Save changes? [y/n]: y
Updated presentation.json with summary variants.
```

### Interactive Q&A with Your Script (Coming Soon)

```bash
# Ask questions about your presentation content
$ mulmocast-preprocessor query presentation.json "What is an agent?"

Found relevant content in beats: #3, #7, #12

An agent in GraphAI is a reusable component that performs a specific task.
It receives inputs, processes them (often using LLMs), and produces outputs.
Agents can be chained together in a graph structure.

Sources:
  - Beat #3 (section: concepts, tags: agent, core)
  - Beat #7 (section: examples)

# Follow-up questions in chat mode
$ mulmocast-preprocessor query presentation.json --chat

You: How do agents communicate?
Assistant: Agents communicate through the graph structure. Each agent's output
can be connected to another agent's input using named connections...

You: Show me an example
Assistant: Here's an example from your presentation (Beat #12):
  "const graph = { nodes: { fetch: { agent: 'fetchAgent' }, ... } }"
```

---

## Overview

The MulmoScript Preprocessor is a tool that enables content creators to:

1. **Generate multiple output variations** from a single source script
2. **Embed rich metadata** for filtering and AI-powered features
3. **Query and summarize** script content using natural language

## Open Data Format

The Extended MulmoScript format is an **open specification** designed for interoperability. While `mulmocast-preprocessor` provides a reference implementation, the format can be used by:

### Any Tool or System

The schema is fully documented and can be implemented by any tool:

```typescript
// The schema is defined using Zod and exported from the package
import { extendedScriptSchema, extendedBeatSchema, beatMetaSchema } from "mulmocast-preprocessor";

// Validate your own Extended MulmoScript
const result = extendedScriptSchema.safeParse(yourScript);
```

### General-Purpose AI (Claude Code, etc.)

The metadata-rich format is designed to work directly with general-purpose AI assistants:

```bash
# Example: Ask Claude Code to work with your Extended MulmoScript
$ claude

You: Read presentation.json and answer: What is an agent?

Claude: Based on the script, I found relevant content in beat #3 (section: chapter2):
"An agent is a reusable component that performs a specific task..."
The meta.context describes a diagram showing input/output arrows.
```

The AI can leverage:
- `meta.keywords` for semantic search
- `meta.expectedQuestions` for Q&A matching
- `meta.context` for understanding visual content
- `meta.section` and `meta.tags` for navigation

### Custom Implementations

The `summarize` and `query` commands in this package are **reference implementations**. You can:

1. **Implement your own summarization** using any LLM:
   ```typescript
   // Read Extended MulmoScript
   const script = JSON.parse(fs.readFileSync("script.json"));

   // Extract content for summarization
   const content = script.beats.map(beat => ({
     text: beat.text,
     context: beat.meta?.context,
     section: beat.meta?.section,
     tags: beat.meta?.tags,
   }));

   // Use your preferred LLM to generate summaries
   const summaries = await yourLLM.summarize(content);

   // Apply to variants
   script.beats.forEach((beat, i) => {
     beat.variants = beat.variants || {};
     beat.variants.summary = summaries[i];
   });
   ```

2. **Build custom Q&A systems**:
   - Index `meta.keywords` and `meta.expectedQuestions` in a vector database
   - Use RAG (Retrieval-Augmented Generation) for accurate answers
   - Build chatbots that understand your content

3. **Integrate with existing tools**:
   - Content management systems
   - Documentation platforms
   - Learning management systems

### Schema as Contract

The type definitions serve as the authoritative schema:

| Type | Purpose |
|------|---------|
| `ExtendedScript` | Root document with beats, variants, and profiles |
| `ExtendedBeat` | Beat with optional `variants` and `meta` |
| `BeatVariant` | Profile-specific overrides (`text`, `skip`, `image`) |
| `BeatMeta` | Metadata for filtering and AI features |
| `OutputProfile` | Profile display information |

All fields are optional and additive—existing MulmoScript files remain valid.

## Background

### Problem Statement

When creating video or audio content from MulmoScript, content creators face several challenges:

**Challenge 1: Multiple Versions**

Content often needs multiple versions for different purposes:

- **Full version**: Complete 10-minute presentation with detailed explanations
- **Summary version**: 3-minute condensed version for quick consumption
- **Teaser version**: 30-second promotional clip for social media

Traditional approach: Maintain separate files → duplication, sync issues, inconsistency.

**Challenge 2: Content Understanding**

As scripts grow longer, creators need ways to:

- **Summarize**: Quickly generate condensed versions without manual rewriting
- **Query**: Ask questions about the content ("What did I say about X?")
- **Navigate**: Find specific sections or topics within large scripts

Traditional approach: Manual search and reading → time-consuming, error-prone.

### Solution

The MulmoScript Preprocessor addresses these challenges through:

1. **Variant System**: Define all version-specific content in a single file
2. **Metadata System**: Embed tags, sections, keywords, and context for each beat
3. **AI Integration**: Use metadata to power summarization and Q&A features

```
┌─────────────────────────────────────────────────────────────────┐
│                    Extended MulmoScript                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   beats     │  │  variants   │  │    meta     │             │
│  │  (content)  │  │ (per-profile│  │ (tags, keys │             │
│  │             │  │  overrides) │  │  context)   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
   ┌─────────┐        ┌──────────┐        ┌──────────┐
   │ Process │        │Summarize │        │  Query   │
   │--profile│        │  (AI)    │        │  (AI)    │
   └─────────┘        └──────────┘        └──────────┘
        │                   │                   │
        ▼                   ▼                   ▼
   Standard            Auto-generated      Natural language
   MulmoScript         variants            answers
```

## Data Model

### Extended MulmoScript Schema

The preprocessor extends the standard MulmoScript schema with additional fields.

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

Beats can include metadata for filtering and AI features:

```typescript
interface BeatMeta {
  tags?: string[];              // Categorization tags
  section?: string;             // Section identifier
  context?: string;             // Additional context (for images, diagrams)
  keywords?: string[];          // Search keywords for Q&A
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
        "section": "opening",
        "keywords": ["GraphAI", "introduction"],
        "expectedQuestions": ["What is GraphAI?", "What will this video cover?"]
      }
    },
    {
      "speaker": "Host",
      "text": "First, let me explain the historical context and motivation behind GraphAI...",
      "image": { "type": "image", "source": { "kind": "path", "path": "timeline.png" } },
      "variants": {
        "summary": { "text": "GraphAI was created to simplify AI workflows." },
        "teaser": { "skip": true }
      },
      "meta": {
        "tags": ["background", "history"],
        "section": "chapter1",
        "context": "Timeline diagram showing GraphAI development from 2023 to present",
        "keywords": ["history", "motivation", "2023"]
      }
    },
    {
      "speaker": "Host",
      "text": "An agent is a reusable component that performs a specific task. It receives inputs, processes them, and produces outputs.",
      "image": { "type": "image", "source": { "kind": "path", "path": "agent-diagram.png" } },
      "meta": {
        "tags": ["concept", "agent", "core"],
        "section": "chapter2",
        "context": "Diagram showing agent with input arrows on left, processing box in center, output arrows on right",
        "keywords": ["agent", "component", "input", "output", "task"],
        "expectedQuestions": [
          "What is an agent?",
          "How do agents work?",
          "What can agents do?"
        ]
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

### Step 4: Add Metadata for Filtering and AI

Include metadata to enable filtering and AI-powered features:

```json
{
  "text": "An agent is a reusable component...",
  "meta": {
    "section": "concepts",
    "tags": ["agent", "core"],
    "keywords": ["agent", "component", "reusable"],
    "context": "This diagram shows the agent architecture",
    "expectedQuestions": ["What is an agent?"]
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

### Metadata Guidelines for AI Features

1. **Add context for images** - Describe what diagrams and images show
2. **Include relevant keywords** - Enable accurate Q&A matching
3. **Anticipate questions** - Add `expectedQuestions` to improve Q&A accuracy
4. **Use descriptive sections** - Help AI understand document structure

---

## AI Features: Reference Implementation

This section describes how the `summarize` and `query` commands use the metadata to provide AI-powered features. These are **reference implementations**—you can implement equivalent functionality using any LLM or AI system by following the same patterns.

### Summarize Command

The `summarize` command automatically generates variant text for a specified profile using an LLM.

#### How It Works

1. **Collect Content**: For each beat, gather:
   - `text`: The original spoken text
   - `meta.context`: Additional context (especially for images/diagrams)
   - `meta.section`: Section name for understanding document structure

2. **Build Prompt**: Send to LLM with instructions:
   ```
   You are summarizing a presentation. For each beat, provide either:
   - A shortened version of the text (for important content)
   - "SKIP" (for content that can be omitted in summary)

   Beat 1 (section: intro):
   Original: "Today we'll explore GraphAI in depth, covering concepts..."
   Context: Opening slide with title

   Beat 2 (section: background):
   Original: "First, let me explain the historical context..."
   Context: Timeline diagram showing development history
   ...
   ```

3. **Apply Results**: Update the script with generated variants:
   ```json
   {
     "variants": {
       "summary": { "text": "Generated summary text..." }
     }
   }
   ```
   or
   ```json
   {
     "variants": {
       "summary": { "skip": true }
     }
   }
   ```

#### Data Usage

| Field | Usage in Summarize |
|-------|-------------------|
| `text` | Primary content to summarize |
| `meta.context` | Helps LLM understand visual content that text may reference |
| `meta.section` | Groups beats for coherent section-level summarization |
| `meta.tags` | Identifies important topics (e.g., `core` tag = don't skip) |

### Query Command

The `query` command enables natural language Q&A about the script content.

#### How It Works

1. **Parse Question**: Extract keywords and intent from user's question

2. **Find Relevant Beats**: Score each beat based on:
   - `meta.keywords` match (highest weight)
   - `meta.expectedQuestions` similarity (high weight)
   - `meta.tags` match (medium weight)
   - `text` content match (lower weight)

3. **Build Context**: For matched beats, gather:
   - `text`: The spoken content
   - `meta.context`: Additional context for images/diagrams
   - `meta.section`: For citation purposes

4. **Generate Answer**: Send to LLM:
   ```
   Answer the user's question based on the following content from a presentation.

   User Question: "What is an agent?"

   Relevant Content:
   [Beat #3, section: concepts, tags: agent, core]
   Text: "An agent is a reusable component that performs a specific task..."
   Context: Diagram showing agent with input/output arrows

   [Beat #7, section: examples]
   Text: "Here's an example of a simple agent..."

   Provide a clear, accurate answer citing the source beats.
   ```

5. **Return Response**: Include answer and source citations

#### Data Usage

| Field | Usage in Query |
|-------|---------------|
| `text` | Primary searchable content |
| `meta.keywords` | Explicit search terms for matching |
| `meta.expectedQuestions` | Pre-defined Q&A pairs for accurate matching |
| `meta.context` | Provides image/diagram descriptions to LLM |
| `meta.tags` | Topic categorization for relevance scoring |
| `meta.section` | Source citation in answers |

#### Chat Mode

In chat mode, the system maintains conversation history to enable follow-up questions:

```
User: What is an agent?
→ Search beats, generate answer about agents

User: How do they communicate?
→ Context: previous topic was "agents"
→ Search for beats about agent communication
→ Generate answer with maintained context
```

### Metadata Best Practices for AI

To get the best results from AI features:

1. **Keywords**: Add specific, searchable terms
   ```json
   "keywords": ["agent", "component", "input", "output"]
   ```

2. **Expected Questions**: Anticipate what viewers might ask
   ```json
   "expectedQuestions": [
     "What is an agent?",
     "How do I create an agent?",
     "What types of agents exist?"
   ]
   ```

3. **Context**: Describe visual content that the text references
   ```json
   "context": "Architecture diagram showing three agents connected in a pipeline"
   ```

4. **Tags**: Use consistent, meaningful tags
   ```json
   "tags": ["concept", "agent", "core"]  // not: ["c1", "important", "misc"]
   ```

### Alternative Implementations

You are not limited to using `mulmocast-preprocessor` for AI features. Examples:

| Approach | Description |
|----------|-------------|
| **Direct LLM** | Pass Extended MulmoScript JSON directly to Claude, GPT, etc. |
| **RAG System** | Index metadata in a vector database for semantic search |
| **Custom CLI** | Build your own tool using the schema definitions |
| **Web Service** | Create an API that processes Extended MulmoScript |

The metadata schema is designed to be self-descriptive and AI-friendly.

## Related Resources

- [MulmoScript Specification](https://github.com/receptron/mulmocast)
- [mulmocast-cli Documentation](https://github.com/receptron/mulmocast-cli)
- [GraphAI Project](https://github.com/receptron/graphai)
