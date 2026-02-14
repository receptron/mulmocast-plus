# @mulmocast/extended-types

Extended type definitions for MulmoScript / MulmoViewerData, adding variant support, content metadata, and output profiles.

## Type Hierarchy

```mermaid
classDiagram
    class MulmoScript {
        +$mulmocast: version
        +title?: string
        +lang?: string
        +speechParams?: SpeechParams
        +imageParams?: ImageParams
        +movieParams?: MovieParams
        +beats: MulmoBeat[]
    }

    class MulmoBeat {
        +id?: string
        +speaker?: string
        +text?: string
        +description?: string
        +image?: ImageAsset
    }

    class MulmoViewerData {
        +title?: string
        +lang?: string
        +beats: MulmoViewerBeat[]
    }

    class MulmoViewerBeat {
        +id?: string
        +text?: string
        +duration?: number
        +imageSource?: string
        +audioSources?: Record
    }

    class ExtendedMulmoScript {
        +outputProfiles?: Record~string, OutputProfile~
        +scriptMeta?: ScriptMeta
        +beats: ExtendedMulmoBeat[]
    }

    class ExtendedMulmoBeat {
        +variants?: Record~string, BeatVariant~
        +meta?: BeatMeta
    }

    class ExtendedMulmoViewerData {
        +outputProfiles?: Record~string, OutputProfile~
        +scriptMeta?: ScriptMeta
        +beats: ExtendedMulmoViewerBeat[]
    }

    class ExtendedMulmoViewerBeat {
        +variants?: Record~string, BeatVariant~
        +meta?: BeatMeta
    }

    class BeatVariant {
        +text?: string
        +skip?: boolean
        +image?: MulmoImageAsset
        +imagePrompt?: string
    }

    class BeatMeta {
        +tags?: string[]
        +section?: string
        +context?: string
        +notes?: string
        +keywords?: string[]
        +expectedQuestions?: string[]
    }

    class ScriptMeta {
        +audience?: string
        +prerequisites?: string[]
        +goals?: string[]
        +background?: string
        +keywords?: string[]
        +references?: Reference[]
        +faq?: FAQ[]
        +author?: string
    }

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
```

## Conversion Flow

```mermaid
flowchart LR
    ES[ExtendedMulmoScript]
    MS[MulmoScript]
    EVD[ExtendedMulmoViewerData]

    ES -->|filterBySection\nfilterByTags| ES
    ES -->|applyProfile| MS
    ES -->|stripExtendedFields| MS
    ES -->|scriptToViewerData| EVD

    subgraph "@mulmocast/script-utils"
        direction TB
        filter[filter]
        variant[variant]
        context[context-builder]
    end
```

| Operation | Input | Output | Description |
|---|---|---|---|
| `filterBySection` / `filterByTags` | ExtendedMulmoScript | ExtendedMulmoScript | Filter beats while preserving metadata |
| `applyProfile` | ExtendedMulmoScript | MulmoScript | Apply variant overrides, remove extended fields |
| `stripExtendedFields` | ExtendedMulmoScript | MulmoScript | Remove all extended fields |
| `scriptToViewerData` | ExtendedMulmoScript | ExtendedMulmoViewerData | Extract viewer-relevant fields for playback/Q&A |
| `processScript` | ExtendedMulmoScript | MulmoScript | Filter + applyProfile (full pipeline) |

## Package Relationships

```mermaid
graph TD
    T["@mulmocast/types<br/>(MulmoScript, MulmoViewerData)"]
    ET["@mulmocast/extended-types<br/>(Extended* types)"]
    SU["@mulmocast/script-utils<br/>(filter, variant, prompts)"]
    PP["mulmocast-preprocessor<br/>(LLM: summarize, query)"]
    SL["mulmo-slide<br/>(CLI: convert, bundle, movie)"]

    ET --> T
    SU --> T
    SU --> ET
    PP --> SU
    PP --> ET
    SL --> SU
    SL --> ET
```

## Data Lifecycle

```mermaid
flowchart TD
    SRC["Source File\n(PDF / PPTX / Markdown / Keynote)"]

    SRC -->|"mulmo-slide convert\nmulmo-slide marp / pdf / pptx ..."| MS
    MS -->|"mulmo-slide extend scaffold"| ES
    MS -->|"mulmo-slide narrate (LLM)"| ES
    MS -->|"mulmo-slide bundle\n(via mulmocast)"| MVD

    ES -->|"mulmo-slide extend merge"| EMVD
    MVD -->|"mulmo-slide extend merge"| EMVD

    ES -->|"mulmocast-preprocessor\nprocess / profiles"| MS2
    ES -->|"mulmocast-preprocessor\nsummarize / query"| LLM["LLM Response\n(summary / answer)"]

    MS["MulmoScript\nscripts/{bn}/{bn}.json"]
    ES["ExtendedMulmoScript\nscripts/{bn}/extended_script.json"]
    MVD["MulmoViewerData\noutput/{bn}/.../mulmo_view.json"]
    EMVD["ExtendedMulmoViewerData\noutput/{bn}/.../mulmo_view.json"]
    MS2["MulmoScript\n(profiled output)"]

    MS2 -->|"mulmo movie / pdf"| OUT["Movie / PDF"]
    EMVD -->|"MulmoViewer"| VIEWER["Browser Playback\n+ Q&A Chat"]
```

### Type Usage by Package

| Type | Produced by | Consumed by |
|---|---|---|
| **MulmoScript** | `mulmo-slide` converters (marp, pptx, pdf, keynote, markdown, transcribe) | `mulmocast` (movie, pdf, bundle), `mulmocast-preprocessor`, scaffold |
| **ExtendedMulmoScript** | `mulmo-slide extend scaffold`, `mulmo-slide narrate`, `mulmo-slide assemble-extended` | `mulmocast-preprocessor` (process, summarize, query), `extend merge` |
| **MulmoViewerData** | `mulmocast` bundle generation | `extend merge` (base for merging metadata) |
| **ExtendedMulmoViewerData** | `mulmo-slide extend merge` | MulmoViewer (browser playback, Q&A chat) |

### Type Usage by Function (`@mulmocast/script-utils`)

| Function | Input | Output | Used by |
|---|---|---|---|
| `processScript` | ExtendedMulmoScript | MulmoScript | preprocessor CLI |
| `applyProfile` | ExtendedMulmoScript | MulmoScript | processScript |
| `filterBySection` / `filterByTags` | ExtendedMulmoScript | ExtendedMulmoScript | processScript, preprocessor query/summarize |
| `stripExtendedFields` | ExtendedMulmoScript | MulmoScript | processScript (default profile) |
| `scriptToViewerData` | ExtendedMulmoScript | ExtendedMulmoViewerData | preprocessor interactive query |
| `buildScriptContent` | ExtendedMulmoViewerData | string | mulmo-slide Q&A chat (browser) |

### File Conventions

| Type | File Path |
|---|---|
| MulmoScript | `scripts/{basename}/{basename}.json` |
| ExtendedMulmoScript | `scripts/{basename}/extended_script.json` |
| MulmoViewerData / ExtendedMulmoViewerData | `output/{basename}/{basename}/mulmo_view.json` |

## Installation

```bash
yarn add @mulmocast/extended-types
```

## License

MIT
