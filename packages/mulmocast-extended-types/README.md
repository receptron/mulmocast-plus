# @mulmocast/extended-types

Extended type definitions for MulmoScript / MulmoViewerData, adding variant support, content metadata, and output profiles.

## Type Hierarchy

```mermaid
classDiagram
    direction LR

    MulmoScript *-- MulmoBeat
    MulmoViewerData *-- MulmoViewerBeat

    ExtendedMulmoScript --|> MulmoScript : extends
    ExtendedMulmoScript *-- ExtendedMulmoBeat
    ExtendedMulmoScript *-- ScriptMeta
    ExtendedMulmoBeat --|> MulmoBeat : extends
    ExtendedMulmoBeat *-- BeatVariant
    ExtendedMulmoBeat *-- BeatMeta

    ExtendedMulmoViewerData --|> MulmoViewerData : extends
    ExtendedMulmoViewerData *-- ExtendedMulmoViewerBeat
    ExtendedMulmoViewerData *-- ScriptMeta
    ExtendedMulmoViewerBeat --|> MulmoViewerBeat : extends
    ExtendedMulmoViewerBeat *-- BeatVariant
    ExtendedMulmoViewerBeat *-- BeatMeta

    class MulmoScript { beats: MulmoBeat[] }
    class MulmoBeat { text, image, speaker }
    class MulmoViewerData { beats: MulmoViewerBeat[] }
    class MulmoViewerBeat { text, imageSource, audioSources }

    class ExtendedMulmoScript { beats: ExtendedMulmoBeat[]; outputProfiles; scriptMeta }
    class ExtendedMulmoBeat { variants; meta }
    class ExtendedMulmoViewerData { beats: ExtendedMulmoViewerBeat[]; outputProfiles; scriptMeta }
    class ExtendedMulmoViewerBeat { variants; meta }

    class BeatVariant { text; skip; image }
    class BeatMeta { tags; section; context; keywords }
    class ScriptMeta { audience; goals; keywords; faq; references }
```

### Defined in

| Package | Types |
|---|---|
| `@mulmocast/types` | MulmoScript, MulmoBeat, MulmoViewerData, MulmoViewerBeat |
| `@mulmocast/extended-types` | Extended\* types, BeatVariant, BeatMeta, ScriptMeta, OutputProfile |

## Data Lifecycle

```mermaid
flowchart TD
    SRC["Source File\n(PDF / PPTX / MD / Keynote)"]

    SRC -->|"mulmo-slide convert"| MS
    MS -->|"mulmo-slide extend scaffold\nmulmo-slide narrate"| ES
    MS -->|"mulmocast bundle"| MVD

    ES -->|"mulmo-slide extend merge"| EMVD
    MVD -->|"mulmo-slide extend merge"| EMVD

    ES -->|"processScript\napplyProfile"| MS2["MulmoScript\n(profiled)"]
    ES -->|"preprocessor\nsummarize / query"| LLM["LLM Response"]

    MS2 -->|"mulmocast movie / pdf"| OUT["Movie / PDF"]
    EMVD -->|"MulmoViewer"| VIEWER["Browser Playback\n+ Q&A Chat"]

    MS["MulmoScript"]
    ES["ExtendedMulmoScript"]
    MVD["MulmoViewerData"]
    EMVD["ExtendedMulmoViewerData"]
```

### Type Usage by Package

| Type | Produced by | Consumed by |
|---|---|---|
| **MulmoScript** | `mulmo-slide` converters (marp, pptx, pdf, keynote, markdown, transcribe) | `mulmocast` (movie, pdf, bundle), preprocessor, scaffold |
| **ExtendedMulmoScript** | `mulmo-slide extend scaffold`, `narrate`, `assemble-extended` | `mulmocast-preprocessor` (process, summarize, query), `extend merge` |
| **MulmoViewerData** | `mulmocast` bundle generation | `extend merge` (base for merging metadata) |
| **ExtendedMulmoViewerData** | `mulmo-slide extend merge` | MulmoViewer (browser playback, Q&A chat) |

### Key Transformations (`@mulmocast/script-utils`)

| Function | Input | Output |
|---|---|---|
| `processScript` | ExtendedMulmoScript | MulmoScript |
| `applyProfile` | ExtendedMulmoScript | MulmoScript |
| `stripExtendedFields` | ExtendedMulmoScript | MulmoScript |
| `scriptToViewerData` | ExtendedMulmoScript | ExtendedMulmoViewerData |
| `buildScriptContent` | ExtendedMulmoViewerData | string (for LLM prompt) |

### File Conventions

| Type | File Path |
|---|---|
| MulmoScript | `scripts/{basename}/{basename}.json` |
| ExtendedMulmoScript | `scripts/{basename}/extended_script.json` |
| MulmoViewerData / ExtendedMulmoViewerData | `output/{basename}/{basename}/mulmo_view.json` |

## Package Dependencies

```mermaid
graph TD
    T["@mulmocast/types\n(MulmoScript, MulmoViewerData)"]
    ET["@mulmocast/extended-types\n(Extended* types)"]
    SU["@mulmocast/script-utils\n(transform, prompts)"]
    PP["mulmocast-preprocessor\n(LLM: summarize, query)"]
    SL["mulmo-slide\n(CLI: convert, bundle, movie)"]

    ET --> T
    SU --> T
    SU --> ET
    PP --> SU
    PP --> ET
    SL --> SU
    SL --> ET
```

## Installation

```bash
yarn add @mulmocast/extended-types
```

## License

MIT
