'use client'
import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from 'next/navigation';
import { getStudentTask } from "@/app/studenquestionapi/GET/page" // Assuming these paths are correct
import { submitExam } from "@/app/submitexam/POST/page" // Assuming these paths are correct
import toast from 'react-hot-toast';
// import Cookies from "js-cookie" // Cookies import was present but not used in the original code logic you provided
import { IoLogoCodepen } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function StudentExamPage() {
  const { task_id } = useParams();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [name, setName] = useState('');
  const [count, setCount] = useState<number | null>(null);
  const router = useRouter();
  // const warningCountRef = useRef(0); // This ref was initialized but not used
  const [timeLeft, setTimeLeft] = useState(600); // Initial time: 10 minutes
  const initialTime = 600; // Define initial time for progress bar calculation

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await getStudentTask(Number(task_id)) as { title: string; questions: any[], student: string ,count:number };
        setTitle(res.title);
        setQuestions(res.questions);
        setName(res.student);
        setCount(res.count);
      } catch (error) {
        console.log('Error getting the task', error);
        toast.error('Failed to load exam details.');
      } finally {
        setLoading(false);
      }
    }
    if (task_id) { // Ensure task_id is available before fetching
        fetchTask();
    }
  }, [task_id]);

  useEffect(() => {
    if (timeLeft === 0) {
        toast.error('Time is up. Submitting and redirecting...');
        handleSubmit(true); // Auto-submit when time is up
        // router.push('/middle'); // Redirect will be handled after submission
        return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, router]); // Added router to dependency array if needed by handleSubmit indirectly

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionChange = (qid: number, value: string) => {
    setAnswers({ ...answers, [qid]: value });
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    try {
      await submitExam(Number(task_id), answers);
      if (!isAutoSubmit) {
        toast.success('Exam submitted successfully!');
      }
      router.push('/studentprofile'); // Or '/middle' if that's the desired flow post-submission
    } catch (error) {
      console.error('Error submitting exam', error);
      toast.error('Failed to submit exam.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <IoLogoCodepen className="text-6xl text-blue-600 mb-4 animate-pulse" />
        <p className="text-xl font-semibold text-gray-700">Loading Exam...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md w-full p-4 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
          <IoLogoCodepen className="text-4xl text-blue-600" />
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 truncate max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl" title={title}>
            {title}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <CiUser className="text-2xl text-gray-700" />
          <span className="text-gray-700 font-medium">{name}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        
        {/* Questions Section (Left/Main) */}
        <section className="lg:flex-grow bg-white p-6 shadow-xl rounded-lg order-2 lg:order-1">
          {questions.map((q, index) => (
            <div key={q.id} className="mb-8 pb-8 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                Question {index + 1}: {q.question_text}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['option1', 'option2', 'option3', 'option4'].map((optKey) => (
                  q[optKey] && ( // Render only if option exists
                    <label
                      key={optKey}
                      className={`flex items-center p-3 border rounded-md transition-all duration-150 ease-in-out cursor-pointer
                        ${answers[q.id] === optKey 
                          ? 'bg-blue-500 border-blue-600 text-white shadow-md ring-2 ring-blue-300' 
                          : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700'}`}
                    >
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        value={optKey}
                        checked={answers[q.id] === optKey}
                        onChange={() => handleOptionChange(q.id, optKey)}
                        className="mr-3 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      {q[optKey]}
                    </label>
                  )
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Information Panel (Right/Sidebar) */}
        <aside className="lg:w-80 xl:w-96 bg-white p-6 shadow-xl rounded-lg order-1 lg:order-2 h-fit lg:sticky lg:top-24"> {/* Adjust lg:top-X based on header height */}
          <div className="flex flex-col space-y-6">
            {/* Timer */}
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Remaining Time</h2>
              <div style={{ width: 180, height: 180, margin: '0 auto' }}>
                <CircularProgressbarWithChildren
                  value={(timeLeft / initialTime) * 100} // Calculate percentage based on initial time
                  styles={buildStyles({
                    pathColor: timeLeft < 60 ? '#EF4444' : (timeLeft < 180 ? '#F59E0B' : '#3B82F6'), // Red < 1min, Orange < 3min, else Blue
                    trailColor: '#E5E7EB',
                    strokeLinecap: 'round',
                  })}
                >
                  <div className="text-sm text-gray-600 text-center">
                    <div className={`font-bold text-3xl ${timeLeft < 60 ? 'text-red-500' : (timeLeft < 180 ? 'text-amber-500' : 'text-blue-600')}`}>
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                </CircularProgressbarWithChildren>
              </div>
            </div>

            {/* Question Count */}
            <div className="text-center p-4 bg-gray-50 rounded-md">
              <h2 className="text-md font-medium text-gray-600 mb-1">
                Total Questions
              </h2>
              <p className="text-3xl font-bold text-blue-600">
                {count}
              </p>
            </div>
            
            {/* Submit Button */}
            <button
              onClick={() => handleSubmit()}
              disabled={timeLeft === 0} // Disable if time is up (auto-submit will handle)
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-150 ease-in-out font-semibold text-lg disabled:bg-gray-400"
            >
              Submit Exam
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}