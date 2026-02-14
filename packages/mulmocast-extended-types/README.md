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

## Installation

```bash
yarn add @mulmocast/extended-types
```

## License

MIT
