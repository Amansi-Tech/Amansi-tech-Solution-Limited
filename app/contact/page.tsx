
"use client";
import Link from "next/link";
import {  LucideGitlab } from "lucide-react";

export default function Contact() {

    return (
        <main className="min-h-screen flex flex-col items-center p-6 mt-[2rem]">
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-violet-700 mb-6 text-center">
                    Contact Me
                </h1>
                <div className="space-y-4 text-gray-800">
                    <div className="flex items-center">
                        <span className="ml-2">📞 08023101101</span>
                    </div>
                    <div className="flex items-center">
                        <LucideGitlab />
                        <span className="ml-2">GitHub: Amansi‑tech</span>
                    </div>
                    <div className="flex items-center">

                        <span className="ml-2"> P.star.chinedu@gmail.com</span>
                    </div>
                </div>
            </div>

      <div>
        <Link
        href='/'
        >
        <h1 className="text-violet-600 bg-white text-[20px] p-[5px] m-[2rem] font-bold rounded-[5px]">Back home</h1>
        </Link>
      </div>
        </main>
    )
}

