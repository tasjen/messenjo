BEGIN;
  ALTER TABLE users ADD pfp VARCHAR(512) NOT NULL DEFAULT '';
  ALTER TABLE groups ADD pfp VARCHAR(512) NOT NULL DEFAULT '';
COMMIT;