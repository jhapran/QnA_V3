-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.organizations enable row level security;
alter table public.questions enable row level security;

-- Create users table
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null unique,
  full_name text,
  avatar_url text,
  organization_id uuid references public.organizations(id),
  role text check (role in ('admin', 'educator', 'student')) not null default 'educator',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create organizations table
create table public.organizations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  domain text,
  logo_url text,
  plan text check (plan in ('free', 'basic', 'pro', 'enterprise')) not null default 'free',
  subscription_id text unique,
  subscription_status text check (subscription_status in ('active', 'trialing', 'past_due', 'canceled')) default 'active',
  max_users integer not null default 5,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create questions table
create table public.questions (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) not null,
  created_by uuid references public.users(id) not null,
  question text not null,
  answer text not null,
  explanation text,
  type text check (type in ('multiple-choice', 'short-answer', 'essay')) not null,
  subject text not null,
  topic text not null,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')) not null,
  options jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
create policy "Users can view their own data"
  on public.users
  for select
  using (auth.uid() = id);

create policy "Users can update their own data"
  on public.users
  for update
  using (auth.uid() = id);

create policy "Organization members can view organization data"
  on public.organizations
  for select
  using (
    exists (
      select 1 from public.users
      where users.organization_id = organizations.id
      and users.id = auth.uid()
    )
  );

create policy "Organization admins can update organization data"
  on public.organizations
  for update
  using (
    exists (
      select 1 from public.users
      where users.organization_id = organizations.id
      and users.id = auth.uid()
      and users.role = 'admin'
    )
  );

create policy "Organization members can view questions"
  on public.questions
  for select
  using (
    exists (
      select 1 from public.users
      where users.organization_id = questions.organization_id
      and users.id = auth.uid()
    )
  );

create policy "Organization members can create questions"
  on public.questions
  for insert
  with check (
    exists (
      select 1 from public.users
      where users.organization_id = questions.organization_id
      and users.id = auth.uid()
    )
  );

-- Create functions
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

-- Create triggers
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();