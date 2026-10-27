begin;

create table public.tournament_registrations (
  submission_key uuid primary key,
  reference text not null unique default ('LKO-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 16))),
  created_at timestamptz not null default clock_timestamp(),
  name text not null check (char_length(name) between 1 and 100),
  alias text not null check (char_length(alias) between 1 and 80),
  email text not null check (char_length(email) between 3 and 254),
  phone text not null check (char_length(phone) between 8 and 32),
  game text not null check (game in ('fifa','tekken','mk','bgmi','cod','freefire')),
  team text not null default '' check (char_length(team) <= 100),
  roster text not null default '' check (char_length(roster) <= 2000),
  request_digest text not null check (request_digest ~ '^[a-f0-9]{64}$'),
  ip_hash text not null check (ip_hash ~ '^[a-f0-9]{64}$')
);
create index tournament_registration_rate on public.tournament_registrations (ip_hash, created_at);
alter table public.tournament_registrations enable row level security;
revoke all on public.tournament_registrations from public, anon, authenticated;
grant select on public.tournament_registrations to service_role;

create function public.register_esports(p_key uuid, p_payload jsonb, p_digest text, p_ip_hash text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare existing public.tournament_registrations; receipt text;
begin
  perform pg_advisory_xact_lock(hashtext(p_key::text));
  select * into existing from public.tournament_registrations where submission_key = p_key;
  if found then
    if existing.request_digest <> p_digest then raise exception 'registration_key_conflict'; end if;
    return jsonb_build_object('reference', existing.reference, 'created', false);
  end if;
  perform pg_advisory_xact_lock(hashtext(p_ip_hash));
  if (select count(*) from public.tournament_registrations where ip_hash = p_ip_hash and created_at > clock_timestamp() - interval '1 hour') >= 20 then
    raise exception 'registration_rate_limit';
  end if;
  insert into public.tournament_registrations (submission_key, name, alias, email, phone, game, team, roster, request_digest, ip_hash)
  values (p_key, p_payload->>'name', p_payload->>'alias', p_payload->>'email', p_payload->>'phone', p_payload->>'game', coalesce(p_payload->>'team',''), coalesce(p_payload->>'roster',''), p_digest, p_ip_hash)
  returning reference into receipt;
  return jsonb_build_object('reference', receipt, 'created', true);
end;
$$;
revoke all on function public.register_esports(uuid,jsonb,text,text) from public, anon, authenticated;
grant execute on function public.register_esports(uuid,jsonb,text,text) to service_role;

commit;
