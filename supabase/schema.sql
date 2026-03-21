-- profiles table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  plan text not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  plan_updated_at timestamptz,
  conversations_this_week integer not null default 0,
  week_reset_at timestamptz default now(),
  trial_ends_at timestamptz,
  referral_code text unique,
  referred_by text,
  created_at timestamptz default now()
);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, referral_code)
  values (
    new.id,
    new.email,
    substr(md5(new.id::text), 1, 8)
  );
  return new;
end;
$$ language plpgsql security definer;

-- trigger on new user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS policies
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
