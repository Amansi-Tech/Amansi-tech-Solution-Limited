'use client';
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300  ${
        scrolled ? 'bg-white/60 shadow backdrop-blur text-white' : 'bg-violet-600 pt-[1px] pb-[1px] text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between m-2">
        
        <div className="text-xl font-bold">Amansi-tech</div>

       <nav className="hidden md:flex space-x-6 font-medium">
  <Link href="#" className="hover:scale-90 transform transition duration-300 font-bold hover:text-gray-200">
    Home
  </Link>
  <Link href="/About" className="hover:scale-90 transform transition duration-300 font-bold hover:text-gray-200">
    About
  </Link>
  <Link href="#" className="hover:scale-90 transform transition duration-300 font-bold hover:text-gray-200">
    Services
  </Link>
  <Link href="#" className="hover:scale-90 transform transition duration-300 font-bold hover:text-gray-200">
    Training
  </Link>
  <Link href="#" className="hover:scale-90 transform transition duration-300 font-bold hover:text-gray-200">
    Projects
  </Link>
</nav>


        <div className="hidden md:block">
          <Link href="#">
            <button className="bg-white text-violet-600 font-bold px-4 py-2 rounded hover:bg-gray-100 transition">
              Get in touch
            </button>
          </Link>
        </div>

        <button
          className="md:hidden text-blue-violet-800"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <nav className="flex flex-col gap-3 font-medium">
            <Link href="#" className="hover:text-gray-600 transition">Home</Link>
            <Link href="#" className="hover:text-gray-600 transition">About</Link>
            <Link href="#" className="hover:text-gray-600 transition">Services</Link>
            <Link href="#" className="hover:text-gray-600 transition">Training</Link>
            <Link href="#" className="hover:text-gray-600 transition">Projects</Link>
            <Link href="#">
              <button className="mt-2 text-violet-600 text-white px-4 py-2 rounded hover:violet-700 transition w-full text-left">
                Get in touch
              </button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

    // <div>
    //      <header
    //   className={`sticky top-0 z-50 transition-all duration-300 ${
    //     scrolled ? 'bg-white/80 shadow backdrop-blur' : 'bg-transparent'
    //   }`}
    //   >
    //     <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between ">
    //         <div>
    //             Amansi-tech
    //         </div>
    //         <nav className="space-x-4">

    //         <div>
    //             <ul className="flex gap-[10px] items-center justify-center text-orange-800 ">
    //             <li className="hover:text-orange-600 transition">Home</li>
    //             <li className="hover:text-orange-600 transition">About</li>
    //             <li className="hover:text-orange-600 transition">Services</li>
    //             <li className="hover:text-orange-600 transition">Training</li>
    //             <li className="hover:text-orange-600 transition">Projects</li>
    //         </ul>
    //         </div>
    //         </nav>
    //         <div>
    //            <Link href=""><button>Get-in-touch</button></Link> 
    //         </div>
    //     </div>
    //     </header>
    // </div>