"use client"

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function HomePage() {
  const { isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn) {
      router.push('/chat')
    }
  }, [isSignedIn])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        {/* Logo/Header */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-bold text-2xl">AI</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">
            AI Fiesta
          </h1>
          <p className="text-gray-400 mt-2">Experience the power of multiple AI models working together in perfect harmony</p>
        </div>

        {/* Sign In Button */}
        <Link
          href="/sign-in"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 transform hover:scale-105"
        >
          Sign In to Continue
        </Link>

        {/* Features List */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mb-3 mx-auto">
              <span className="text-white font-bold">4</span>
            </div>
            <h3 className="font-semibold mb-2">AI Models</h3>
            <p className="text-gray-400 text-sm">Gemini, Groq, OpenRouter, Qwen</p>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mb-3 mx-auto">
              <span className="text-white font-bold">⚡</span>
            </div>
            <h3 className="font-semibold mb-2">Real-time</h3>
            <p className="text-gray-400 text-sm">Compare responses instantly</p>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mb-3 mx-auto">
              <span className="text-white font-bold">💬</span>
            </div>
            <h3 className="font-semibold mb-2">Smart Chat</h3>
            <p className="text-gray-400 text-sm">Interactive conversations</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12">
          <p className="text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-green-400 hover:text-green-300">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
