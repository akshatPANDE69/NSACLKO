begin;

-- Google verifies players in the Next.js server. No personal email or raw
-- Google subject is needed by the browser or public leaderboard.
create table public.game_players (
  player_id text primary key check (player_id ~ '^[a-f0-9]{64}$'),
  display_name text not null check (char_length(display_name) between 1 and 60),
  email text not null
);
create table public.game_runs (
  id uuid primary key default gen_random_uuid(),
  player_id text not null references public.game_players(player_id) on delete cascade,
  seed integer not null check (seed > 0),
  created_at timestamptz not null default clock_timestamp(),
  status text not null default 'open' check (status in ('open', 'submitted', 'abandoned')),
  score integer check (score >= 0),
  ticks integer check (ticks between 1 and 72000),
  flaps jsonb check (jsonb_typeof(flaps) = 'array' and jsonb_array_length(flaps) <= 12000),
  submitted_at timestamptz
);
create index game_runs_player_created on public.game_runs (player_id, created_at desc);
create unique index game_runs_one_open on public.game_runs (player_id) where status = 'open';
create sequence public.game_score_order;
create table public.game_scores (
  player_id text primary key references public.game_players(player_id) on delete cascade,
  score integer not null check (score > 0),
  achieved_order bigint not null,
  achieved_at timestamptz not null,
  run_id uuid not null references public.game_runs(id)
);
create index game_scores_ranking on public.game_scores (score desc, achieved_order, player_id);

alter table public.game_players enable row level security;
alter table public.game_runs enable row level security;
alter table public.game_scores enable row level security;
revoke all on public.game_players, public.game_runs, public.game_scores from public, anon, authenticated;
revoke all on sequence public.game_score_order from public, anon, authenticated;
grant select, insert, update, delete on public.game_players, public.game_runs, public.game_scores to service_role;
grant usage, select on sequence public.game_score_order to service_role;

create function public.start_game_run(p_user text, p_seed integer, p_name text, p_email text)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  new_run public.game_runs;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_user, 0));
  if (select count(*) from public.game_runs where player_id = p_user and created_at > clock_timestamp() - interval '1 minute') >= 6
    or (select count(*) from public.game_runs where player_id = p_user and created_at > clock_timestamp() - interval '1 hour') >= 180 then
    raise exception 'Too many flights';
  end if;
  insert into public.game_players (player_id, display_name, email) values (p_user, p_name, p_email)
    on conflict (player_id) do update set display_name = excluded.display_name, email = excluded.email;
  update public.game_runs set status = 'abandoned' where player_id = p_user and status = 'open';
  insert into public.game_runs (player_id, seed) values (p_user, p_seed) returning * into new_run;
  return jsonb_build_object('id', new_run.id, 'seed', new_run.seed);
end;
$$;

create function public.finish_game_run(p_user text, p_run uuid, p_score integer, p_ticks integer, p_flaps jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  flight public.game_runs;
  recorded_order bigint;
  recorded_at timestamptz;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_user, 0));
  select * into flight from public.game_runs where id = p_run and player_id = p_user for update;
  if not found then raise exception 'Flight is no longer open'; end if;
  if flight.status = 'submitted' then return jsonb_build_object('score', flight.score); end if;
  if flight.status <> 'open' then raise exception 'Flight is no longer open'; end if;
  if clock_timestamp() - flight.created_at > interval '25 minutes' then raise exception 'Flight has expired'; end if;
  -- Finalisation and tie order commit in one transaction across all instances.
  perform pg_advisory_xact_lock(hashtextextended('nsac:game:leaderboard-order', 0));
  recorded_at := clock_timestamp();
  recorded_order := nextval('public.game_score_order');
  update public.game_runs set status = 'submitted', score = p_score, ticks = p_ticks,
    flaps = p_flaps, submitted_at = recorded_at where id = p_run;
  if p_score > 0 then
    insert into public.game_scores (player_id, score, achieved_order, achieved_at, run_id)
      values (p_user, p_score, recorded_order, recorded_at, p_run)
      on conflict (player_id) do update
      set score = excluded.score, achieved_order = excluded.achieved_order,
          achieved_at = excluded.achieved_at, run_id = excluded.run_id
      where excluded.score > public.game_scores.score;
  end if;
  return jsonb_build_object('score', p_score);
end;
$$;

create function public.get_game_leaderboard(p_user text default null)
returns jsonb language sql stable security invoker set search_path = '' as $$
  with ranked as (
    select row_number() over (order by s.score desc, s.achieved_order, s.player_id) as rank,
      s.player_id, s.score, p.display_name
    from public.game_scores s join public.game_players p using (player_id)
  )
  select jsonb_build_object(
    'entries', coalesce((select jsonb_agg(jsonb_build_object(
      'rank', rank, 'name', display_name, 'score', score, 'isYou', coalesce(player_id = p_user, false)
    ) order by rank) from ranked where rank <= 20), '[]'::jsonb),
    'personal', (select jsonb_build_object('rank', rank, 'score', score) from ranked where player_id = p_user)
  );
$$;

revoke all on function public.start_game_run(text, integer, text, text) from public, anon, authenticated;
revoke all on function public.finish_game_run(text, uuid, integer, integer, jsonb) from public, anon, authenticated;
revoke all on function public.get_game_leaderboard(text) from public, anon, authenticated;
grant execute on function public.start_game_run(text, integer, text, text) to service_role;
grant execute on function public.finish_game_run(text, uuid, integer, integer, jsonb) to service_role;
grant execute on function public.get_game_leaderboard(text) to service_role;

commit;
