'use client';
import { Typewriter } from 'react-simple-typewriter'
import Services from './Services';
import Link from 'next/link';
import { useEffect } from 'react';
import 'aos/dist/aos.css';
import  AOS  from 'aos';

export default function Hero() {
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
    });
  }, []);
  return (
    <div>
      <section className="relative h-screen w-full overflow-hidden">

        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
          src="/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        <div className="relative z-10 flex items-center justify-center h-full text-center p-[10px] mt[-4rem]">
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 " data-aos="zoom-out">Welcome to <span className="" data-aos="fade-up-left"> Amansi Tech</span></h1>
            <p className="text-lg md:text-xl mb-6 text-white" data-aos="fade-up-right">
              <span className="relative">
                <span className="absolute inset-0 text-gray-600 blur-sm -z-10">
                  <Typewriter
                    words={[
                      'Where imagination becomes reality through programing.',
                      'In Amansi-Tech we think towards the future',
                      'Come and code with us fun and slick',
                    ]}
                    loop={true}
                    cursor
                    typeSpeed={100}
                    deleteSpeed={100}
                    delaySpeed={1900}
                  />
                </span>
                <Typewriter
                  words={[
                    'Where imagination becomes reality through programing.',
                    'In Amansi-Tech we think towards the future',
                    'Come and code with us fun and slick',
                  ]}
                  loop={true}
                  cursor
                  typeSpeed={100}
                  deleteSpeed={100}
                  delaySpeed={90}
                />
              </span>
            </p>

            {/* <p className="text-lg md:text-xl mb-6" data-aos="fade-up-right">Where imagination becomes reality through programing.</p> */}
            <Link
            href='/Contact'
            >
            <button className="bg-violet-600 hover:bg-violet-700 px-6 py-3 rounded text-white font-semibold" data-aos="fade-right">
              Contact us
            </button>
            </Link>
          </div>
        </div>
      </section>
 <Services />
    </div>
  );
}
