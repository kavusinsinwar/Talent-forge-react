import React, { useEffect } from "react";
import { getSavedJobs } from "@/api/apiJobs";
import JobCard from "@/components/job-card";
import ProfileSummaryCard from "@/components/profile-summary-card";
import SkeletonJobCard from "@/components/skeleton-card";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { Bookmark, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <SkeletonJobCard />
        <SkeletonJobCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Left Sidebar */}
      <div className="lg:col-span-3 lg:sticky lg:top-[72px]">
        <ProfileSummaryCard savedCount={savedJobs?.length || 0} />
      </div>

      {/* Main Center Content */}
      <div className="lg:col-span-6 space-y-4">
        {/* Header Card */}
        <div className="bg-[var(--color-surface)] p-4 sm:p-5 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card flex items-center justify-between gap-3">
          <div>
            <h1 className="text-[18px] font-bold text-[var(--color-text)]">
              Saved Jobs
            </h1>
            <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5">
              Review and apply to saved engineering positions
            </p>
          </div>
          <span className="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary-soft)] px-2.5 py-1 rounded-[var(--radius-pill)]">
            {savedJobs?.length || 0} Saved
          </span>
        </div>

        {/* Saved Cards */}
        {loadingSavedJobs ? (
          <div className="space-y-3">
            <SkeletonJobCard />
            <SkeletonJobCard />
          </div>
        ) : savedJobs?.length ? (
          <div className="space-y-3">
            {savedJobs.map((saved) => (
              <JobCard
                key={saved.id}
                job={saved?.job}
                onJobAction={fnSavedJobs}
                savedInit={true}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[var(--color-surface)] p-8 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-surface-alt)] flex items-center justify-center text-[var(--color-text-muted)] mx-auto">
              <Bookmark className="w-5 h-5" />
            </div>
            <h3 className="text-[15px] font-semibold text-[var(--color-text)]">
              No saved jobs yet
            </h3>
            <p className="text-[13px] text-[var(--color-text-muted)] max-w-xs mx-auto">
              Bookmark jobs on the feed to review details, compare requirements, and apply anytime.
            </p>
            <Link to="/jobs">
              <Button size="sm">Browse Job Feed</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block lg:col-span-3 sticky top-[72px] space-y-4">
        <div className="bg-[var(--color-surface)] p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card space-y-3">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--color-text)]">
            <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
            <span>AI Resume Check</span>
          </div>
          <p className="text-[12px] text-[var(--color-text-muted)] leading-relaxed">
            Need advice on how your background fits these saved positions? Ask our AI Coach to highlight what to include in your pitch.
          </p>
          <Link to="/Chat-bot">
            <Button size="sm" variant="secondary" className="w-full text-xs">
              Open AI Coach
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;
