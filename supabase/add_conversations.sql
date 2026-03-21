-- Conversations table for persistent memory (paid users)
create table if not exists public.conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  persona_id text not null default 'ray',
  title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Messages table
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- RLS for conversations
alter table public.conversations enable row level security;
create policy "Users can manage own conversations"
  on public.conversations for all
  using (auth.uid() = user_id);

-- RLS for messages
alter table public.messages enable row level security;
create policy "Users can manage own messages"
  on public.messages for all
  using (auth.uid() = user_id);

-- Index for fast lookups
create index if not exists messages_conversation_id_idx on public.messages(conversation_id);
create index if not exists conversations_user_id_idx on public.conversations(user_id);
