import React, { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useParams, Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Briefcase,
  MapPin,
  Building2,
  Sparkles,
  ArrowLeft,
  Share2,
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
  Copy,
  Check,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ApplyJobDrawer } from "@/components/apply-job";
import ApplicationCard from "@/components/application-card";
import { SkeletonJobDetails } from "@/components/skeleton-card";

import useFetch from "@/hooks/use-fetch";
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";
import {
  analyzeJobFit,
  generateTailoredPitch,
  generateInterviewQuestions,
} from "@/api/apiAi";

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const [aiLoading, setAiLoading] = useState(false);
  const [aiFitData, setAiFitData] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, { job_id: id });

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    { job_id: id }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  const handleRunAiFit = async () => {
    setActiveTab("ai-fit");
    if (aiFitData || !job) return;
    setAiLoading(true);
    try {
      const result = await analyzeJobFit({
        jobTitle: job.title,
        companyName: job.company?.name,
        description: job.description,
        skills: user?.unsafeMetadata?.skills || "React, JavaScript, Tailwind, Node.js",
      });
      setAiFitData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGeneratePitch = async () => {
    if (!job) return;
    setAiLoading(true);
    try {
      const pitch = await generateTailoredPitch({
        jobTitle: job.title,
        companyName: job.company?.name,
        description: job.description,
        candidateName: user?.fullName || "Candidate",
        skills: user?.unsafeMetadata?.skills || "React, JavaScript",
      });
      setCoverLetter(pitch);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateInterviewPrep = async () => {
    setActiveTab("interview-prep");
    if (interviewQuestions || !job) return;
    setAiLoading(true);
    try {
      const result = await generateInterviewQuestions({
        jobTitle: job.title,
        description: job.description,
      });
      setInterviewQuestions(result?.questions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  if (!isLoaded || loadingJob) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <SkeletonJobDetails />
      </div>
    );
  }

  const isRecruiterOwner = job?.recruiter_id === user?.id;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all jobs
        </Link>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Job link copied!");
          }}
          className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share Job
        </button>
      </div>

      {/* Main Job Details Card */}
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card overflow-hidden">
        {/* Header Block */}
        <div className="p-5 sm:p-6 border-b border-[var(--color-border)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
                {job?.company?.logo_url ? (
                  <img
                    src={job.company.logo_url}
                    alt={job.company.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-[var(--color-text-muted)]" />
                )}
              </div>
              <div>
                <h1 className="text-[20px] sm:text-[24px] font-bold text-[var(--color-text)] leading-snug">
                  {job?.title}
                </h1>
                <p className="text-[14px] font-medium text-[var(--color-primary)] hover:underline cursor-pointer">
                  {job?.company?.name || "Verified Employer"}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[12px] text-[var(--color-text-subtle)] mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {job?.location || "Remote"}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {job?.applications?.length || 0} applicants
                  </span>
                  <span>&bull;</span>
                  <span className={job?.isOpen ? "text-[var(--color-accent)] font-semibold" : "text-[var(--color-danger)] font-semibold"}>
                    {job?.isOpen ? "Actively Hiring" : "Hiring Closed"}
                  </span>
                </div>
              </div>
            </div>

            {/* Recruiter Status Control */}
            {isRecruiterOwner && (
              <div className="sm:self-center">
                <Select onValueChange={handleStatusChange} defaultValue={job?.isOpen ? "open" : "closed"}>
                  <SelectTrigger className="w-40 text-xs font-semibold h-9 rounded-[var(--radius-pill)]">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">🟢 Status: Open</SelectItem>
                    <SelectItem value="closed">🔴 Status: Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Action Row */}
          {!isRecruiterOwner && (
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <ApplyJobDrawer
                job={job}
                user={user}
                fetchJob={fnJob}
                applied={job?.applications?.find((ap) => ap.candidate_id === user?.id)}
              />
              <button
                onClick={handleRunAiFit}
                className="h-9 px-3.5 rounded-[var(--radius-pill)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] text-[var(--color-text)] hover:text-[var(--color-primary)] text-[12px] font-semibold transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                AI Fit Score
              </button>
              <button
                onClick={handleGenerateInterviewPrep}
                className="h-9 px-3.5 rounded-[var(--radius-pill)] border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-[12px] font-semibold transition-colors flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Interview Q&A
              </button>
            </div>
          )}

          {/* Sub Navigation Tabs */}
          <div className="flex gap-6 border-t border-[var(--color-border)] pt-2.5 text-[13px] font-semibold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-1 transition-colors relative ${
                activeTab === "overview"
                  ? "text-[var(--color-primary)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[var(--color-primary)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              Job Overview
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
              AI Fit Assessment
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
              Interview Prep
            </button>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="p-5 sm:p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-[15px] font-semibold text-[var(--color-text)]">About the Role</h3>
              <p className="text-[14px] leading-relaxed text-[var(--color-text-muted)] whitespace-pre-wrap">
                {job?.description}
              </p>
            </div>

            {job?.requirements && (
              <div className="space-y-2 pt-4 border-t border-[var(--color-border)]">
                <h3 className="text-[15px] font-semibold text-[var(--color-text)]">Skills & Requirements</h3>
                <div className="text-[14px] leading-relaxed text-[var(--color-text-muted)] prose max-w-none">
                  <MDEditor.Markdown
                    source={job.requirements}
                    style={{ background: "transparent", color: "inherit" }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: AI Fit Assessment */}
        {activeTab === "ai-fit" && (
          <div className="p-5 sm:p-6 space-y-5">
            {aiLoading ? (
              <div className="py-10 text-center space-y-2">
                <div className="w-8 h-8 rounded-full skeleton-shimmer mx-auto" />
                <p className="text-[14px] font-semibold text-[var(--color-text)]">
                  Evaluating fit with Gemini AI...
                </p>
              </div>
            ) : aiFitData ? (
              <div className="space-y-5">
                <div className="p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-alt)] flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide">
                      AI Profile Match
                    </span>
                    <h4 className="text-[17px] font-bold text-[var(--color-text)] mt-0.5">
                      {aiFitData.verdict}
                    </h4>
                    <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
                      {aiFitData.recruiterTip}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-[var(--color-primary-soft)] border-2 border-[var(--color-primary)] text-[var(--color-primary)] text-[18px] font-extrabold flex items-center justify-center flex-shrink-0">
                    {aiFitData.matchScore}%
                  </div>
                </div>

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

                <div className="space-y-2">
                  <h4 className="text-[13px] font-semibold text-[var(--color-text)] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-[var(--color-warning)]" />
                    Recommended Skill Additions
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

                <div className="p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[13px] font-semibold text-[var(--color-text)] flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[var(--color-primary)]" />
                        Tailored Pitch
                      </h4>
                      <p className="text-[12px] text-[var(--color-text-muted)]">
                        Cover letter personalized to this role.
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
                        onClick={() => {
                          navigator.clipboard.writeText(coverLetter);
                          setCopiedLetter(true);
                          setTimeout(() => setCopiedLetter(false), 2000);
                        }}
                        className="w-full text-xs gap-1.5"
                      >
                        {copiedLetter ? <Check className="w-3.5 h-3.5 text-[var(--color-accent)]" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedLetter ? "Copied to Clipboard!" : "Copy Cover Letter"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Tab 3: Interview Q&A Prep */}
        {activeTab === "interview-prep" && (
          <div className="p-5 sm:p-6 space-y-4">
            {aiLoading ? (
              <div className="py-10 text-center space-y-2">
                <div className="w-8 h-8 rounded-full skeleton-shimmer mx-auto" />
                <p className="text-[14px] font-semibold text-[var(--color-text)]">
                  Generating interview questions with Gemini...
                </p>
              </div>
            ) : interviewQuestions ? (
              <div className="space-y-3">
                {interviewQuestions.map((q, idx) => (
                  <div key={idx} className="p-3.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-alt)] space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--color-primary)]">
                      <span>Question {idx + 1}</span>
                      <span className="px-2 py-0.5 rounded-[var(--radius-pill)] bg-[var(--color-primary-soft)] text-[10px]">
                        {q.category}
                      </span>
                    </div>
                    <p className="text-[13px] font-semibold text-[var(--color-text)]">{q.question}</p>
                    <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--color-surface)] text-[12px] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                      <span className="font-semibold text-[var(--color-text)] block mb-0.5">Recruiter Tip:</span>
                      {q.tip}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Recruiter Applications Section */}
      {isRecruiterOwner && job?.applications?.length > 0 && (
        <div className="bg-[var(--color-surface)] p-5 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[var(--color-text)]">
              Candidate Applications ({job.applications.length})
            </h2>
            <span className="text-xs text-[var(--color-text-muted)]">Manage hiring stages</span>
          </div>
          <div className="space-y-3">
            {job.applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPage;
