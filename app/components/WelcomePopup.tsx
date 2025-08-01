'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const WelcomePopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const alreadyVisited = sessionStorage.getItem('amansi_welcome_shown');
    if (!alreadyVisited) {
      setShowPopup(true);
      sessionStorage.setItem('amansi_welcome_shown', 'true');
    }
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <>

          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />


          <motion.div
            className="fixed top-[10%] left-[10%] w-[30vw] h-[30vw] bg-violet-300/30 rounded-full blur-3xl z-30 animate-pulse"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 2 }}
          />


          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed top-[21rem] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-zinc-900 text-black dark:text-white p-6 sm:p-8 rounded-2xl border border-violet-500 shadow-2xl w-[90vw] max-w-5xl"
          >

            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-[2rem] h-6 text-violet-600" />
            </button>


            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-1/2">
                <video
                  className="w-full h-auto rounded-xl shadow-lg"
                  src="/welcomepup.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>

              <div className="w-full md:w-1/2 space-y-3">
                <h1 className="text-violet-700 dark:text-violet-400 text-xl md:text-2xl font-bold">
                  Amansi-tech Web Team
                </h1>
                <hr className="border-violet-400 dark:border-violet-600 w-full" />
                <p className="text-gray-800 dark:text-gray-200 text-sm md:text-base leading-relaxed">
                  Is welcoming you <span className="font-semibold">Personally</span> to our amazing site explore and write a review about your
                   experience.
                </p>
                <div className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 30, 0] }}
                    transition={{ repeat: Infinity, duration: 1.7 }}
                    className="text-2xl md:text-3xl"
                  >
                    👋
                  </motion.span>
                  <span className="text-gray-600 dark:text-gray-400">We're glad you're here!</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WelcomePopup;
