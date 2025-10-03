import { useState, useEffect } from 'react';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';
import { supabase, Course, CourseProgress } from '../lib/supabase';

type HomePageProps = {
  onSelectCourse: (courseId: string) => void;
};

export default function HomePage({ onSelectCourse }: HomePageProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Map<string, CourseProgress>>(new Map());
  const [loading, setLoading] = useState(true);
  const [userId] = useState(() => {
    let id = localStorage.getItem('user_id');
    if (!id) {
      id = `user_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_id', id);
    }
    return id;
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true });

      if (coursesError) throw coursesError;

      const { data: progressData, error: progressError } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', userId);

      if (progressError) throw progressError;

      setCourses(coursesData || []);

      const progressMap = new Map<string, CourseProgress>();
      progressData?.forEach(p => {
        progressMap.set(p.course_id, p);
      });
      setProgress(progressMap);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-emerald-100 text-emerald-700';
      case 'intermediate':
        return 'bg-blue-100 text-blue-700';
      case 'advanced':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-lg">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-slate-700" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">LearnHub</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover courses to advance your skills and achieve your learning goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const courseProgress = progress.get(course.id);
            const isCompleted = courseProgress?.completed || false;

            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course.id)}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group transform hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {isCompleted && (
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Completed
                    </div>
                  )}
                  <div className={`absolute top-4 left-4 ${getLevelColor(course.level)} px-3 py-1 rounded-full text-sm font-semibold`}>
                    {course.level}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{course.instructor}</span>
                    </div>
                  </div>

                  <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors duration-200">
                    {isCompleted ? 'Review Course' : 'Start Learning'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
