# mulmocast-easy

**MulmoCast with zero configuration** - Create videos and PDFs from simple JSON scripts.

No need to install ffmpeg or Chrome separately. Everything is bundled!

---

**MulmoCast を設定なしで** - シンプルな JSON スクリプトから動画や PDF を作成できます。

ffmpeg や Chrome を別途インストールする必要はありません。すべてバンドル済み！

---

## 🎬 See What You Can Create! / こんな動画が作れます！

[![MulmoCast Demo](https://img.youtube.com/vi/SlHhzFUOXBQ/maxresdefault.jpg)](https://www.youtube.com/watch?v=SlHhzFUOXBQ)

**👆 Click to watch / クリックして視聴**

This video was created entirely with MulmoCast! From a simple JSON script to a professional presentation video - no video editing skills required.

この動画は MulmoCast だけで作られています！シンプルな JSON スクリプトからプロフェッショナルなプレゼン動画まで - 動画編集スキルは不要です。

---

## What is MulmoCast? / MulmoCast とは？

MulmoCast transforms your content into professional videos, podcasts, and PDFs using AI. Write a simple JSON script, and MulmoCast generates everything automatically.

MulmoCast は AI を使ってコンテンツをプロフェッショナルな動画、ポッドキャスト、PDF に変換します。シンプルな JSON スクリプトを書くだけで、すべて自動生成されます。

## Quick Start / クイックスタート

### 1. Install / インストール

```bash
npm install -g mulmocast-easy
```

### 2. Create a script / スクリプトを作成

Create a file named `hello.json`:

`hello.json` というファイルを作成:

```json
{
  "$mulmocast": { "version": "1.1" },
  "lang": "en",
  "title": "My First Presentation",
  "speechParams": {
    "speakers": {
      "Host": {
        "voiceId": "shimmer",
        "displayName": { "en": "Host", "ja": "ホスト" }
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

### 3. Generate video / 動画を生成

```bash
mulmo-easy movie hello.json
```

Your video will be created in `output/movie/hello.mp4` 🎉

動画は `output/movie/hello.mp4` に作成されます 🎉

### 4. Generate PDF / PDF を生成

```bash
mulmo-easy pdf hello.json
```

Your PDF will be created in `output/pdf/hello.pdf` 📄

PDF は `output/pdf/hello.pdf` に作成されます 📄

## Adding AI Voice / AI 音声を追加

To generate videos with AI narration, set up your OpenAI API key:

AI ナレーション付きの動画を生成するには、OpenAI API キーを設定:

```bash
export OPENAI_API_KEY=your-api-key-here
```

Then add text to your script:

そしてスクリプトにテキストを追加:

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

## More Options / その他のオプション

```bash
# Show all commands / すべてのコマンドを表示
mulmo-easy --help

# Generate images only / 画像のみを生成
mulmo-easy images hello.json

# Generate audio only / 音声のみを生成
mulmo-easy audio hello.json
```

## Learn More / もっと詳しく

### Desktop App / デスクトップアプリ

For a graphical interface, try the MulmoCast desktop app:

グラフィカルなインターフェースが必要な方は、MulmoCast デスクトップアプリをお試しください:

👉 Download from [mulmocast.com](https://mulmocast.com/)

### Official Website / 公式サイト

Visit the official website for documentation, examples, and more:

ドキュメント、サンプル、その他の情報は公式サイトへ:

🌐 [https://mulmocast.com/](https://mulmocast.com/)

### Source Code / ソースコード

- CLI: [github.com/receptron/mulmocast-cli](https://github.com/receptron/mulmocast-cli)
- This package: [github.com/receptron/mulmocast-plus](https://github.com/receptron/mulmocast-plus)

## License / ライセンス

GPL-3.0-or-later
