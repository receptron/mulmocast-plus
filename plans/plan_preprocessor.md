# MulmoScript Preprocessor 実装計画

## 概要

1つのMulmoScriptから複数のバリエーション（フル版、要約版、ティーザー版など）を生成できるプリプロセッサを実装する。

## アーキテクチャ

preprocessorは**mulmoとは別の独立したツール**として実装する。

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  source.json    │ --> │  preprocessor    │ --> │ output.json │ --> mulmo
│  (variants付き) │     │  --profile xxx   │     │ (処理済み)  │
└─────────────────┘     └──────────────────┘     └─────────────┘
```

### 基本的なワークフロー

```bash
# 1. preprocessorでプロファイル適用
mulmocast-preprocessor source.json --profile summary -o summary.json

# 2. 処理済みJSONをmulmoに渡す
mulmo movie summary.json
```

### リポジトリ構成

| リポジトリ | パッケージ | 役割 |
|-----------|-----------|------|
| mulmocast-plus | `mulmocast-preprocessor` | JSON前処理（本計画） |
| mulmocast-cli | `mulmocast` | 動画/音声/PDF生成 |

## API設計

CLIはAPIのラッパー。コア機能はライブラリとしてエクスポートし、他システムへの組み込みやmulmocast-cliへの統合を可能にする。

### パッケージ構成

```
mulmocast-preprocessor/
├── src/
│   ├── index.ts          # API エクスポート
│   ├── cli/              # CLI実装（APIを使用）
│   │   └── bin.ts
│   ├── core/             # コアロジック
│   │   ├── process.ts    # メイン処理
│   │   ├── variant.ts    # Variant適用
│   │   └── filter.ts     # フィルタ処理
│   └── types/            # 型定義
│       └── index.ts
└── lib/                  # ビルド出力
```

### Core API

```typescript
// index.ts からエクスポート
import {
  // メイン処理
  processScript,

  // 個別機能
  applyProfile,
  filterBySection,
  filterByTags,
  listProfiles,

  // 型
  ProcessOptions,
  ProfileInfo,
} from "mulmocast-preprocessor";
```

### API定義

#### `processScript(script, options): MulmoScript`

メイン処理関数。プロファイル適用とフィルタを一括実行。

```typescript
interface ProcessOptions {
  profile?: string;      // 適用するプロファイル名
  section?: string;      // セクションフィルタ
  tags?: string[];       // タグフィルタ
}

// 使用例
const result = processScript(script, {
  profile: "summary",
  section: "chapter1",
});
```

#### `applyProfile(script, profileName): MulmoScript`

プロファイルを適用してスクリプトを変換。

```typescript
// 使用例
const summaryScript = applyProfile(script, "summary");
// - variants.summary.text があれば text を差し替え
// - variants.summary.skip === true なら beat を除外
// - variants.summary.image があれば image を差し替え
```

#### `filterBySection(script, section): MulmoScript`

指定セクションのbeatsのみ抽出。

```typescript
// 使用例
const chapter1 = filterBySection(script, "chapter1");
```

#### `filterByTags(script, tags): MulmoScript`

指定タグを持つbeatsのみ抽出。

```typescript
// 使用例
const conceptBeats = filterByTags(script, ["concept", "demo"]);
```

#### `listProfiles(script): ProfileInfo[]`

スクリプトに定義されているプロファイル一覧を取得。

```typescript
interface ProfileInfo {
  name: string;           // プロファイル名
  displayName?: string;   // 表示名
  description?: string;   // 説明
  beatCount: number;      // 出力beat数
  skippedCount: number;   // スキップされるbeat数
}

// 使用例
const profiles = listProfiles(script);
// [
//   { name: "default", beatCount: 7, skippedCount: 0 },
//   { name: "summary", displayName: "3分要約版", beatCount: 5, skippedCount: 2 },
//   { name: "teaser", displayName: "30秒ティーザー", beatCount: 3, skippedCount: 4 },
// ]
```

### 使用例: 外部システムからの利用

```typescript
import { processScript, listProfiles } from "mulmocast-preprocessor";
import { readFileSync, writeFileSync } from "fs";

// スクリプト読み込み
const script = JSON.parse(readFileSync("source.json", "utf-8"));

// プロファイル一覧確認
const profiles = listProfiles(script);
console.log("Available profiles:", profiles.map(p => p.name));

// 要約版を生成
const summary = processScript(script, { profile: "summary" });
writeFileSync("summary.json", JSON.stringify(summary, null, 2));
```

### 使用例: mulmocast-cliへの統合（将来）

```typescript
// mulmocast-cli側での統合イメージ
import { processScript } from "mulmocast-preprocessor";

// mulmo movie script.json --profile summary を実現
const processedScript = options.profile
  ? processScript(script, { profile: options.profile })
  : script;

await generateMovie(processedScript);
```

## 課題

単純なフィルタリング方式では話が飛ぶ：

```
beat 1: 「まず背景を説明します」
beat 2: (詳細な背景説明) ← フィルタで削除
beat 3: 「次に本題に入ります」
```

→ 「背景を説明します」と言っておきながら説明がない不自然な流れに。

## 解決策: バリアント（差し替え）方式

各beatに対してプロファイルごとの**差し替えテキスト**を定義できるようにする。

### 具体例: 10分のプレゼン動画を短縮版にする

#### 元のスクリプト（フル版 10分）

```
beat 1: 「今日はGraphAIについて、基本概念から実践的な使い方まで詳しくお話しします」
beat 2: 「まず、GraphAIが生まれた背景からお話しします」
beat 3: 「2023年、LLMアプリケーション開発の課題として...」（詳細な歴史説明 2分）
beat 4: 「次にGraphAIの基本概念を説明します」
beat 5: 「エージェントとは...」（詳細な概念説明 3分）
beat 6: 「では実際にコードを見てみましょう」（デモ 3分）
beat 7: 「以上がGraphAIの概要でした。ぜひお試しください」
```

#### ❌ 単純フィルタ方式の問題

「詳細説明のbeatを削除」すると：

```
beat 1: 「今日はGraphAIについて、基本概念から実践的な使い方まで詳しくお話しします」
beat 2: 「まず、GraphAIが生まれた背景からお話しします」
        ← beat 3 削除（背景説明なし）
beat 4: 「次にGraphAIの基本概念を説明します」
        ← beat 5 削除（概念説明なし）
beat 6: 「では実際にコードを見てみましょう」
beat 7: 「以上がGraphAIの概要でした」
```

**問題点:**
- 「背景をお話しします」→ 説明なし → 「次に基本概念を」という不自然な流れ
- 「詳しくお話しします」と言いながら詳細がない
- 視聴者は「何か飛ばされた？」と感じる

#### ✅ バリアント方式の解決策

各beatに「要約版ではこのテキストに差し替える」を定義：

```json
{
  "beats": [
    {
      "text": "今日はGraphAIについて、基本概念から実践的な使い方まで詳しくお話しします",
      "variants": {
        "summary": { "text": "今日はGraphAIの概要をお話しします" }
      }
    },
    {
      "text": "まず、GraphAIが生まれた背景からお話しします",
      "variants": {
        "summary": { "skip": true }
      }
    },
    {
      "text": "2023年、LLMアプリケーション開発の課題として...(長い説明)",
      "variants": {
        "summary": { "text": "GraphAIは2023年に開発が始まりました" }
      }
    },
    {
      "text": "次にGraphAIの基本概念を説明します",
      "variants": {
        "summary": { "skip": true }
      }
    },
    {
      "text": "エージェントとは...(詳細な説明)",
      "variants": {
        "summary": { "text": "GraphAIではエージェントという単位でタスクを実行します" }
      }
    },
    {
      "text": "では実際にコードを見てみましょう...(デモ)",
      "variants": {
        "summary": { "text": "コード例はドキュメントをご覧ください" }
      }
    },
    {
      "text": "以上がGraphAIの概要でした。ぜひお試しください",
      "variants": {
        "summary": { "text": "GraphAI、ぜひお試しください！" }
      }
    }
  ]
}
```

#### 出力結果の比較

```bash
# フル版（preprocessor不要、元のJSONをそのまま使用）
mulmo movie script.json

# 要約版（preprocessorで前処理）
mulmocast-preprocessor script.json --profile summary -o script_summary.json
mulmo movie script_summary.json
```

| プロファイル | 出力 |
|-------------|------|
| (なし/default) | フル版 10分（元のテキスト全て） |
| summary | 要約版 2分（差し替え・スキップ適用） |

**要約版の流れ:**
```
「今日はGraphAIの概要をお話しします」
「GraphAIは2023年に開発が始まりました」
「GraphAIではエージェントという単位でタスクを実行します」
「コード例はドキュメントをご覧ください」
「GraphAI、ぜひお試しください！」
```

→ 自然な流れを保ちながら短縮できる

### ティーザー版（30秒）の例

SNS用の超短縮版も同じスクリプトから生成：

```json
{
  "text": "今日はGraphAIについて...",
  "variants": {
    "summary": { "text": "GraphAIの概要をお話しします" },
    "teaser": { "text": "GraphAI、知ってますか？" }
  }
}
```

```bash
# 30秒のSNS用動画
mulmocast-preprocessor script.json --profile teaser -o script_teaser.json
mulmo movie script_teaser.json
```

---

## 機能一覧

| 機能 | コマンド例 | 優先度 |
|-----|-----------|--------|
| **Variant適用** | `mulmocast-preprocessor script.json --profile summary` | 高 |
| **Beat Meta** | tags, section, context等のスキーマ拡張 | 中 |
| **Script Meta** | audience, goals, faq等のスキーマ拡張 | 中 |
| **profiles** | `mulmocast-preprocessor profiles script.json` | 高 |
| **Section/Tag Filter** | `--section`, `--tags` オプション | 中 |
| **summarize** | `mulmocast-preprocessor summarize script.json` | 低 |
| **query** | `mulmocast-preprocessor query script.json "質問"` | 低 |

---

## Phase 1: スキーマ拡張

### 1.0 プロファイル名の定義

プリセットとして以下のプロファイル名を定義する。ユーザーは任意のプロファイル名も使用可能。

| プロファイル | 説明 | 用途 |
|-------------|------|------|
| `default` | フル版（元のテキスト） | `--profile` 未指定時 |
| `summary` | 要約版 | 短縮版、ダイジェスト |
| `teaser` | ティーザー版 | SNS用、プロモーション |

**JSONでの定義:**
```json
{
  "outputProfiles": {
    "default": {
      "name": "フル版",
      "description": "すべてのコンテンツを含む完全版"
    },
    "summary": {
      "name": "3分要約版",
      "description": "主要ポイントのみの短縮版"
    },
    "teaser": {
      "name": "30秒ティーザー",
      "description": "SNS用の短い紹介動画"
    }
  }
}
```

**CLI使用例:**
```bash
# フル版 (preprocessor不要、元のJSONをそのまま使用)
mulmo movie script.json

# 要約版
mulmocast-preprocessor script.json --profile summary -o summary.json
mulmo movie summary.json

# ティーザー版
mulmocast-preprocessor script.json --profile teaser -o teaser.json
mulmo movie teaser.json

# カスタムプロファイル (ユーザー定義)
mulmocast-preprocessor script.json --profile presentation -o presentation.json
mulmo movie presentation.json
```

**備考:**
- `default` は特別な予約語として扱う
- `--profile` 未指定時は `default` として処理
- `variants.default` は不要（元のtext/imageがdefault）
- ユーザーは `workshop`, `presentation`, `podcast` など任意の名前も定義可能

---

### 1.1 Beat Variant (プロファイル別の差し替え)

**型定義:**
```typescript
beatVariantSchema = {
  text?: string,           // テキスト差し替え
  skip?: boolean,          // このプロファイルでスキップ
  image?: MulmoImage,      // 画像差し替え
  imagePrompt?: string,    // 画像生成プロンプト差し替え
  speechOptions?: SpeechOptions,
}
```

**JSONサンプル:**
```json
{
  "id": "intro",
  "speaker": "Host",
  "text": "今日はGraphAIについて、基本概念から実践的な使い方まで詳しくお話しします。",
  "image": {
    "type": "textSlide",
    "slide": { "title": "GraphAI入門", "subtitle": "完全ガイド" }
  },
  "variants": {
    "summary": {
      "text": "GraphAIの概要を説明します。"
    },
    "teaser": {
      "text": "GraphAIを紹介します。",
      "image": {
        "type": "textSlide",
        "slide": { "title": "GraphAI", "subtitle": "AIワークフローを簡単に" }
      }
    }
  }
}
```

**skipの例:**
```json
{
  "id": "detailed-explanation",
  "speaker": "Host",
  "text": "ここで詳細な技術的説明をします。アーキテクチャは...(長い説明)",
  "variants": {
    "summary": { "skip": true },
    "teaser": { "skip": true }
  }
}
```

---

### 1.2 Beat Meta (メタデータ)

**型定義:**
```typescript
beatMetaSchema = {
  tags?: string[],              // タグ
  section?: string,             // セクション名
  context?: string,             // 画像の補足説明 (Q&A用)
  keywords?: string[],          // 検索キーワード
  expectedQuestions?: string[], // 想定される質問
  references?: Reference[],     // 参照情報
  relatedBeats?: string[],      // 関連beat ID
}
```

**JSONサンプル:**
```json
{
  "id": "what-is-agent",
  "speaker": "Host",
  "text": "エージェントとは、特定のタスクを実行する独立したコンポーネントです。",
  "image": {
    "type": "image",
    "source": { "kind": "path", "path": "agent-diagram.png" }
  },
  "meta": {
    "tags": ["concept", "agent", "core"],
    "section": "chapter1",
    "context": "この図はエージェントの内部構造を示しています。左側が入力、中央が処理ロジック（LLM呼び出し、データ変換など）、右側が出力です。",
    "keywords": ["エージェント", "コンポーネント", "入力", "出力", "処理"],
    "expectedQuestions": [
      "エージェントとは何ですか？",
      "エージェントの役割は？",
      "どんな種類のエージェントがありますか？"
    ],
    "references": [
      {
        "type": "web",
        "url": "https://graphai.dev/docs/agents",
        "title": "エージェント詳細ドキュメント"
      },
      {
        "type": "code",
        "url": "https://github.com/receptron/graphai/tree/main/agents",
        "title": "エージェント実装例"
      }
    ],
    "relatedBeats": ["graph-structure", "demo"]
  }
}
```

---

### 1.3 Script Meta (スクリプト全体のメタデータ)

**型定義:**
```typescript
scriptMetaSchema = {
  audience?: string,            // 対象読者
  prerequisites?: string[],     // 前提知識
  goals?: string[],             // 学習目標
  background?: string,          // 背景説明
  faq?: FAQ[],                  // よくある質問
  keywords?: string[],          // 全体キーワード
  references?: Reference[],     // 参照情報
  author?: string,
  version?: string,
}
```

**JSONサンプル:**
```json
{
  "$mulmocast": { "version": "1.1" },
  "title": "GraphAI入門",
  "lang": "ja",

  "scriptMeta": {
    "audience": "AIアプリケーション開発者、エンジニア",
    "prerequisites": [
      "JavaScript/TypeScriptの基礎知識",
      "LLM APIの基本的な理解"
    ],
    "goals": [
      "GraphAIの基本概念を理解する",
      "エージェントとグラフ構造の関係を理解する",
      "簡単なワークフローを構築できるようになる"
    ],
    "background": "近年、LLMを活用したアプリケーション開発が増加しており、複雑なワークフローを効率的に構築するフレームワークの需要が高まっている。",
    "keywords": ["GraphAI", "エージェント", "ワークフロー", "LLM"],
    "faq": [
      {
        "question": "GraphAIは無料で使えますか？",
        "answer": "はい、MITライセンスで無料です。",
        "relatedBeats": ["intro"]
      },
      {
        "question": "どのLLMに対応していますか？",
        "answer": "OpenAI、Anthropic、Gemini、ローカルLLM等に対応。",
        "relatedBeats": ["what-is-agent"]
      }
    ],
    "references": [
      {
        "type": "web",
        "url": "https://github.com/receptron/graphai",
        "title": "GraphAI GitHub"
      }
    ],
    "author": "GraphAI Team",
    "version": "1.0"
  },

  "beats": [...]
}
```

---

### 1.4 Output Profiles (出力プロファイル定義)

**型定義:**
```typescript
outputProfileSchema = {
  name: string,                 // 表示名
  description?: string,         // 説明
  overrides?: {                 // パラメータ上書き
    audioParams?: Partial<AudioParams>,
    movieParams?: Partial<MovieParams>,
    canvasSize?: CanvasSize,
  }
}
```

**JSONサンプル:**
```json
{
  "$mulmocast": { "version": "1.1" },
  "title": "GraphAI入門",

  "outputProfiles": {
    "summary": {
      "name": "3分要約版",
      "description": "主要ポイントのみの短縮版"
    },
    "teaser": {
      "name": "30秒ティーザー",
      "description": "SNS用の短い紹介動画",
      "overrides": {
        "audioParams": {
          "padding": 0.2
        },
        "canvasSize": {
          "width": 1080,
          "height": 1920
        }
      }
    },
    "presentation": {
      "name": "プレゼン用",
      "description": "スライド表示に最適化",
      "overrides": {
        "canvasSize": {
          "width": 1920,
          "height": 1080
        }
      }
    }
  },

  "beats": [...]
}
```

---

### 1.5 完全なサンプル

```json
{
  "$mulmocast": { "version": "1.1" },
  "title": "GraphAI入門",
  "lang": "ja",

  "scriptMeta": {
    "audience": "AIアプリ開発者",
    "goals": ["GraphAIの基本を理解する"],
    "faq": [
      {
        "question": "無料ですか？",
        "answer": "はい、MITライセンスです。"
      }
    ]
  },

  "outputProfiles": {
    "summary": {
      "name": "3分要約版",
      "description": "短縮版"
    },
    "teaser": {
      "name": "30秒ティーザー",
      "overrides": {
        "audioParams": { "padding": 0.2 }
      }
    }
  },

  "speechParams": {
    "speakers": {
      "Host": {
        "voiceId": "shimmer",
        "displayName": { "ja": "ホスト" }
      }
    }
  },

  "beats": [
    {
      "id": "intro",
      "speaker": "Host",
      "text": "今日はGraphAIについて詳しくお話しします。",
      "image": {
        "type": "textSlide",
        "slide": { "title": "GraphAI入門" }
      },
      "variants": {
        "summary": { "text": "GraphAIの概要を説明します。" },
        "teaser": { "text": "GraphAIを紹介！" }
      },
      "meta": {
        "tags": ["intro"],
        "section": "opening"
      }
    },
    {
      "id": "history",
      "speaker": "Host",
      "text": "GraphAIは2023年に開発が始まりました。当初はシンプルなワークフローエンジンでしたが...",
      "variants": {
        "summary": { "text": "2023年開発開始、現在はマルチエージェント対応。" },
        "teaser": { "skip": true }
      },
      "meta": {
        "tags": ["history"],
        "section": "chapter1",
        "keywords": ["2023年", "開発"]
      }
    },
    {
      "id": "what-is-agent",
      "speaker": "Host",
      "text": "エージェントとは、特定のタスクを実行するコンポーネントです。",
      "image": {
        "type": "image",
        "source": { "kind": "path", "path": "agent.png" }
      },
      "variants": {
        "teaser": { "skip": true }
      },
      "meta": {
        "tags": ["concept", "agent"],
        "section": "chapter1",
        "context": "図はエージェントの入出力構造を示す",
        "expectedQuestions": ["エージェントとは？"]
      }
    },
    {
      "id": "conclusion",
      "speaker": "Host",
      "text": "以上がGraphAIの概要でした。ぜひお試しください。",
      "variants": {
        "summary": { "text": "GraphAIをぜひお試しください。" },
        "teaser": { "text": "GraphAI、今すぐ試そう！" }
      },
      "meta": {
        "tags": ["conclusion"],
        "section": "closing"
      }
    }
  ]
}
```

### 出力結果の比較

| プロファイル | beats | 説明 |
|-------------|-------|------|
| (なし) | 4 | フル版 - 全beatを元テキストで |
| summary | 4 | 要約版 - テキスト差し替え |
| teaser | 2 | ティーザー - history, what-is-agent をskip |

---

### 1.6 既存スキーマの拡張

```typescript
// mulmoBeatSchema に追加
+ variants?: Record<string, BeatVariant>
+ meta?: BeatMeta

// mulmoScriptSchema に追加
+ scriptMeta?: ScriptMeta
+ outputProfiles?: Record<string, OutputProfile>
```

---

## Phase 2: コアAPI実装

### 新規ファイル

| ファイル | エクスポート関数 |
|---------|-----------------|
| `src/index.ts` | APIエントリーポイント |
| `src/core/process.ts` | `processScript()` |
| `src/core/variant.ts` | `applyProfile()` |
| `src/core/filter.ts` | `filterBySection()`, `filterByTags()` |
| `src/core/profiles.ts` | `listProfiles()` |
| `src/types/index.ts` | 型定義 |

### API実装

```typescript
// src/index.ts
export { processScript } from "./core/process.js";
export { applyProfile } from "./core/variant.js";
export { filterBySection, filterByTags } from "./core/filter.js";
export { listProfiles } from "./core/profiles.js";
export type { ProcessOptions, ProfileInfo } from "./types/index.js";
```

### 処理フロー (`applyProfile`)

```
1. profileName を受け取る
2. 各beatに対して:
   - variants[profileName] が存在するか確認
   - skip: true なら除外
   - text があれば差し替え
   - image があれば差し替え
3. 処理済みMulmoScriptを返す（variants/meta は除去）
```

### 出力形式

処理後のMulmoScriptからは `variants` と `meta` フィールドを除去し、通常のMulmoScriptとして出力：

```typescript
// 入力
{
  "text": "詳しく説明します",
  "variants": { "summary": { "text": "概要です" } },
  "meta": { "tags": ["intro"] }
}

// 出力 (--profile summary)
{
  "text": "概要です"
}
```

### 例

```json
{
  "id": "intro",
  "text": "今日はGraphAIについて詳しくお話しします。",
  "variants": {
    "summary": { "text": "GraphAIの概要を説明します。" },
    "teaser": { "text": "GraphAIを紹介します。" }
  }
}
```

| プロファイル | 出力テキスト |
|-------------|-------------|
| (なし) | 今日はGraphAIについて詳しくお話しします。 |
| summary | GraphAIの概要を説明します。 |
| teaser | GraphAIを紹介します。 |

---

## Phase 3: CLI実装

### 新規ファイル (mulmocast-preprocessor)

| ファイル | 内容 |
|---------|------|
| `src/cli/index.ts` | CLIエントリーポイント |
| `src/cli/commands/process.ts` | メイン処理コマンド |
| `src/cli/commands/profiles.ts` | プロファイル一覧コマンド |

### 使用例

```bash
# 基本: プロファイル適用してJSON出力
mulmocast-preprocessor script.json --profile summary -o summary.json

# 標準出力に出力（パイプ用）
mulmocast-preprocessor script.json --profile summary

# プロファイル一覧を表示
mulmocast-preprocessor profiles script.json
```

### CLIオプション

| オプション | 説明 |
|-----------|------|
| `--profile <name>` | 適用するプロファイル名 |
| `-o, --output <path>` | 出力ファイルパス |
| `--stdout` | 標準出力に出力 |

---

## Phase 4: profiles サブコマンド

### 使用例

```bash
$ mulmocast-preprocessor profiles script.json

Available profiles:
  default  : フル版 (7 beats)
  summary  : 3分要約版 (5 beats, 2 skipped)
  teaser   : 30秒ティーザー (3 beats, 4 skipped)
```

### 出力内容

- 定義されているプロファイル一覧
- 各プロファイルのbeat数
- スキップされるbeat数

---

## Phase 5: フィルタオプション

### 新規ファイル

| ファイル | 内容 |
|---------|------|
| `src/utils/beat_filter.ts` | `filterBySection()`, `filterByTags()` |

### CLIオプション

```bash
# セクションでフィルタ
mulmocast-preprocessor script.json --section chapter1 -o chapter1.json

# タグでフィルタ
mulmocast-preprocessor script.json --tags concept,demo -o filtered.json

# プロファイルとフィルタの組み合わせ
mulmocast-preprocessor script.json --profile summary --section chapter1 -o output.json
```

---

## Phase 6: summarize コマンド (AI自動要約)

### 新規ファイル

| ファイル | 内容 |
|---------|------|
| `src/types/ai_tools.ts` | `SummarizeOptions` 型 |
| `src/tools/summarize_script.ts` | 要約生成ロジック |
| `src/cli/commands/summarize.ts` | CLIコマンド |

### 使用例

```bash
# 要約バリアントを自動生成（script.jsonを更新）
mulmocast-preprocessor summarize script.json --profile summary

# 文字数制限
mulmocast-preprocessor summarize script.json --profile summary --max-chars 50

# プレビューのみ（ファイル更新なし）
mulmocast-preprocessor summarize script.json --profile summary --dry-run
```

### 処理フロー

```
1. スクリプト読み込み
2. 各beatのtextをLLMに送信
3. LLMが要約テキストを生成
4. variants.[profile].text に書き込み
5. スクリプトを保存
```

---

## Phase 7: query コマンド (Q&A)

### 新規ファイル

| ファイル | 内容 |
|---------|------|
| `src/tools/query_script.ts` | クエリ処理ロジック |
| `src/utils/beat_matcher.ts` | キーワードマッチング |
| `src/cli/commands/query.ts` | CLIコマンド |

### 使用例

```bash
# 質問
mulmocast-preprocessor query script.json "エージェントとは何？"

# 詳細モード
mulmocast-preprocessor query script.json "特徴は？" --verbose

# JSON出力
mulmocast-preprocessor query script.json "結論は？" --json
```

### 処理フロー

```
1. 質問からキーワード抽出
2. scriptMeta.faq に該当あれば優先使用
3. keywords, expectedQuestions でbeatマッチング
4. マッチしたbeat の text + context をLLMに送信
5. 回答を生成・表示
```

---

## 実装順序

```
Phase 1 (スキーマ拡張)
    ↓
Phase 2 (Variant処理ロジック)
    ↓
Phase 3 (CLI実装)
    ↓
Phase 4 (profiles サブコマンド)  ←── ここまでがMVP
    ↓
Phase 5 (フィルタオプション)
    ↓
Phase 6 (summarize)
    ↓
Phase 7 (query)
```

---

## 後方互換性

- `variants` フィールドはオプショナル
- `meta` フィールドはオプショナル
- `scriptMeta` フィールドはオプショナル
- `outputProfiles` フィールドはオプショナル
- 既存のMulmoScriptはそのまま動作
- `--profile` 未指定時は元のテキストを使用

---

## 関連Issue/PR

- mulmocast-plus#2: Implement preprocessor for MulmoScript
- mulmocast-cli#1152: 元issue
- mulmocast-cli#1132: docs: add beat metadata and variants plan
