-- Rosa do Deserto — esquema inicial
CREATE TYPE user_role AS ENUM ('admin', 'user');

CREATE TABLE users (
  id serial PRIMARY KEY,
  email text NOT NULL,
  display_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  password_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX users_email_lower_uidx ON users (lower(email));

CREATE TABLE sessions (
  id text PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_accessed timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);
CREATE INDEX sessions_user_idx ON sessions (user_id);
CREATE INDEX sessions_expires_idx ON sessions (expires_at);

CREATE TABLE login_attempts (
  id bigserial PRIMARY KEY,
  email text NOT NULL,
  ip text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('login', 'reset')),
  success boolean NOT NULL,
  attempted_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX login_attempts_email_idx ON login_attempts (kind, lower(email), attempted_at DESC);
CREATE INDEX login_attempts_ip_idx ON login_attempts (kind, ip, attempted_at DESC);

CREATE TABLE password_reset_codes (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_hash text NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  used_at timestamptz
);
CREATE INDEX password_reset_codes_user_idx ON password_reset_codes (user_id, created_at DESC);

CREATE TABLE categories (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE products (
  id serial PRIMARY KEY,
  category_id integer NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name text NOT NULL,
  description text,
  image_url text,
  price_from numeric(10,2) CHECK (price_from IS NULL OR price_from >= 0),
  featured boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX products_category_active_idx ON products (category_id, active, sort_order);
CREATE INDEX products_featured_idx ON products (featured) WHERE active AND featured;

CREATE TABLE notices (
  id serial PRIMARY KEY,
  message text NOT NULL,
  starts_at date,
  ends_at date,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (starts_at IS NULL OR ends_at IS NULL OR starts_at <= ends_at)
);
