'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import Link from 'next/link';

export default function Offer() {
  const techs = [
    { img: '/HTML5.png', title: 'HTML/CSS', level: '(Beginner) 🔰' },
    { img: '/javascript.png', title: 'JavaScript', level: '(Advanced Beginner) 🥉' },
    { img: '/React.png', title: 'React', level: '(Intermediate) 🥈' },
    { img: '/next-js.svg', title: 'Next.js', level: 'Advanced/Proficient 🥇' },
  ];

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  return (
    <section className="mx-4 my-8 px-2 sm:px-4">
      <h1 className="text-left font-bold text-xl sm:text-2xl text-white mb-4 sm:mb-6">
        Languages We Offer
      </h1>

      <div
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4"
        data-aos="zoom-out"
      >
        {techs.map((t) => (
          <div
            key={t.title}
            className="group bg-violet-400 bg-opacity-20 backdrop-blur-sm border border-white/30 shadow-md rounded-xl p-4 flex flex-col items-center text-white transition transform hover:scale-[1.03]"
          >
            <Image
              src={t.img}
              alt={`${t.title} logo`}
              width={60}
              height={60}
              className="object-contain"
              unoptimized
            />

            <h2 className="mt-3 text-[16px] font-semibold text-violet-900 group-hover:underline text-center">
              {t.title}
            </h2>

            <p className="mt-1 text-sm text-white text-center">{t.level}</p>

            <Link href="/contact" passHref>
              <button className="mt-3 px-4 py-2 rounded bg-white text-violet-600 font-semibold text-xs hover:bg-violet-100 transition">
                Enquire
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
