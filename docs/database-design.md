# データベース設計

## 概要

Doseアプリケーションのデータベース設計ドキュメントです。SQLiteを使用し、Drizzle ORMで管理されています。

## テーブル一覧

### 認証関連テーブル（Better Auth）

Better Authライブラリで使用される認証関連のテーブルです。

#### `user`
ユーザーの基本情報を格納するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| `id` | TEXT | PRIMARY KEY | ユーザーID（UUID形式） |
| `name` | TEXT | NOT NULL | ユーザー名 |
| `email` | TEXT | NOT NULL, UNIQUE | メールアドレス |
| `email_verified` | INTEGER | NOT NULL, DEFAULT false | メール認証済みフラグ |
| `image` | TEXT | | プロフィール画像URL |
| `created_at` | INTEGER | NOT NULL | 作成日時（タイムスタンプ） |
| `updated_at` | INTEGER | NOT NULL | 更新日時（タイムスタンプ） |

#### `session`
ユーザーのセッション情報を格納するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| `id` | TEXT | PRIMARY KEY | セッションID |
| `expires_at` | INTEGER | NOT NULL | セッション有効期限（タイムスタンプ） |
| `token` | TEXT | NOT NULL, UNIQUE | セッショントークン |
| `created_at` | INTEGER | NOT NULL | 作成日時（タイムスタンプ） |
| `updated_at` | INTEGER | NOT NULL | 更新日時（タイムスタンプ） |
| `ip_address` | TEXT | | IPアドレス |
| `user_agent` | TEXT | | ユーザーエージェント |
| `user_id` | TEXT | NOT NULL, FK → `user.id` | ユーザーID（CASCADE DELETE） |

#### `account`
認証プロバイダーアカウント情報を格納するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| `id` | TEXT | PRIMARY KEY | アカウントID |
| `account_id` | TEXT | NOT NULL | プロバイダー側のアカウントID |
| `provider_id` | TEXT | NOT NULL | プロバイダーID（例: "email", "google"） |
| `user_id` | TEXT | NOT NULL, FK → `user.id` | ユーザーID（CASCADE DELETE） |
| `access_token` | TEXT | | アクセストークン |
| `refresh_token` | TEXT | | リフレッシュトークン |
| `id_token` | TEXT | | IDトークン |
| `expires_at` | INTEGER | | トークン有効期限（タイムスタンプ） |
| `password` | TEXT | | ハッシュ化されたパスワード（emailプロバイダーの場合） |
| `created_at` | INTEGER | NOT NULL | 作成日時（タイムスタンプ） |
| `updated_at` | INTEGER | NOT NULL | 更新日時（タイムスタンプ） |

#### `verification`
メール認証などの検証情報を格納するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| `id` | TEXT | PRIMARY KEY | 検証ID |
| `identifier` | TEXT | NOT NULL | 識別子（通常はメールアドレス） |
| `value` | TEXT | NOT NULL | 検証コード |
| `expires_at` | INTEGER | NOT NULL | 有効期限（タイムスタンプ） |
| `created_at` | INTEGER | | 作成日時（タイムスタンプ） |
| `updated_at` | INTEGER | | 更新日時（タイムスタンプ） |

### アプリケーション関連テーブル

#### `medicine`
薬・サプリメントの基本情報を格納するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| `medicine_id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | 薬ID |
| `user_id` | TEXT | NOT NULL, FK → `user.id` | ユーザーID（CASCADE DELETE） |
| `name` | TEXT | NOT NULL | 薬の名前 |
| `description` | TEXT | | 説明 |
| `is_active` | INTEGER | NOT NULL, DEFAULT true | 有効フラグ |
| `registered_at` | INTEGER | NOT NULL | 登録日時（タイムスタンプ） |

**説明**: ユーザーが登録する薬やサプリメントのマスターデータを管理します。

#### `schedule`
薬の服用スケジュールを格納するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| `schedule_id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | スケジュールID |
| `medicine_id` | INTEGER | NOT NULL, FK → `medicine.medicine_id` | 薬ID |
| `time` | TEXT | NOT NULL | 服用予定時刻（例: "08:00", "23:00"） |
| `frequency_type` | TEXT | NOT NULL, DEFAULT "DAILY" | 頻度タイプ（"DAILY", "WEEKLY", "CUSTOM"） |
| `start_date` | INTEGER | NOT NULL | 開始日（タイムスタンプ） |

**説明**: 薬の服用時間や頻度を管理する設定テーブルです。1つの薬に対して複数のスケジュールを設定できます。

#### `dose_log`
服用実績を格納するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| `dose_log_id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | 服用ログID |
| `schedule_id` | INTEGER | NOT NULL, FK → `schedule.schedule_id` | スケジュールID |
| `record_date` | INTEGER | NOT NULL | 記録日（タイムスタンプ） |
| `is_taken` | INTEGER | NOT NULL | 服用したかどうか（boolean） |
| `taken_at` | INTEGER | | 服用日時（タイムスタンプ、NULL可） |

**説明**: スケジュールされた薬の服用実績を記録します。`is_taken`が`true`の場合、`taken_at`に実際の服用日時が記録されます。

#### `custom_item`
カスタムチェック項目の設定を格納するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| `custom_item_id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | カスタム項目ID |
| `medicine_id` | INTEGER | FK → `medicine.medicine_id` | 薬ID（NULL可 - 薬に紐づかない場合） |
| `item_name` | TEXT | NOT NULL | 項目名（例: "出血チェック", "体温"） |
| `data_type` | TEXT | NOT NULL | データ型（"BOOL", "NUMBER", "TEXT", "RATING"） |
| `is_required` | INTEGER | NOT NULL, DEFAULT false | 必須フラグ |

**説明**: ユーザーが自由に設定できる追加の記録項目です。薬に紐づけることも、独立した項目として設定することもできます。

#### `custom_log`
カスタム項目の実際の値を格納するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| `custom_log_id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | カスタムログID |
| `custom_item_id` | INTEGER | NOT NULL, FK → `custom_item.custom_item_id` | カスタム項目ID |
| `record_date` | INTEGER | NOT NULL | 記録日（タイムスタンプ） |
| `value` | TEXT | NOT NULL | 値（BOOL/NUMBER/TEXT/RATINGに対応するためTEXT型で保存） |

**説明**: カスタム項目の実際の値を記録します。`value`はTEXT型で保存され、`custom_item.data_type`に応じて適切に解釈されます。

## テーブル関係図

```
user
  ├── account (1:N, CASCADE DELETE)
  ├── session (1:N, CASCADE DELETE)
  └── medicine (1:N, CASCADE DELETE)
        └── schedule (1:N)
              └── dose_log (1:N)
        └── custom_item (1:N, NULL可)
              └── custom_log (1:N)
```

## 外部キー制約

| テーブル | カラム | 参照先テーブル | 参照先カラム | 削除時の動作 |
|---------|--------|--------------|-------------|------------|
| `session` | `user_id` | `user` | `id` | CASCADE |
| `account` | `user_id` | `user` | `id` | CASCADE |
| `medicine` | `user_id` | `user` | `id` | CASCADE |
| `schedule` | `medicine_id` | `medicine` | `medicine_id` | NO ACTION |
| `dose_log` | `schedule_id` | `schedule` | `schedule_id` | NO ACTION |
| `custom_item` | `medicine_id` | `medicine` | `medicine_id` | NO ACTION |
| `custom_log` | `custom_item_id` | `custom_item` | `custom_item_id` | NO ACTION |

## インデックス

### ユニークインデックス

- `user.email`: メールアドレスの一意性を保証
- `session.token`: セッショントークンの一意性を保証

## データ型の詳細

### タイムスタンプ
SQLiteでは日時をINTEGER型（Unixタイムスタンプ）で保存しています。Drizzle ORMの`mode: "timestamp"`により、TypeScript側では`Date`型として扱われます。

### ブール値
SQLiteにはBOOLEAN型がないため、INTEGER型で保存しています。Drizzle ORMの`mode: "boolean"`により、TypeScript側では`boolean`型として扱われます。

### 列挙型（Enum）
以下の列挙型が使用されています：

- `schedule.frequency_type`: `"DAILY" | "WEEKLY" | "CUSTOM"`
- `custom_item.data_type`: `"BOOL" | "NUMBER" | "TEXT" | "RATING"`

## マイグレーション

マイグレーションファイルは`backend/drizzle/`ディレクトリに格納されています。

### マイグレーションの実行

```bash
# マイグレーションファイルの生成
bun run db:generate

# マイグレーションの実行
bun run db:migrate
```

## 注意事項

1. **ユーザー削除時の動作**: `user`テーブルのレコードを削除すると、関連する`account`、`session`、`medicine`のレコードも自動的に削除されます（CASCADE DELETE）。

2. **カスタム項目の独立性**: `custom_item.medicine_id`はNULL可のため、薬に紐づかない独立したカスタム項目を設定できます。

3. **カスタムログの値**: `custom_log.value`はTEXT型で保存されますが、`custom_item.data_type`に応じて適切に型変換する必要があります。

4. **スケジュールと服用ログ**: 1つのスケジュールに対して、複数の服用ログ（異なる日付）を記録できます。

