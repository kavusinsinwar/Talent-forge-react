import React, { useEffect } from "react";
import { getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import SkeletonJobCard from "./skeleton-card";
import JobCard from "./job-card";
import { Briefcase, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const CreatedJobs = () => {
  const { user } = useUser();

  const {
    loading: loadingCreatedJobs,
    data: createdJobs,
    fn: fnCreatedJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user.id,
  });

  useEffect(() => {
    fnCreatedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingCreatedJobs) {
    return (
      <div className="space-y-3">
        <SkeletonJobCard />
        <SkeletonJobCard />
      </div>
    );
  }

  if (!createdJobs || createdJobs.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] p-8 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-[var(--color-surface-alt)] flex items-center justify-center text-[var(--color-text-muted)] mx-auto">
          <Briefcase className="w-5 h-5" />
        </div>
        <h3 className="text-[15px] font-semibold text-[var(--color-text)]">
          No jobs posted yet
        </h3>
        <p className="text-[13px] text-[var(--color-text-muted)] max-w-xs mx-auto">
          Create your first role to start receiving qualified applications from top candidates.
        </p>
        <Link to="/post-job">
          <Button size="sm" className="gap-1">
            <Plus className="w-3.5 h-3.5" />
            Post Your First Role
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[12px] text-[var(--color-text-muted)] px-1">
        <span className="font-semibold text-[var(--color-text)]">
          {createdJobs.length} Active Listings
        </span>
        <span>Click on any job to review applicant CVs</span>
      </div>

      <div className="space-y-2.5">
        {createdJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onJobAction={fnCreatedJobs}
            isMyJob
          />
        ))}
      </div>
    </div>
  );
};

export default CreatedJobs;
