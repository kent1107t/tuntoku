# CLAUDE.md

このファイルは、Claude Code がこのリポジトリで作業するときのガイドです。

## プロジェクト概要

**tuntoku** は、AtCoder の問題 URL を入力してカードとして積んでおき、グループ分け・解答済み管理ができる React 製の Web アプリ。
GitHub Pages で公開している: https://kent1107t.github.io/tuntoku/

## 技術スタック

- React 18 + TypeScript（Create React App / `react-scripts` 5）
- UI: MUI (`@mui/material`, `@mui/icons-material`) + Emotion
- 数式表示: KaTeX（`react-katex`, `remark-math`, `rehype-katex`）、`better-react-mathjax`
- データ永続化: ブラウザの `localStorage`（サーバーなし）
- 問題データ収集: Python スクレイパー（`requests` + `BeautifulSoup`）

## ディレクトリ構成

```
src/
  index.tsx                  エントリポイント
  components/
    App.tsx                  状態管理の中心（グループ・問題リスト・保存処理）
    OverallStructure.tsx     ページ全体のレイアウト（MUI アルバムテンプレートがベース）
    Form.tsx                 URL 入力フォーム（追加位置の切り替えスイッチ含む）
    ProblemCards.tsx         問題カードの表示。スクレイピング済み JSON からタイトル・問題文を引く
  save/
    TypesAndInitialData.tsx  型定義と初期データ（グループ名定数など）
    LocalStorage.tsx         localStorage の読み書き（Set ⇔ 配列の変換あり）
  scraper/
    scraper.py               AtCoder から全コンテスト・全問題の URL / タイトル / 問題文を収集
    *.json                   スクレイピング結果（アプリから直接 import している）
  auth/google_auth.tsx       未使用（.gitignore 対象）
types/react-katex.d.ts       react-katex の型定義
docs/                        ビルド成果物（GitHub Pages 公開用）
```

## 主要なデータ構造

- グループは `initialGroup`（最初のグループ）、`AllGroup`（solved 以外の全問題）、`SolvedGroup`（解答済み）が固定で存在する。
- `GroupName2problems`: グループ名 → `Problem[]`
- `GroupName2setUrls`: グループ名 → `Set<string>`（URL の重複チェック用。カードの key に URL を使っているため）
- `localStorage` のキーは `KEYS` enum（`GROUPNAME2PROBLEMS`, `GROUPNAME2SETURLS`, `CURRENTGROUPNAME`）。
  `Set` は JSON 化できないので、保存時に配列へ、読み込み時に `Set` へ戻している。

## コマンド

```bash
npm install        # 依存関係のインストール
npm start          # 開発サーバー起動
npm run build      # 本番ビルド（build/ に出力）
npm test           # テスト（react-scripts test）
npm run deploy     # docs/ を作り直してコミット & push（下の注意を参照）
```

スクレイパー（`src/scraper/` で実行）:

```bash
python scraper.py  # JSON ファイルを更新。AtCoder への負荷を避けるため crawl_delay=1.4 秒を守ること
```

## デプロイ

- GitHub Pages は `docs/` ディレクトリを公開している。`build/` を `docs/` に移す運用。
- 注意: `npm run git` は `git push origin master` になっているが、現在のデフォルトブランチは `main`。

## 規約

- コミットメッセージは `[種別] 日本語の説明` の形式。種別は `add` / `fix` / `update` / `clean` / `change` / `remove`。
  例: `[add] 問題を追加する位置を選ぶスイッチ`
- コード中のコメントは日本語。
- `docs/` はビルド成果物なので手で編集しない。
- `src/scraper/*.json` は大きいので、必要なとき以外は全体を読み込まない。
