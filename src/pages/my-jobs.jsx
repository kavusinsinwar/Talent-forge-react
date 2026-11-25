import React from "react";
import CreatedApplications from "@/components/created-applications";
import CreatedJobs from "@/components/created-jobs";
import ProfileSummaryCard from "@/components/profile-summary-card";
import { useUser } from "@clerk/clerk-react";
import { SkeletonJobCard } from "@/components/skeleton-card";
import { Plus, Sparkles, Compass, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MyJobs = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <SkeletonJobCard />
        <SkeletonJobCard />
      </div>
    );
  }

  const isCandidate = user?.unsafeMetadata?.role === "candidate";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Left Sidebar (approx 225px - 3 cols on lg): Sticky Profile Summary Card */}
      <div className="lg:col-span-3 sticky top-[72px]">
        <ProfileSummaryCard appliedCount={isCandidate ? "Tracked" : "Active"} />
      </div>

      {/* Center Feed (Main content - 6 cols on lg, 9 if no right sidebar) */}
      <div className="lg:col-span-6 space-y-4">
        {/* Page Header Card */}
        <div className="bg-[var(--color-surface)] p-4 sm:p-5 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card flex items-center justify-between">
          <div>
            <h1 className="text-[18px] font-bold text-[var(--color-text)]">
              {isCandidate ? "My Job Applications" : "Manage Job Postings"}
            </h1>
            <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5">
              {isCandidate
                ? "Track stage progression, resume submissions, and hiring decisions"
                : "Manage active openings, review applicant CVs, and update status"}
            </p>
          </div>

          {!isCandidate && (
            <Link to="/post-job">
              <Button size="sm" className="gap-1 font-semibold">
                <Plus className="w-3.5 h-3.5" />
                Post Job
              </Button>
            </Link>
          )}
        </div>

        {/* List of Applications or Posted Jobs */}
        {isCandidate ? <CreatedApplications /> : <CreatedJobs />}
      </div>

      {/* Right Sidebar (3 cols on lg, sticky top-[72px]): Career Tips & AI Copilot */}
      <div className="hidden lg:block lg:col-span-3 sticky top-[72px] space-y-4">
        <div className="bg-[var(--color-surface)] p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card space-y-3">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--color-text)]">
            <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
            <span>AI Copilot Advice</span>
          </div>
          <p className="text-[12px] text-[var(--color-text-muted)] leading-relaxed">
            Candidates who personalize their application cover letter report a <strong>3x higher response rate</strong> from tech recruiters.
          </p>
          <div className="pt-1">
            <Link to="/Chat-bot">
              <Button size="sm" variant="secondary" className="w-full text-xs">
                Launch Career Coach
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card space-y-2 text-[12px]">
          <h4 className="font-semibold text-[var(--color-text)]">Quick Tips</h4>
          <ul className="space-y-1.5 text-[var(--color-text-muted)]">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
              <span>Update your resume with measurable performance metrics</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
              <span>Use the AI Match Score tool to spot skill gaps before interviews</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyJobs;
