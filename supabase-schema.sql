-- 1) Table for the user's shared dashboard data
create table if not exists public.daily_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Prevent duplicate rows per user
create unique index if not exists daily_data_user_unique
on public.daily_data (user_id);

-- 3) Enable RLS
alter table public.daily_data enable row level security;

-- 4) Policies: user can only access their own row
create policy "Users can view their own dashboard data"
  on public.daily_data
  for select
  using (auth.uid() = user_id);

create policy "Users can create their own dashboard data"
  on public.daily_data
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own dashboard data"
  on public.daily_data
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own dashboard data"
  on public.daily_data
  for delete
  using (auth.uid() = user_id);

-- 5) Trigger to refresh updated_at automatically
create or replace function public.update_daily_data_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_daily_data_updated_at
before update on public.daily_data
for each row
execute function public.update_daily_data_updated_at();
