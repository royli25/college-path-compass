
-- First, let's create the admitted_profiles table for the new feature
CREATE TABLE public.admitted_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  graduation_year INTEGER NOT NULL,
  high_school TEXT NOT NULL,
  gpa_unweighted DECIMAL(3,2),
  gpa_weighted DECIMAL(3,2),
  sat_score INTEGER,
  act_score INTEGER,
  activities JSONB DEFAULT '[]'::jsonb,
  leadership_positions TEXT[],
  honors_awards JSONB DEFAULT '[]'::jsonb,
  ap_ib_courses JSONB DEFAULT '[]'::jsonb,
  colleges_admitted JSONB DEFAULT '[]'::jsonb,
  colleges_rejected JSONB DEFAULT '[]'::jsonb,
  colleges_waitlisted JSONB DEFAULT '[]'::jsonb,
  intended_major TEXT,
  essay_excerpts JSONB DEFAULT '[]'::jsonb,
  profile_photo TEXT,
  background_story TEXT,
  advice TEXT,
  demographics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies for admitted profiles (public read access)
ALTER TABLE public.admitted_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view admitted profiles" 
  ON public.admitted_profiles 
  FOR SELECT 
  USING (true);

-- Insert sample data for admitted profiles
INSERT INTO public.admitted_profiles (
  name, graduation_year, high_school, gpa_unweighted, gpa_weighted, sat_score, 
  activities, colleges_admitted, intended_major, background_story, advice,
  demographics
) VALUES 
(
  'Sarah Chen',
  2023,
  'Lincoln High School',
  3.92,
  4.45,
  1520,
  '[
    {"name": "Debate Team Captain", "years": 3, "hours_per_week": 8},
    {"name": "Math Tutoring", "years": 2, "hours_per_week": 4},
    {"name": "Science Olympiad", "years": 4, "hours_per_week": 6}
  ]'::jsonb,
  '[
    {"school": "MIT", "program": "Computer Science", "decision": "Accepted"},
    {"school": "Stanford", "program": "Computer Science", "decision": "Accepted"},
    {"school": "UC Berkeley", "program": "EECS", "decision": "Accepted"}
  ]'::jsonb,
  'Computer Science',
  'First-generation college student who discovered programming through a free online course. Overcame financial challenges by working part-time while maintaining academic excellence.',
  'Don''t let anyone tell you that you don''t belong. Your unique perspective is your strength. Start early with applications and don''t be afraid to ask for help.',
  '{"ethnicity": "Asian American", "first_generation": true, "income_bracket": "Under $50k"}'::jsonb
),
(
  'Marcus Johnson',
  2023,
  'Roosevelt High School',
  3.85,
  4.32,
  1480,
  '[
    {"name": "Varsity Basketball", "years": 4, "hours_per_week": 15},
    {"name": "Student Government", "years": 2, "hours_per_week": 5},
    {"name": "Community Service Club", "years": 3, "hours_per_week": 3}
  ]'::jsonb,
  '[
    {"school": "Duke University", "program": "Public Policy", "decision": "Accepted"},
    {"school": "UNC Chapel Hill", "program": "Political Science", "decision": "Accepted"},
    {"school": "Georgetown", "program": "Government", "decision": "Accepted"}
  ]'::jsonb,
  'Public Policy',
  'Student-athlete who balanced sports with academics while being involved in local community initiatives. Led voter registration drives in underserved communities.',
  'Time management is everything. Use a planner and stick to it. Don''t sacrifice your passions for grades - find ways to excel in both.',
  '{"ethnicity": "African American", "first_generation": false, "income_bracket": "$50k-$100k"}'::jsonb
),
(
  'Emma Rodriguez',
  2024,
  'Valley Prep Academy',
  4.0,
  4.67,
  1560,
  '[
    {"name": "Research Lab Intern", "years": 2, "hours_per_week": 12},
    {"name": "Environmental Club President", "years": 3, "hours_per_week": 6},
    {"name": "Volunteer EMT", "years": 1, "hours_per_week": 8}
  ]'::jsonb,
  '[
    {"school": "Harvard", "program": "Biomedical Engineering", "decision": "Accepted"},
    {"school": "Johns Hopkins", "program": "Biomedical Engineering", "decision": "Accepted"},
    {"school": "Northwestern", "program": "Biomedical Engineering", "decision": "Accepted"}
  ]'::jsonb,
  'Biomedical Engineering',
  'Passionate about using technology to solve healthcare problems. Conducted independent research on biodegradable medical implants that was published in a peer-reviewed journal.',
  'Find something you''re genuinely passionate about and pursue it deeply. Admissions officers can tell when you''re truly excited about your work versus just padding your resume.',
  '{"ethnicity": "Hispanic/Latino", "first_generation": false, "income_bracket": "$100k+"}'::jsonb
);
