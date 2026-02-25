-- Pesquita Poker - Supabase Schema
-- Run this in Supabase SQL Editor

-- Players
create table players (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  emoji text not null default '🃏',
  created_at timestamptz default now()
);

-- Sessions (fechas)
create table sessions (
  id uuid default gen_random_uuid() primary key,
  date date unique not null,
  notes text,
  created_at timestamptz default now()
);

-- Games
create table games (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references sessions(id) on delete cascade not null,
  game_number int not null,
  created_at timestamptz default now(),
  unique(session_id, game_number)
);

-- Results
create table results (
  id uuid default gen_random_uuid() primary key,
  game_id uuid references games(id) on delete cascade not null,
  player_id uuid references players(id) on delete cascade not null,
  position int not null check (position between 1 and 10),
  points int not null,
  unique(game_id, player_id),
  unique(game_id, position)
);

-- Leaderboard view
create or replace view leaderboard as
select
  p.id as player_id,
  p.name,
  p.emoji,
  coalesce(sum(r.points), 0)::int as total_points,
  count(r.id)::int as games_played,
  count(distinct g.session_id)::int as sessions_attended,
  count(case when r.position = 1 then 1 end)::int as wins,
  round(avg(r.position)::numeric, 2)::float as avg_position
from players p
left join results r on r.player_id = p.id
left join games g on g.id = r.game_id
group by p.id, p.name, p.emoji
order by total_points desc;

-- RLS Policies
alter table players enable row level security;
alter table sessions enable row level security;
alter table games enable row level security;
alter table results enable row level security;

-- Public read
create policy "Public read players" on players for select using (true);
create policy "Public read sessions" on sessions for select using (true);
create policy "Public read games" on games for select using (true);
create policy "Public read results" on results for select using (true);

-- Authenticated write
create policy "Auth insert players" on players for insert to authenticated with check (true);
create policy "Auth update players" on players for update to authenticated using (true);
create policy "Auth delete players" on players for delete to authenticated using (true);

create policy "Auth insert sessions" on sessions for insert to authenticated with check (true);
create policy "Auth update sessions" on sessions for update to authenticated using (true);
create policy "Auth delete sessions" on sessions for delete to authenticated using (true);

create policy "Auth insert games" on games for insert to authenticated with check (true);
create policy "Auth update games" on games for update to authenticated using (true);
create policy "Auth delete games" on games for delete to authenticated using (true);

create policy "Auth insert results" on results for insert to authenticated with check (true);
create policy "Auth update results" on results for update to authenticated using (true);
create policy "Auth delete results" on results for delete to authenticated using (true);
