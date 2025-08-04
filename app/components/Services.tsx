import React from 'react'
import Offer from './Offer';
import styles from '../styles/BackgroundImage.module.css';
import ServicesPackage from "./Package"

const Services = () => {
  return (
    <section  className={styles.container} id="projects">

      <div className="relative flex items-center justify-center my-8 mx-auto w-fit">

        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-[2px] bg-violet-300"></span>

        <h2 className="text-4xl font-extrabold text-violet-600 relative z-10">
          Services
        </h2>
        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-[2px] bg-violet-400"></span>
      </div>


      <div className="star-container flex flex-wrap gap-4 p-4 justify-center">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`star-wrapper ${i < 3 ? "first-stars" : ""}`}>
            ⭐
          </div>
        ))}
      </div>

      <Offer />
      <ServicesPackage />
    </section>
  )
}
 
export default Services
