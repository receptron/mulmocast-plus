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

### 新規スキーマ

```typescript
// Beat単位のバリアント
beatVariantSchema = {
  text?: string,        // テキスト差し替え
  skip?: boolean,       // このプロファイルでスキップ
  image?: MulmoImage,   // 画像差し替え
  imagePrompt?: string,
  speechOptions?: SpeechOptions,
}

// プロファイル名 → バリアント
beatVariantsSchema = Record<string, BeatVariant>

// Beat単位のメタデータ
beatMetaSchema = {
  tags?: string[],              // タグ (例: ["intro", "concept"])
  section?: string,             // セクション (例: "chapter1")
  context?: string,             // 画像beatの補足説明
  keywords?: string[],          // 検索用キーワード
  expectedQuestions?: string[], // 想定される質問
  references?: Reference[],     // 参照情報
  relatedBeats?: string[],      // 関連beat ID
}

// スクリプト全体のメタデータ
scriptMetaSchema = {
  audience?: string,            // 対象読者
  prerequisites?: string[],     // 前提知識
  goals?: string[],             // 学習目標
  background?: string,          // 背景説明
  faq?: FAQ[],                  // よくある質問
  keywords?: string[],          // 全体キーワード
  references?: Reference[],     // 参照情報
}

// 出力プロファイル定義
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

### 既存スキーマの拡張

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
