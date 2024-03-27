-- レポジトリ
CREATE TABLE
  repositories (
    id UUID DEFAULT uuid_generate_v4 (),
    owner_id UUID REFERENCES auth.users ON DELETE SET NULL, -- ユーザ
    NAME VARCHAR(25) NOT NULL,
    detail TEXT,
    image_path TEXT, -- 画像パス("repository_images") ※例: "[repositoryId]/[fileName]"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users,
    updated_by UUID REFERENCES auth.users,
    PRIMARY KEY (id)
  );

ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER on_create_repositories BEFORE INSERT ON repositories FOR EACH ROW
EXECUTE PROCEDURE set_created ();

CREATE TRIGGER on_update_repositories BEFORE
UPDATE ON repositories FOR EACH ROW
EXECUTE PROCEDURE set_updated ();

CREATE POLICY "insert own repositories" ON repositories FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own repositories" ON repositories FOR
SELECT
  USING (
    auth.uid () = created_by
    OR auth.uid () = owner_id
  );

CREATE POLICY "update own repositories" ON repositories FOR
UPDATE USING (
  auth.uid () = created_by
  OR auth.uid () = owner_id
)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own repositories" ON repositories FOR DELETE USING (
  auth.uid () = created_by
  OR auth.uid () = owner_id
);

CREATE FUNCTION auth_check_repository (repository_id UUID) RETURNS BOOLEAN AS $$
  SELECT
    EXISTS(
      SELECT
        1
      FROM
        repositories r
      WHERE
        r.id = repository_id
      AND
        (r.created_by = auth.uid() OR auth.uid () = r.owner_id));
$$ LANGUAGE SQL STABLE;

-- storage
INSERT INTO
  STORAGE.buckets (id, NAME)
VALUES
  ('repository_images', 'repository_images');

CREATE POLICY "repository_image images are protected" ON STORAGE.objects FOR
SELECT
  TO authenticated USING (
    bucket_id = 'repository_images'
    AND auth_check_repository (CAST((STORAGE.foldername (NAME)) [1] AS UUID))
  );

CREATE POLICY "repository user can upload an repository_image." ON STORAGE.objects FOR INSERT TO authenticated
-- WITH CHECK (bucket_id = 'repository_images');
WITH
  CHECK (
    bucket_id = 'repository_images'
    AND auth_check_repository (CAST((STORAGE.foldername (NAME)) [1] AS UUID))
  );

CREATE POLICY "repository user can update their own repository_image." ON STORAGE.objects FOR
UPDATE TO authenticated
-- USING (auth.uid() = OWNER)
USING (bucket_id = 'repository_images')
WITH
  CHECK (auth_check_repository (CAST((STORAGE.foldername (NAME)) [1] AS UUID)));

CREATE POLICY "repository user can delete their own repository_image." ON STORAGE.objects FOR DELETE TO authenticated
-- USING (bucket_id = 'repository_images');
USING (
  bucket_id = 'repository_images'
  AND auth_check_repository (CAST((STORAGE.foldername (NAME)) [1] AS UUID))
);

-- テーブル
CREATE TABLE
  repository_tables (
    NAME VARCHAR(25) NOT NULL,
    repository_id UUID NOT NULL,
    detail TEXT,
    render_rule JSON,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users,
    updated_by UUID REFERENCES auth.users,
    PRIMARY KEY (NAME, repository_id),
    FOREIGN KEY (repository_id) REFERENCES repositories (id) ON DELETE CASCADE ON UPDATE CASCADE
  );

ALTER TABLE repository_tables ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER on_create_repository_table BEFORE INSERT ON repository_tables FOR EACH ROW
EXECUTE PROCEDURE set_created ();

CREATE TRIGGER on_update_repository_table BEFORE
UPDATE ON repository_tables FOR EACH ROW
EXECUTE PROCEDURE set_updated ();

CREATE POLICY "insert own repository_tables" ON repository_tables FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own repository_tables" ON repository_tables FOR
SELECT
  USING (
    auth.uid () = created_by
    OR auth_check_repository (repository_id)
  );

CREATE POLICY "update own repository_tables" ON repository_tables FOR
UPDATE USING (
  auth.uid () = created_by
  OR auth_check_repository (repository_id)
)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own repository_tables" ON repository_tables FOR DELETE USING (
  auth.uid () = created_by
  OR auth_check_repository (repository_id)
);

-- 行
CREATE TABLE
  repository_table_rows (
    id UUID DEFAULT uuid_generate_v4 (),
    repository_table_name VARCHAR(25) NOT NULL,
    repository_id UUID NOT NULL,
    detail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users,
    updated_by UUID REFERENCES auth.users,
    PRIMARY KEY (id, repository_table_name, repository_id),
    FOREIGN KEY (repository_id) REFERENCES repositories (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (repository_table_name, repository_id) REFERENCES repository_tables (NAME, repository_id) ON DELETE CASCADE ON UPDATE CASCADE
  );

ALTER TABLE repository_table_rows ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER on_create_repository_table_rows BEFORE INSERT ON repository_table_rows FOR EACH ROW
EXECUTE PROCEDURE set_created ();

CREATE TRIGGER on_update_repository_table_rows BEFORE
UPDATE ON repository_table_rows FOR EACH ROW
EXECUTE PROCEDURE set_updated ();

CREATE POLICY "insert own repository_table_rows" ON repository_table_rows FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own repository_table_rows" ON repository_table_rows FOR
SELECT
  USING (
    auth.uid () = created_by
    OR auth_check_repository (repository_id)
  );

CREATE POLICY "update own repository_table_rows" ON repository_table_rows FOR
UPDATE USING (
  auth.uid () = created_by
  OR auth_check_repository (repository_id)
)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own repository_table_rows" ON repository_table_rows FOR DELETE USING (
  auth.uid () = created_by
  OR auth_check_repository (repository_id)
);

-- 値列
CREATE TABLE
  repository_table_columns (
    NAME VARCHAR(25) NOT NULL,
    repository_table_name VARCHAR(25) NOT NULL,
    repository_id UUID NOT NULL,
    detail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users,
    updated_by UUID REFERENCES auth.users,
    PRIMARY KEY (NAME, repository_table_name, repository_id),
    FOREIGN KEY (repository_id) REFERENCES repositories (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (repository_table_name, repository_id) REFERENCES repository_tables (NAME, repository_id) ON DELETE CASCADE ON UPDATE CASCADE
  );

ALTER TABLE repository_table_columns ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER on_create_repository_table_columns BEFORE INSERT ON repository_table_columns FOR EACH ROW
EXECUTE PROCEDURE set_created ();

CREATE TRIGGER on_update_repository_table_columns BEFORE
UPDATE ON repository_table_columns FOR EACH ROW
EXECUTE PROCEDURE set_updated ();

CREATE POLICY "insert own repository_table_columns" ON repository_table_columns FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own repository_table_columns" ON repository_table_columns FOR
SELECT
  USING (
    auth.uid () = created_by
    OR auth_check_repository (repository_id)
  );

CREATE POLICY "update own repository_table_columns" ON repository_table_columns FOR
UPDATE USING (
  auth.uid () = created_by
  OR auth_check_repository (repository_id)
)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own repository_table_columns" ON repository_table_columns FOR DELETE USING (
  auth.uid () = created_by
  OR auth_check_repository (repository_id)
);

-- 値セル
CREATE TABLE
  repository_table_cells (
    repository_table_row_id UUID NOT NULL,
    repository_table_column_name VARCHAR(25) NOT NULL,
    repository_table_name VARCHAR(25) NOT NULL,
    VALUE TEXT,
    repository_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users,
    updated_by UUID REFERENCES auth.users,
    PRIMARY KEY (repository_table_row_id, repository_table_column_name, repository_table_name, repository_id),
    FOREIGN KEY (repository_id) REFERENCES repositories (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (repository_table_row_id, repository_table_name, repository_id) REFERENCES repository_table_rows (id, repository_table_name, repository_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (repository_table_column_name, repository_table_name, repository_id) REFERENCES repository_table_columns (NAME, repository_table_name, repository_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (repository_table_name, repository_id) REFERENCES repository_tables (NAME, repository_id) ON DELETE CASCADE ON UPDATE CASCADE
  );

ALTER TABLE repository_table_cells ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER on_create_repository_table_cells BEFORE INSERT ON repository_table_cells FOR EACH ROW
EXECUTE PROCEDURE set_created ();

CREATE TRIGGER on_update_repository_table_cells BEFORE
UPDATE ON repository_table_cells FOR EACH ROW
EXECUTE PROCEDURE set_updated ();

CREATE POLICY "insert own repository_table_cells" ON repository_table_cells FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own repository_table_cells" ON repository_table_cells FOR
SELECT
  USING (
    auth.uid () = created_by
    OR auth_check_repository (repository_id)
  );

CREATE POLICY "update own repository_table_cells" ON repository_table_cells FOR
UPDATE USING (
  auth.uid () = created_by
  OR auth_check_repository (repository_id)
)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own repository_table_cells" ON repository_table_cells FOR DELETE USING (
  auth.uid () = created_by
  OR auth_check_repository (repository_id)
);

-- FK列
CREATE TABLE
  repository_table_fk_columns (
    NAME VARCHAR(25) NOT NULL,
    repository_table_name VARCHAR(25) NOT NULL,
    target_repository_table_name VARCHAR(25) NOT NULL,
    repository_id UUID NOT NULL,
    detail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users,
    updated_by UUID REFERENCES auth.users,
    PRIMARY KEY (NAME, repository_table_name, repository_id),
    FOREIGN KEY (repository_id) REFERENCES repositories (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (repository_table_name, repository_id) REFERENCES repository_tables (NAME, repository_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (target_repository_table_name, repository_id) REFERENCES repository_tables (NAME, repository_id) ON DELETE CASCADE ON UPDATE CASCADE
  );

ALTER TABLE repository_table_fk_columns ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER on_create_repository_table_fk_columns BEFORE INSERT ON repository_table_fk_columns FOR EACH ROW
EXECUTE PROCEDURE set_created ();

CREATE TRIGGER on_update_repository_table_fk_columns BEFORE
UPDATE ON repository_table_fk_columns FOR EACH ROW
EXECUTE PROCEDURE set_updated ();

CREATE POLICY "insert own repository_table_fk_columns" ON repository_table_fk_columns FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own repository_table_fk_columns" ON repository_table_fk_columns FOR
SELECT
  USING (
    auth.uid () = created_by
    OR auth_check_repository (repository_id)
  );

CREATE POLICY "update own repository_table_fk_columns" ON repository_table_fk_columns FOR
UPDATE USING (
  auth.uid () = created_by
  OR auth_check_repository (repository_id)
)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own repository_table_fk_columns" ON repository_table_fk_columns FOR DELETE USING (
  auth.uid () = created_by
  OR auth_check_repository (repository_id)
);

-- FKセル
CREATE TABLE
  repository_table_fk_cells (
    repository_table_row_id UUID NOT NULL,
    repository_table_fk_column_name VARCHAR(25) NOT NULL,
    repository_table_name VARCHAR(25) NOT NULL,
    target_repository_table_fk_column_name VARCHAR(25) NOT NULL,
    target_repository_table_name VARCHAR(25) NOT NULL,
    repository_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users,
    updated_by UUID REFERENCES auth.users,
    PRIMARY KEY (repository_table_row_id, repository_table_fk_column_name, repository_table_name, repository_id),
    FOREIGN KEY (repository_id) REFERENCES repositories (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (repository_table_row_id, repository_table_name, repository_id) REFERENCES repository_table_rows (id, repository_table_name, repository_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (repository_table_fk_column_name, repository_table_name, repository_id) REFERENCES repository_table_fk_columns (NAME, repository_table_name, repository_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (target_repository_table_fk_column_name, target_repository_table_name, repository_id) REFERENCES repository_table_fk_columns (NAME, repository_table_name, repository_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (repository_table_name, repository_id) REFERENCES repository_tables (NAME, repository_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (target_repository_table_name, repository_id) REFERENCES repository_tables (NAME, repository_id) ON DELETE CASCADE ON UPDATE CASCADE
  );

ALTER TABLE repository_table_fk_cells ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER on_create_repository_table_fk_cells BEFORE INSERT ON repository_table_fk_cells FOR EACH ROW
EXECUTE PROCEDURE set_created ();

CREATE TRIGGER on_update_repository_table_fk_cells BEFORE
UPDATE ON repository_table_fk_cells FOR EACH ROW
EXECUTE PROCEDURE set_updated ();

CREATE POLICY "insert own repository_table_fk_cells" ON repository_table_fk_cells FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own repository_table_fk_cells" ON repository_table_fk_cells FOR
SELECT
  USING (
    auth.uid () = created_by
    OR auth_check_repository (repository_id)
  );

CREATE POLICY "update own repository_table_fk_cells" ON repository_table_fk_cells FOR
UPDATE USING (
  auth.uid () = created_by
  OR auth_check_repository (repository_id)
)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own repository_table_fk_cells" ON repository_table_fk_cells FOR DELETE USING (
  auth.uid () = created_by
  OR auth_check_repository (repository_id)
);

-- 表示列
CREATE TABLE
  repository_table_render_columns (
    NAME VARCHAR(25) NOT NULL,
    repository_table_name VARCHAR(25) NOT NULL,
    repository_id UUID NOT NULL,
    render_rule JSON,
    detail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users,
    updated_by UUID REFERENCES auth.users,
    PRIMARY KEY (NAME, repository_table_name, repository_id),
    FOREIGN KEY (repository_id) REFERENCES repositories (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (repository_table_name, repository_id) REFERENCES repository_tables (NAME, repository_id) ON DELETE CASCADE ON UPDATE CASCADE
  );

ALTER TABLE repository_table_render_columns ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER on_create_repository_table_render_columns BEFORE INSERT ON repository_table_render_columns FOR EACH ROW
EXECUTE PROCEDURE set_created ();

CREATE TRIGGER on_update_repository_table_render_columns BEFORE
UPDATE ON repository_table_render_columns FOR EACH ROW
EXECUTE PROCEDURE set_updated ();

CREATE POLICY "insert own repository_table_render_columns" ON repository_table_render_columns FOR INSERT
WITH
  CHECK (auth.uid () = created_by);

CREATE POLICY "select own repository_table_render_columns" ON repository_table_render_columns FOR
SELECT
  USING (
    auth.uid () = created_by
    OR auth_check_repository (repository_id)
  );

CREATE POLICY "update own repository_table_render_columns" ON repository_table_render_columns FOR
UPDATE USING (
  auth.uid () = created_by
  OR auth_check_repository (repository_id)
)
WITH
  CHECK (auth.uid () = updated_by);

CREATE POLICY "delete own repository_table_render_columns" ON repository_table_render_columns FOR DELETE USING (
  auth.uid () = created_by
  OR auth_check_repository (repository_id)
);