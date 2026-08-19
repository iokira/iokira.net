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
--color-accent: #b55612;   /* 白背景で 4.88:1。旧 #d96715 は 3.56:1 で AA 不合格だった */
--color-text: #1a1a1a;
--color-text-muted: #6b7280;
--color-bg: #ffffff;
--color-border: #e5e7eb;
--max-width: 760px;
--spacing-page: clamp(1.25rem, 4vw, 2.5rem);

/* ダークモード (@media prefers-color-scheme: dark) */
--color-accent: #d96715;   /* 濃背景では 4.99:1 で AA 通過のため変更なし */
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
| 2026-08-09 | ブログ機能の削除 | サイトの目的を「個人の紹介サイト」に絞るため、ブログ機能・記事・関連コンポーネント (BlogPostItem, BreadCrumbs, MarkdownPostLayout, readingTime, Crumb 型) を全て削除 |
| 2026-08-09 | about ページの統合 | ページが 1 枚 (旧 index) になったため about.astro の内容をトップページに統合し廃止。旧 `/about` は `/` へリダイレクト。Navigation のページリンクも削除 (ロゴのみ) |
| 2026-08-09 | アクセントカラーの分離 | 旧 `#d96715` は白背景で 3.56:1 と WCAG AA (4.5:1) 不合格だった。旧記録の「~5.2:1 で AA 通過」はダークモード側 (実測 4.99:1) の話で、ライトモードは未検証だった。色相・彩度を保ったまま明度のみ下げた `#b55612` (4.88:1) をライトモード用に採用し、ダークモードは `#d96715` のまま |
| 2026-08-09 | 本文リンクの視認性 | `a { color: inherit; text-decoration: none }` により本文中のリンクが本文と同色・下線なしで、`↗` 以外に手がかりがなかった。`main a` に限りアクセント色 + 下線を付与 (ヘッダー・フッターは位置で自明なため対象外)。あわせて `:focus-visible` のフォーカスリングを追加 |
| 2026-08-09 | 日本語組版 | `line-break: strict` (禁則処理強化) と `overflow-wrap: anywhere` を body に、見出しに `text-wrap: balance`、段落に `text-wrap: pretty` を適用。いずれも progressive enhancement で非対応ブラウザでも破綻しない |
| 2026-08-09 | OGP 画像 | 共有時にテキストしか出なかったため 1200×630 の `public/og-image.png` を追加し `twitter:card` を `summary_large_image` に変更。画像は profile.jpg + Noto Sans JP で生成 (Pillow、生成スクリプトはリポジトリ管理外) |
| 2026-08-09 | LCP 改善 | プロフィール画像はファーストビュー内にあるのに `loading="lazy"` が付いていたため `eager` + `fetchpriority="high"` に変更。あわせて内在サイズを 200→240px に (CSS 表示 120px の 2x 相当) |
| 2026-08-09 | 画像の alt | 英語の `"iokira's profile picture"` から日本語の説明に変更。画像の実体はコーヒー豆なのでその旨を記述 |
| 2026-08-09 | robots.txt | `Sitemap:` ディレクティブが無かったため追加 |
| 2026-08-09 | メタ情報の補完 | `theme-color` (ライト/ダーク別)、`og:site_name`、`twitter:creator` を追加 |
| 2026-08-09 | 構造化データ | 人物として同定させるため `Person` schema の JSON-LD を追加。`sameAs` で GitHub / X を束ね、資格一覧は既存の `qualifications` 配列から `hasCredential` を生成。SNS リンクには `rel="me"` を付与。生年・出身地はプライバシー上の判断で意図的に含めていない |
| 2026-08-19 | SNS リンクの配置 | 「その他」セクション末尾のテキストリンク一覧を廃止し、ヘッダー部 (名前の下、自己紹介文の上) にアイコンの横並びで表示するよう変更。`rel="me"` は維持し、アイコンのみのため `aria-label` でアカウント名を付与 |
| 2026-08-19 | メールアドレスの掲載方法 | 従来は「その他」に「dotfiles を参照」という婉曲表現のみでスパム避けしていたが、ユーザー判断により生アドレス `iam.iokiller@gmail.com` を SNS アイコン列に mail アイコン (`mailto:` リンク) として追加する方針に変更。href に生アドレスが載るため文面での婉曲化と同等のスパム耐性は失われる点は合意済み。あわせて旧「メールアドレス」節は削除し、構造化データにも `email` を追加 |
| 2026-08-19 | 趣味セクションの一時撤去 | サイトを IndieWeb 流の post kinds (読書=read、音楽=listen/jam) に沿ってコレクションページへ分割する方針とし、トップページの「趣味」節 (コーヒー・本・曲) を一旦削除。「その他」節は資格のみが残ったため見出しを `その他` → `資格` に統合。コーヒーの話は特定の post kind に対応しないため将来的な扱いは未決定。トップページ構成は 見出し部 → Bio → 資格 のみに簡素化 |
