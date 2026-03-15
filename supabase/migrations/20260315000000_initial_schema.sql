-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- users
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table users enable row level security;

create policy "Users can read own row" on users
  for select using (auth.uid() = id);

-- user_preferences
create table user_preferences (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  topics text[] not null default '{}',
  sources text[] not null default '{}',
  notification_enabled boolean not null default false,
  notification_time time not null default '09:00'
);

alter table user_preferences enable row level security;

create policy "Users can manage own preferences" on user_preferences
  for all using (auth.uid() = user_id);

-- words
create table words (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  word text not null,
  context text,
  russian_definition text,
  english_definition text,
  synonyms jsonb,
  etymology text,
  created_at timestamptz not null default now()
);

alter table words enable row level security;

create policy "Users can manage own words" on words
  for all using (auth.uid() = user_id);

-- reviews
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  word_id uuid not null references words(id) on delete cascade,
  ease_factor float not null default 2.5,
  interval_days int not null default 1,
  repetitions int not null default 0,
  next_review_at timestamptz not null default now(),
  last_reviewed_at timestamptz
);

alter table reviews enable row level security;

create policy "Users can manage own reviews" on reviews
  for all using (auth.uid() = user_id);
