-- Create Results Table
CREATE TABLE results (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    registerNo TEXT,
    quiz TEXT,
    score INTEGER,
    total INTEGER,
    percentage FLOAT,
    grade TEXT,
    timeTaken TEXT,
    violations INTEGER,
    submittedAt TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create Violations Table
CREATE TABLE violations (
    id BIGSERIAL PRIMARY KEY,
    student TEXT,
    quiz TEXT,
    type TEXT,
    detail TEXT,
    time TEXT,
    timestamp BIGINT
);

-- Enable Realtime
-- This allows the dashboard to update without refreshing
ALTER PUBLICATION supabase_realtime ADD TABLE results;
ALTER PUBLICATION supabase_realtime ADD TABLE violations;
