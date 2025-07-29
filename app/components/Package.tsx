"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MonitorSmartphone,
  Paintbrush2,
  Code2,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const services = [
  {
    icon: <Code2 className="w-12 h-12 text-violet-600 mx-auto mb-4" />,
    title: "Web-App Development",
    description: "We build fast, scalable, and reliable web applications.",
    motivation: "Empower your business with cutting-edge digital experiences.",
    href: "/about",
  },
  {
    icon: <MonitorSmartphone className="w-12 h-12 text-violet-600 mx-auto mb-4" />,
    title: "UI/UX Design",
    description: "Crafting user-first designs that are both intuitive and beautiful.",
    motivation: "Designs that speak, engage, and convert effortlessly.",
    href: "/about",
  },
  {
    icon: <Paintbrush2 className="w-12 h-12 text-violet-600 mx-auto mb-4" />,
    title: "Graphics Designer",
    description: "Creative designs for your brand, social media, and more.",
    motivation: "Make your brand stand out with striking visuals.",
    href: "/about",
  },
];

const motionVariants = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
};

export default function ServicesSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % services.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => setIndex((prev) => (prev - 1 + services.length) % services.length);
  const handleNext = () => setIndex((prev) => (prev + 1) % services.length);

  const { icon, title, description, motivation, href } = services[index];

  return (
    <>
    <div className="m-[1rem]">

      <h2 className="text-left font-bold text-xl sm:text-2xl text-white mb-4 sm:mb-6 p-[10px]">skills we offer</h2>

      {/* 👇 Mobile View */}
      <div className="sm:hidden flex flex-col items-center w-full max-w-md mx-auto relative">
        <div className="relative w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              variants={motionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                if (info.offset.x < -50) handleNext();
                else if (info.offset.x > 50) handlePrev();
              }}
              className="bg-white p-6 rounded-xl shadow-lg text-center cursor-grab active:cursor-grabbing transform hover:scale-105 hover:ring-2 hover:ring-violet-200 hover:bg-violet-50"
            >
              <Link href={href}>
                <div>
                  {icon}
                  <h3 className="text-xl font-bold text-violet-700 mb-2">{title}</h3>
                  <p className="text-black">{description}</p>
                  {motivation && (
                    <p className="text-sm text-black italic mt-2 mb-2">{motivation}</p>
                  )}
                  <button className="text-white font-medium hover:underline mt-2 bg-violet-600 p-[6px] rounded-[5px]">
                    Learn More →
                  </button>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 🔘 Dots */}
        <div className="flex gap-2 mt-4">
          {services.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full ${i === index ? "bg-violet-600" : "border border-violet-400"}`}
            ></span>
          ))}
        </div>

        {/* ⬅️➡️ Arrows */}
        <div className="flex justify-between w-full mt-4 px-4">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-violet-100 hover:bg-violet-200"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-violet-600" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-violet-100 hover:bg-violet-200"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 text-violet-600" />
          </button>
        </div>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/2348100000000"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>

      {/* 👇 Desktop Grid */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-[5rem] max-w-6xl mx-auto mt-[-5rem} ml-[-9px] p-[16px]">
        {services.map((service, i) => (
          <Link key={i} href={service.href}>
            <motion.div
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center transform hover:scale-105 hover:ring-2 hover:ring-violet-200 hover:bg-violet-50"
            >
              {service.icon}
              <h3 className="text-xl font-bold text-violet-700 mb-2">{service.title}</h3>
              <p className="text-black">{service.description}</p>
              {service.motivation && (
                <p className="text-sm text-black italic mt-2 mb-2">
                  {service.motivation}
                </p>
              )}
              <button className="text-white font-medium hover:underline mt-2 bg-violet-600 p-[6px] rounded-[5px]">
                Learn More →
              </button>
            </motion.div>
          </Link>
        ))}
      </div>
            </div>
    </>
  );
}
