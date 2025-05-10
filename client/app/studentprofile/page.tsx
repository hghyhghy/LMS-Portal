'use client'
import axios from "axios"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Define a type for the profile data
type Profile = {
    name: string,
    email: string,
    gender: string,
    phone_number: string
}

// Define a more specific type for API responses if possible
// For example, if your 'update' and 'delete' always return a 'message' string:

type ProfileApiResponse = {
    student_profile: Profile;
}

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<Profile>({
        name: "",
        email: "",
        gender: "",
        phone_number: ""
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null); // For distinguishing error messages

    const API_BASE_URL = 'http://127.0.0.1:8000'; // Centralize API base URL

    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = Cookies.get('access');
            if (!token) {
                setMessage("Authentication token not found. Please log in.");
                setLoading(false);
                router.push('/login'); // Redirect to login if no token
                return;
            }
            const response = await axios.get<{ student_profile: Profile }>(
                `${API_BASE_URL}/get-student-profile/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProfile(response.data.student_profile);
        } catch (err: any) {
            console.error("Fetch Profile Error:", err);
            setError('Failed to fetch Student Profile. Please try again later.');
            setMessage(''); // Clear general messages if there's an error
        } finally {
            setLoading(false);
        }
    }

    const updateProfile = async () => {
        setUpdating(true);
        setMessage('');
        setError(null);
        try {
            const token = Cookies.get('access');
            if (!token) {
                setError('Authentication token not found.');
                setUpdating(false);
                return;
            }
            const response = await axios.post<{ message: string }>(
                `${API_BASE_URL}/update-student-profile/`,
                profile,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setMessage(response.data.message || "Profile updated successfully!");
            await fetchProfile(); // Refresh profile data
        } catch (err: any) {
            console.error("Update Profile Error:", err);
            setError(err.response?.data?.message || 'Error updating the profile. Please check your input.');
        } finally {
            setUpdating(false);
        }
    }

    const deleteProfile = async () => {
        // More user-friendly confirmation (consider a custom modal for true professional feel)
        const confirmed = window.confirm("Are you sure you want to delete your profile? This action cannot be undone.");
        if (!confirmed) return;

        setMessage('');
        setError(null);
        try {
            const token = Cookies.get('access');
            if (!token) {
                setError('Authentication token not found.');
                return;
            }
            const response = await axios.delete<{message:string}>(`${API_BASE_URL}/delete-student-profile/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage(response.data.message || "Profile deleted successfully.");
            Cookies.remove('access');
            // Redirect to a different page after deletion, e.g., homepage or login
            router.push('/');
        } catch (err: any) {
            console.error("Delete Profile Error:", err);
            setError(err.response?.data?.message || 'Error deleting Profile.');
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []); // Single fetch on mount

    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage('');
                setError(null);
            }, 5000); // Increased timer for better readability

            return () => clearTimeout(timer);
        }
    }, [message, error]);


    const ProfileInput = ({ label, id, value, onChange, type = "text", placeholder }: {
        label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, placeholder?: string
    }) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            />
        </div>
    );


    return (
        <div className="flex min-h-screen bg-gray-900 text-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 p-6 hidden md:flex flex-col justify-between shadow-lg">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-8 uppercase">Dashboard</h1>
                    <ul className="space-y-3">
                        <li>
                            <button
                                onClick={() => router.push('/studentprofile')} // Assuming this is the current page
                                className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-md bg-blue-600 text-white transition-colors duration-150"
                            >
                                {/* Icon example (replace with actual icons) */}
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>
                                <span>Profile</span>
                            </button>
                        </li>
                        <li>
                            <button
                                className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> {/* Settings Icon */}
                                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106A1.532 1.532 0 0111.49 3.17zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                                <span>Settings</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => router.push('/studenttasks')}
                                className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">{/* Exam Icon */}
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4A7.969 7.969 0 0011 4.804v10A7.968 7.968 0 0114.5 16c1.255 0 2.443-.29 3.5.804v-10A7.968 7.968 0 0014.5 4z"></path>
                                </svg>
                                <span>Exam Panel</span>
                            </button>
                        </li>
                    </ul>
                </div>
                {/* Optional: Logout button or user avatar at the bottom of sidebar */}
                <div>
                    <button
                        onClick={() => { Cookies.remove('access'); router.push('/login'); }}
                        className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-md text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-150"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-center">
                <div className="w-full max-w-2xl">

                    {/* Message Display */}
                    {message && (
                        <div className="mb-6 p-4 text-sm bg-green-600 border border-green-700 text-white rounded-lg shadow-md animate-fadeIn">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="mb-6 p-4 text-sm bg-red-600 border border-red-700 text-white rounded-lg shadow-md animate-fadeIn">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-10">
                            {/* You can replace this with a spinner component */}
                            <svg className="animate-spin h-10 w-10 text-blue-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-3 text-lg font-medium text-gray-300">Loading Profile...</p>
                        </div>
                    ) : (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                updateProfile();
                            }}
                            className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl space-y-6"
                        >
                            <h2 className="text-3xl font-semibold text-white text-center mb-6">
                                Student Profile
                            </h2>

                            <ProfileInput label="Full Name" id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                            <ProfileInput label="Email Address" id="email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                            <ProfileInput label="Phone Number" id="phone_number" value={profile.phone_number} onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })} />
                            <ProfileInput label="Gender" id="gender" value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} />

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto flex-grow bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={updating}
                                >
                                    {updating ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </span>
                                    ) : 'Update Profile'}
                                </button>
                                <button
                                    type="button"
                                    onClick={deleteProfile}
                                    className="w-full sm:w-auto flex-grow bg-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                                >
                                    Delete Profile
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    )
}