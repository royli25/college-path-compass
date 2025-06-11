
-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create essays table
CREATE TABLE IF NOT EXISTS essays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  prompt_name TEXT NOT NULL,
  word_limit INTEGER,
  content TEXT DEFAULT '',
  status TEXT DEFAULT 'drafting' CHECK (status IN ('drafting', 'in_review', 'refining', 'completed')),
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE essays ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Essays policies
CREATE POLICY "Users can view their own essays" ON essays
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own essays" ON essays
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own essays" ON essays
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own essays" ON essays
  FOR DELETE USING (auth.uid() = user_id);

-- Insert some sample notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
  ((SELECT id FROM auth.users LIMIT 1), 'Application Deadline Reminder', 'USC application deadline is in 14 days', 'warning'),
  ((SELECT id FROM auth.users LIMIT 1), 'Essay Review Complete', 'Your Common App essay has been reviewed', 'success'),
  ((SELECT id FROM auth.users LIMIT 1), 'New School Added', 'Stanford University has been added to your list', 'info');

-- Insert some sample essays
INSERT INTO essays (user_id, school_name, prompt_name, word_limit, deadline) VALUES
  ((SELECT id FROM auth.users LIMIT 1), 'USC', 'Why USC?', 250, '2024-01-15'),
  ((SELECT id FROM auth.users LIMIT 1), 'USC', 'Leadership Experience', 350, '2024-01-15'),
  ((SELECT id FROM auth.users LIMIT 1), 'Stanford', 'What matters to you and why?', 250, '2024-01-02'),
  ((SELECT id FROM auth.users LIMIT 1), 'UCLA', 'Personal Insight Question 1', 350, '2024-11-30');
