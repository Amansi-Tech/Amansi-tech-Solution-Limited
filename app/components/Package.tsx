// components/ServicesSection.tsx
"use client";
import Image from "next/image";
import Link from "next/link";

type Service = {
  iconSrc: string;
  title: string;
  description: string;
  motivation?: string;
  href?: string;
};

const services: Service[] = [
  {
    iconSrc: "/icons/app-dev.svg",
    title: "Web-App Development",
    description: "We build fast, scalable, and reliable web applications.",
    motivation: "Empower your business with cutting-edge digital experiences.",
    href: "/services/web-app-development",
  },
  {
    iconSrc: "/icons/uiux.svg",
    title: "UI/UX Design",
    description: "Crafting user-first designs that are both intuitive and beautiful.",
    motivation: "Designs that speak, engage, and convert effortlessly.",
    href: "/services/ui-ux-design",
  },
  {
    iconSrc: "/icons/digital-marketing.svg",
    title: "Digital Marketing",
    description: "Boost your online presence with strategic digital campaigns.",
    href: "/services/digital-marketing",
  },
  {
    iconSrc: "/icons/graphics.svg",
    title: "Graphics Designer",
    description: "Creative designs for your brand, social media, and more.",
    motivation: "Make your brand stand out with striking visuals.",
    href: "/services/graphics-designer",
  },
];

export default function ServicesPackage() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center text-violet-700 mb-8">
          Our Services
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((svc, idx) => (
            <Link
              key={idx}
              href={svc.href || "#"}
              className="group block bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition"
            >
              <div className="w-16 h-16 mx-auto mb-4">
                <Image
                  src={svc.iconSrc}
                  alt={svc.title}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-2 group-hover:text-violet-600">
                {svc.title}
              </h3>
              <p className="text-gray-600 text-center">{svc.description}</p>
              {svc.motivation && (
                <p className="text-sm text-center text-violet-700 italic mt-2 mb-2">
                  {svc.motivation}
                </p>
              )}
              <div className="text-center">
                <button className="text-violet-600 font-medium hover:underline">
                  Learn More →
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
