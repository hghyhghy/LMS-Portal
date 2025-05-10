'use client'
import { useState, useEffect, MouseEvent as ReactMouseEvent } from "react" // Renamed to avoid conflict
import { getStudentTasks } from "@/app/studenttaskapi/page" // Ensure this path and function are correct
import { useRouter } from "next/navigation"
import { IoLogoCodepen, IoClose } from "react-icons/io5"; // Added IoClose for modal

type Task = {
    task_id: number,
    title: string,
    deadline: string,
    teacher_name: string,
    student: string // Assuming this is the student's name or identifier
}

export default function StudentTasksPage() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null) // For user-facing errors
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [modalPosition, setModalPosition] = useState<{ x: number, y: number } | null>(null) // Kept if future use planned

    const router = useRouter()

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            setError(null);
            try {
                // Assuming getStudentTasks correctly returns Task[] or throws an error
                const data = await getStudentTasks();
                if (Array.isArray(data)) {
                    setTasks(data);
                } else {
                    // Handle cases where data might not be in the expected format, if applicable
                    console.error('Unexpected data format:', data);
                    setError('Failed to load tasks due to unexpected data format.');
                }
            } catch (err) {
                console.error('Error fetching tasks:', err);
                setError('Failed to load tasks. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    // Handle closing modal
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => { // Specify MouseEvent type
            // Close if selectedTask is not null and the click is on the backdrop
            // The modal content itself has e.stopPropagation()
            if (selectedTask && (event.target as HTMLElement).id === 'modal-backdrop') {
                setSelectedTask(null);
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setSelectedTask(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [selectedTask]); // Re-run if selectedTask changes to ensure listener is correctly managed

    const handleRightClick = (
        event: ReactMouseEvent<HTMLTableRowElement, MouseEvent>, // Correct type for React event
        task: Task
    ) => {
        event.preventDefault();
        setSelectedTask(task);
        setModalPosition({ x: event.clientX, y: event.clientY }); // Position data is set
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-gray-800 shadow-2xl rounded-xl p-6 sm:p-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-400 mb-8 tracking-tight">
                    Pending Exams
                </h1>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <svg className="animate-spin h-10 w-10 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4 text-lg text-gray-300">Loading tasks...</p>
                    </div>
                ) : error ? (
                    <p className="text-center text-lg text-red-400 py-10">{error}</p>
                ) : tasks.length === 0 ? (
                    <p className="text-center text-lg text-gray-400 py-10">No tasks assigned yet.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-700">
                        <table className="w-full min-w-max">
                            <thead className="bg-gray-700">
                                <tr>
                                    {["Sl no", "Task Title", "Deadline", "Teacher", "Assigned To"].map(header => (
                                        <th key={header} className="py-3.5 px-5 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {tasks.map((task, index) => (
                                    <tr
                                        key={task.task_id}
                                        className="hover:bg-gray-700/50 transition-colors duration-150 cursor-context-menu group"
                                        onContextMenu={(e) => handleRightClick(e, task)}
                                    >
                                        <td className="py-4 px-5 text-sm text-gray-300 font-medium">{index + 1}</td>
                                        <td className="py-4 px-5 text-sm text-gray-200 font-semibold">{task.title}</td>
                                        <td className="py-4 px-5 text-sm text-gray-400">{formatDate(task.deadline)}</td>
                                        <td className="py-4 px-5 text-sm text-gray-300">{task.teacher_name}</td>
                                        <td className="py-4 px-5 text-sm text-gray-300">{task.student}</td>
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
                    id="modal-backdrop" // Added ID for specific backdrop click detection
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out animate-fadeIn"
                    // onClick={() => setSelectedTask(null)} // This is now handled by useEffect with ID check
                >
                    <div
                        className="bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-md flex flex-col items-center relative transform transition-all duration-300 ease-in-out animate-scaleUp"
                        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
                    >
                        <button
                            onClick={() => setSelectedTask(null)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-700"
                            aria-label="Close modal"
                        >
                            <IoClose size={24} />
                        </button>

                        <div className="p-3 bg-blue-500/20 rounded-full mb-5 text-blue-400">
                            <IoLogoCodepen size={48} />
                        </div>

                        <h2 className="text-2xl font-semibold mb-2 text-white text-center">
                            {selectedTask.title}
                        </h2>
                        <p className="text-sm text-gray-400 mb-6 text-center">
                            Ready to start this exam?
                        </p>

                        <button
                            onClick={() => {
                                router.push(`/startexam/${selectedTask.task_id}`);
                                setSelectedTask(null); // Close modal after initiating navigation
                            }}
                            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-150 ease-in-out"
                        >
                            Start Exam
                        </button>
                        <p className="text-xs text-gray-500 mt-4 text-center">
                            Deadline: {formatDate(selectedTask.deadline)}
                        </p>
                    </div>
                </div>
            )}
             {/* Add keyframes for animation in your global CSS or tailwind.config.js */}
             {/*
                // tailwind.config.js
                theme: {
                    extend: {
                        animation: {
                            fadeIn: 'fadeIn 0.3s ease-out',
                            scaleUp: 'scaleUp 0.3s ease-out',
                        },
                        keyframes: {
                            fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
                            scaleUp: { '0%': { opacity: 0, transform: 'scale(0.95)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
                        },
                    },
                },
            */}
        </div>
    );
}