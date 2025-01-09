import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import companies from "../data/companies.json"
import faqs from "../data/faq.json"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Link } from "react-router-dom"
import { colors } from "../styles/color"
import { Sparkles } from 'lucide-react'
import { TalentForgeLogo } from "../components/talent-forge-logo";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-[#51e2f5]/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-radial from-[#ffa8b6]/10 via-transparent to-transparent" />
      </div>

      <main className="relative z-10 flex flex-col gap-10 sm:gap-20 py-10 sm:py-20 px-4 max-w-7xl mx-auto">
        <motion.section 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative inline-block">
            <motion.h1 
              className="flex flex-col items-center justify-center font-extrabold text-4xl sm:text-6xl lg:text-8xl tracking-tighter py-4"
              style={{
                background: `linear-gradient(135deg, ${colors.brightBlue}, ${colors.blueGreen}, ${colors.dustyWhite}, ${colors.pinkSand})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Find Your Dream Job
              <span className="flex items-center gap-2 sm:gap-6">
                and get
                <TalentForgeLogo size="large" className="h-14 sm:h-24 lg:h-32" />
              </span>
            </motion.h1>
            <motion.div
              className="absolute -top-4 -right-4 text-[#51e2f5]"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8" />
            </motion.div>
          </div>
          <motion.p 
            className="text-gray-300 sm:mt-4 text-xs sm:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Explore thousands of job listings or find the perfect candidate
          </motion.p>
        </motion.section>

        <motion.div 
          className="flex gap-6 justify-center"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <Link to="/jobs">
            <Button 
              className="bg-[#97f3ff] hover:bg-[#51e2f5]/90 text-black font-semibold px-8 py-3 text-lg"
            >
              Find Jobs
            </Button>
          </Link>
          <Link to="/post-job">
            <Button 
              className="bg-[#fd526e] hover:bg-[#ffa8b6]/90 text-black font-semibold px-8 py-3 text-lg"
            >
              Post a Job
            </Button>
          </Link>
        </motion.div>

        <div className="relative">
          <Carousel
            plugins={[
              Autoplay({
                delay: 2000,
              })
            ]}
            className="w-full py-10"
          >
            <CarouselContent className="flex gap-5 sm:gap-20 items-center">
              {companies.map((company) => (
                <CarouselItem key={company.id} className="basis-1/3 lg:basis-1/6">
                  <motion.img
                    src={company.path}
                    alt={company.name}
                    className="h-9 sm:h-14 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-gray-900" />
        </div>

        <motion.img 
          src="/Banner1.jpg" 
          className="w-full rounded-xl  shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />

        <motion.section 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <Card className="bg-gray-800/50 backdrop-blur border-[#51e2f5]/20 hover:border-[#51e2f5]/40 transition-colors">
            <CardHeader>
              <CardTitle className="font-bold text-[#51e2f5]">For Job Seekers</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              Search and apply for jobs, track applications, and more.
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 backdrop-blur border-[#ffa8b6]/20 hover:border-[#ffa8b6]/40 transition-colors">
            <CardHeader>
              <CardTitle className="font-bold text-[#ffa8b6]">For Employers</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              Post jobs, manage applications, and find the best candidates.
            </CardContent>
          </Card>
        </motion.section>

        <Accordion type="multiple" className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index + 1}`}
              className="border border-gray-700/50 rounded-lg backdrop-blur bg-gray-800/30"
            >
              <AccordionTrigger className="text-gray-200 hover:text-[#51e2f5] px-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 px-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </div>
  )
}

export default LandingPage

