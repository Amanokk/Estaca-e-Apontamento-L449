alter table presence add column if not exists activity_id text;
alter table presence add column if not exists apontamento_id text;
create index if not exists presence_updated_idx on presence (updated_at desc);
