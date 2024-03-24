-- create table schedules
-- schedulesテーブルの構築
CREATE TABLE
  schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL, -- ユーザ
    title TEXT NOT NULL, -- 件名
    detail TEXT, -- 詳細
    is_important BOOLEAN NOT NULL DEFAULT FALSE, -- 重要か否か
    is_emergency BOOLEAN NOT NULL DEFAULT FALSE, -- 緊急か否か
    is_all_day BOOLEAN NOT NULL DEFAULT FALSE, -- 終日か否か
    plan_from_at TIMESTAMP WITH TIME ZONE NOT NULL, -- 予定日時
    plan_to_at TIMESTAMP WITH TIME ZONE NOT NULL, -- 予定日時
    completed_at TIMESTAMP WITH TIME ZONE, -- 達成日時
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users,
    updated_by UUID REFERENCES auth.users
  );

ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER on_create_schedules BEFORE INSERT ON schedules FOR EACH ROW
EXECUTE PROCEDURE set_created ();

CREATE TRIGGER on_update_schedules BEFORE
UPDATE ON schedules FOR EACH ROW
EXECUTE PROCEDURE set_updated ();

CREATE POLICY "insert own schedules" ON schedules FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own schedules" ON schedules FOR
SELECT
  USING (
    auth.uid () = created_by
    OR auth.uid () = user_id
  );

CREATE POLICY "update own schedules" ON schedules FOR
UPDATE USING (
  auth.uid () = created_by
  OR auth.uid () = user_id
)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own schedules" ON schedules FOR DELETE USING (
  auth.uid () = created_by
  OR auth.uid () = user_id
);