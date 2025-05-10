'use client'
import { useEffect, useState } from "react"
import { fetchProfile, type Profile } from "../api/GET/get"
import { updateProfile } from "../api/UPDATE/update"
import { deleteProfile } from '../api/DELETE/delete'
import { verifyPasskey } from "../verifyapi/verify"
import { useRouter } from "next/navigation"
import { fetchStudents, type Student } from "../enrolledstudentapi/GET/get"
import { removeStudent } from "../removeregisteredstudents/DELETE/remove"
import { IoLogoCodepen } from "react-icons/io"
import { FaUserGraduate, FaUserTie, FaListAlt, FaLock } from "react-icons/fa"
import { HiOutlineAcademicCap } from "react-icons/hi"
import { RiMoneyDollarCircleLine } from "react-icons/ri"
import { MdAccessTime, MdOutlineSubject } from "react-icons/md"

export default function Profilepage() {
  // Add animation keyframes 
  const animationKeyframes = `
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `;

  const router = useRouter()
  const [profile, setProfile] = useState<Profile>({
    name: "",
    subject: "",
    fees: null,
    duration: ""
  })
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [adminKey, setAdminKey] = useState<number>(0)
  const [verifyError, setVerifyError] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [activeTab, setActiveTab] = useState<'profile' | 'students' | 'Tasks'>('profile')
  const [studentMessage, setStudentMessage] = useState("")
  const [availableSeats, setAvailableSeats] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)

  const handleVerify = async () => {
    try {
      const msg = await verifyPasskey(adminKey)
      setVerifyError("")
      setIsVerified(true)
      await loadProfile()
      await loadStudents()
    } catch (error: any) {
      setVerifyError(error.message)
    }
  }

  const loadProfile = async () => {
    setLoading(true)
    try {
      const data = await fetchProfile()
      setProfile(data)
    } catch (error) {
      console.log(error)
      setMessage('Error loading profile')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      const msg = await updateProfile(profile)
      setMessage(msg)
      await fetchProfile()
    } catch (error) {
      console.log(error)
      setMessage('Error updating the profile')
    } finally {
      setUpdating(false)
    }
  }

  const loadStudents = async () => {
    try {
      const data = await fetchStudents()
      setStudents(data.students)
      setAvailableSeats(data.Available_Seats)
    } catch (error: any) {
      setStudentMessage(error.message)
    }
  }

  const handleDelete = async () => {
    try {
      const msg = await deleteProfile()
      setMessage(msg)
      setDeleteConfirmation(false)
    } catch (error) {
      console.log(error)
      setMessage('Error deleting profile')
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  if (!isVerified) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-gray-900 flex justify-center items-center z-50">
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-2xl w-96 border border-white border-opacity-20">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <FaLock className="text-white text-3xl" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-6 text-center text-white">
            Admin Authentication
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Enter Admin Passkey
              </label>
              <input
                type="password"
                value={adminKey ? adminKey : ""}
                onChange={(e) => setAdminKey(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="••••••"
              />
            </div>
            {verifyError && (
              <p className="text-red-400 text-sm">{verifyError}</p>
            )}
            <button
              onClick={handleVerify}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200 ease-in-out transform hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Verify Access
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-sm text-white">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <HiOutlineAcademicCap className="text-blue-400 text-3xl" />
            <h1 className="text-xl font-bold">Teacher Portal</h1>
          </div>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <button
                className={`flex items-center w-full px-4 py-3 rounded-lg transition duration-200 ${
                  activeTab === 'profile'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <FaUserTie className="mr-3" />
                <span>Profile</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full px-4 py-3 rounded-lg transition duration-200 ${
                  activeTab === 'students'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab('students')}
              >
                <FaUserGraduate className="mr-3" />
                <span>Students</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full px-4 py-3 rounded-lg transition duration-200 ${
                  activeTab === 'Tasks'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab('Tasks')}
              >
                <FaListAlt className="mr-3" />
                <span>Tasks</span>
              </button>
            </li>
          </ul>
        </nav>
        <div className="p-4 mt-auto border-t border-gray-800">
          <button
            onClick={() => router.push('/middle')}
            className="w-full flex items-center justify-center py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            {activeTab === 'profile' && 'Teacher Profile'}
            {activeTab === 'students' && 'Enrolled Students'}
            {activeTab === 'Tasks' && 'Task Manager'}
          </h1>
        </header>

        {/* Notification */}
        {message && (
          <div className="mb-6 bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-200 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        {/* Content */}
        <div className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-xl shadow-xl border border-gray-700 border-opacity-50">
          {activeTab === 'profile' ? (
            loading ? (
              <div className="flex justify-center items-center h-80">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleUpdate()
                }}
                className="p-8"
              >
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
                        <FaUserTie className="mr-2" /> Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
                        <MdOutlineSubject className="mr-2" /> Subject
                      </label>
                      <input
                        type="text"
                        value={profile.subject}
                        onChange={(e) => setProfile({ ...profile, subject: e.target.value })}
                        placeholder="Subject taught"
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
                        <RiMoneyDollarCircleLine className="mr-2" /> Fees
                      </label>
                      <input
                        type="number"
                        value={profile.fees ?? ''}
                        onChange={(e) => setProfile({ ...profile, fees: Number(e.target.value) })}
                        placeholder="Class fees"
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
                        <MdAccessTime className="mr-2" /> Duration
                      </label>
                      <input
                        type="text"
                        value={profile.duration}
                        onChange={(e) => setProfile({ ...profile, duration: e.target.value })}
                        placeholder="Course duration"
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={updating}
                  >
                    {updating ? "Updating..." : "Update Profile"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmation(true)}
                    className="flex-1 bg-red-600 bg-opacity-30 text-red-300 border border-red-600 px-6 py-3 rounded-lg hover:bg-red-600 hover:bg-opacity-40 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete Profile
                  </button>
                </div>
              </form>
            )
          ) : activeTab === 'students' ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Student Roster</h2>
                {availableSeats !== null && (
                  <div className="bg-green-900 bg-opacity-30 text-green-300 px-4 py-2 rounded-lg border border-green-700">
                    <span className="font-medium">Available Seats:</span> {availableSeats}
                  </div>
                )}
              </div>

              {studentMessage && (
                <div className="mb-6 bg-red-500 bg-opacity-10 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
                  {studentMessage}
                </div>
              )}

              {students.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                  <FaUserGraduate className="text-3xl mb-3" />
                  <p>No students enrolled yet.</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-700">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-800">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Gender
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Phone
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Email
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-900 bg-opacity-50 divide-y divide-gray-800">
                        {students.map((student) => (
                          <tr 
                            key={student.id}
                            className="hover:bg-gray-800 transition duration-150 cursor-pointer"
                            onContextMenu={(e) => {
                              e.preventDefault();
                              setSelectedStudent(student);
                              setShowModal(true);
                            }}
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowModal(true);
                            }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {student.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {student.gender}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {student.phone_number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-300">
                              {student.email}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-blue-600 p-4 rounded-full mb-6">
                  <FaListAlt className="text-white text-3xl" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-4">Task Management</h2>
                <p className="text-gray-300 mb-8 text-center max-w-md">
                  Manage your assignments, track student progress, and organize your teaching schedule.
                </p>
                <button
                  onClick={() => router.push('/allmytasks_teacher')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Open Task Manager
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Student Action Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 z-50">
          {/* This overlay is transparent but captures clicks */}
          <div 
            className="absolute inset-0 backdrop-filter backdrop-blur-lg" 
            onClick={() => setShowModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-gray-900 bg-opacity-70 border border-gray-700 rounded-xl shadow-2xl p-6 w-96 pointer-events-auto animate-fadeIn">
              <h3 className="text-xl font-semibold text-white mb-2">{selectedStudent.name}</h3>
              <p className="text-gray-400 mb-6">{selectedStudent.email}</p>
              
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    try {
                      const msg = await removeStudent(selectedStudent.id);
                      setStudentMessage(msg);
                      await loadStudents();
                      setShowModal(false);
                    } catch (error: any) {
                      setStudentMessage(error.message);
                      setShowModal(false);
                    }
                  }}
                  className="w-full bg-gray-800 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Remove Student
                </button>
                <button
                  onClick={() => router.push(`/assignment/${selectedStudent.id}`)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Assign Tasks
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-gray-800 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50">
          {/* This overlay is transparent but captures clicks */}
          <div 
            className="absolute inset-0 backdrop-filter backdrop-blur-lg" 
            onClick={() => setDeleteConfirmation(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-gray-900 bg-opacity-70 border border-gray-700 rounded-xl shadow-2xl p-6 w-96 pointer-events-auto animate-fadeIn">
              <h3 className="text-xl font-semibold text-white mb-2">Confirm Deletion</h3>
              <p className="text-gray-400 mb-6">Are you sure you want to delete your profile? This action cannot be undone.</p>
              
              <div className="space-y-3">
                <button
                  onClick={handleDelete}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Yes, Delete Profile
                </button>
                <button
                  onClick={() => setDeleteConfirmation(false)}
                  className="w-full bg-gray-800 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}