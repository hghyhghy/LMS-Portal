'use client'
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getGradedTask } from "@/app/gradeapis/GET/page"
import { CheckCircle, XCircle, Clock, Award, BookOpen, User, Calendar } from "lucide-react"
import { postGradedMarks } from "@/app/getalltaskapi/POST/page"
type Question = {
  id: number,
  question_text: string,
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_answer: string;
}

type AnswerData = {
  question_id: number;
  question: Question;
  selected_answer: string;
  submitted_at: string;
  marks: number | null;
  student: string
}

export default function GradedTaskPage() {
  const { id, student_id } = useParams()
  const [answers, setAnswers] = useState<AnswerData[]>([]);
  const [gradingMarks, setGradingMarks] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [examName, setExamName] = useState("Assessment");

  const totalEarned = answers.reduce((sum, answer) => sum + (answer.marks || 0), 0);
  const totalPossible = answers.length;
  const percentage = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;

  const getGrade = (percent: number) => {
    if (percent >= 90) return { letter: "A", color: "text-emerald-600" };
    if (percent >= 80) return { letter: "B", color: "text-blue-600" };
    if (percent >= 70) return { letter: "C", color: "text-yellow-600" };
    if (percent >= 60) return { letter: "D", color: "text-orange-500" };
    return { letter: "F", color: "text-red-500" };
  };

  const grade = getGrade(percentage);

  useEffect(() => {
    const fetchGraded = async () => {
      try {
        const res = await getGradedTask(Number(id), Number(student_id)) as { data: AnswerData[] };
        setAnswers(res.data || []);
        setExamName("Mathematics Final Exam");

        const initialMarks: { [key: string]: number } = {};
        res.data.forEach(ans => {
          if (ans.marks !== null) {
            initialMarks[String(ans.question_id)] = ans.marks;
          }
        });
        setGradingMarks(initialMarks);
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchGraded();
  }, [id, student_id]);

  const handleMarksChange = (questionId: number, marks: number) => {
    setGradingMarks(prev => ({
      ...prev,
      [String(questionId)]: marks
    }));
  };
const handleSubmitGrading = async () => {
  setSubmitting(true);
  setSubmitMessage("");

  try {
    const gradings = {
      grading: Object.fromEntries(
        Object.entries(gradingMarks).map(([qid, marks]) => [String(qid), marks])
      ),
    };

    // You need to extract the marks separately from gradingMarks
    const marks = Object.fromEntries(
      Object.entries(gradingMarks).map(([qid, marks]) => [String(qid), marks])
    );

    await postGradedMarks(Number(id), Number(student_id), gradings, marks);

    setSubmitMessage("Grading submitted successfully!");
  } catch (error) {
    console.error("Grading failed:", error);
    setSubmitMessage("Failed to submit grading.");
  } finally {
    setSubmitting(false);
  }
};


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-indigo-50">
        <div className="w-16 h-16 border-t-4 border-indigo-600 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-800 text-lg">Loading assessment results...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-t-4 border-indigo-500">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
            <h1 className="text-2xl font-bold text-indigo-800">
              <BookOpen className="inline mr-2 text-indigo-600" size={24} />
              {examName}
            </h1>
            <div className="flex items-center bg-indigo-100 px-3 py-1 rounded-full">
              <Calendar className="text-indigo-500 mr-2" size={18} />
              <span className="text-sm text-indigo-800">
                {answers.length > 0 ? formatDate(answers[0].submitted_at) : 'No submission date'}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-2">
                <User className="text-indigo-500 mr-2" size={18} />
                <span className="text-indigo-700 font-medium">Student:</span>
                {answers.length > 0 && (
                  <span className="ml-2 text-indigo-900">{answers[0].student}</span>
                )}
              </div>
              <div className="flex items-center">
                <Award className="text-indigo-500 mr-2" size={18} />
                <span className="text-indigo-700 font-medium">ID:</span>
                <span className="ml-2 text-indigo-900">{student_id}</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-indigo-200">
              <div className="flex justify-between mb-2">
                <span className="text-indigo-700 font-medium">Score:</span>
                <span className="text-indigo-900 font-bold">{totalEarned} / {totalPossible}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-indigo-700 font-medium">Percentage:</span>
                <span className="text-indigo-900 font-bold">{percentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-700 font-medium">Grade:</span>
                <span className={`font-bold text-2xl ${grade.color}`}>{grade.letter}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          {answers.map((ans, index) => {
            const selectedKey = ans.selected_answer as keyof Question;

            return (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-indigo-400">
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-100 to-blue-50 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-indigo-800">Question {index + 1}</h2>
                  <div className="flex items-center">
                    {ans.marks !== null ? (
                      <>
                        {ans.marks > 0 ? (
                          <CheckCircle className="text-emerald-500 mr-2" size={20} />
                        ) : (
                          <XCircle className="text-red-500 mr-2" size={20} />
                        )}
                        <span className={ans.marks > 0 ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}>
                          {ans.marks} / 1
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="text-yellow-500 mr-2" size={20} />
                        <span className="text-yellow-600 font-medium">Pending</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-indigo-900 mb-4">{ans.question.question_text}</p>
                  <div className="space-y-2 mb-4">
                    {['option1', 'option2', 'option3', 'option4'].map((option, optIdx) => {
                      const key = option as keyof Question;
                      const isSelected = key === selectedKey;
                      const isCorrect = ans.question[key] === ans.question.correct_answer;

                      let bgColor = "bg-white";
                      let borderColor = "border-gray-200";

                      if (isSelected && isCorrect) {
                        bgColor = "bg-emerald-50";
                        borderColor = "border-emerald-300";
                      } else if (isSelected && !isCorrect) {
                        bgColor = "bg-red-50";
                        borderColor = "border-red-300";
                      } else if (isCorrect) {
                        bgColor = "bg-emerald-50";
                        borderColor = "border-emerald-300";
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 border ${borderColor} rounded-md ${bgColor} flex items-center`}
                        >
                          <div className="w-6 h-6 flex items-center justify-center bg-indigo-100 text-indigo-800 border border-indigo-300 rounded-full mr-3">
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span className="text-indigo-800">{ans.question[key]}</span>
                          {isSelected && (
                            <span className="ml-auto text-sm font-medium">
                              {isCorrect ? (
                                <span className="text-emerald-600">Your answer (correct)</span>
                              ) : (
                                <span className="text-red-500">Your answer</span>
                              )}
                            </span>
                          )}
                          {!isSelected && isCorrect && (
                            <span className="ml-auto text-sm font-medium text-emerald-600">
                              Correct answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Grading input */}
                  <div className="mt-3">
                    <label className="block text-indigo-600 font-medium mb-1">Assign Marks:</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={gradingMarks[String(ans.question_id)] ?? ""}
                      onChange={(e) => handleMarksChange(ans.question_id, Number(e.target.value))}
                      className="border border-indigo-300 rounded-md px-3 py-1 w-20 text-black"
                    />
                  </div>

                  <div className="text-sm text-indigo-500 mt-2">
                    Submitted: {formatDate(ans.submitted_at)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Grading Submission */}
        <div className="mt-8 flex flex-col items-center">
          <button
            onClick={handleSubmitGrading}
            disabled={submitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg shadow"
          >
            {submitting ? "Submitting..." : "Submit Grading"}
          </button>
          {submitMessage && (
            <p className="mt-3 text-sm text-indigo-700">{submitMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
