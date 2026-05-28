# DESIGN.md — iokira.net 改善計画

## 概要

SEO 改善・デザイン刷新・ブログ要素強化を一括実施する。

---

## 決定事項

### SEO
| 項目 | 決定内容 |
|------|---------|
| meta description | BaseLayout に `description` prop 追加、全ページで設定 |
| OGP | テキストのみ (`og:title`, `og:description`, `og:type`, `og:url`) |
| sitemap | `@astrojs/sitemap` を追加 |
| favicon | `profile.jpg` をリサイズして使用 |
| タイトル形式 | `"タイトル \| iokira.net"` (トップページのみ `"iokira.net"`) |
| トップページ description | `"カフェインに弱い、コーヒー・紅茶・読書愛好家のブログ。主にコーヒー、本、音楽、技術について。"` |

### デザイン
| 項目 | 決定内容 |
|------|---------|
| アクセントカラー | `#d96715` (リンクホバー + BlogPostItem タイトルリンク) |
| ダークモード | 今回なし |
| シンタックスハイライト | Shiki `github-light` |
| 方針 | シンプル・モダン・レスポンシブ。ベストプラクティス優先、既存デザイン踏襲せず |

### ブログ要素
| 項目 | 決定内容 |
|------|---------|
| トップページ | 自己紹介 `"カフェインに弱い、コーヒー・紅茶・読書愛好家。"` + 最新 3 件 |
| 読了時間 | 記事一覧・記事ページ両方に表示。日本語 400 字/分換算 |
| BlogPostItem 日付 | 更新日優先、なければ投稿日を表示 |
| 記事ページレイアウト | h1 → 日付 / 読了時間 → 本文 |
| タグ・ページネーション | 今回なし |

---

## デザイントークン

```css
--color-accent: #d96715;
--color-text: #1a1a1a;
--color-text-muted: #6b7280;
--color-bg: #ffffff;
--color-border: #e5e7eb;
--max-width: 760px;
--spacing-page: clamp(1rem, 4vw, 2rem);
```

---

## 実装ステップ

### Large Step 1: Foundation / SEO Infrastructure
- 1a: `@astrojs/sitemap` インストール
- 1b: `astro.config.ts` 更新 (sitemap, Shiki)
- 1c: `BaseLayout.astro` 刷新 (description/OGP/title)
- 1d: 全ページ (index, blog, about, 404) にメタ情報を追加
- 1e: favicon 生成 (`public/favicon.png`, `public/apple-touch-icon.png`)
- 1f: ユーティリティ `src/utils/readingTime.ts` 作成

### Large Step 2: Design System
- 2a: `global.css` 刷新 (CSS カスタムプロパティ、タイポグラフィ、レスポンシブ)
- 2b: `Header` / `Navigation` スタイル刷新
- 2c: `Footer` スタイル刷新・動的年表示

### Large Step 3: Home Page
- 3a: `index.astro` を自己紹介 + 最新 3 件構成に刷新

### Large Step 4: Blog Components
- 4a: `BlogPostItem/index.astro` 刷新 (日付ロジック、読了時間、アクセント)
- 4b: `blog.astro` 刷新

### Large Step 5: Article Page
- 5a: `MarkdownPostLayout.astro` 刷新 (レイアウト順序、読了時間)
- 5b: `BreadCrumbs` スタイル改善
- 5c: prose スタイル (記事内コンテンツの見出し・コード等)

### Large Step 6: Cleanup
- 6a: 死んでいる `.tsx` / `.module.scss` ファイルを削除

---

## 意思決定ログ

変更履歴・計画からの逸脱はここに記録する。

| 日時 | 項目 | 内容 |
|------|------|------|
| - | - | - |
