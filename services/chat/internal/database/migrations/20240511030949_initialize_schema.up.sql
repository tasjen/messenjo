BEGIN;

CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(32) UNIQUE NOT NULL
);

CREATE TABLE groups (
  id UUID PRIMARY KEY,
  name VARCHAR(16)
);

CREATE TABLE members (
  user_id UUID REFERENCES users (id),
  group_id UUID REFERENCES groups (id),
  PRIMARY KEY (user_id, group_id)
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users (id),
  group_id UUID REFERENCES groups (id),
  content VARCHAR(300) NOT NULL,
  sent_at TIMESTAMP NOT NULL
);

COMMIT;