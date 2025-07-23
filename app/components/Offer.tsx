'use client'
import Image from 'next/image';
import { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import Link from 'next/link';
export default function Offer() {
  const techs = [
    { img: '/HTML5.png', title: 'HTML/CSS', level: '(Beginner) 🔰' },
    { img: '/javascript.png', title: 'JavaScript', level: '(Advanced Beginner)🥉 ' },
    { img: '/React.png', title: 'React', level: '(Intermediate)🥈' },
    { img: '/next-js.svg', title: 'Next.js', level: 'Advanced/Proficient🥇' },
  ];
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
    });
  }, []);
  return (
    <section className="mx-4 my-8 p-[20px]">
      <h1 className='text-left font-bold text-[25px] p-[5px] text-white'>
        Languages We Offer <br />

      </h1>

      <div className="grid grid-cols-2  gap-[10px]" data-aos="zoom-out">
        {techs.map((t) => (
          <div
            key={t.title}
            className="group bg-violet-400 w-[39.5rem] text-white bg-opacity-20 backdrop-blur-sm border-2 border-white shadow-lge rounded-xl p-5 flex flex-col items-center transition transform hover:scale-105 hover:shadow-lg"
          >
            <Image src={t.img} alt={`${t.title} logo`} width={80} height={80} unoptimized />
            <h2 className="mt-4 text-xl font-semibold text-violet-900 group-hover:underline">
              {t.title}
            </h2>
            <p className="mt-2 text-white text-center">{t.level}</p>
            <Link
              href='/contact'
            >
              <button className='bg-white hover:scale-[-5px] px-6 py-3 rounded text-violet-600 font-semibold text-[15px] mt-[5px]'>
                Enquire
              </button>
            </Link>
          </div>
        ))}

      </div>
    </section>
  );
}
