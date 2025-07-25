'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/60 shadow backdrop-blur text-white'
          : 'bg-violet-600 pt-[1px] pb-[1px] text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-2">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          {/* Optional Logo Placeholder */}
          {/* <Image src="/logo.svg" alt="Logo" width={40} height={40} /> */}
          <h1 className="text-[18px] font-bold leading-tight">
            Amansi-technologies
            <br />
            &Graphs-Limited
          </h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 font-medium">
          <Link href="/" className="hover:scale-90 transform transition duration-300 font-bold hover:text-gray-200">
            Home
          </Link>
          <Link href="#" className="hover:scale-90 transform transition duration-300 font-bold hover:text-gray-200">
            About
          </Link>
          <Link href="/contact" className="hover:scale-90 transform transition duration-300 font-bold hover:text-gray-200">
            Contact
          </Link>
          <Link href="#" className="hover:scale-90 transform transition duration-300 font-bold hover:text-gray-200">
            Services
          </Link>
          <Link href="#" className="hover:scale-90 transform transition duration-300 font-bold hover:text-gray-200">
            Projects
          </Link>
        </nav>

        {/* Desktop Button */}
        <div className="hidden md:block">
          <Link href="/contact">
            <button className="bg-white text-violet-600 font-bold px-4 py-2 rounded hover:bg-gray-100 transition">
              Get in touch
            </button>
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <nav className="flex flex-col gap-3 font-medium">
            <Link href="/" className="hover:text-gray-600 transition">Home</Link>
            <Link href="#" className="hover:text-gray-600 transition">About</Link>
            <Link href="/contact" className="hover:text-gray-600 transition">Contact</Link>
            <Link href="#" className="hover:text-gray-600 transition">Services</Link>
            <Link href="#" className="hover:text-gray-600 transition">Training</Link>
            <Link href="#" className="hover:text-gray-600 transition">Projects</Link>
            <Link href="/contact">
              <button className="mt-2 bg-white text-violet-600 font-bold px-4 py-2 rounded hover:bg-violet-100 transition w-full text-left">
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
