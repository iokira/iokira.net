# CLAUDE.md

## プロジェクト概要

個人のポートフォリオ・ブログサイト。Astro 製の静的サイトで AWS (S3 + CloudFront + Route 53) にデプロイされる。

- **URL:** https://iokira.net
- **言語:** 主に日本語
- **ライセンス:** MIT

## 技術スタック

| 役割 | 技術 |
|------|------|
| SSG フレームワーク | Astro 5.6.1 |
| UI コンポーネント | React 19.1.1 (TSX) |
| スタイリング | SCSS Modules + Global CSS |
| 型チェック | TypeScript 5.8.3 |
| コード整形 | Prettier 3.5.3 |
| フォント | Noto Sans JP (Google Fonts) |
| ホスティング | AWS S3 + CloudFront |
| DNS | AWS Route 53 |
| インフラ | AWS CDK 2.205.0 |
| Node バージョン | 20.16.0 (Volta 管理) |

## ディレクトリ構造

```
.
├── src/
│   ├── components/          # React (TSX) コンポーネント、各ディレクトリに SCSS Module
│   │   ├── Header/
│   │   ├── Navigation/
│   │   ├── Footer/
│   │   ├── BlogPostItem/
│   │   └── BreadCrumbs/
│   ├── layouts/             # Astro レイアウトテンプレート
│   │   ├── BaseLayout.astro
│   │   └── MarkdownPostLayout.astro
│   ├── pages/               # ファイルベースルーティング
│   │   ├── index.astro      # トップページ
│   │   ├── about.astro      # プロフィールページ
│   │   ├── blog.astro       # ブログ一覧
│   │   ├── 404.astro
│   │   └── posts/           # ブログ記事 (Markdown)
│   ├── styles/
│   │   └── global.css
│   └── types/
│       └── Crumb.ts
├── public/                  # 静的アセット (profile.jpg, robots.txt 等)
├── cdk/                     # AWS CDK インフラ定義
│   ├── bin/site.ts
│   └── lib/
│       ├── site-stack.ts
│       └── functions/cloudfront-function.js
├── astro.config.ts
├── tsconfig.json
├── package.json
└── .prettierrc.json
```

## よく使うコマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド (dist/ に出力)
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

React コンポーネントは名前付きエクスポートを使う:

```tsx
import styles from "./index.module.scss";

export const ComponentName = (props) => {
    return <div className={styles.className}>{/* ... */}</div>;
};
```

### スタイリング

- グローバルスタイル: `src/styles/global.css`
- コンポーネントスタイル: 各コンポーネントディレクトリの `index.module.scss`
- CSS フレームワーク不使用 (Tailwind・Bootstrap なし)
- コンテンツ最大幅: 800px

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
description: "記事の説明"
---

本文...
```

- `blog.astro` が `Astro.glob()` で自動的に記事を取得し `publishDate` で降順ソートする
- `updateDate` があると ♻ アイコン付きで更新日が表示される

## インフラ構成 (CDK)

```
Route 53 → CloudFront → S3 (iokira-net バケット)
```

- S3: パブリックアクセス全てブロック、SSL 強制
- CloudFront: HTTP→HTTPS リダイレクト、OAC でS3へ安全アクセス
- CloudFront Function: ディレクトリパスを `index.html` にルーティング
- 404 エラー: `/404.html` を返す (1分キャッシュ)
- リージョン: ap-northeast-1 (東京)
