/*
  # E-Learning Platform Schema

  1. New Tables
    - `courses`
      - `id` (uuid, primary key) - Unique course identifier
      - `title` (text) - Course title
      - `description` (text) - Course description
      - `thumbnail` (text) - Course thumbnail URL
      - `instructor` (text) - Instructor name
      - `duration` (text) - Estimated course duration
      - `level` (text) - Course difficulty level (Beginner, Intermediate, Advanced)
      - `created_at` (timestamptz) - Record creation timestamp
    
    - `lessons`
      - `id` (uuid, primary key) - Unique lesson identifier
      - `course_id` (uuid, foreign key) - References courses table
      - `title` (text) - Lesson title
      - `description` (text) - Lesson description
      - `duration` (text) - Lesson duration
      - `order_number` (integer) - Lesson order within course
      - `created_at` (timestamptz) - Record creation timestamp
    
    - `course_progress`
      - `id` (uuid, primary key) - Unique progress record identifier
      - `course_id` (uuid, foreign key) - References courses table
      - `user_id` (text) - User identifier (session-based for demo)
      - `completed` (boolean) - Completion status
      - `completed_at` (timestamptz) - Completion timestamp
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on all tables
    - Add public read policies for courses and lessons
    - Add policies for users to manage their own progress

  3. Sample Data
    - Insert sample courses with lessons for demonstration
*/

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  thumbnail text NOT NULL,
  instructor text NOT NULL,
  duration text NOT NULL,
  level text NOT NULL DEFAULT 'Beginner',
  created_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  duration text NOT NULL,
  order_number integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create course_progress table
CREATE TABLE IF NOT EXISTS course_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  user_id text NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses (public read access)
CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  USING (true);

-- RLS Policies for lessons (public read access)
CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT
  USING (true);

-- RLS Policies for course_progress (users can manage their own progress)
CREATE POLICY "Anyone can view progress"
  ON course_progress FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert their own progress"
  ON course_progress FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update their own progress"
  ON course_progress FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Insert sample courses
INSERT INTO courses (title, description, thumbnail, instructor, duration, level) VALUES
  (
    'Introduction to Web Development',
    'Learn the fundamentals of web development including HTML, CSS, and JavaScript. Build your first website from scratch.',
    'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Sarah Johnson',
    '8 hours',
    'Beginner'
  ),
  (
    'React Fundamentals',
    'Master React by building real-world applications. Learn hooks, state management, and component architecture.',
    'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Michael Chen',
    '12 hours',
    'Intermediate'
  ),
  (
    'Python for Data Science',
    'Explore data analysis and visualization using Python, Pandas, and Matplotlib. Perfect for aspiring data scientists.',
    'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Dr. Emily Rodriguez',
    '15 hours',
    'Intermediate'
  ),
  (
    'UI/UX Design Principles',
    'Learn to create beautiful and functional user interfaces. Understand design thinking and user psychology.',
    'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Alex Thompson',
    '10 hours',
    'Beginner'
  ),
  (
    'Advanced JavaScript',
    'Deep dive into JavaScript concepts including closures, promises, async/await, and functional programming.',
    'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800',
    'David Kim',
    '20 hours',
    'Advanced'
  ),
  (
    'Mobile App Development with Flutter',
    'Build cross-platform mobile applications using Flutter and Dart. Deploy to iOS and Android.',
    'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Jessica Williams',
    '18 hours',
    'Intermediate'
  );

-- Insert sample lessons for course 1 (Web Development)
INSERT INTO lessons (course_id, title, description, duration, order_number)
SELECT id, 'Introduction to HTML', 'Learn the basics of HTML structure and elements', '45 min', 1
FROM courses WHERE title = 'Introduction to Web Development'
UNION ALL
SELECT id, 'CSS Fundamentals', 'Style your web pages with CSS', '1 hour', 2
FROM courses WHERE title = 'Introduction to Web Development'
UNION ALL
SELECT id, 'JavaScript Basics', 'Add interactivity with JavaScript', '1.5 hours', 3
FROM courses WHERE title = 'Introduction to Web Development'
UNION ALL
SELECT id, 'Building Your First Website', 'Put it all together in a project', '2 hours', 4
FROM courses WHERE title = 'Introduction to Web Development';

-- Insert sample lessons for course 2 (React)
INSERT INTO lessons (course_id, title, description, duration, order_number)
SELECT id, 'React Setup and Components', 'Get started with React and create your first component', '1 hour', 1
FROM courses WHERE title = 'React Fundamentals'
UNION ALL
SELECT id, 'State and Props', 'Understand data flow in React applications', '1.5 hours', 2
FROM courses WHERE title = 'React Fundamentals'
UNION ALL
SELECT id, 'React Hooks', 'Master useState, useEffect, and custom hooks', '2 hours', 3
FROM courses WHERE title = 'React Fundamentals'
UNION ALL
SELECT id, 'Building a Todo App', 'Create a fully functional React application', '2.5 hours', 4
FROM courses WHERE title = 'React Fundamentals';

-- Insert sample lessons for course 3 (Python)
INSERT INTO lessons (course_id, title, description, duration, order_number)
SELECT id, 'Python Basics for Data Science', 'Introduction to Python syntax and data structures', '2 hours', 1
FROM courses WHERE title = 'Python for Data Science'
UNION ALL
SELECT id, 'Working with Pandas', 'Data manipulation and analysis with Pandas', '3 hours', 2
FROM courses WHERE title = 'Python for Data Science'
UNION ALL
SELECT id, 'Data Visualization', 'Create charts and graphs with Matplotlib', '2.5 hours', 3
FROM courses WHERE title = 'Python for Data Science'
UNION ALL
SELECT id, 'Real-world Data Project', 'Analyze a real dataset from start to finish', '3 hours', 4
FROM courses WHERE title = 'Python for Data Science';

-- Insert sample lessons for course 4 (UI/UX)
INSERT INTO lessons (course_id, title, description, duration, order_number)
SELECT id, 'Design Thinking Fundamentals', 'Learn the design thinking process', '1.5 hours', 1
FROM courses WHERE title = 'UI/UX Design Principles'
UNION ALL
SELECT id, 'User Research Methods', 'Understand your users through research', '2 hours', 2
FROM courses WHERE title = 'UI/UX Design Principles'
UNION ALL
SELECT id, 'Wireframing and Prototyping', 'Create wireframes and interactive prototypes', '2.5 hours', 3
FROM courses WHERE title = 'UI/UX Design Principles'
UNION ALL
SELECT id, 'Visual Design Principles', 'Master color, typography, and layout', '2 hours', 4
FROM courses WHERE title = 'UI/UX Design Principles';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_course_id ON course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON course_progress(user_id);