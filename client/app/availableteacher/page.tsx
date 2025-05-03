'use client'
import useSWR from 'swr';
import axios from 'axios';
import Image from 'next/image';
import { useState } from 'react';
import enrollInCourse from '../enrollmentapi/ENTER/entry';
import exitFromCourse from '../enrollmentapi/EXIT/exit';
import { IoMdTime } from "react-icons/io";

type Teacher = {
  id:number,
  name: string;
  subject: string;
  fees: string;
  duration: string;
};

const fetcher = async (url: string): Promise<Teacher[]> => {
  const res = await axios.get<{ teacher: Teacher[] }>(url, { withCredentials: true });
  return res.data.teacher || []; 
};

export default function TeachersListPage() {
  const baseApi = 'http://127.0.0.1:8000';

  const [searchInput, setSearchInput] = useState('');
  const [apiUrl, setApiUrl] = useState(`${baseApi}/get-teachers/`);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState("")
  const [enrollStatus, setEnrollStatus] = useState<Record<number, 'idle' | 'loading' | 'enrolled'>>({});


  const { data: teachers = [], error, isLoading, mutate } = useSWR(apiUrl, fetcher);

  const handleSearch = () => {
    setIsSearching(true);
    if (searchInput.trim() === '') {
      setApiUrl(`${baseApi}/get-teachers/`);
    } else {
      setApiUrl(`${baseApi}/search-teachers/?subject=${encodeURIComponent(searchInput)}`);
    }
    mutate(); // re-fetch data manually after URL change
    setTimeout(() => {
      setIsSearching(false);
      setSearchInput('')
    }, 500); // small timeout to show loading spinner smoothly
  };

  const handleEnroll = async (id: number) => {
    setEnrollStatus((prev) => ({ ...prev, [id]: 'loading' }));
    try {
      // Simulate delay for UX feedback
      await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5 seconds delay
  
      const res = await enrollInCourse(id) as { message: string };
      setMessage(res.message);
      setEnrollStatus((prev) => ({ ...prev, [id]: 'enrolled' }));
    } catch (error) {
      console.log(error);
      setMessage('Error enrolling course');
      setEnrollStatus((prev) => ({ ...prev, [id]: 'idle' }));
    }
  };
  
  
  const handleExit = async (id: number) => {
    setEnrollStatus((prev) => ({ ...prev, [id]: 'loading' }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulated delay
  
      const res = await exitFromCourse(id) as { message: string };
      setMessage(res.message);
      setEnrollStatus((prev) => ({ ...prev, [id]: 'idle' }));
    } catch (error) {
      console.log(error);
      setMessage('Error exiting course');
      setEnrollStatus((prev) => ({ ...prev, [id]: 'enrolled' }));
    }
  };
  
  

  if (isLoading || isSearching) {
    return <div className="text-center p-10 text-xl">Loading teachers...</div>;
  }

  if (error || !Array.isArray(teachers) || teachers.length === 0) {
    return <div className="text-center p-10 text-xl">No teachers available right now.</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-white">
      <h1 className="text-3xl font-bold mb-6 text-black font-serif flex items-center justify-center">
        Available Courses with Mentors
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-8 gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border border-gray-400  px-4 py-2 w-full max-w-md text-black rounded-2xl outline-none bg-gray-100"
          placeholder="Search here .. "
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-800 text-white rounded-2xl hover:bg-blue-800 cursor-pointer "
        >
          Search
        </button>
      </div>

      {/* Teachers grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
        {teachers.map((teacher, index) => {
          const randomRating = (Math.random() * (5 - 4) + 4).toFixed(1);
          return (
            <div
              key={index}
              className="border border-gray-300 rounded shadow-md hover:shadow-xl transition h-[27rem] w-[20rem] flex flex-col cursor-pointer"
            > 
              <div>
                <Image
                  src="/aiteacher.jpeg"
                  height={20}
                  width={350}
                  alt="aiteacher"
                  className="border-5 border-[#C3A158]"
                />
              </div>

              <div className="px-5 py-2 flex flex-col">
                <h3 className="font-semibold">
                  100 days of {teacher.subject}: The complete <br /> {teacher.subject} Roadmap
                </h3>
                <h3 className="text-sm text-gray-500">By Dr {teacher.name}</h3>

                {/* Rating section */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-green-800 font-semibold">
                    {randomRating}
                    <span className="text-green-500 ml-3">★★★★★</span>
                  </span>
                </div>
                <div>
                  <h2 className="mt-1 font-semibold font-sans">₹ {teacher.fees}</h2>
                </div>
                <div className=' flex flex-row gap-1'>
                  <strong className=' text-blue-700 mt-1'>
                  <IoMdTime className='  text-xl mt-[0.2rem]' /> 
                  </strong>
                  <h2 className="mt-1 font-normal text-gray-700 font-sans text-1xl ">{teacher.duration}</h2>
                </div>
                <div className="mt-2 space-x-2 flex flex-row gap-2">
  <button
    onClick={() => handleEnroll(teacher.id)}
    className={`${
      enrollStatus[teacher.id] === 'enrolled'
        ? 'bg-gray-600 cursor-not-allowed'
        : 'bg-green-700 hover:bg-green-800 cursor-pointer'
    } text-white px-3 py-1 rounded`}
    disabled={enrollStatus[teacher.id] === 'loading' || enrollStatus[teacher.id] === 'enrolled'}
  >
    {enrollStatus[teacher.id] === 'loading'
      ? 'Enrolling...'
      : enrollStatus[teacher.id] === 'enrolled'
      ? 'Enrolled'
      : 'Enroll'}
  </button>

  <button
    onClick={() => handleExit(teacher.id)}
    className={`${
      enrollStatus[teacher.id] !== 'enrolled'
        ? 'bg-gray-600 cursor-not-allowed'
        : 'bg-red-700 hover:bg-red-800 cursor-pointer'
    } text-white px-3 py-1 rounded`}
    disabled={enrollStatus[teacher.id] !== 'enrolled'}
  >
    {enrollStatus[teacher.id] === 'loading' ? 'Exiting...' : 'Exit'}
  </button>
</div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
