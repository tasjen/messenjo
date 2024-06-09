BEGIN;

ALTER TABLE messages DROP CONSTRAINT messages_user_id_fkey;
ALTER TABLE messages DROP CONSTRAINT messages_group_id_fkey;

ALTER TABLE messages ADD CONSTRAINT messages_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;
ALTER TABLE messages ADD CONSTRAINT messages_group_id_fkey
  FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE;

COMMIT;
