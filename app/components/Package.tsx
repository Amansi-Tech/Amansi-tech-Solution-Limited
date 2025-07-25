// components/ServicesSection.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MonitorSmartphone,
  Paintbrush2,
  Code2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";

const services = [
  {
    icon: <Code2 className="w-12 h-12 text-violet-600 mx-auto mb-4" />,
    title: "Web-App Development",
    description: "We build fast, scalable, and reliable web applications.",
    motivation: "Empower your business with cutting-edge digital experiences.",
    href: "/services/web-app-development",
  },
  {
    icon: <MonitorSmartphone className="w-12 h-12 text-violet-600 mx-auto mb-4" />,
    title: "UI/UX Design",
    description: "Crafting user-first designs that are both intuitive and beautiful.",
    motivation: "Designs that speak, engage, and convert effortlessly.",
    href: "/services/ui-ux-design",
  },
  {
    icon: <Paintbrush2 className="w-12 h-12 text-violet-600 mx-auto mb-4" />,
    title: "Graphics Designer",
    description: "Creative designs for your brand, social media, and more.",
    motivation: "Make your brand stand out with striking visuals.",
    href: "/services/graphics-designer",
  },
];

export default function Package() {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % services.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    trackMouse: true,
  });

  return (
    <div className="sm:hidden flex flex-col items-center relative w-full max-w-md mx-auto">
      <div {...swipeHandlers} className="relative w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-white p-6 rounded-xl shadow-lg text-center transform transition-transform duration-500 hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-violet-200 hover:bg-violet-50"
          >
            <Link href={services[index].href || "#"}>
              {services[index].icon}
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {services[index].title}
              </h3>
              <p className="text-gray-600">{services[index].description}</p>
              {services[index].motivation && (
                <p className="text-sm text-violet-700 italic mt-2 mb-2">
                  {services[index].motivation}
                </p>
              )}
              <button className="text-violet-600 font-medium hover:underline mt-2">
                Learn More →
              </button>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

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
    </div>
  );
}

