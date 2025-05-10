'use client'
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie'

const BASE_URL = 'http://127.0.0.1:8000/auth';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(false)
    const [form, setForm] = useState({ username: '', email: '', password: '' })
    const router = useRouter()

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        const endpoint = isLogin ? 'login' : 'register';
        const payload = isLogin
            ? { username: form.username, password: form.password }
            : { username: form.username, email: form.email, password: form.password }

        const res = await fetch(`${BASE_URL}/${endpoint}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })

        const data = await res.json()
        if (res.ok) {
            if (data.access) {
                Cookies.set('access', data.access, { expires: 7 })
                console.log(Cookies.get('access'))
            }
            router.push('/middle')
        } else {
            alert(data.error || 'Something went wrong')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all hover:scale-[1.01]">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <div className="space-y-5">
                    <input
                        name="username"
                        value={form.username}
                        placeholder="Username"
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    />
                    {!isLogin && (
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        />
                    )}
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    />
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </div>
                <p className="text-sm mt-6 text-center text-gray-600">
                    {isLogin ? 'New here?' : 'Already have an account?'}{' '}
                    <span
                        className="text-indigo-600 font-medium cursor-pointer hover:underline"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </span>
                </p>
            </div>
        </div>
    )
}