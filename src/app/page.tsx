"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/chat");
    }
  }, [isSignedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle Background Grid Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('/grid.svg')] bg-cover z-0" />

      <div className="relative z-10 text-center max-w-4xl w-full animate-fade-in-up">
        {/* Logo */}
        <div className="mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-400/30">
            <span className="text-black font-extrabold text-3xl tracking-wider">AI</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight bg-gradient-to-r from-green-400 via-teal-300 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
            AI Fiesta Opensource
          </h1>
          <p className="text-gray-400 mt-4 text-lg sm:text-xl max-w-xl mx-auto">
            Powering conversations with multiple AI models — compare, chat, and build smarter.
          </p>
        </div>

        {/* CTA Button */}
        <Link
          href="/sign-in"
          className="inline-block mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full text-lg transition-transform duration-200 hover:scale-105 shadow-lg"
        >
          Sign In to Continue
        </Link>

        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-2">
          {[
            {
              icon: "🤖",
              title: "AI Models",
              desc: "Gemini, Groq, OpenRouter, Qwen",
            },
            {
              icon: "⚡",
              title: "Real-time",
              desc: "Compare responses instantly",
            },
            {
              icon: "💬",
              title: "Smart Chat",
              desc: "Interactive multi-model conversations",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-md shadow-black/30 hover:shadow-green-500/20 transition-all duration-300 hover:scale-[1.03]"
            >
              <div className="text-2xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-green-400 hover:text-green-300 underline">
            Sign up here
          </Link>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}
