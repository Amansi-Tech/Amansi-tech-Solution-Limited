'use client';

import { Typewriter } from 'react-simple-typewriter';
import Services from './Services';
import Link from 'next/link';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Progress from './Progress';
import ReviewForm from './Reviews';

export default function Hero() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  const typewriterWords = [
    'Where imagination becomes reality through programming.',
    'In Amansi-Tech we think towards the future.',
    'Come and code with us, fun and slick.',
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
          src="/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/50 z-0" />

        <div className="relative z-10 flex items-center justify-center h-full text-center px-4 md:px-12">
          <div className="text-white max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4" data-aos="zoom-out">
              Welcome to <span className="text-violet-400" data-aos="fade-up-left">Amansi Tech</span>
            </h1>

            <p className="text-lg md:text-2xl mb-6 font-light" data-aos="fade-up-right">
              <Typewriter
                words={typewriterWords}
                loop
                cursor
                typeSpeed={90}
                deleteSpeed={80}
                delaySpeed={1800}
              />
            </p>

            <Link href="/contact" passHref>
              <button
                className="bg-violet-600 hover:bg-violet-700 px-6 py-3 rounded-lg text-white font-semibold transition duration-300 ease-in-out shadow-lg"
                data-aos="fade-right"
              >
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="bg-white dark:bg-black w-full overflow-x-hidden">
        <Services />
        <Progress />
        <ReviewForm />
      </section>
    </div>
  );
}
