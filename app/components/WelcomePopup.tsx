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
          {/* Overlay Blur */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 2 }}
            exit={{ opacity: 0 }}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.9 }}
            className="fixed ml-[44rem] m-[15rem] -translate-x-1/2 z-50 bg-white text-black p-5 sm:p-6 rounded-2xl border border-violet-500 shadow-xl w-[100%] max-w-lg"
          >
            <button onClick={closePopup} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className=" justify-between items-start gap-4 p-[23px]">

              <h1 className="text-violet-600 font-bold pb-[3px]">Amansi-tech web team</h1>
              <hr className='w-[20rem] pb-[3px]' />
              <div className='flex g-[10px] items-center justify-center'>
                <div>
                  <p className="text-sm sm:text-base font-medium leading-relaxed text-black">
                    Saw your 'IP address' and decided to welcome you
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 30, 0] }}
                    transition={{ repeat: 100, duration: 1.7 }}
                    className="text-2xl sm:text-3xl"
                  >
                    👋
                  </motion.span>
                  <div>
                  </div>
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
