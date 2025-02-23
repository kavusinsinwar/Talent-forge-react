"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import companies from "../data/companies.json"
import faqs from "../data/faq.json"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Link } from "react-router-dom"
import { colors } from "../styles/color"
import { Sparkles, ArrowRight } from "lucide-react"
import { TalentForgeLogo } from "../components/talent-forge-logo"
import { BarLoader } from "react-spinners"
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const LandingPage = () => {
  return (
    
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800-tr relative overflow-hidden">
      
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-[#51e2g5]/10 via-transparent to-transparent blur-xl" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-radial from-[#ffa8b6]/5 via-transparent to-transparent blur-xl" />
      </div>

      <main className="relative z-10 flex flex-col gap-8 sm:gap-16 lg:gap-24 py-6 sm:py-12 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.section
          className="text-center space-y-4 sm:space-y-6 lg:space-y-8 pt-4 sm:pt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative inline-block">
            <motion.h1
              className="flex flex-col items-center justify-center gap-2 sm:gap-4 font-extrabold text-3xl sm:text-5xl lg:text-7xl tracking-tighter"
              style={{
                background: `linear-gradient(135deg, ${colors.brightBlue}, ${colors.blueGreen}, ${colors.dustyWhite}, ${colors.pinkSand})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <span className="text-balance p-4">Find Your Dream Job</span>
              <span className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
                and get Hired
               
              </span>
            </motion.h1>
            <motion.div
              className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 text-[#51e2f5]"
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              }}
            >
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
            </motion.div>
          </div>
          <motion.p
            className="text-gray-300 text-sm sm:text-lg lg:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Explore thousands of job listings or find the perfect candidate
          </motion.p>
        </motion.section>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <Link to="/jobs" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-[#97f3ff] hover:bg-[#51e2f5]/90 text-black font-semibold px-6 sm:px-8 py-6 text-base sm:text-lg group">
              Find Jobs
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/post-job" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-red-800 hover:bg-red-950 text-black font-semibold px-6 sm:px-8 py-6 text-base sm:text-lg group">
              Post a Job
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        {/* Companies Carousel */}
        <div className="relative -mx-4 sm:mx-0">
          <Carousel
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            className="w-full py-6 sm:py-10"
          >
            <CarouselContent className="-ml-2 sm:-ml-4">
              {companies.map((company) => (
                <CarouselItem key={company.id} className="pl-2 sm:pl-4 basis-1/3 sm:basis-1/4 lg:basis-1/6">
                  <motion.div className="relative group" whileHover={{ scale: 1.05 }}>
                    <img
                      src={company.path || "/placeholder.svg"}
                      alt={company.name}
                      className="h-8 sm:h-12 lg:h-14 w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-gray-900 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-gray-900 to-transparent" />
        </div>

        {/* Banner Image */}
        <motion.div
          className="rounded-lg sm:rounded-xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img src="/Banner1.jpg" alt="Banner" className="w-full h-full object-cover" />
        </motion.div>

        {/* Feature Cards */}
        <motion.section
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <Card className="bg-gray-800/50 backdrop-blur border-[#51e2f5]/20 hover:border-[#51e2f5]/40 transition-all duration-300 hover:transform hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="font-bold text-[#51e2f5] text-xl sm:text-2xl">For Job Seekers</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 text-sm sm:text-base">
              Search and apply for jobs, track applications, and more.
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 backdrop-blur border-[#ffa8b6]/20 hover:border-[#ffa8b6]/40 transition-all duration-300 hover:transform hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="font-bold text-[#ffa8b6] text-xl sm:text-2xl">For Employers</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 text-sm sm:text-base">
              Post jobs, manage applications, and find the best candidates.
            </CardContent>
          </Card>
        </motion.section>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-100 mb-8">Frequently Asked Questions</h2>
          <Accordion type="multiple" className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index + 1}`}
                className="border border-gray-700/50 rounded-lg backdrop-blur bg-gray-800/30 data-[state=open]:bg-gray-800/50 transition-colors duration-200"
              >
                <AccordionTrigger className="text-gray-200 hover:text-[#51e2f5] px-4 py-6 text-left text-sm sm:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 px-4 pb-6 text-sm sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </main>
    </div>
  )
}

export default LandingPage
