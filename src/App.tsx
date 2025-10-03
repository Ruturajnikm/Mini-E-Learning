import { useState } from 'react';
import HomePage from './components/HomePage';
import CourseDetail from './components/CourseDetail';

function App() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  return (
    <>
      {selectedCourseId ? (
        <CourseDetail
          courseId={selectedCourseId}
          onBack={() => setSelectedCourseId(null)}
        />
      ) : (
        <HomePage onSelectCourse={setSelectedCourseId} />
      )}
    </>
  );
}

export default App;
