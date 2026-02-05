# MulmoScript Preprocessor 実装計画

## 概要

1つのMulmoScriptから複数のバリエーション（フル版、要約版、ティーザー版など）を生成できるプリプロセッサを実装する。

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

---

## 機能一覧

| 機能 | 説明 | 優先度 |
|-----|------|--------|
| **Variant** | プロファイル別にtext/image差し替え、skip | 高 |
| **Beat Meta** | tags, section, context, keywords等 | 中 |
| **Script Meta** | audience, goals, faq等 | 中 |
| **Profile Filter** | `--profile summary` で出力切替 | 高 |
| **Section/Tag Filter** | `--section`, `--tags` でフィルタ | 中 |
| **tool profiles** | プロファイル一覧表示 | 中 |
| **tool summarize** | AI自動要約生成 | 低 |
| **tool query** | メタデータ活用のQ&A | 低 |

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
# フル版 (default)
mulmo movie script.json
mulmo movie script.json --profile default

# 要約版
mulmo movie script.json --profile summary

# ティーザー版
mulmo movie script.json --profile teaser

# カスタムプロファイル (ユーザー定義)
mulmo movie script.json --profile presentation
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

## Phase 2: Variant処理

### 新規ファイル

| ファイル | 内容 |
|---------|------|
| `src/utils/beat_variant.ts` | `applyVariant()`, `resolveBeat()` |

### 処理フロー

```
1. --profile オプション取得
2. 各beatに対して:
   - variants[profile] が存在するか確認
   - skip: true なら除外
   - text があれば差し替え
   - image があれば差し替え
3. 処理済みbeats配列を返す
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

## Phase 3: CLIオプション追加

### 変更ファイル

| ファイル | 変更 |
|---------|------|
| `src/cli/common.ts` | `--profile` オプション定義 |
| `src/cli/commands/*/builder.ts` | 各コマンドに追加 |

### 使用例

```bash
# フル版
mulmo movie script.json

# 要約版
mulmo movie script.json --profile summary

# ティーザー版
mulmo movie script.json --profile teaser
```

---

## Phase 4: Action層適用

### 変更ファイル

| ファイル | 変更 |
|---------|------|
| `src/actions/audio.ts` | プロファイル適用 |
| `src/actions/images.ts` | プロファイル適用 |
| `src/actions/movie.ts` | プロファイル適用 |
| `src/actions/pdf.ts` | プロファイル適用 |

---

## Phase 5: tool profiles コマンド

### 新規ファイル

| ファイル | 内容 |
|---------|------|
| `src/cli/commands/tool/profiles/` | プロファイル一覧コマンド |

### 使用例

```bash
$ mulmo tool profiles script.json

Profiles:
  summary  : 3分要約版 (6 beats, 2 skipped)
  teaser   : 30秒ティーザー (3 beats, 3 skipped)
```

---

## Phase 6: フィルタオプション

### 新規ファイル

| ファイル | 内容 |
|---------|------|
| `src/utils/beat_filter.ts` | `filterBySection()`, `filterByTags()` |

### CLIオプション

```bash
# セクションでフィルタ
mulmo movie script.json --section chapter1

# タグでフィルタ
mulmo movie script.json --tags concept,demo

# 組み合わせ
mulmo movie script.json --profile summary --section chapter1
```

---

## Phase 7: tool summarize (AI自動要約)

### 新規ファイル

| ファイル | 内容 |
|---------|------|
| `src/types/ai_tools.ts` | `SummarizeOptions` 型 |
| `src/tools/summarize_script.ts` | 要約生成ロジック |
| `src/cli/commands/tool/summarize/` | CLIコマンド |

### 使用例

```bash
# 要約バリアントを自動生成
mulmo tool summarize script.json --profile summary

# 文字数制限
mulmo tool summarize script.json --profile summary --max-chars 50

# プレビューのみ
mulmo tool summarize script.json --profile summary --dry-run
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

## Phase 8: tool query (Q&A)

### 新規ファイル

| ファイル | 内容 |
|---------|------|
| `src/tools/query_script.ts` | クエリ処理ロジック |
| `src/utils/beat_matcher.ts` | キーワードマッチング |
| `src/cli/commands/tool/query/` | CLIコマンド |

### 使用例

```bash
# 質問
mulmo tool query script.json "エージェントとは何？"

# 詳細モード
mulmo tool query script.json "特徴は？" --verbose

# JSON出力
mulmo tool query script.json "結論は？" --json
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
Phase 1 (スキーマ)
    ↓
Phase 2 (Variant処理)
    ↓
Phase 3 (CLIオプション)
    ↓
Phase 4 (Action層適用)
    ↓
Phase 5 (tool profiles)  ←── ここまでがMVP
    ↓
Phase 6 (フィルタ)
    ↓
Phase 7 (summarize)
    ↓
Phase 8 (query)
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
