# DESIGN.md — iokira.net 改善計画

## 概要

SEO 改善・デザイン刷新・ブログ要素強化を一括実施。その後ダークモード・コードブロック改善を追加実施。

---

## 決定事項

### SEO
| 項目 | 決定内容 |
|------|---------|
| meta description | BaseLayout に `description` prop 追加、全ページで設定 |
| OGP | テキストのみ (`og:title`, `og:description`, `og:type`, `og:url`) |
| sitemap | `@astrojs/sitemap` を追加 |
| favicon | `profile.jpg` をリサイズして使用 (32×32 PNG + 180×180 apple-touch-icon) |
| タイトル形式 | `"タイトル \| iokira.net"` (トップページのみ `"iokira.net"`) |
| トップページ description | `"カフェインに弱い、コーヒー・紅茶・読書愛好家のブログ。主にコーヒー、本、音楽、技術について。"` |

### デザイン
| 項目 | 決定内容 |
|------|---------|
| アクセントカラー | `#d96715` (リンクホバー + BlogPostItem タイトルリンク) |
| ダークモード | `prefers-color-scheme` CSS のみ (JS なし)。後から追加実施 |
| シンタックスハイライト | Shiki `github-light` / `github-dark` デュアルテーマ |
| 方針 | シンプル・モダン・レスポンシブ。ベストプラクティス優先 |

### ブログ要素
| 項目 | 決定内容 |
|------|---------|
| トップページ | 自己紹介 `"カフェインに弱い、コーヒー・紅茶・読書愛好家。"` + 最新 3 件 |
| 読了時間 | 記事一覧・記事ページ両方に表示。日本語 400 字/分換算。表示形式: `読了目安 N分` |
| BlogPostItem 日付 | 更新日優先、なければ投稿日を表示 |
| 記事ページレイアウト | h1 → 日付 → 読了時間 → 本文 |
| タグ・ページネーション | なし (記事が増えたタイミングで検討) |
| コードブロック コピーボタン | ホバーで表示、`navigator.clipboard` でコピー。最小限の JS |

---

## デザイントークン

```css
/* ライトモード */
--color-accent: #d96715;
--color-text: #1a1a1a;
--color-text-muted: #6b7280;
--color-bg: #ffffff;
--color-border: #e5e7eb;
--max-width: 760px;
--spacing-page: clamp(1.25rem, 4vw, 2.5rem);

/* ダークモード (@media prefers-color-scheme: dark) */
--color-accent: #d96715;   /* コントラスト比 ~5.2:1 で WCAG AA 通過のため変更なし */
--color-text: #e5e7eb;
--color-text-muted: #9ca3af;
--color-bg: #111827;
--color-border: #374151;
```

---

## 実装ステップ (完了)

| ステップ | 内容 | 状態 |
|---------|------|------|
| 1 | Foundation / SEO Infrastructure | ✅ |
| 2 | Design System | ✅ |
| 3 | Home Page | ✅ |
| 4 | Blog Components | ✅ |
| 5 | Article Page | ✅ |
| 6 | Cleanup (dead tsx/scss 削除) | ✅ |
| 7 | Dark mode | ✅ |
| 8 | Code block copy button | ✅ |

---

## 意思決定ログ

| 日付 | 項目 | 内容 |
|------|------|------|
| 2026-05-29 | ダークモード | 当初「今回はなし」で計画したが、直後に追加実施。`prefers-color-scheme` CSS のみで JS ゼロ実装 |
| 2026-05-29 | コードブロック ダーク対応 | Shiki がインラインスタイルで背景色を書くため、`@media` の CSS 変数だけでは背景が切り替わらない。`.astro-code` に `!important` で `--shiki-dark-bg` を適用する方法を採用 |
| 2026-05-29 | コードブロック コピーボタン | 当初計画になし。純粋 CSS では Clipboard API を呼べないため最小限の JS (`<script>` タグ) で実装 |
| 2026-05-29 | 読了時間の表示形式 | `"N分で読めます"` → `"読了目安 N分"` にユーザー指示により変更 |
