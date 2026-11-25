/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Heart, MapPin, Trash2, Building2, Zap, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteJob, saveJob } from "@/api/apiJobs";
import { useUser } from "@clerk/clerk-react";

const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
  isSelected = false,
  onSelect = null,
}) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();
  const navigate = useNavigate();

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job?.id,
  });

  const {
    loading: loadingSavedJob,
    data: savedJob,
    fn: fnSavedJob,
  } = useFetch(saveJob, { alreadySaved: saved });

  const handleSaveJob = async (e) => {
    e.stopPropagation();
    if (!user) return;
    await fnSavedJob({
      user_id: user.id,
      job_id: job?.id,
    });
    setSaved(!saved);
    onJobAction();
  };

  const handleDeleteJob = async (e) => {
    e.stopPropagation();
    await fnDeleteJob();
    onJobAction();
  };

  const handleCardClick = () => {
    if (window.innerWidth < 1024) {
      navigate(`/job/${job?.id}`);
    } else if (onSelect) {
      onSelect(job);
    } else {
      navigate(`/job/${job?.id}`);
    }
  };

  useEffect(() => {
    if (savedJob !== undefined) setSaved(savedJob?.length > 0);
  }, [savedJob]);

  const snippet = job?.description
    ? job.description.replace(/[#*`_]/g, "").slice(0, 120) + "..."
    : "No job description provided.";

  return (
    <div
      onClick={handleCardClick}
      className={`group relative p-3.5 sm:p-4 rounded-[var(--radius-md)] border transition-all duration-150 cursor-pointer bg-[var(--color-surface)] shadow-card flex flex-col justify-between min-h-[148px] ${
        isSelected
          ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]/40 ring-1 ring-[var(--color-primary)]"
          : "border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] hover:shadow-raised hover:-translate-y-[1px]"
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] p-1 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-xs">
            {job?.company?.logo_url ? (
              <img
                src={job.company.logo_url}
                alt={job?.company?.name || "Company"}
                className="w-full h-full object-contain"
              />
            ) : (
              <Building2 className="w-6 h-6 text-[var(--color-text-muted)]" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-[14px] sm:text-[15px] text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors truncate leading-snug">
              {job?.title}
            </h3>
            <p className="text-[12px] sm:text-[13px] text-[var(--color-text-muted)] truncate font-medium">
              {job?.company?.name || "Verified Employer"}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-[var(--color-text-subtle)] mt-0.5">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{job?.location || "Remote"}</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center flex-shrink-0 self-start">
          {isMyJob ? (
            <button
              onClick={handleDeleteJob}
              className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-surface-alt)] transition-colors"
              title="Delete Listing"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSaveJob}
              disabled={loadingSavedJob}
              className={`w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--color-surface-alt)] ${
                saved
                  ? "text-[var(--color-danger)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
              title={saved ? "Saved" : "Save job"}
            >
              <Heart
                className="w-4 h-4"
                fill={saved ? "currentColor" : "none"}
              />
            </button>
          )}
        </div>
      </div>

      {/* Description Snippet (Strictly clamped 2-line height for even alignment across cards) */}
      <p className="text-[12px] sm:text-[13px] text-[var(--color-text-muted)] line-clamp-2 mt-2 leading-relaxed h-[36px] sm:h-[38px] overflow-hidden">
        {snippet}
      </p>

      {/* Badges Footer Row */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[var(--color-border)] text-[11px] min-h-[28px]">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 h-5 px-2 rounded-[var(--radius-pill)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold text-[10px] sm:text-[11px]">
            <Zap className="w-3 h-3" />
            Easy Apply
          </span>
          <span className="text-[var(--color-text-subtle)] flex items-center gap-1 text-[11px]">
            <Clock className="w-3 h-3" />
            {job?.isOpen ? "Actively Hiring" : "Closed"}
          </span>
        </div>

        <Link
          to={`/job/${job?.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[var(--color-primary)] font-semibold hover:underline text-[12px] flex items-center gap-1 flex-shrink-0"
        >
          <span>Details</span>
          <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
