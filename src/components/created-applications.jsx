import React, { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import ApplicationCard from "./application-card";
import { getApplications } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import SkeletonJobCard from "./skeleton-card";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { FileSearch } from "lucide-react";

const CreatedApplications = () => {
  const { user } = useUser();

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user.id,
  });

  useEffect(() => {
    fnApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingApplications) {
    return (
      <div className="space-y-3">
        <SkeletonJobCard />
        <SkeletonJobCard />
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] p-8 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-[var(--color-surface-alt)] flex items-center justify-center text-[var(--color-text-muted)] mx-auto">
          <FileSearch className="w-5 h-5" />
        </div>
        <h3 className="text-[15px] font-semibold text-[var(--color-text)]">
          No applications submitted yet
        </h3>
        <p className="text-[13px] text-[var(--color-text-muted)] max-w-xs mx-auto">
          Browse open roles on the job feed and apply with 1-click Easy Apply.
        </p>
        <Link to="/jobs">
          <Button size="sm">Explore Open Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[12px] text-[var(--color-text-muted)] px-1">
        <span className="font-semibold text-[var(--color-text)]">
          {applications.length} Active Applications
        </span>
        <span>Updates in real-time</span>
      </div>

      <div className="space-y-2.5">
        {applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            isCandidate={true}
          />
        ))}
      </div>
    </div>
  );
};

export default CreatedApplications;
