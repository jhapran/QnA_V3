-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create roles table
create table public.roles (
  id serial primary key,
  name varchar(50) unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default roles
insert into public.roles (name) values
  ('admin'),
  ('educator'),
  ('student');

-- Create users table
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email varchar(255) unique not null,
  full_name varchar(100) not null,
  role_id integer references public.roles(id) not null default 3, -- Default to student
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Create RLS policies
create policy "Users can view their own data"
  on public.users
  for select
  using (auth.uid() = id);

create policy "Users can update their own data"
  on public.users
  for update
  using (auth.uid() = id);

create policy "Admins can view all users"
  on public.users
  for select
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role_id = 1
    )
  );

-- Create function to handle new user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  default_role_id integer;
begin
  -- Get the default role ID (student)
  select id into default_role_id from public.roles where name = 'student';
  
  insert into public.users (id, email, full_name, role_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    default_role_id
  );
  return new;
end;
$$;

-- Create trigger for new user registration
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create organizations table
create table public.organizations (
  id uuid default uuid_generate_v4() primary key,
  name varchar(100) not null,
  domain varchar(255) unique,
  logo_url text,
  plan varchar(50) default 'free',
  max_users integer default 10,
  features jsonb default '[]',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create organization_members table for user-organization relationships
create table public.organization_members (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  role varchar(50) default 'member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(organization_id, user_id)
);

-- Enable RLS
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;

-- Create RLS policies for organizations
create policy "Organization members can view their organizations"
  on public.organizations
  for select
  using (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = organizations.id
      and organization_members.user_id = auth.uid()
    )
  );

create policy "Organization admins can update their organizations"
  on public.organizations
  for update
  using (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = organizations.id
      and organization_members.user_id = auth.uid()
      and organization_members.role = 'admin'
    )
  );

-- Create RLS policies for organization members
create policy "Organization members can view member list"
  on public.organization_members
  for select
  using (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = organization_members.organization_id
      and organization_members.user_id = auth.uid()
    )
  );

create policy "Organization admins can manage members"
  on public.organization_members
  for all
  using (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = organization_members.organization_id
      and organization_members.user_id = auth.uid()
      and organization_members.role = 'admin'
    )
  );

-- Grant necessary permissions
grant usage on schema public to authenticated, anon;
grant all on public.users to authenticated, anon;
grant all on public.roles to authenticated, anon;
grant usage on sequence public.roles_id_seq to authenticated, anon;
grant all on public.organizations to authenticated;
grant all on public.organization_members to authenticated;