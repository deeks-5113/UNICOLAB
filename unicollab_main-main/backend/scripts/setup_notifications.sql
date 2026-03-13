-- Create Notifications Table in Supabase
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.notifications enable row level security;

-- Create Policy
create policy "Users can view their own notifications"
  on public.notifications for select
  using ( auth.uid() = user_id );

create policy "Users can update their own notifications"
  on public.notifications for update
  using ( auth.uid() = user_id );
