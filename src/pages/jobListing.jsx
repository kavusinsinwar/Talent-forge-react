import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import { useNavigate, useSearchParams } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import MDEditor from "@uiw/react-md-editor";

import JobCard from "@/components/job-card";
import { SkeletonJobCard, SkeletonJobDetails } from "@/components/skeleton-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplyJobDrawer } from "@/components/apply-job";

import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";
import {
  analyzeJobFit,
  generateTailoredPitch,
  generateInterviewQuestions,
} from "@/api/apiAi";

import {
  Briefcase,
  MapPin,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Share2,
  Users,
  Search,
  X,
  FileText,
  HelpCircle,
  Clock,
} from "lucide-react";

const JobListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoaded, user } = useUser();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "ai-fit" | "interview-prep"

  // AI Feature States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFitData, setAiFitData] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState(null);

  const { data: companies, fn: fnCompanies } = useFetch(getCompanies);

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      fnJobs();
    }
  }, [isLoaded, location, company_id, searchQuery]);

  useEffect(() => {
    if (jobs && jobs.length > 0) {
      if (!selectedJob || !jobs.some((j) => j.id === selectedJob.id)) {
        setSelectedJob(jobs[0]);
      }
    } else {
      setSelectedJob(null);
    }
  }, [jobs]);

  useEffect(() => {
    setAiFitData(null);
    setCoverLetter("");
    setInterviewQuestions(null);
    setActiveTab("overview");
  }, [selectedJob?.id]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search-query");
    setSearchQuery(query || "");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
    setSearchParams({});
  };

  const handleRunAiFit = async () => {
    if (!selectedJob) return;
    setActiveTab("ai-fit");
    if (aiFitData) return;

    setAiLoading(true);
    try {
      const result = await analyzeJobFit({
        jobTitle: selectedJob.title,
        companyName: selectedJob.company?.name,
        description: selectedJob.description,
        skills: user?.unsafeMetadata?.skills || "React, JavaScript, Tailwind, Node.js",
      });
      setAiFitData(result);
    } catch (err) {
      console.error("AI fit error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGeneratePitch = async () => {
    if (!selectedJob) return;
    setAiLoading(true);
    try {
      const pitch = await generateTailoredPitch({
        jobTitle: selectedJob.title,
        companyName: selectedJob.company?.name,
        description: selectedJob.description,
        candidateName: user?.fullName || "Candidate",
        skills: user?.unsafeMetadata?.skills || "Full-stack development, React, JavaScript",
      });
      setCoverLetter(pitch);
    } catch (err) {
      console.error("Pitch generation error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateInterviewPrep = async () => {
    if (!selectedJob) return;
    setActiveTab("interview-prep");
    if (interviewQuestions) return;

    setAiLoading(true);
    try {
      const result = await generateInterviewQuestions({
        jobTitle: selectedJob.title,
        description: selectedJob.description,
      });
      setInterviewQuestions(result?.questions || []);
    } catch (err) {
      console.error("Interview questions error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* 5.3 Filter Bar: White card surface, pill-shaped filter buttons */}
      <div className="bg-[var(--color-surface)] p-3 sm:p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card space-y-3">
        <form onSubmit={handleSearch} className="flex flex-col gap-2.5">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by title, skill, or company"
              name="search-query"
              defaultValue={searchQuery}
              className="pl-9 h-10 text-[14px] rounded-[var(--radius-pill)] bg-[var(--color-surface-alt)] focus:bg-[var(--color-surface)] border-transparent focus:border-[var(--color-primary)] w-full"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-nowrap items-center gap-2 w-full">
            {/* Location Pill Selector */}
            <Select value={location || "all"} onValueChange={(val) => setLocation(val === "all" ? "" : val)}>
              <SelectTrigger className="h-10 px-3 text-[12px] sm:text-[13px] rounded-[var(--radius-pill)] bg-[var(--color-surface-alt)] border-transparent hover:border-[var(--color-border)] w-full sm:min-w-[130px]">
                <MapPin className="w-3.5 h-3.5 mr-1 text-[var(--color-text-muted)] flex-shrink-0" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Locations</SelectItem>
                  {State.getStatesOfCountry("IN").map(({ name }) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Company Pill Selector */}
            <Select value={company_id || "all"} onValueChange={(val) => setCompany_id(val === "all" ? "" : val)}>
              <SelectTrigger className="h-10 px-3 text-[12px] sm:text-[13px] rounded-[var(--radius-pill)] bg-[var(--color-surface-alt)] border-transparent hover:border-[var(--color-border)] w-full sm:min-w-[130px]">
                <Building2 className="w-3.5 h-3.5 mr-1 text-[var(--color-text-muted)] flex-shrink-0" />
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies?.map(({ name, id }) => (
                    <SelectItem key={id} value={String(id)}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button type="submit" className="col-span-2 sm:col-span-1 h-10 px-5 text-[13px] rounded-[var(--radius-pill)] w-full sm:w-auto">
              Find Jobs
            </Button>

            {(searchQuery || location || company_id) && (
              <button
                type="button"
                onClick={clearFilters}
                className="col-span-2 sm:col-span-1 h-9 px-3 text-[12px] font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-danger)] flex items-center justify-center gap-1 rounded-[var(--radius-pill)] hover:bg-[var(--color-surface-alt)] transition-colors w-full sm:w-auto"
              >
                <X className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </form>

        {/* Quick Filter Pills (28px tall, primary-soft background) */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar text-[12px]">
          <span className="text-[var(--color-text-subtle)] font-medium text-[11px] uppercase tracking-wide flex-shrink-0">
            Filters:
          </span>
          <button
            onClick={() => setLocation("")}
            className={`h-7 px-3 rounded-[var(--radius-pill)] font-medium transition-colors flex-shrink-0 ${
              !location
                ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold"
                : "bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]"
            }`}
          >
            All Locations
          </button>
          <button
            onClick={() => setLocation("Karnataka")}
            className={`h-7 px-3 rounded-[var(--radius-pill)] font-medium transition-colors flex-shrink-0 ${
              location === "Karnataka"
                ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold"
                : "bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]"
            }`}
          >
            Bengaluru / Karnataka
          </button>
          <button
            onClick={() => setLocation("Maharashtra")}
            className={`h-7 px-3 rounded-[var(--radius-pill)] font-medium transition-colors flex-shrink-0 ${
              location === "Maharashtra"
                ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold"
                : "bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]"
            }`}
          >
            Mumbai / Pune
          </button>
          <button
            onClick={() => setLocation("Delhi")}
            className={`h-7 px-3 rounded-[var(--radius-pill)] font-medium transition-colors flex-shrink-0 ${
              location === "Delhi"
                ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold"
                : "bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]"
            }`}
          >
            Delhi NCR
          </button>
        </div>
      </div>

      {/* Signature 2-Pane Split-Screen Grid: Left List (5 cols) & Right Sticky Detail (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Job Feed */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between px-1 text-[12px] text-[var(--color-text-muted)]">
            <span className="font-semibold text-[var(--color-text)]">
              {jobs?.length || 0} Openings
            </span>
            <span>Sorted by Recent</span>
          </div>

          <div className="space-y-2 max-h-[calc(100vh-190px)] overflow-y-auto pr-1">
            {loadingJobs ? (
              <>
                <SkeletonJobCard />
                <SkeletonJobCard />
                <SkeletonJobCard />
              </>
            ) : jobs?.length ? (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSelected={selectedJob?.id === job.id}
                  onSelect={(j) => setSelectedJob(j)}
                  savedInit={job?.saved?.length > 0}
                  onJobAction={fnJobs}
                />
              ))
            ) : (
              /* Empty state (Section 4.13) */
              <div className="bg-[var(--color-surface)] p-8 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-surface-alt)] flex items-center justify-center text-[var(--color-text-muted)] mx-auto">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-[15px] text-[var(--color-text)]">
                  No matching jobs found
                </h3>
                <p className="text-[13px] text-[var(--color-text-muted)] max-w-xs mx-auto">
                  Try adjusting your search criteria or clearing active location filters.
                </p>
                <Button size="sm" variant="secondary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Job Detail Inspector (7 cols on desktop, sticky top-20) */}
        <div className="hidden lg:block lg:col-span-7 sticky top-[72px] bg-[var(--color-surface)] rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card overflow-hidden">
          {loadingJobs ? (
            <SkeletonJobDetails />
          ) : selectedJob ? (
            <div className="max-h-[calc(100vh-100px)] overflow-y-auto">
              {/* Header Box */}
              <div className="p-5 border-b border-[var(--color-border)] space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
                      {selectedJob.company?.logo_url ? (
                        <img
                          src={selectedJob.company.logo_url}
                          alt={selectedJob.company?.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Building2 className="w-7 h-7 text-[var(--color-text-muted)]" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-[19px] font-bold text-[var(--color-text)] leading-snug">
                        {selectedJob.title}
                      </h2>
                      <p className="text-[14px] font-medium text-[var(--color-primary)] hover:underline cursor-pointer">
                        {selectedJob.company?.name || "Verified Employer"}
                      </p>
                      <div className="flex items-center gap-2.5 text-[12px] text-[var(--color-text-subtle)] mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {selectedJob.location || "Remote"}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {selectedJob.applications?.length || 0} applicants
                        </span>
                        <span>&bull;</span>
                        <span className="text-[var(--color-accent)] font-semibold">
                          {selectedJob.isOpen ? "Actively Hiring" : "Closed"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/job/${selectedJob.id}`);
                      alert("Link copied to clipboard!");
                    }}
                    className="p-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                    title="Share Job Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2.5 pt-1">
                  <ApplyJobDrawer
                    job={selectedJob}
                    user={user}
                    fetchJob={fnJobs}
                    applied={selectedJob?.applications?.find(
                      (ap) => ap.candidate_id === user?.id
                    )}
                  />

                  {/* AI Fit Assessment Pill */}
                  <button
                    onClick={handleRunAiFit}
                    className="h-9 px-3.5 rounded-[var(--radius-pill)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] text-[var(--color-text)] hover:text-[var(--color-primary)] text-[12px] font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    AI Fit Score
                  </button>

                  {/* Interview Prep Pill */}
                  <button
                    onClick={handleGenerateInterviewPrep}
                    className="h-9 px-3.5 rounded-[var(--radius-pill)] border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-[12px] font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Interview Prep
                  </button>
                </div>

                {/* 4.10 Tabs: Horizontal, text-only, with a 2px primary underline on active tab */}
                <div className="flex gap-6 border-t border-[var(--color-border)] pt-2.5 text-[13px] font-semibold">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`pb-1 transition-colors relative ${
                      activeTab === "overview"
                        ? "text-[var(--color-primary)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[var(--color-primary)]"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    About the Job
                  </button>

                  <button
                    onClick={handleRunAiFit}
                    className={`pb-1 transition-colors relative flex items-center gap-1 ${
                      activeTab === "ai-fit"
                        ? "text-[var(--color-primary)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[var(--color-primary)]"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    AI Match & Insights
                  </button>

                  <button
                    onClick={handleGenerateInterviewPrep}
                    className={`pb-1 transition-colors relative flex items-center gap-1 ${
                      activeTab === "interview-prep"
                        ? "text-[var(--color-primary)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[var(--color-primary)]"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Interview Q&A
                  </button>
                </div>
              </div>

              {/* Tab 1: Overview */}
              {activeTab === "overview" && (
                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-3 gap-3 p-3 rounded-[var(--radius-sm)] bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-[12px]">
                    <div>
                      <span className="text-[var(--color-text-subtle)] block">Job Type</span>
                      <span className="font-semibold text-[var(--color-text)]">Full-time</span>
                    </div>
                    <div>
                      <span className="text-[var(--color-text-subtle)] block">Workplace</span>
                      <span className="font-semibold text-[var(--color-text)]">
                        {selectedJob.location?.toLowerCase().includes("remote") ? "Remote" : "On-site / Hybrid"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--color-text-subtle)] block">Status</span>
                      <span className="font-semibold text-[var(--color-accent)]">
                        {selectedJob.isOpen ? "Accepting Applicants" : "Closed"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-[15px] font-semibold text-[var(--color-text)]">About the Role</h3>
                    <div className="text-[14px] leading-relaxed text-[var(--color-text-muted)] prose max-w-none">
                      <MDEditor.Markdown
                        source={selectedJob.description || "No description provided."}
                        style={{ background: "transparent", color: "inherit" }}
                      />
                    </div>
                  </div>

                  {selectedJob.requirements && (
                    <div className="space-y-2 pt-4 border-t border-[var(--color-border)]">
                      <h3 className="text-[15px] font-semibold text-[var(--color-text)]">
                        Key Requirements & Technical Skills
                      </h3>
                      <div className="text-[14px] leading-relaxed text-[var(--color-text-muted)] prose max-w-none">
                        <MDEditor.Markdown
                          source={selectedJob.requirements}
                          style={{ background: "transparent", color: "inherit" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: AI Fit Assessment */}
              {activeTab === "ai-fit" && (
                <div className="p-5 space-y-5">
                  {aiLoading ? (
                    <div className="py-10 text-center space-y-2">
                      <div className="w-8 h-8 rounded-full skeleton-shimmer mx-auto" />
                      <p className="text-[14px] font-semibold text-[var(--color-text)]">
                        Evaluating candidate profile with Gemini AI...
                      </p>
                      <p className="text-[12px] text-[var(--color-text-muted)]">
                        Analyzing technical requirements and core competencies
                      </p>
                    </div>
                  ) : aiFitData ? (
                    <div className="space-y-5">
                      {/* Match Score Card */}
                      <div className="p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-alt)] flex items-center justify-between gap-4">
                        <div>
                          <span className="text-[11px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide">
                            Fit Assessment
                          </span>
                          <h4 className="text-[17px] font-bold text-[var(--color-text)] mt-0.5">
                            {aiFitData.verdict || "Strong Match"}
                          </h4>
                          <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
                            {aiFitData.recruiterTip}
                          </p>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-[var(--color-primary-soft)] border-2 border-[var(--color-primary)] text-[var(--color-primary)] text-[18px] font-extrabold flex items-center justify-center flex-shrink-0">
                          {aiFitData.matchScore}%
                        </div>
                      </div>

                      {/* Strengths */}
                      <div className="space-y-2">
                        <h4 className="text-[13px] font-semibold text-[var(--color-text)] flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)]" />
                          Key Strengths
                        </h4>
                        <ul className="space-y-1 text-[13px] text-[var(--color-text-muted)]">
                          {aiFitData.keyStrengths?.map((str, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-[var(--color-accent)] font-bold">&bull;</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Missing Gaps */}
                      <div className="space-y-2">
                        <h4 className="text-[13px] font-semibold text-[var(--color-text)] flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-[var(--color-warning)]" />
                          Recommended Focus Areas
                        </h4>
                        <ul className="space-y-1 text-[13px] text-[var(--color-text-muted)]">
                          {aiFitData.skillGaps?.map((gap, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-[var(--color-warning)] font-bold">&bull;</span>
                              <span>{gap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tailored Cover Letter Generator */}
                      <div className="p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-[13px] font-semibold text-[var(--color-text)] flex items-center gap-1.5">
                              <FileText className="w-4 h-4 text-[var(--color-primary)]" />
                              Tailored Application Pitch
                            </h4>
                            <p className="text-[12px] text-[var(--color-text-muted)]">
                              3-paragraph pitch tailored directly for {selectedJob.company?.name || "this team"}.
                            </p>
                          </div>
                          {!coverLetter && (
                            <Button size="sm" onClick={handleGeneratePitch}>
                              Generate
                            </Button>
                          )}
                        </div>

                        {coverLetter && (
                          <div className="space-y-2">
                            <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--color-surface-alt)] text-[13px] text-[var(--color-text)] whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto border border-[var(--color-border)]">
                              {coverLetter}
                            </div>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => copyToClipboard(coverLetter)}
                              className="w-full text-xs gap-1.5"
                            >
                              {copiedLetter ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                                  Copied to Clipboard!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  Copy Pitch to Clipboard
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Tab 3: Interview Q&A */}
              {activeTab === "interview-prep" && (
                <div className="p-5 space-y-4">
                  {aiLoading ? (
                    <div className="py-10 text-center space-y-2">
                      <div className="w-8 h-8 rounded-full skeleton-shimmer mx-auto" />
                      <p className="text-[14px] font-semibold text-[var(--color-text)]">
                        Generating role-specific interview questions...
                      </p>
                    </div>
                  ) : interviewQuestions ? (
                    <div className="space-y-3">
                      {interviewQuestions.map((q, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-alt)] space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--color-primary)]">
                            <span>Question {idx + 1}</span>
                            <span className="px-2 py-0.5 rounded-[var(--radius-pill)] bg-[var(--color-primary-soft)] text-[10px]">
                              {q.category || "Technical"}
                            </span>
                          </div>
                          <p className="text-[13px] font-semibold text-[var(--color-text)]">
                            {q.question}
                          </p>
                          <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--color-surface)] text-[12px] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                            <span className="font-semibold text-[var(--color-text)] block mb-0.5">
                              Recruiter Advice:
                            </span>
                            {q.tip}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center space-y-2">
              <Briefcase className="w-10 h-10 text-[var(--color-text-subtle)] mx-auto" />
              <p className="font-semibold text-[15px] text-[var(--color-text)]">
                Select a job from the list
              </p>
              <p className="text-[13px] text-[var(--color-text-muted)]">
                Click any role on the left to preview details and AI match insights.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListing;
