"use client";

import {
  Users,
  CalendarDays,
  ThumbsUp,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const team = [
  {
    name: "Emmanuel",
    role: "CEO",
    github: "https://github.com/emmanuel",
    linkedin: "https://linkedin.com/in/emmanuel",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    name: "Ifeanyi",
    role: "Lead Developer",
    github: "https://github.com/ifeanyi",
    linkedin: "https://linkedin.com/in/ifeanyi",
    image: "https://randomuser.me/api/portraits/men/20.jpg",
  },
  {
    name: "Igwebe",
    role: "Business Manager",
    github: "https://github.com/igwebe",
    linkedin: "https://linkedin.com/in/igwebe",
    image: "https://randomuser.me/api/portraits/men/30.jpg",
  },
];



export default function AboutPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "url('/bg-3.jpg')",
      }}
    >
      <br />
      <br />
      <div className="max-w-6xl mx-auto space-y-20">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2 mt-[1rem]">
            About Amansi-Tech
          </h1>
          <p className="text-black max-w-xl mx-auto">
            At Amansi-Tech, we are passionate about transforming ideas into
            digital excellence. Our team is committed to delivering innovative
            solutions that drive real business growth imagination to reality is our code you 
            give the order and we make the magic.
          </p>
        </motion.div>

        {/* Team Section */}
        <br />
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-violet-600 mb-8 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Our Team
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {team.map(({ name, role, github, linkedin, image }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                {/* Card with avatar inside */}
                <div className="bg-white dark:bg-violet-900 p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all duration-300 text-center">
                  <img
                    src={image}
                    alt={name}
                    className="w-28 h-28 rounded-full mx-auto object-cover shadow-md border-4 border-white mb-4"
                  />
                  <h4 className="font-semibold text-lg text-violet-600">{name}</h4>
                  <p className="text-violet-600 text-sm mb-3">{role}</p>
                  <div className="flex justify-center gap-4 text-xl text-violet-600">
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-500"
                    >
                      <FaLinkedin />
                    </a>
                    <a
                      href={github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white"
                    >
                      <FaGithub />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>


        {/* Timeline Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
            <CalendarDays className="w-5 h-5 mr-2" />
            Our Journey
          </h2>
          <ol className="relative border-l border-violet-300 pl-4 text-gray-300">
            {[
              { year: "2021", text: "Amansi-Tech was founded." },
              { year: "2022", text: "Launched our first product for Eigig-resources." },
              { year: "2023", text: "Expanded to UI/UX and Branding services." },
              { year: "2024", text: "Reached 100+ client milestones globally." },
            ].map((event, i) => (
              <li key={i} className="mb-6 ml-4">
                <div className="absolute w-3 h-3 bg-violet-600 rounded-full -left-1.5 top-1.5"></div>
                <time className="block text-sm font-semibold text-white mb-1">
                  {event.year}
                </time>
                <p className="text-gray-300 text-sm">{event.text}</p>
              </li>
            ))}
          </ol>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
            <ThumbsUp className="w-5 h-5 mr-2" />
            What Clients Say
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              "Incredible service! Highly professional team.",
              "Amansi-Tech exceeded all expectations!",
            ].map((quote, i) => (
              <div key={i} className="bg-violet-50 p-4 rounded-lg shadow">
                <p className="text-gray-700 italic">"{quote}"</p>
                <span className="block mt-2 font-medium text-sm text-violet-600">
                  – Client {i + 1}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Contact Form Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Get in Touch
          </h2>
          <form
            action="https://formsubmit.co/p.star.chinedu@gmail.com"
            method="POST"
            className="bg-white p-6 rounded-xl shadow space-y-4 max-w-xl mx-auto text-black"
          >
            <input type="hidden" name="_captcha" value="false" />
            <input
              type="hidden"
              name="_next"
              value="https://amansi-tech.vercel.app/thankyou"
            />

            <input
              type="text"
              name="name"
              required
              placeholder="Your Name"
              className="w-full border rounded p-2"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Your Email"
              className="w-full border rounded p-2"
            />
            <textarea
              name="message"
              rows={4}
              required
              placeholder="Your Message"
              className="w-full border rounded p-2"
            ></textarea>
            <button
              type="submit"
              className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
            >
              Send Message
            </button>
          </form>
        </motion.section>

        <br />
        <br />
        <br />
      </div>
    </div>
  );
}
