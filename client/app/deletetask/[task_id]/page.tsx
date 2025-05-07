
'use client'
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { useState,useEffect } from "react"
import { deleteTask } from "@/app/assignmentapi/DELETE/page"

export  default  function DeleteTaskPage() {
    const {task_id} =  useParams()
    const router=  useRouter()
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleDelete =  async( ) =>  {
        try {
            setLoading(true)
            const response  =  await  deleteTask(Number(task_id))
            setMessage(response)
            setTimeout(() => router.push('/allmytasks_teacher?refresh=true'),500)

        } catch (error:any) {
            setError(error)
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-semibold mb-4 text-red-600">Are you sure you want to delete this task?</h2>
      <div className="flex gap-4">
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Yes, Delete'}
        </button>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
    )
  
}