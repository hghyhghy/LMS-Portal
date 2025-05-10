'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar, Clock, User, Trash2, Loader2 } from 'lucide-react'
import { fetchMytasks } from '../getalltaskapi/GET/page'
type Task = {
  id: number,
  title: string,
  deadline: string,
  student_name: string,
  student_id:number
}

export default function MyTasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const searchParams = useSearchParams()
  const refresh = searchParams.get('refresh')

  useEffect(() => {
    const getAllTasks = async () => {
      try {
        const response = await fetchMytasks()
        setTasks(response)
      } catch (error: any) {
        setError(error.message || "Failed to load tasks")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    getAllTasks()
  }, [refresh])

  const handleDelete = (taskId: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      router.push(`/deletetask/${taskId}`)
    }
  }

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get relative time (e.g. "2 days left" or "Overdue by 1 day")
  const getTimeStatus = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`, urgent: true }
    } else if (diffDays === 0) {
      return { text: "Due today", warning: true }
    } else if (diffDays === 1) {
      return { text: "Due tomorrow", warning: true }
    } else {
      return { text: `${diffDays} days left`, normal: true }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Assigned Tasks</h1>
            <p className="text-gray-500 mt-1">Manage and track student assignments</p>
          </div>
          
          <button 
            onClick={() => router.push('/teacherprofile')}
            className="mt-3 md:mt-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
          >
            Add New Task
          </button>
        </div>

        {/* Main content area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Loading your tasks...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm"
            >
              Try Again
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white shadow-md rounded-xl p-10 border border-gray-200 text-center">
            <p className="text-gray-600 text-lg mb-6">No tasks assigned yet.</p>
            <button 
              onClick={() => router.push('/new-task')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
            >
              Create Your First Task
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => {
              const timeStatus = getTimeStatus(task.deadline)
              
              return (
                <div 
                  key={task.id} 
                  className="bg-white shadow-md hover:shadow-lg rounded-xl p-6 border border-gray-200 transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-gray-800 leading-tight">{task.title}</h2>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100"
                      aria-label="Delete task"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">Assigned to: <span className="font-medium">{task.student_name}</span></span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{formatDate(task.deadline)}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span 
                        className={`text-sm font-medium px-2 py-1 rounded-full ${
                          timeStatus.urgent ? 'bg-red-100 text-red-700' : 
                          timeStatus.warning ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-green-100 text-green-700'
                        }`}
                      >
                        {timeStatus.text}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t flex justify-end">
                    <button
                      onClick={() => router.push(`/evaluate/${task.id}/${task.student_id}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Grade Exam
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}