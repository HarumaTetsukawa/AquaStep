# 水たまり登録ページのSupabase設定

既存画面は変更せず、`/add-puddle` に独立した登録ページを追加しています。

## 1. 写真用Storageを作成

Supabase Dashboardで対象プロジェクトを開き、**SQL Editor** に
[`supabase/setup.sql`](./supabase/setup.sql) の内容を貼り付けて実行します。

作成されるもの:

- `puddle-photos` 公開Storageバケット
- 写真を公開表示するための読み取りポリシー

既存の `public.puddles` テーブルや列構成は変更しません。フォームの値は既存列
`latitude`、`longitude`、`range_ns_m`、`range_ew_m`、`depth_cm`、`observed_on`、`status` に保存されます。
写真はStorageの `{puddles.id}/{画像UUID}.jpg` というパスへ保存されます。

## 2. サーバー用のキーを設定

プロジェクト直下に `.env.local` を作り、次の2行を設定します。

```env
SUPABASE_URL=https://oazbufyzxoqcbqpuoqvu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=Supabaseのservice_roleキー
```

キーは Supabase Dashboard の **Project Settings > API Keys** から取得します。
`service_role` は管理権限を持つため、Gitへコミットしたり `NEXT_PUBLIC_` を付けたりしないでください。

## 3. 起動して確認

```bash
npm run dev
```

ブラウザで `http://localhost:3000/add-puddle` を開きます。
登録後、Supabaseの **Table Editor > puddles** と **Storage > puddle-photos** の両方にデータが作成されます。
