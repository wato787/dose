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
├── backend/             # バックエンドアプリケーション
│   ├── src/
│   │   ├── routes/      # API ルート
│   │   ├── middleware/  # ミドルウェア
│   │   ├── schema/      # スキーマ定義
│   │   ├── utils/       # ユーティリティ関数
│   │   ├── lib/         # ライブラリ
│   │   ├── domain/      # ドメインロジック
│   │   └── index.ts     # エントリーポイント
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

## バックエンド

Hono + Drizzle ORM で構築されたバックエンドアプリケーションです。

### セットアップ

依存関係のインストール:

```bash
cd backend
bun install
```

### データベース

#### マイグレーションの生成

スキーマを変更した後、マイグレーションファイルを生成:

```bash
cd backend
bun run db:generate
```

#### データベースへの適用

マイグレーションをデータベースに適用:

```bash
cd backend
bun run db:push
```

または、マイグレーションファイルを使用:

```bash
cd backend
bun run db:migrate
```

#### Drizzle Studio

データベースを可視化して確認:

```bash
cd backend
bun run db:studio
```

### 開発

開発サーバーを起動:

```bash
cd backend
bun run dev
```

サーバーは `http://localhost:3000` で起動します。

### エンドポイント

- `GET /` - ルートエンドポイント
- `GET /health` - ヘルスチェック
- `GET /api` - API ルート

### ビルド

TypeScript の型チェック:

```bash
cd backend
bun run typecheck
```

### データベースアクセス

Honoのcontextからデータベースにアクセスできます:

```typescript
app.get("/users", async (c) => {
  const db = c.get("db");
  const users = await db.select().from(usersTable).all();
  return c.json(users);
});
```

## 技術スタック

### フロントエンド

- [Vite](https://vitejs.dev/) - ビルドツール
- [React](https://react.dev/) - UI ライブラリ
- [TanStack Router](https://tanstack.com/router) - ルーティング
- [TypeScript](https://www.typescriptlang.org/) - 型安全性

### バックエンド

- [Hono](https://hono.dev/) - 軽量かつ高速な Web フレームワーク
- [Drizzle ORM](https://orm.drizzle.team/) - 軽量で型安全な ORM
- [TypeScript](https://www.typescriptlang.org/) - 型安全性

### 共通

- [Bun](https://bun.sh/) - パッケージマネージャー・ランタイム
