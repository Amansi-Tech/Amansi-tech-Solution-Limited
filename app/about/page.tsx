"use client";

import {
  Users,
  CalendarDays,
  ThumbsUp,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/bg-1.jpg')", // Replace with your actual image path
      }}
      >
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-violet-700 mb-2">About Amansi-Tech</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            At Amansi-Tech, we are passionate about transforming ideas into digital excellence.
            Our team is committed to delivering innovative solutions that drive real business growth.
          </p>
        </motion.div>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-violet-700 mb-8 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {["Emmanuel", "Ifeanyi", "Igwebe"].map((name, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow text-center hover:shadow-md transition"
              >
                <img
                  src={`https://via.placeholder.com/150?text=${name}`}
                  alt={name}
                  className="w-24 h-24 mx-auto rounded-full object-cover mb-2"
                />
                <h4 className="font-semibold text-lg text-violet-700">{name}</h4>
                <p className="text-gray-500 text-sm">
                  {name === "Emmanuel"
                    ? "CEO"
                    : name === "Ifeanyi"
                    ? "Lead Developer"
                    : "Business manager"}
                </p>
              </div>
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
          <h2 className="text-2xl font-bold text-violet-700 mb-8 flex items-center">
            <CalendarDays className="w-5 h-5 mr-2" />
            Our Journey
          </h2>
          <ol className="relative border-l border-violet-300 pl-4">
            {[
              { year: "2021", text: "Amansi-Tech was founded." },
              { year: "2022", text: "Launched our first product for Eigig-resources." },
              { year: "2023", text: "Expanded to UI/UX and Branding services." },
              { year: "2024", text: "Reached 100+ client milestones globally." },
            ].map((event, i) => (
              <li key={i} className="mb-6 ml-4">
                <div className="absolute w-3 h-3 bg-violet-600 rounded-full -left-1.5 top-1.5"></div>
                <time className="block text-sm font-semibold text-violet-500 mb-1">{event.year}</time>
                <p className="text-gray-700 text-sm">{event.text}</p>
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
          <h2 className="text-2xl font-bold text-violet-700 mb-8 flex items-center">
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
          <h2 className="text-2xl font-bold text-violet-700 mb-8 flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Get in Touch 
          </h2>
          <form
            action="https://formsubmit.co/p.star.chinedu@gmail.com"
            method="POST"
            className="bg-white p-6 rounded-xl shadow space-y-4 max-w-xl mx-auto"
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
      </div>
    </div>
  );
}
