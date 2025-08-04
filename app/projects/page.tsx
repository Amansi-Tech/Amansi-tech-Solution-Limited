"use client";

import { motion } from "framer-motion";
import { Code, Github, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";

const repos = [
  {
    name: "Career Site",
    description: "Career-site using HTML and CSS.",
    url: "https://github.com/Amansi-Tech/carrer-site",
    stars: 4,
  },
  {
    name: "Task Editor App",
    description: "Task editor using front-end language.",
    url: "https://github.com/Amansi-Tech/TASK-Editor-App",
    stars: 5,
  },
  {
    name: "To-do list",
    description: "A simple to-do list",
    url: "https://github.com/Amansi-Tech/TO-DO-list",
    stars: 3,
  },
  {
    name: "Portfolio",
    description: "A portfolio built using React/Typescript.",
    url: "https://emmanuelchinedu.vercel.app",
    stars: 5,
  },
  {
    name: "amansi-tech",
    description: "Official site built with React/Next.js.",
    url: "https://amansi-tech.vercel.app",
    stars: 5,
  },
];

export default function ProjectsPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-violet-50 to-white px-4 py-20">
      <div className="max-w-6xl mx-auto space-y-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold text-violet-700"
        >
          Projects in Progress
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-600 text-lg max-w-xl mx-auto"
        >
          Explore our current initiatives. Click each card to view details on GitHub.
        </motion.p>

        <Swiper
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          modules={[Pagination, Autoplay]}
          className="!pb-12"
        >
          {repos.map((repo, i) => (
            <SwiperSlide key={i}>
              <motion.a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="block bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col justify-between text-left hover:shadow-violet-200"
              >
                <Code className="w-10 h-10 text-violet-600 mb-4" />

                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {repo.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {repo.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-violet-600 font-medium mt-auto">
                  <div className="flex items-center gap-1">
                    {[...Array(repo.stars)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                    ))}
                  </div>
                  <span className="flex items-center gap-1">
                    <Github className="w-4 h-4" />
                    GitHub
                  </span>
                </div>
              </motion.a>
            </SwiperSlide>
          ))}
        </Swiper>

        <Link
          href="/"
          className="inline-block mt-4 text-violet-500 hover:underline text-sm"
        >
          ← Back to Home
        </Link>
      </div>
    </section>
  );
}
