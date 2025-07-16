import { motion } from 'framer-motion';

export default function CharacterAutoType() {
  const sentence = "Framer Motion auto-typing.";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Delay between each character
      },
    },
  };

  const characterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {sentence.split("").map((char, index) => (
        <motion.span key={index} variants={characterVariants}>
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}