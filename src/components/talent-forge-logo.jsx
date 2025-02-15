import { motion } from "framer-motion"

export function TalentForgeLogo({ className = "", size = "default" }) {
  // Responsive size classes for different screen sizes
  const sizeClasses = {
    small: "text-xl md:text-2xl lg:text-3xl",
    default: "text-2xl md:text-3xl lg:text-5xl",
    large: "text-3xl md:text-4xl lg:text-6xl",
  }

  // Gradient with responsive opacity
  const gradientClasses = "bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400"

  // Animation variants for consistent animations
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  const textHoverVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    }
  }

  const underlineVariants = {
    hidden: { scaleX: 0 },
    visible: { 
      scaleX: 1,
      transition: {
        duration: 0.7,
        delay: 0.2,
        ease: "easeOut",
      }
    }
  }

  return (
    <motion.div
      className={`relative ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.h1
        className={`
          ${sizeClasses[size]}
          font-bold
          tracking-tight
          text-transparent
          bg-clip-text
          ${gradientClasses}
          whitespace-nowrap
        `}
      >
        <motion.span
          className="inline-block"
          variants={textHoverVariants}
          whileHover="hover"
        >
          Talent
        </motion.span>
        {" "}
        <motion.span
          className="inline-block"
          variants={textHoverVariants}
          whileHover="hover"
        >
          Forge
        </motion.span>
      </motion.h1>

      <motion.div
        className={`
          h-0.5
          mt-1
          rounded-full
          bg-gradient-to-r from-sky-400/40 via-cyan-300/40 to-blue-400/40
          opacity-60
        `}
        variants={underlineVariants}
        initial="hidden"
        animate="visible"
        style={{ transformOrigin: "left" }}
      />
    </motion.div>
  )
}