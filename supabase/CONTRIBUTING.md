# 備忘録

## マイグレーション

```bash
supabase migration new create_todo_tables
supabase db reset
supabase link --project-ref <project-id>
supabase db remote commit
supabase db push
supabase db dump --local -f supabase\.dump\dumpfile.sql
```

## 型生成

```bash
supabase gen types typescript --local > supabase/database.type.ts
```

## マイグレーションファイル命名規則
- `ct__(table_name)` create table (テーブル作成)
- `ac__(table_name)` add column (カラム追加)