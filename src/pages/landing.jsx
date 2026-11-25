import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Search,
  Briefcase,
  Zap,
  Building2,
  BarChart3,
  Bot,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

const LandingPage = () => {
  const [heroSearch, setHeroSearch] = useState("");
  const navigate = useNavigate();

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate("/jobs");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-12">
      {/* Hero Card: White surface on gray canvas */}
      <section className="w-full bg-[var(--color-surface)] p-4 sm:p-10 lg:p-14 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-card text-center space-y-5 sm:space-y-6">
        {/* Soft Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-pill)] text-xs font-semibold bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TalentForge Pro &bull; Professional Career Platform</span>
        </div>

        {/* Display Title: 24px-28px on mobile, larger on desktop */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-text)] leading-[1.2] px-1">
          Discover your next opportunity.{" "}
          <span className="text-[var(--color-primary)]">Built for tech talent.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[var(--color-text-muted)] text-[14px] sm:text-[17px] max-w-2xl mx-auto leading-relaxed px-1">
          Search verified engineering roles, evaluate AI profile fit scores, and apply seamlessly with transparent tracking.
        </p>

        {/* Search Bar: Pill shaped, light gray background */}
        <div className="pt-1 max-w-xl mx-auto w-full">
          <form
            onSubmit={handleHeroSearch}
            className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-[var(--radius-md)] sm:rounded-[var(--radius-pill)] bg-[var(--color-surface-alt)] border border-[var(--color-border)] focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary-soft)] transition-all"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-subtle)] pointer-events-none" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search job title, skills, or company"
                className="w-full pl-10 pr-3 py-2 text-[14px] bg-transparent outline-none text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)]"
              />
            </div>
            <Button
              type="submit"
              size="default"
              className="w-full sm:w-auto h-9 px-6 rounded-[var(--radius-pill)]"
            >
              Search
            </Button>
          </form>

          {/* Quick Filter Tags */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-3 flex-wrap text-[11px] sm:text-[12px] text-[var(--color-text-subtle)]">
            <span>Trending:</span>
            {["React Developer", "Full-Stack", "Frontend Lead", "Remote India"].map((kw) => (
              <button
                key={kw}
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(kw)}`)}
                className="px-2.5 py-0.5 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] text-[var(--color-text-muted)] transition-colors"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center items-center pt-2 w-full max-w-sm sm:max-w-none mx-auto">
          <Link to="/jobs" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-10 px-6 gap-2 font-semibold">
              <Briefcase className="w-4 h-4" />
              Browse Open Jobs
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/post-job" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto h-10 px-6 gap-2 font-semibold">
              <Building2 className="w-4 h-4" />
              Post a Role
            </Button>
          </Link>
        </div>
      </section>

      {/* Companies Logos */}
      <section className="space-y-3">
        <p className="text-center text-[12px] font-medium text-[var(--color-text-subtle)] uppercase tracking-wider">
          Connecting talent with teams at
        </p>

        <div className="relative overflow-hidden py-1">
          <Carousel
            plugins={[
              Autoplay({
                delay: 2400,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-3">
              {companies.map((company) => (
                <CarouselItem key={company.id} className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
                  <div className="p-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center h-14 shadow-card hover:border-[var(--color-primary)] transition-colors">
                    <img
                      src={company.path || "/placeholder.svg"}
                      alt={company.name}
                      className={`h-7 w-auto max-w-full object-contain filter grayscale opacity-75 hover:opacity-100 transition-opacity ${
                        company.name === "uber" ? "dark:invert" : ""
                      }`}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* 3 Pillar Cards: White cards, 1px border, shadow-card */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-card space-y-2.5">
          <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-[16px] font-semibold text-[var(--color-text)]">1-Click Easy Apply</h3>
          <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">
            Apply to open roles directly with your saved resume. No tedious multi-step application forms.
          </p>
        </div>

        <div className="p-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-card space-y-2.5">
          <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <h3 className="text-[16px] font-semibold text-[var(--color-text)]">AI Fit & Tailored Pitches</h3>
          <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">
            Get an instant match score, skill recommendations, and generated cover letters powered by Gemini 3.5.
          </p>
        </div>

        <div className="p-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-card space-y-2.5">
          <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--color-primary-soft)] text-[var(--color-accent)] flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-[16px] font-semibold text-[var(--color-text)]">Transparent Status Tracker</h3>
          <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">
            Know in real-time whether your application is Submitted, In Review, or progressing to Interview.
          </p>
        </div>
      </section>

      {/* Dual Audience Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <div className="p-4 sm:p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-card space-y-3">
          <span className="px-2.5 py-0.5 rounded-[var(--radius-pill)] text-[12px] font-semibold bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            For Candidates
          </span>
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[var(--color-text)]">
            Find your next high-impact engineering role
          </h2>
          <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">
            Filter curated tech positions, run AI fit assessments on your resume, and communicate with verified recruiters.
          </p>
          <div className="pt-1">
            <Link to="/jobs">
              <Button size="sm" className="gap-1.5 font-semibold">
                Explore Jobs
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="p-4 sm:p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-card space-y-3">
          <span className="px-2.5 py-0.5 rounded-[var(--radius-pill)] text-[12px] font-semibold bg-[var(--color-primary-soft)] text-[var(--color-accent)]">
            For Recruiters & Founders
          </span>
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[var(--color-text)]">
            Hire qualified technical talent faster
          </h2>
          <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">
            Post opportunities with Markdown job requirements, review applicant resumes in 1-click, and manage candidates smoothly.
          </p>
          <div className="pt-1">
            <Link to="/post-job">
              <Button size="sm" variant="secondary" className="gap-1.5 font-semibold">
                Post an Opening
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section: Full-width card matching other sections */}
      <section className="w-full bg-[var(--color-surface)] p-4 sm:p-8 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card space-y-4 sm:space-y-5">
        <div className="space-y-1">
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[var(--color-text)]">
            Frequently Asked Questions
          </h2>
          <p className="text-[13px] text-[var(--color-text-muted)]">
            Answers to common questions about TalentForge Pro
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2.5">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-surface-alt)] px-3.5 sm:px-5 transition-colors"
            >
              <AccordionTrigger className="text-left font-semibold text-[13px] sm:text-[15px] hover:text-[var(--color-primary)] py-3 sm:py-3.5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[12px] sm:text-[14px] text-[var(--color-text-muted)] leading-relaxed pb-3 sm:pb-3.5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
};

export default LandingPage;
