'use client'

import { useState } from "react"
import { useParams } from "next/navigation"
import { assignTask } from "@/app/assignmentapi/POST/page"

type Question = {
  question_text: string,
  option1: string,
  option2: string,
  option3: string,
  option4: string,
  correct_answer: string
}

export default function AssignTaskPage() {
  const { student_id } = useParams()
  const [title, setTitle] = useState("")
  const [deadline, setDeadline] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleQuestionChange = (index: number, field: keyof Question, value: string) => {
    const updated = [...questions]
    updated[index][field] = value
    setQuestions(updated)
  }

  const addQuestions = () => {
    setQuestions([...questions, { question_text: '', option1: '', option2: '', option3: '', option4: '', correct_answer: '' }])
  }

  const removeQuestion = (index: number) => {
    const updated = [...questions]
    updated.splice(index, 1)
    setQuestions(updated)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const payload = { title, deadline, questions }
      const response = await assignTask(Number(student_id), payload)
      setMessage(response)
      setLoading(false)
    } catch (error: any) {
      console.log(error)
      setMessage('Error posting assignment')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-indigo-800 mb-6 border-b pb-4">
            Assign Task to Student {student_id}
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignment Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter assignment title"
                className="border border-gray-300 rounded-lg p-3 w-full outline-none text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Submission Deadline
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full outline-none text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Questions
          </h2>

          {questions.length === 0 && (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No questions added yet. Click the button below to add your first question.</p>
            </div>
          )}

          {questions.map((q, index) => (
            <div
              key={index}
              className="mb-8 border border-gray-200 p-6 rounded-lg bg-gray-50 relative"
            >
              <button
                onClick={() => removeQuestion(index)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
                title="Remove question"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <div className="font-medium text-indigo-700 mb-4">Question {index + 1}</div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                <input
                  type="text"
                  placeholder="Enter your question"
                  value={q.question_text}
                  onChange={(e) => handleQuestionChange(index, 'question_text', e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 w-full text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['option1', 'option2', 'option3', 'option4'].map((field, optionIndex) => (
                  <div key={field} className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Option {optionIndex + 1}
                    </label>
                    <input
                      type="text"
                      value={q[field as keyof Question]}
                      placeholder={`Option ${optionIndex + 1}`}
                      onChange={(e) => handleQuestionChange(index, field as keyof Question, e.target.value)}
                      className="border border-gray-300 rounded-lg p-3 w-full text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-indigo-600">Correct Answer</span>
                </label>
                <input
                  type="text"
                  value={q.correct_answer}
                  placeholder="Enter the correct answer"
                  onChange={(e) => handleQuestionChange(index, 'correct_answer', e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 w-full text-black bg-green-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                />
              </div>
            </div>
          ))}

          <button
            onClick={addQuestions}
            className="flex items-center justify-center w-full md:w-auto px-6 py-3 bg-indigo-100 text-indigo-700 font-medium rounded-lg hover:bg-indigo-200 transition mb-6 mt-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Another Question
          </button>

          <button 
            onClick={handleSubmit} 
            disabled={loading || questions.length === 0 || !title || !deadline}
            className={`w-full py-3 px-6 rounded-lg font-medium text-white ${
              loading || questions.length === 0 || !title || !deadline 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 shadow-md hover:shadow-lg transition'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Submit Assignment
              </span>
            )}
          </button>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
