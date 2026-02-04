# mulmocast-easy 実装プラン

## 概要

`mulmocast-easy` は ffmpeg バイナリを同梱し、`npx` だけで MulmoCast CLI を利用可能にする npm パッケージ。

## 調査結果

### mulmocast-app での実装方法

`../mulmocast-app/` では以下の方法で ffmpeg を同梱している：

1. **使用パッケージ**: `ffmpeg-ffprobe-static@^6.1.2-rc.1`
   - ffmpeg と ffprobe の両方を含む単一パッケージ
   - macOS, Linux, Windows 対応
   - GPL-3.0-or-later ライセンス

2. **パス設定方法** (`src/main/mulmo/handler.ts`):
   ```typescript
   import { setFfmpegPath, setFfprobePath } from "mulmocast";

   const ffmpegPath = path.resolve(__dirname, "../../node_modules/ffmpeg-ffprobe-static/ffmpeg");
   const ffprobePath = path.resolve(__dirname, "../../node_modules/ffmpeg-ffprobe-static/ffprobe");

   setFfmpegPath(ffmpegPath);
   setFfprobePath(ffprobePath);
   ```

3. **mulmocast の API**:
   - `setFfmpegPath(path: string)` - ffmpeg のパスを設定
   - `setFfprobePath(path: string)` - ffprobe のパスを設定
   - これらは `mulmocast` パッケージから export されている

### npm パッケージでの実装

Electron とは異なり、npm パッケージでは以下の理由でシンプルに実装可能：

- パッケージインストール時にバイナリが自動ダウンロードされる
- 開発/本番モードの切り替えが不要
- `node_modules` 内のパスを直接参照可能

## 実装方針

### 1. 依存パッケージの変更

現在の設定:
```json
{
  "ffmpeg-static": "^5.2.0",
  "ffprobe-static": "^3.1.0"
}
```

変更後:
```json
{
  "ffmpeg-ffprobe-static": "^6.1.2-rc.1"
}
```

**理由**: mulmocast-app で動作実績がある単一パッケージを使用

### 2. setup.ts の更新

```typescript
import ffmpegFfprobeStatic from "ffmpeg-ffprobe-static";
import { setFfmpegPath, setFfprobePath } from "mulmocast";

export const setupFfmpeg = () => {
  setFfmpegPath(ffmpegFfprobeStatic.ffmpegPath);
  setFfprobePath(ffmpegFfprobeStatic.ffprobePath);
};
```

### 3. CLI エントリポイント (cli/bin.ts)

```typescript
#!/usr/bin/env node

import { setupFfmpeg } from "../setup.js";

// FFmpeg を設定してから mulmocast CLI を起動
setupFfmpeg();

// mulmocast の CLI をそのまま実行
import("mulmocast/cli");
```

**課題**: `mulmocast/cli` のエントリポイントを確認する必要がある

### 4. package.json の bin 設定

```json
{
  "bin": {
    "mulmo-easy": "lib/cli/bin.js"
  }
}
```

## 実装手順

1. [ ] `ffmpeg-ffprobe-static` パッケージに変更
2. [ ] `setup.ts` を更新
3. [ ] `cli/bin.ts` を実装
4. [ ] mulmocast の CLI エントリポイントを調査・対応
5. [ ] 型定義の追加（必要に応じて）
6. [ ] ローカルテスト（`npx tsx` で実行）
7. [ ] ビルド・lint 確認
8. [ ] 動作テスト（`yarn link` または `npx` で）

## 検討事項

### mulmocast CLI の呼び出し方法

`mulmocast` の CLI エントリポイントを調査：

```
mulmocast/package.json:
  "bin": {
    "mulmo": "lib/cli/bin.js",
    "mulmo-mcp": "lib/mcp/server.js"
  }
```

**選択肢**:

1. **動的 import** - `import("mulmocast/cli")` で CLI モジュールをロード
2. **child_process.spawn** - 別プロセスとして mulmo コマンドを実行
3. **プログラマティック API** - mulmocast の内部 API を直接呼び出し

推奨: **選択肢 3** - CLI のコマンドハンドラを直接呼び出し、より細かい制御が可能

### ライセンス

- `ffmpeg-ffprobe-static`: GPL-3.0-or-later
- `mulmocast`: AGPL-3.0-only
- `mulmocast-easy`: GPL-3.0 または AGPL-3.0 が必要

## ファイル構成（最終形）

```
packages/mulmocast-easy/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts          # setupFfmpeg をエクスポート
    ├── setup.ts          # FFmpeg パス設定ロジック
    └── cli/
        └── bin.ts        # CLI エントリポイント
```

## 参考リンク

- [ffmpeg-ffprobe-static](https://www.npmjs.com/package/ffmpeg-ffprobe-static)
- [mulmocast-app/src/main/mulmo/handler.ts](../mulmocast-app/src/main/mulmo/handler.ts)
- [mulmocast/src/utils/ffmpeg_utils.ts](../mulmocast-cli/src/utils/ffmpeg_utils.ts)
