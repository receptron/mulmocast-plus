# mulmocast-easy

**MulmoCast with zero configuration** - Create videos and PDFs from simple JSON scripts.

No need to install ffmpeg or Chrome separately. Everything is bundled!

## 🎬 See What You Can Create!

[![MulmoCast Demo](https://img.youtube.com/vi/SlHhzFUOXBQ/maxresdefault.jpg)](https://www.youtube.com/watch?v=SlHhzFUOXBQ)

**👆 Click to watch**

This video was created entirely with MulmoCast! From a simple JSON script to a professional presentation video - no video editing skills required.

## What is MulmoCast?

MulmoCast transforms your content into professional videos, podcasts, and PDFs using AI. Write a simple JSON script, and MulmoCast generates everything automatically.

## Quick Start

### 1. Install

```bash
npm install -g mulmocast-easy
```

### 2. Create a script

Create a file named `hello.json`:

```json
{
  "$mulmocast": { "version": "1.1" },
  "lang": "en",
  "title": "My First Presentation",
  "speechParams": {
    "speakers": {
      "Host": {
        "voiceId": "shimmer",
        "displayName": { "en": "Host" }
      }
    }
  },
  "beats": [
    {
      "speaker": "Host",
      "text": "",
      "duration": 3,
      "image": {
        "type": "textSlide",
        "slide": {
          "title": "Welcome!",
          "subtitle": "My First MulmoCast Video"
        }
      }
    },
    {
      "speaker": "Host",
      "text": "",
      "duration": 3,
      "image": {
        "type": "textSlide",
        "slide": {
          "title": "Features",
          "bullets": [
            "Easy to use",
            "No coding required",
            "Professional output"
          ]
        }
      }
    },
    {
      "speaker": "Host",
      "text": "",
      "duration": 3,
      "image": {
        "type": "textSlide",
        "slide": {
          "title": "Thank You!",
          "subtitle": "Visit mulmocast.com for more"
        }
      }
    }
  ]
}
```

### 3. Generate video

```bash
mulmocast-easy movie hello.json
```

Your video will be created in `output/movie/hello.mp4` 🎉

### 4. Generate PDF

```bash
mulmocast-easy pdf hello.json
```

Your PDF will be created in `output/pdf/hello.pdf` 📄

## Adding AI Voice

To generate videos with AI narration, set up your OpenAI API key:

```bash
export OPENAI_API_KEY=your-api-key-here
```

Then add text to your script:

```json
{
  "speaker": "Host",
  "text": "Welcome to my presentation!",
  "image": {
    "type": "textSlide",
    "slide": {
      "title": "Welcome!",
      "subtitle": "My First MulmoCast Video"
    }
  }
}
```

## More Options

```bash
# Show all commands
mulmocast-easy --help

# Generate images only
mulmocast-easy images hello.json

# Generate audio only
mulmocast-easy audio hello.json
```

## Learn More

### Desktop App

For a graphical interface, try the MulmoCast desktop app:

👉 Download from [mulmocast.com](https://mulmocast.com/)

### Official Website

Visit the official website for documentation, examples, and more:

🌐 [https://mulmocast.com/](https://mulmocast.com/)

### Source Code

- CLI: [github.com/receptron/mulmocast-cli](https://github.com/receptron/mulmocast-cli)
- This package: [github.com/receptron/mulmocast-plus](https://github.com/receptron/mulmocast-plus)

## License

GPL-3.0-or-later

---

# 日本語ドキュメント

## mulmocast-easy とは

**設定不要の MulmoCast** - シンプルな JSON スクリプトから動画や PDF を作成できます。

ffmpeg や Chrome を別途インストールする必要はありません。すべてバンドル済み！

## 🎬 こんな動画が作れます！

[![MulmoCast Demo](https://img.youtube.com/vi/SlHhzFUOXBQ/maxresdefault.jpg)](https://www.youtube.com/watch?v=SlHhzFUOXBQ)

**👆 クリックして視聴**

この動画は MulmoCast だけで作られています！シンプルな JSON スクリプトからプロフェッショナルなプレゼン動画まで - 動画編集スキルは不要です。

## MulmoCast とは？

MulmoCast は AI を使ってコンテンツをプロフェッショナルな動画、ポッドキャスト、PDF に変換します。シンプルな JSON スクリプトを書くだけで、すべて自動生成されます。

## クイックスタート

### 1. インストール

```bash
npm install -g mulmocast-easy
```

### 2. スクリプトを作成

`hello.json` というファイルを作成:

```json
{
  "$mulmocast": { "version": "1.1" },
  "lang": "ja",
  "title": "はじめてのプレゼン",
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
      "speaker": "Host",
      "text": "",
      "duration": 3,
      "image": {
        "type": "textSlide",
        "slide": {
          "title": "ようこそ！",
          "subtitle": "はじめての MulmoCast 動画"
        }
      }
    },
    {
      "speaker": "Host",
      "text": "",
      "duration": 3,
      "image": {
        "type": "textSlide",
        "slide": {
          "title": "特徴",
          "bullets": [
            "簡単に使える",
            "コーディング不要",
            "プロ品質の出力"
          ]
        }
      }
    },
    {
      "speaker": "Host",
      "text": "",
      "duration": 3,
      "image": {
        "type": "textSlide",
        "slide": {
          "title": "ありがとう！",
          "subtitle": "詳しくは mulmocast.com へ"
        }
      }
    }
  ]
}
```

### 3. 動画を生成

```bash
mulmocast-easy movie hello.json
```

動画は `output/movie/hello.mp4` に作成されます 🎉

### 4. PDF を生成

```bash
mulmocast-easy pdf hello.json
```

PDF は `output/pdf/hello.pdf` に作成されます 📄

## AI 音声を追加

AI ナレーション付きの動画を生成するには、OpenAI API キーを設定:

```bash
export OPENAI_API_KEY=your-api-key-here
```

そしてスクリプトにテキストを追加:

```json
{
  "speaker": "Host",
  "text": "プレゼンテーションへようこそ！",
  "image": {
    "type": "textSlide",
    "slide": {
      "title": "ようこそ！",
      "subtitle": "はじめての MulmoCast 動画"
    }
  }
}
```

## その他のオプション

```bash
# すべてのコマンドを表示
mulmocast-easy --help

# 画像のみを生成
mulmocast-easy images hello.json

# 音声のみを生成
mulmocast-easy audio hello.json
```

## もっと詳しく

### デスクトップアプリ

グラフィカルなインターフェースが必要な方は、MulmoCast デスクトップアプリをお試しください:

👉 [mulmocast.com](https://mulmocast.com/) からダウンロード

### 公式サイト

ドキュメント、サンプル、その他の情報は公式サイトへ:

🌐 [https://mulmocast.com/](https://mulmocast.com/)

### ソースコード

- CLI: [github.com/receptron/mulmocast-cli](https://github.com/receptron/mulmocast-cli)
- このパッケージ: [github.com/receptron/mulmocast-plus](https://github.com/receptron/mulmocast-plus)

## ライセンス

GPL-3.0-or-later
