'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const ChooseRolePage = () => {
  const router = useRouter()

  const roles = [
    {
      name: 'Student',
      imageSrc: '/student.jpeg', // Ensure this path is correct in your public folder
      altText: 'Illustration of a student',
      primaryActionPath: '/student',
      profileActionPath: '/studentprofile',
    },
    {
      name: 'Teacher',
      imageSrc: '/teacher.jpg', // Ensure this path is correct in your public folder
      altText: 'Illustration of a teacher',
      primaryActionPath: '/teacher',
      profileActionPath: '/teacherprofile',
    },
  ]

  return (
    <main className='bg-slate-100 min-h-screen flex flex-col items-center justify-center p-4 sm:p-8'>
      <div className='w-full max-w-4xl'>
        <h2 className='text-4xl sm:text-5xl font-bold text-gray-800 uppercase text-center mb-12 sm:mb-16'>
          Choose Your Role
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 lg:gap-16'>
          {roles.map((role) => (
            <div
              key={role.name}
              className='bg-white rounded-xl shadow-2xl p-6 sm:p-8 flex flex-col items-center transform transition-all duration-300 hover:scale-105'
            >
              <div className='relative w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 mb-6 sm:mb-8 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg'>
                <Image
                  src={role.imageSrc}
                  layout='fill'
                  objectFit='cover'
                  alt={role.altText}
                  className='cursor-pointer transition-transform duration-300 hover:opacity-90'
                  onClick={() => router.push(role.primaryActionPath)} // Optional: click image to go to primary path
                />
              </div>
              <h3 className='text-2xl sm:text-3xl font-semibold text-gray-700 mb-6'>
                {role.name}
              </h3>
              <div className='w-full flex flex-col gap-4'>
                <button
                  className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-lg sm:text-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'
                  onClick={() => router.push(role.primaryActionPath)}
                >
                  I am a {role.name}
                </button>
                <button
                  onClick={() => router.push(role.profileActionPath)}
                  className='bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg text-lg sm:text-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75'
                >
                  View {role.name} Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default ChooseRolePage