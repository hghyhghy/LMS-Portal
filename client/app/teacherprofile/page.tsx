
'use client'
import { useEffect,useState } from "react"
import { fetchProfile,type Profile } from "../api/GET/get"
import { updateProfile } from "../api/UPDATE/update"
import { deleteProfile } from '../api/DELETE/delete';
import { verifyPasskey } from "../verifyapi/verify";
import { useRouter } from "next/navigation";
import { fetchStudents,type  Student } from "../enrolledstudentapi/GET/get";
import { removeStudent } from "../removeregisteredstudents/DELETE/remove";

export  default  function  Profilepage() {
    
    const router =  useRouter()
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
    const [students, setStudents] = useState<Student[]>([]);
    const [activeTab, setActiveTab] = useState<'profile' | 'students'>('profile');
    const [studentMessage, setStudentMessage] = useState("");
    const [availableSeats, setAvailableSeats] = useState <number |  null>(null)

    const handleVerify = async() =>  {
        try {
            
            const msg =  await  verifyPasskey(adminKey)
            setVerifyError("")
            setIsVerified(true)
            await loadProfile()
            await loadStudents()
        } catch (error:any) {
            setVerifyError(error.message)
        }
    }

    const loadProfile =  async() =>  {
        setLoading(true)
        try {
            const data  =  await fetchProfile()
            setProfile(data)
        } catch (error) {
            console.log(error)
            setMessage('Error loading profile')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate =  async() =>  {
        setUpdating(true)
        try {
            const msg =  await  updateProfile(profile)
            setMessage(msg)
            await fetchProfile()
        } catch (error) {
            console.log(error)
            setMessage('Error updating the profile')
        } finally {
            setUpdating(false)
        }
    }

    const loadStudents =  async() =>  {
        try {
            const data  =  await  fetchStudents()
            setStudents(data.students)
            setAvailableSeats(data.Available_Seats)
        } catch (error:any) {
                setStudentMessage(error.message)
        }
    }

    const handleDelete =  async() =>  {
        try {
            const msg =  await  deleteProfile()
            setMessage(msg)
        } catch (error) {
            console.log(error)
            setMessage('Error deleting  profile')
        }
    }
    useEffect(() =>  {
        loadProfile()
    },[])
    useEffect(() =>  {
        if (message){
            const timer =  setTimeout(() =>  setMessage(""),3000)
            return  () => clearTimeout(timer)
        }
    },[message])

    if (!isVerified){
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-900">
                    <div className="bg-white rounded-xl p-8 shadow-2xl w-96">
                        <h2 className="text-xl font-semibold mb-4 text-center">
                            Enter Admin Passkey 
                        </h2>
                        <input 
                        type="password" 
                        value={adminKey ?  adminKey : ""}
                        onChange={(e) =>  setAdminKey(Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded mb-4"

                        />
                    {verifyError && (
                        <p className="text-red-600 mb-2 text-center">{verifyError}</p>
                    )}
                    <button
                        onClick={handleVerify}
                        className="bg-blue-600 w-full text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Verify
                    </button>
                    </div>
            </div>
        )
    }
    
    return(
            <div className="  flex  min-h-screen  bg-black">
                <aside className="w-50 bg-gray-800 text-white p-6 hidden md:block">
                    <h2 className="  text-xl  font-semibold  mb-4">
                        Dashboard
                    </h2>
                    <ul>
                    <li
            className={`mb-2 uppercase cursor-pointer ${activeTab === 'profile' ? 'text-blue-400' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </li>
          <li
            className={`mb-2 uppercase cursor-pointer ${activeTab === 'students' ? 'text-blue-400' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </li>
                    </ul>
                </aside>

                <main className="flex-1 flex items-center justify-center">
                    {message && 
                     <p className="  mb-4 text-blue-800">
                        {message}
                     </p>
                    }
   {activeTab === 'profile' ? (
          loading ? (
            <p>Loading...</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleUpdate()
              }}
              className="grid grid-cols-1 gap-14 p-6 rounded-2xl shadow-xl"
            >
              <div className="flex flex-row gap-3">
                <h2 className="text-1xl text-gray-300 uppercase mt-1 bg-[#333333] px-6 py-2 rounded-xl">Name</h2>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Name"
                  className="w-full p-2 border border-gray-600 rounded-2xl outline-none shadow-2xl ml-7"
                />
              </div>

              <div className="flex flex-row gap-3">
                <h2 className="text-1xl text-gray-300 uppercase mt-1 bg-[#333333] px-6 py-2 rounded-xl">Subject</h2>
                <input
                  type="text"
                  value={profile.subject}
                  onChange={(e) => setProfile({ ...profile, subject: e.target.value })}
                  placeholder="Subject"
                  className="w-full p-2 border border-gray-600 rounded-2xl outline-none shadow-2xl ml-7"
                />
              </div>

              <div className="flex flex-row gap-3">
                <h2 className="text-1xl text-gray-300 uppercase mt-1 bg-[#333333] px-6 py-2 rounded-xl">Fees</h2>
                <input
                  type="number"
                  value={profile.fees ?? ''}
                  onChange={(e) => setProfile({ ...profile, fees: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-600 rounded-2xl outline-none shadow-2xl ml-8"
                  placeholder="Fees"
                />
              </div>

              <div className="flex flex-row gap-3">
                <h2 className="text-1xl text-gray-300 uppercase mt-1 bg-[#333333] px-6 py-2 rounded-xl">Duration</h2>
                <input
                  type="text"
                  value={profile.duration}
                  onChange={(e) => setProfile({ ...profile, duration: e.target.value })}
                  placeholder="Duration"
                  className="w-full p-2 border border-gray-600 rounded-2xl outline-none shadow-2xl ml-5"
                />
              </div>

              <div className="col-span-2 flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 cursor-pointer"
                  disabled={updating}
                >
                  {updating ? "Updating" : "Updated"}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-[#333333] text-white px-6 py-2 rounded ml-5 cursor-pointer"
                >
                  Delete Profile
                </button>
                <button
                  onClick={() => router.push('/middle')}
                  className="bg-[#333333] text-white px-6 py-2 rounded ml-5 cursor-pointer"
                >
                  Back
                </button>
              </div>
            </form>
          )
        ) : (
<div className=" w-full p-2 ">
  <h2 className="text-2xl font-semibold mb-6 absolute top-10   right-[40rem]">Enrolled Students</h2>
  {availableSeats !==  null && (
    <p  className="text-lg text-green-400 font-mono mb-4 ml-4">
         Available Seats: {availableSeats}
    </p>
  )}
  {studentMessage && <p className="text-red-600 mb-4">{studentMessage}</p>}
  {students.length === 0 ? (
    <p>No students enrolled.</p>
  ) : (
    <div className="overflow-x-auto rounded-t-lg relative -top-50">
      <div className="flex border-b border-gray-600 font-normal bg-[#0A0A0A]    rounded-t uppercase font-mono">
        <div className="w-1/4 px-4 py-2">Name</div>
        <div className="w-1/4 px-4 py-2">Gender</div>
        <div className="w-1/4 px-4 py-2">Phone</div>
        <div className="w-1/4 px-4 py-2">Email</div>
      </div>

      {students.map((student, index) => (
        <div
          key={index}
          className="flex border-b font-semibold border-gray-500  text-gray-400 "
        >
          <div className="w-1/4 px-4 py-3">{student.name}</div>
          <div className="w-1/4 px-10 py-3">{student.gender}</div>
          <div className="w-1/4 px-15 py-3">{student.phone_number}</div>
          <div className="w-1/4 px-4 py-3">{student.email}</div>
          <button
          onClick={ async  () =>  {

            try {
                const  msg  =  await  removeStudent(student.id)
                setStudentMessage(msg)
                await loadStudents()
            } catch (error:any) {
                setStudentMessage(error.message)

            }
          }}
          className="bg-red-600 text-white px-3 py-1 rounded ml-4 text-sm hover:bg-red-700 cursor-pointer mt-1"

          >     
                Remove 
          </button>
        </div>
      ))}
    </div>
  )}
</div>

        )}
                </main>
            </div>

    )
}