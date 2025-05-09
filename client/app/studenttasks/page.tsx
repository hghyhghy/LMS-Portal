'use client'
import { useState, useEffect } from "react"
import { getStudentTasks } from "@/app/studenttaskapi/page"
import { useRouter } from "next/navigation"
import { IoLogoCodepen } from "react-icons/io";

type Task = {
    task_id: number,
    title: string,
    deadline: string,
    teacher_name: string,
    student: string
}

export default function StudentTasksPage() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [modalPosition, setModalPosition] = useState<{ x: number, y: number } | null>(null)

    const router = useRouter()

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getStudentTasks() as Task[]
                setTasks(data)
            } catch (error) {
                console.error('Error fetching tasks', error)
            } finally {
                setLoading(false)
            }
        };
        fetchTasks()
    }, [])

    // Handle closing modal on click outside or Escape
    useEffect(() => {
        const handleClick = () => setSelectedTask(null)
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedTask(null)
        }
        document.addEventListener("click", handleClick)
        document.addEventListener("keydown", handleEscape)
        return () => {
            document.removeEventListener("click", handleClick)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [])

    const handleRightClick = (
        event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
        task: Task
    ) => {
        event.preventDefault()
        setSelectedTask(task)
        setModalPosition({ x: event.clientX, y: event.clientY })
    }

    return (
        <div className="min-h-screen py-10 px-4 bg-[#151B23] relative">
            <div className="w-full mx-auto">
                <h1 className="text-2xl font-normal text-center text-blue-300 mb-8">PENDING EXAMS</h1>

                {loading ? (
                    <p className="text-center text-lg text-gray-400">Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <p className="text-center text-lg text-red-500">No tasks assigned yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white shadow-md rounded overflow-hidden">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left">Sl no</th>
                                    <th className="py-3 px-4 text-left">Task Title</th>
                                    <th className="py-3 px-4 text-left">Deadline</th>
                                    <th className="py-3 px-4 text-left">Teacher</th>
                                    <th className="py-3 px-4 text-left">Assigned To</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {tasks.map((task, index) => (
                                    <tr
                                        key={task.task_id}
                                        className="border-b hover:bg-blue-50 transition cursor-context-menu"
                                        onContextMenu={(e) => handleRightClick(e, task)}
                                    >
                                        <td className="py-3 px-4 font-medium">{index + 1}</td>
                                        <td className="py-3 px-4">{task.title}</td>
                                        <td className="py-3 px-4">{new Date(task.deadline).toLocaleString()}</td>
                                        <td className="py-3 px-4">{task.teacher_name}</td>
                                        <td className="py-3 px-4">{task.student}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedTask && (
    <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center"
        onClick={() => setSelectedTask(null)} // Close on background click
    >
        <div
            className="bg-[#151B23] rounded-lg shadow-lg p-6 w-60 h-60 flex flex-col items-center  justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
        >
            <h1 className=" text-5xl flex items-center justify-center mb-2">
                <IoLogoCodepen/>
            </h1>
            <h2 className="text-lg font-semibold mb-3 text-blue-400">Start Exam</h2>

            <button
                onClick={() => {
                    setSelectedTask(null) // Close modal before navigation (optional)
                    router.push(`/startexam/${selectedTask.task_id}`)
                }}
                className="w-full bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
                Start Exam
            </button>
        </div>
    </div>
)}

        </div>
    )
}
