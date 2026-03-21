-- Add onboarding fields to profiles table
alter table public.profiles
  add column if not exists onboarding_completed boolean default false,
  add column if not exists current_job text,
  add column if not exists industry text,
  add column if not exists years_experience text,
  add column if not exists top_skills text,
  add column if not exists values text,
  add column if not exists life_goals text,
  add column if not exists risk_tolerance text,
  add column if not exists help_type text;
