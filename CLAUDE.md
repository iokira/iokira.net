# CLAUDE.md

## プロジェクト概要

個人のポートフォリオ・ブログサイト。Astro 製の静的サイトで AWS (S3 + CloudFront + Route 53) にデプロイされる。

- **URL:** https://iokira.net
- **言語:** 主に日本語
- **ライセンス:** MIT

## 技術スタック

| 役割 | 技術 |
|------|------|
| SSG フレームワーク | Astro 5.18.1 |
| スタイリング | SCSS (一部) + Global CSS + Astro scoped styles |
| 型チェック | TypeScript 5.8.3 |
| コード整形 | Prettier 3.5.3 |
| フォント | Noto Sans JP Variable (fontsource) |
| シンタックスハイライト | Shiki (github-light / github-dark デュアルテーマ) |
| sitemap | @astrojs/sitemap (ビルド時自動生成) |
| ホスティング | AWS S3 + CloudFront |
| DNS | AWS Route 53 |
| インフラ | AWS CDK 2.205.0 |
| Node バージョン | 20.16.0 (Volta 管理) |

## ディレクトリ構造

```
.
├── src/
│   ├── assets/
│   │   └── profile.jpg              # プロフィール写真
│   ├── components/                  # Astro コンポーネント、各ディレクトリに scoped style
│   │   ├── Header/
│   │   ├── Navigation/
│   │   ├── Footer/
│   │   ├── BlogPostItem/
│   │   └── BreadCrumbs/
│   ├── layouts/
│   │   ├── BaseLayout.astro         # meta/OGP/favicon 含む共通レイアウト
│   │   └── MarkdownPostLayout.astro # 記事レイアウト (prose スタイル・コピーボタン)
│   ├── pages/
│   │   ├── index.astro              # トップページ (自己紹介 + 最新 3 件)
│   │   ├── about.astro
│   │   ├── blog.astro               # ブログ一覧
│   │   ├── 404.astro
│   │   └── posts/                   # ブログ記事 (Markdown)
│   ├── styles/
│   │   └── global.css               # CSS カスタムプロパティ + ダークモード
│   ├── types/
│   │   └── Crumb.ts
│   └── utils/
│       └── readingTime.ts           # 読了時間計算 (400字/分)
├── public/
│   ├── favicon.png                  # 32×32 (profile.jpg から生成)
│   ├── apple-touch-icon.png         # 180×180
│   ├── robots.txt
│   └── CNAME
├── cdk/                             # AWS CDK インフラ定義
│   ├── bin/site.ts
│   └── lib/
│       ├── site-stack.ts
│       └── functions/cloudfront-function.js
├── DESIGN.md                        # デザイン決定事項・意思決定ログ
├── astro.config.ts
├── tsconfig.json
├── package.json
└── .prettierrc.json
```

## よく使うコマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド (dist/ に出力、sitemap も生成される)
npm run build

# ビルド結果のプレビュー
npm run preview
```

### AWS デプロイ

```bash
npm run build               # Astro ビルド
cd cdk && npm run build     # CDK TypeScript コンパイル
cdk deploy                  # AWS にデプロイ (dist/ を S3 に同期、CloudFront キャッシュ無効化)
```

デプロイには以下の環境変数が必要:
- `AWS_ACCOUNT_ID`
- `SITE_CERTIFICATE_ARN` (ACM 証明書の ARN)

## コーディング規則

### コンポーネント

コンポーネントは `.astro` ファイルで実装し、名前付きエクスポートは使わない (React は不使用):

```astro
---
interface Props {
    foo: string;
}
const { foo } = Astro.props;
---

<div class="wrapper">{foo}</div>

<style>
    .wrapper { /* scoped style */ }
</style>
```

### スタイリング

- グローバルトークン: `src/styles/global.css` の CSS カスタムプロパティ
- コンポーネントスタイル: 各 `.astro` ファイルの `<style>` ブロック (scoped)
- ダークモード: `@media (prefers-color-scheme: dark)` で変数を上書き (JS なし)
- CSS フレームワーク不使用 (Tailwind・Bootstrap なし)
- コンテンツ最大幅: 760px

### デザイントークン (CSS カスタムプロパティ)

```css
--color-accent: #d96715;      /* オレンジ系アクセント */
--color-text: #1a1a1a;
--color-text-muted: #6b7280;
--color-bg: #ffffff;
--color-border: #e5e7eb;
--max-width: 760px;
--spacing-page: clamp(1.25rem, 4vw, 2.5rem);
```

### TypeScript パスエイリアス

```
@components/* → src/components/*
@layouts/*    → src/layouts/*
@pages/*      → src/pages/*
@styles/*     → src/styles/*
```

### Prettier 設定

- `printWidth`: 80
- `tabWidth`: 4 (スペース)
- `singleAttributePerLine`: true
- コミット前に Husky + lint-staged が自動整形する

## ブログ記事の追加方法

`src/pages/posts/` に Markdown ファイルを追加する。フロントマターの形式:

```markdown
---
layout: ../../layouts/MarkdownPostLayout.astro
title: "記事タイトル"
publishDate: 2025/04/12
updateDate: 2025/04/25   # 省略可
description: "記事の説明 (meta description にも使用される)"
---

本文...
```

- `blog.astro` と `index.astro` が `import.meta.glob()` で自動取得し `publishDate` 降順ソート
- `updateDate` があると記事一覧に「更新」と表示される
- `description` は OGP の `og:description` にも使われるため必ず書く

## SEO / メタ情報

`BaseLayout.astro` が以下を自動出力:

- `<title>`: `"タイトル | iokira.net"` 形式 (トップページのみ `"iokira.net"`)
- `<meta name="description">`
- OGP (`og:title`, `og:description`, `og:type`, `og:url`)
- Twitter Card (`summary`)
- canonical URL
- favicon / apple-touch-icon

## インフラ構成 (CDK)

```
Route 53 → CloudFront → S3 (iokira-net バケット)
```

- S3: パブリックアクセス全てブロック、SSL 強制
- CloudFront: HTTP→HTTPS リダイレクト、OAC でS3へ安全アクセス
- CloudFront Function: ディレクトリパスを `index.html` にルーティング
- 404 エラー: `/404.html` を返す (1分キャッシュ)
- リージョン: ap-northeast-1 (東京)
