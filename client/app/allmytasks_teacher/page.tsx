
'use client'
import { useState,useEffect } from "react"
import { fetchMytasks } from "../getalltaskapi/GET/page"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"

type  Task  = {
    id:number,
    title:string,
    deadline:string,
    student_name:string
}

export  default  function  MyTasksPage() {
    const router=   useRouter()
    const [tasks, setTasks] = useState<Task[]> ([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const searchParams = useSearchParams()
    const refresh = searchParams.get('refresh')

    useEffect(() =>  {

        const getalltasks =  async () =>  {
            try {
                 const response  =  await  fetchMytasks()
                
                 setTasks(response)
            } catch (error:any) {
                setError(error)
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        getalltasks()
    },[refresh])

    return (
        <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Assigned Tasks</h1>
  
        {loading ? (
          <p className="text-gray-600">Loading tasks...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-600">No tasks assigned yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white shadow-md rounded-xl p-4 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">{task.title}</h2>
                <p className="text-sm text-gray-600 mb-1">Assigned to: <span className="font-medium">{task.student_name}</span></p>
                <p className="text-sm text-gray-500">Deadline: {new Date(task.deadline).toLocaleString()}</p>
                <button
                onClick={() => router.push(`/deletetask/${task.id}`) }
                >
                    Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
}