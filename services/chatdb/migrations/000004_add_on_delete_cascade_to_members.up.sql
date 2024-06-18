BEGIN;

ALTER TABLE members DROP CONSTRAINT members_user_id_fkey;
ALTER TABLE members DROP CONSTRAINT members_group_id_fkey;

ALTER TABLE members ADD CONSTRAINT members_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;
ALTER TABLE members ADD CONSTRAINT members_group_id_fkey
  FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE;

COMMIT;
