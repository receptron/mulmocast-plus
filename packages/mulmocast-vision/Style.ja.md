# スライドのレイアウトや見た目の変更について

mulmoscript vision は、htmlテンプレートとTailwindcssを使ってスライドをつくる仕組みです。
スライドのレイアウトや見た目は、HTMLとTailwindのクラスでデザインされています。

## スライドの構造

mulmoscript visionのスライドは、2つの層でできています。

- ベーステンプレート（base template）
  - スライド全体に共通するHTML構造
  - header（スタイルやフォントなどの設定）と body（スライドを表示する枠）で構成
- スライドテンプレート（bodyテンプレート）
  - 実際のスライド1枚分の中身やレイアウト
  - 80種類以上あり、用途に応じて選べる


## スタイルをカスタマイズする方法

mulmoscript vision では、HTMLやTailwindでスタイルを変更することで、見た目や雰囲気を自由にアレンジできます。
主なカスタマイズ方法は次の3つです。

### 方法①：ベーステンプレートを入れ替える

- base templateファイルを別のものに差し替える
- スライド全体のデザイン（背景、フォント、基本レイアウトなど）が一括で変わる

### 方法②：base templateのheaderにスタイルを追加する

- 既存のbase templateのheader内に styleタグや link タグを追加
- Tailwindのカスタムテーマや追加CSSで、色・文字サイズ・余白などを変更できる

### 方法③：スライドテンプレートをコピーして改造する

- 80種類のスライドテンプレート（body部分）をディレクトリごとコピー
- HTMLやTailwindクラスを書き換えて、独自デザインに変更
- 完成したテンプレートセットを指定して、元のテンプレート群と入れ替えて使う


## 具体的な変更方法

### 方法①：ベーステンプレートを入れ替える

- [html/templates](./html/templates/) 以下にベースのテンプレートがある
- defaultのベース点レートは [tailwind.html](./html/templates/tailwind.html)
- これを同じディレクトリー(html/templates)にコピーして使います。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    ${headerStyle}
  </head>
  <body class="min-h-screen flex flex-col">
    ${htmlBody}
  </body>
</html>
```

- htmlBodyは各スライドのbody部分（３）
- headerStyleが設定で変更できるスタイル部分（２）
- これらを残したままhtmlを作る。
- htmlPlugin classにわたすoptionでファイル名を指定します
- option.htmlTemplateFileで指定する
  - TODO具体例 
  - tailwind のように、拡張子はなしのファイル名のみです

### 方法②：base templateのheaderにスタイルを追加する

- (1)を参考にスタイルを記述
- option.headerStyleにtextで記述する。
  - injectionのリスクあり

### 方法③：スライドテンプレートをコピーして改造する

- 現在のdefaultのhtml テンプレートは [html/html2](./html/html2/) 以下にある。
- 各ファイルはllmが呼ぶtoolsの関数と対応している。
- これらのhtmlファイルをコピーし、htmlを変更してデザインを適用します。埋め込んでいる変数は変えないように。

- dir名は、htmlPluginの４つ目の引数でhtml2を渡しています。
- html dir以下にhtml3, fooTemplateなどの名前でdirectoryを作ります。


### テスト方法

```
yarn run design
```
で、tests/design.ts が実行される
~/Documents/mulmocast-vision/以下にdirectoryが作成されて80個のhtmlとpngが作成されます。

```
const handler = new htmlPlugin({ outputDir, rootDir, templateOptions: { htmlTemplateFile: "tailwind-sea", headerStyle: darkStyle}, htmlDir: "html"});
```

設定項目はそれぞれ
- htmlTemplateFile (1)
- headerStyle (2)
- htmlDir (3)

と対応している。これらの変数を変更してテストできる。


