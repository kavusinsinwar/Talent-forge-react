import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { UserCheck, Briefcase, ArrowRight, Compass } from "lucide-react";
import { SkeletonJobDetails } from "@/components/skeleton-card";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);

  const navigateUser = (currRole) => {
    navigate(currRole === "recruiter" ? "/post-job" : "/jobs");
  };

  const handleRoleSelection = async (role) => {
    setUpdating(true);
    await user
      .update({ unsafeMetadata: { role } })
      .then(() => {
        navigateUser(role);
      })
      .catch((err) => {
        console.error("Error updating role:", err);
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigateUser(user.unsafeMetadata.role);
    }
  }, [user]);

  if (!isLoaded) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <SkeletonJobDetails />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 sm:py-16 text-center space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-pill)] text-[12px] font-semibold bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Compass className="w-3.5 h-3.5" />
          <span>TalentForge Network Setup</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]">
          How will you be using TalentForge?
        </h1>
        <p className="text-[14px] text-[var(--color-text-muted)] max-w-md mx-auto">
          Choose your account mode to customize your jobs feed and recruiting tools.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        {/* Candidate Card */}
        <div
          onClick={() => !updating && handleRoleSelection("candidate")}
          className="p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] hover:border-[var(--color-primary)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)] shadow-card hover:shadow-raised hover:-translate-y-[1px] transition-all cursor-pointer flex flex-col justify-between space-y-5"
        >
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[17px] font-semibold text-[var(--color-text)]">
                I am a Candidate
              </h3>
              <p className="text-[13px] text-[var(--color-text-muted)] mt-1.5 leading-relaxed">
                Discover curated engineering roles, evaluate AI profile fit scores, and submit 1-click applications.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-primary)]">
            <span>Continue as Candidate</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Recruiter Card */}
        <div
          onClick={() => !updating && handleRoleSelection("recruiter")}
          className="p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] hover:border-[var(--color-primary)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)] shadow-card hover:shadow-raised hover:-translate-y-[1px] transition-all cursor-pointer flex flex-col justify-between space-y-5"
        >
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-accent)] flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[17px] font-semibold text-[var(--color-text)]">
                I am a Recruiter / Founder
              </h3>
              <p className="text-[13px] text-[var(--color-text-muted)] mt-1.5 leading-relaxed">
                Post high-impact technical roles, review developer resumes, and manage candidates in your hiring pipeline.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-accent)]">
            <span>Continue as Recruiter</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
