# CLAUDE.md

## プロジェクト概要

個人の紹介サイト。Astro 製の静的サイトで AWS (S3 + CloudFront + Route 53) にデプロイされる。

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
│   │   └── Footer/
│   ├── layouts/
│   │   └── BaseLayout.astro         # meta/OGP/favicon 含む共通レイアウト
│   ├── pages/
│   │   ├── index.astro              # トップページ (自己紹介、旧 about の内容を統合)
│   │   └── 404.astro
│   └── styles/
│       └── global.css               # CSS カスタムプロパティ + ダークモード
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
--color-accent: #b55612;      /* オレンジ系アクセント (白背景で 4.88:1) */
                              /* ダークモードでは #d96715 (濃背景で 4.99:1) */
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

## SEO / メタ情報

`BaseLayout.astro` が以下を自動出力:

- `<title>`: `"タイトル | iokira.net"` 形式 (トップページのみ `"iokira.net"`)
- `/about` → `/` へリダイレクト (`astro.config.ts` の `redirects`)
- `<meta name="description">`
- OGP (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`)
  - `og:type` は `ogType` prop で上書き可 (既定 `website`、トップページは `profile`)
  - `og:image` は `public/og-image.png` (1200×630)
- Twitter Card (`summary_large_image`)
- canonical URL
- favicon / apple-touch-icon
- JSON-LD: `structuredData` prop に渡したオブジェクトを `<script type="application/ld+json">` として出力。
  トップページは `Person` schema (`sameAs` で GitHub / X を同一人物として束ねる)

### 外部リンク

SNS など本人のプロフィールへのリンクには `rel="me"` を付ける
(IndieAuth・Mastodon の本人確認で使われる同一人物性の主張)。

## インフラ構成 (CDK)

```
Route 53 → CloudFront → S3 (iokira-net バケット)
```

- S3: パブリックアクセス全てブロック、SSL 強制
- CloudFront: HTTP→HTTPS リダイレクト、OAC でS3へ安全アクセス
- CloudFront Function: ディレクトリパスを `index.html` にルーティング
- 404 エラー: `/404.html` を返す (1分キャッシュ)
- リージョン: ap-northeast-1 (東京)
