import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Clock, CheckCircle, Circle, Award } from 'lucide-react';
import { supabase, Course, Lesson, CourseProgress } from '../lib/supabase';

type CourseDetailProps = {
  courseId: string;
  onBack: () => void;
};

export default function CourseDetail({ courseId, onBack }: CourseDetailProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [userId] = useState(() => localStorage.getItem('user_id') || '');

  useEffect(() => {
    loadCourseDetails();
  }, [courseId]);

  const loadCourseDetails = async () => {
    try {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .maybeSingle();

      if (courseError) throw courseError;

      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_number', { ascending: true });

      if (lessonsError) throw lessonsError;

      const { data: progressData, error: progressError } = await supabase
        .from('course_progress')
        .select('*')
        .eq('course_id', courseId)
        .eq('user_id', userId)
        .maybeSingle();

      if (progressError) throw progressError;

      setCourse(courseData);
      setLessons(lessonsData || []);
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!course || completing) return;

    setCompleting(true);
    try {
      if (progress?.completed) {
        const { error } = await supabase
          .from('course_progress')
          .update({
            completed: false,
            completed_at: null,
          })
          .eq('id', progress.id);

        if (error) throw error;

        setProgress({
          ...progress,
          completed: false,
          completed_at: null,
        });
      } else {
        if (progress) {
          const { error } = await supabase
            .from('course_progress')
            .update({
              completed: true,
              completed_at: new Date().toISOString(),
            })
            .eq('id', progress.id);

          if (error) throw error;

          setProgress({
            ...progress,
            completed: true,
            completed_at: new Date().toISOString(),
          });
        } else {
          const { data, error } = await supabase
            .from('course_progress')
            .insert({
              course_id: courseId,
              user_id: userId,
              completed: true,
              completed_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (error) throw error;
          setProgress(data);
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-lg">Loading course details...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-lg">Course not found</div>
      </div>
    );
  }

  const isCompleted = progress?.completed || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Courses</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-72">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-6 h-6" />
                <span className="text-sm font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  {course.level}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
              <div className="flex items-center gap-4 text-sm">
                <span>Instructor: {course.instructor}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">About this course</h2>
            <p className="text-slate-600 text-lg mb-6">{course.description}</p>

            {isCompleted && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                <Award className="w-6 h-6 text-emerald-600" />
                <div>
                  <p className="font-semibold text-emerald-900">Congratulations!</p>
                  <p className="text-emerald-700 text-sm">You've completed this course</p>
                </div>
              </div>
            )}

            <button
              onClick={handleMarkComplete}
              disabled={completing}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                isCompleted
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {completing ? (
                'Updating...'
              ) : isCompleted ? (
                <>
                  <CheckCircle className="w-6 h-6" />
                  Mark as Incomplete
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  Mark as Complete
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Lessons</h2>
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="border border-slate-200 rounded-lg p-6 hover:border-slate-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 group-hover:text-slate-400 transition-colors" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                        {index + 1}. {lesson.title}
                      </h3>
                      <span className="text-sm text-slate-500 flex items-center gap-1 whitespace-nowrap ml-4">
                        <Clock className="w-4 h-4" />
                        {lesson.duration}
                      </span>
                    </div>
                    <p className="text-slate-600">{lesson.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
