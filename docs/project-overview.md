# Dose - 薬管理アプリケーション

## 概要

Doseは、薬やサプリメントの服用管理を行うWebアプリケーションです。ユーザーは薬を登録し、服用スケジュールを設定して、実際の服用実績を記録できます。さらに、各薬に対してカスタムチェック項目を設定することで、出血チェックや体温測定など、薬の服用と合わせて記録したい情報を自由に追加できます。

## 主な機能

### 1. 薬の管理
- 薬・サプリメントの登録・編集・削除
- 薬の有効/無効の切り替え
- 薬の説明文の記録

### 2. 服用スケジュール管理
- 薬ごとに服用時間を設定（例: 朝8時、夜23時）
- 頻度タイプの設定（毎日、週次、カスタム）
- スケジュールの開始日の設定

### 3. 服用実績の記録
- スケジュールに基づいた服用ログの記録
- 服用したかどうかの記録
- 実際の服用日時の記録

### 4. カスタム項目機能（特徴的な機能）
- **薬に紐づくカスタム項目**: 各薬に対して、独自のチェック項目を設定可能
  - 例: 血圧測定、体温チェック、副作用の有無など
- **独立したカスタム項目**: 薬に紐づかない独立した記録項目も設定可能
- **複数のデータ型に対応**:
  - `BOOL`: 真偽値（例: 出血あり/なし）
  - `NUMBER`: 数値（例: 体温36.5度）
  - `TEXT`: テキスト（例: メモ）
  - `RATING`: 評価（例: 痛みのレベル1-5）
- **必須/任意の設定**: 各カスタム項目を必須または任意に設定可能

### 5. 認証機能
- Better Authを使用したユーザー認証
- メールアドレスとパスワードによるログイン
- セッション管理

### 6. ホーム画面
- 今日の進捗状況の表示
- スケジュール時刻の一覧
- 服用記録の表示
- カスタム項目の記録

## 技術スタック

### フロントエンド
- **React 19**: UIライブラリ
- **TanStack Router**: 型安全なルーティング
- **TanStack Query**: サーバー状態管理とデータフェッチング
- **Vite**: ビルドツールと開発サーバー
- **Tailwind CSS**: スタイリング
- **TypeScript**: 型安全性

### バックエンド
- **Hono**: 軽量で高速なWebフレームワーク
- **Drizzle ORM**: 型安全なORM
- **Better Auth**: 認証ライブラリ
- **SQLite**: データベース
- **TypeScript**: 型安全性

### 開発環境
- **Bun**: パッケージマネージャーとランタイム
- **Biome**: リンターとフォーマッター

## プロジェクト構造

```
dose/
├── frontend/              # フロントエンドアプリケーション
│   ├── src/
│   │   ├── api/          # APIクライアント
│   │   ├── components/   # Reactコンポーネント
│   │   │   ├── layout/   # レイアウトコンポーネント
│   │   │   └── ui/       # UIコンポーネント
│   │   ├── hooks/        # カスタムフック
│   │   ├── lib/          # ユーティリティとライブラリ設定
│   │   ├── routes/       # TanStack Routerのルート定義
│   │   ├── types/        # TypeScript型定義
│   │   └── views/        # ページコンポーネント
│   └── package.json
│
├── backend/               # バックエンドアプリケーション
│   ├── src/
│   │   ├── db/           # データベース設定とスキーマ
│   │   │   └── schema/   # Drizzleスキーマ定義
│   │   ├── lib/          # ライブラリ設定（認証など）
│   │   ├── middleware/   # Honoミドルウェア
│   │   ├── repository/   # データアクセス層
│   │   ├── routes/       # APIルート定義
│   │   │   ├── medicine/ # 薬関連のAPI
│   │   │   └── dose-log/ # 服用ログ関連のAPI
│   │   ├── types/        # TypeScript型定義
│   │   └── utils/        # ユーティリティ関数
│   ├── drizzle/          # マイグレーションファイル
│   └── package.json
│
├── docs/                  # ドキュメント
│   ├── database-design.md    # データベース設計
│   └── project-overview.md    # このファイル
│
└── package.json          # モノレポのルート設定
```

## データベース設計の概要

詳細は [database-design.md](./database-design.md) を参照してください。

### 主要なテーブル

1. **user**: ユーザー情報（Better Auth）
2. **medicine**: 薬の基本情報
3. **schedule**: 薬の服用スケジュール
4. **dose_log**: 服用実績ログ
5. **custom_item**: カスタムチェック項目の設定
6. **custom_log**: カスタム項目の実際の値

### データの関係性

```
user
  └── medicine (1:N)
        ├── schedule (1:N)
        │     └── dose_log (1:N)
        └── custom_item (1:N, NULL可)
              └── custom_log (1:N)
```

**重要なポイント**:
- 1つの薬に対して複数のスケジュールを設定可能
- 1つのスケジュールに対して複数の服用ログ（異なる日付）を記録可能
- カスタム項目は薬に紐づけることも、独立した項目として設定することも可能（`medicine_id`がNULL可）

## セットアップ

### 前提条件
- [Bun](https://bun.sh/) がインストールされていること

### インストール

```bash
# ルートディレクトリで依存関係をインストール
bun install
```

### データベースのセットアップ

```bash
cd backend

# マイグレーションの実行
bun run db:migrate

# または、スキーマを直接プッシュ（開発時）
bun run db:push
```

### 開発サーバーの起動

#### バックエンド

```bash
cd backend
bun run dev
```

バックエンドは `http://localhost:3000` で起動します。

#### フロントエンド

```bash
cd frontend
bun run dev
```

フロントエンドは `http://localhost:5173` で起動します。

## 開発ガイド

### データベーススキーマの変更

1. `backend/src/db/schema/` 内のスキーマファイルを編集
2. マイグレーションファイルを生成:
   ```bash
   cd backend
   bun run db:generate
   ```
3. マイグレーションを適用:
   ```bash
   bun run db:migrate
   ```

### データベースの確認

Drizzle Studioを使用してデータベースを可視化:

```bash
cd backend
bun run db:studio
```

### コードの品質管理

```bash
# リンターの実行
bun run lint

# 自動修正
bun run lint:fix

# フォーマッターの実行
bun run format

# すべてのチェック
bun run check

# 自動修正付きチェック
bun run check:fix
```

### APIエンドポイント

#### 認証
- `POST /api/auth/sign-up` - ユーザー登録
- `POST /api/auth/sign-in` - ログイン
- `POST /api/auth/sign-out` - ログアウト

#### 薬管理
- `GET /api/medicine` - 薬一覧の取得
- `GET /api/medicine/:id` - 薬の詳細取得
- `POST /api/medicine` - 薬の作成
- `PUT /api/medicine/:id` - 薬の更新
- `DELETE /api/medicine/:id` - 薬の削除
- `GET /api/medicine/:id/custom-logs` - 薬のカスタムログ取得

#### 服用ログ
- `GET /api/dose-log` - 服用ログ一覧の取得
- `GET /api/dose-log/:id` - 服用ログの詳細取得
- `POST /api/dose-log` - 服用ログの作成
- `PUT /api/dose-log/:id` - 服用ログの更新
- `DELETE /api/dose-log/:id` - 服用ログの削除

## カスタム項目機能の詳細

### 使用例

1. **薬に紐づくカスタム項目**:
   - 例: 血圧薬に対して「血圧測定値（NUMBER型）」を設定
   - 例: 抗凝固薬に対して「出血チェック（BOOL型）」を設定

2. **独立したカスタム項目**:
   - 例: 薬に関係なく「体重（NUMBER型）」を毎日記録
   - 例: 「体調メモ（TEXT型）」を自由に記録

### データ型の使い分け

- **BOOL**: はい/いいえ、あり/なしなどの二択
- **NUMBER**: 数値データ（体温、血圧、体重など）
- **TEXT**: 自由なテキスト入力（メモ、症状など）
- **RATING**: 評価やレベル（痛みのレベル、満足度など）

## 今後の拡張可能性

- 服用リマインダー通知機能
- 服用統計・グラフ表示
- 薬の在庫管理
- 複数のユーザー（家族）の管理
- 薬の相互作用チェック
- エクスポート機能（CSV、PDFなど）

## ライセンス

このプロジェクトはプライベートプロジェクトです。

