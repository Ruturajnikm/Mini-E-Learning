# LearnHub - Mini E-Learning Platform

A modern, production-ready e-learning platform built with React, TypeScript, Tailwind CSS, and Supabase. LearnHub provides an intuitive interface for browsing courses, viewing lessons, and tracking learning progress.

## Features

### Home Page
- Browse a curated collection of courses across multiple topics
- Visual course cards with high-quality thumbnails
- Course metadata including instructor, duration, and difficulty level
- Color-coded level badges (Beginner, Intermediate, Advanced)
- Completion status indicators for finished courses
- Smooth hover effects and animations
- Responsive grid layout for all screen sizes

### Course Detail Page
- Immersive course header with full-width banner
- Comprehensive course description and information
- Complete lesson listing with titles and descriptions
- Lesson duration indicators
- Visual progress tracking with checkmarks
- One-click course completion toggle
- Congratulations banner for completed courses
- Easy navigation back to course catalog

### Technical Features
- Real-time data persistence with Supabase
- User session management with localStorage
- Optimistic UI updates for instant feedback
- Responsive design for mobile, tablet, and desktop
- Type-safe development with TypeScript
- Clean component architecture
- Professional hover states and transitions

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Ready for Netlify, Vercel, or any static host

## Database Schema

### Tables

**courses**
- `id` (uuid) - Primary key
- `title` (text) - Course title
- `description` (text) - Course description
- `thumbnail` (text) - Course image URL
- `instructor` (text) - Instructor name
- `duration` (text) - Course duration
- `level` (text) - Difficulty level
- `created_at` (timestamptz) - Creation timestamp

**lessons**
- `id` (uuid) - Primary key
- `course_id` (uuid) - Foreign key to courses
- `title` (text) - Lesson title
- `description` (text) - Lesson description
- `duration` (text) - Lesson duration
- `order_number` (integer) - Lesson sequence
- `created_at` (timestamptz) - Creation timestamp

**course_progress**
- `id` (uuid) - Primary key
- `course_id` (uuid) - Foreign key to courses
- `user_id` (text) - User session identifier
- `completed` (boolean) - Completion status
- `completed_at` (timestamptz) - Completion timestamp
- `created_at` (timestamptz) - Creation timestamp

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works great)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd project
```

2. Install dependencies
```bash
npm install
```

3. Environment variables are already configured in `.env`
```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

4. Database is already set up with sample courses

5. Start the development server
```bash
npm run dev
```

6. Open your browser to the URL shown in the terminal

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to deploy.

## Project Structure

```
src/
├── components/
│   ├── HomePage.tsx          # Main course catalog page
│   └── CourseDetail.tsx      # Individual course page
├── lib/
│   └── supabase.ts           # Supabase client and types
├── App.tsx                    # Root component with routing
├── main.tsx                   # Application entry point
└── index.css                  # Global styles
```

## Sample Courses

The platform comes pre-loaded with 6 courses:

1. **Introduction to Web Development** - Beginner (8 hours)
2. **React Fundamentals** - Intermediate (12 hours)
3. **Python for Data Science** - Intermediate (15 hours)
4. **UI/UX Design Principles** - Beginner (10 hours)
5. **Advanced JavaScript** - Advanced (20 hours)
6. **Mobile App Development with Flutter** - Intermediate (18 hours)

Each course includes 4 detailed lessons with descriptions and durations.

## User Experience

### Progress Tracking
- Each user gets a unique session ID stored in localStorage
- Progress persists across browser sessions
- Completion status syncs in real-time
- Users can mark courses as complete or incomplete

### Design Philosophy
- Clean, modern aesthetic with professional styling
- Subtle animations enhance without distracting
- Consistent color palette for visual harmony
- Generous white space for improved readability
- Accessible color contrasts throughout

## Customization

### Adding New Courses

You can add courses directly to the Supabase database:

```sql
INSERT INTO courses (title, description, thumbnail, instructor, duration, level)
VALUES (
  'Your Course Title',
  'Course description',
  'https://image-url.com/image.jpg',
  'Instructor Name',
  '10 hours',
  'Beginner'
);
```

### Adding Lessons

```sql
INSERT INTO lessons (course_id, title, description, duration, order_number)
VALUES (
  '<course-id>',
  'Lesson Title',
  'Lesson description',
  '1 hour',
  1
);
```

## Security

- Row Level Security (RLS) enabled on all tables
- Public read access for courses and lessons
- User-specific progress tracking with isolation
- No sensitive data exposed to client
- Secure Supabase connection with environment variables

## Performance

- Optimized bundle size with tree-shaking
- Lazy loading of course images
- Efficient database queries with proper indexing
- Minimal re-renders with React best practices
- Fast initial load with Vite

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Acknowledgments

- Course images from [Pexels](https://www.pexels.com)
- Icons by [Lucide](https://lucide.dev)
- Hosted database by [Supabase](https://supabase.com)

---

Built with React, TypeScript, and Tailwind CSS
