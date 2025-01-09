import { motion } from "framer-motion";

export function TalentForgeLogo({ className = "", size = "default" }) {
  const sizeClasses = {
    small: "text-2xl md:text-3xl",
    default: "text-4xl md:text-5xl",
    large: "text-6xl md:text-8xl",
  };

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Main text with gradient and animation */}
      <motion.h1 
        className={`${sizeClasses[size]} font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#51e2f5] via-[#9df9ef] to-[#ffa8b6]`}
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.span
          className="inline-block"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Talent
        </motion.span>
        {" "}
        <motion.span
          className="inline-block"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Forge
        </motion.span>
      </motion.h1>

      {/* Animated underline */}
      <motion.div
        className="h-0.5 mt-1 bg-gradient-to-r from-[#51e2f5] via-[#9df9ef] to-[#ffa8b6]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ transformOrigin: "left" }}
      />
    </motion.div>
  );
}

