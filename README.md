# dose

モノレポ構成のプロジェクトです。

## プロジェクト構造

```
dose/
├── frontend/            # フロントエンドアプリケーション
│   ├── src/
│   │   ├── routes/      # TanStack Router のルートファイル
│   │   │   ├── __root.tsx
│   │   │   ├── index.tsx
│   │   │   └── about.tsx
│   │   ├── main.tsx
│   │   └── routeTree.gen.ts
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
└── README.md
```

## フロントエンド

Vite + React + TanStack Router で構築されたフロントエンドアプリケーションです。

### セットアップ

依存関係のインストール:

```bash
cd frontend
bun install
```

### 開発

開発サーバーを起動:

```bash
cd frontend
bun run dev
```

ブラウザで `http://localhost:5173` を開いてください。

### ビルド

本番用ビルド:

```bash
cd frontend
bun run build
```

ビルド結果のプレビュー:

```bash
cd frontend
bun run preview
```

## 技術スタック

- [Vite](https://vitejs.dev/) - ビルドツール
- [React](https://react.dev/) - UI ライブラリ
- [TanStack Router](https://tanstack.com/router) - ルーティング
- [TypeScript](https://www.typescriptlang.org/) - 型安全性
- [Bun](https://bun.sh/) - パッケージマネージャー・ランタイム
