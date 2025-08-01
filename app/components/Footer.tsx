// app/components/Footer.tsx
import Link from "next/link";
import { FaTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold text-white">amansi‑tech</h3>
          <p className="mt-2 text-sm">
            Innovating reliable tech solutions for your business.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-white mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="/about" className="hover:underline">About Us</Link></li>
            <li><Link href="/services" className="hover:underline">Services</Link></li>
            <li><Link href="/blog" className="hover:underline">Blog</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-white mb-2">Contact Us</h4>
          <p className="text-sm">
            Email:{" "}
            <Link href="mailto:p.star.chinedu@gmail.com" className="hover:underline">
              p.star.chinedu@gmail.com
            </Link>
          </p>
          <p className="text-sm">
            Phone:{" "}
            <Link href="tel:+2348023101101" className="hover:underline">
              +(234) 802 310 1101
            </Link>
          </p>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="font-semibold text-white mb-2">Follow Us</h4>
          <div className="flex space-x-3">
            <Link href="https://twitter.com" aria-label="Twitter" className="hover:text-white">
              <FaTwitter size={20} />
            </Link>
            <Link href="https://facebook.com/profile.php?.id=61578831599809" aria-label="Facebook" className="hover:text-white">
              <FaFacebookF size={20} />
            </Link>
            <Link href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-white">
              <FaLinkedinIn size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm">
        &copy; {year} amansi‑tech. All rights reserved. |{" "}
        <Link href="/privacy" className="hover:underline">Privacy Policy</Link> |{" "}
        <Link href="/terms" className="hover:underline">Terms of Service</Link>
      </div>
    </footer>
  );
}
