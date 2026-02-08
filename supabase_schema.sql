-- Create the 'classes' table
create table classes (
  id uuid primary key default gen_random_uuid(),
  module_code text not null,
  class_date date not null,
  class_start_time time not null,
  class_end_time time not null,
  class_location text not null,
  attendance integer check (attendance in (0, 1)) -- null allowed
);

-- Enable Row Level Security (RLS)
alter table classes enable row level security;

-- Create a policy that allows all operations for now (for development)
create policy "Allow all operations for anon" on classes
for all using (true) with check (true);
