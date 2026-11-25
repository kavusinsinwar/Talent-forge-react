/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Boxes,
  BriefcaseBusiness,
  Download,
  School,
  CheckCircle,
  Clock,
  Calendar,
  XCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { updateApplicationStatus } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";

const ApplicationCard = ({ application, isCandidate = false }) => {
  const [currentStatus, setCurrentStatus] = useState(application?.status || "applied");

  const handleDownload = () => {
    if (!application?.resume) return;
    const link = document.createElement("a");
    link.href = application.resume;
    link.target = "_blank";
    link.download = `${application.name || "candidate"}_Resume.pdf`;
    link.click();
  };

  const { fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application.job_id,
    }
  );

  const handleStatusChange = (status) => {
    setCurrentStatus(status);
    fnHiringStatus(status);
  };

  const stages = ["applied", "interviewing", "hired"];
  const isRejected = currentStatus === "rejected";

  const getStatusBadge = (status) => {
    switch (status) {
      case "hired":
        return { label: "Hired / Offer", bg: "bg-[var(--color-primary-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/30", icon: CheckCircle };
      case "interviewing":
        return { label: "Interviewing", bg: "bg-[var(--color-primary-soft)] text-[var(--color-primary)] border-[var(--color-primary)]/30", icon: Calendar };
      case "rejected":
        return { label: "Not Moving Forward", bg: "bg-red-50 text-[var(--color-danger)] border-red-200", icon: XCircle };
      default:
        return { label: "Under Review", bg: "bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] border-[var(--color-border)]", icon: Clock };
    }
  };

  const badge = getStatusBadge(currentStatus);
  const BadgeIcon = badge.icon;

  return (
    <div className="bg-[var(--color-surface)] p-4 sm:p-5 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card space-y-3.5 hover:shadow-raised transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
        <div>
          <h3 className="font-semibold text-[14px] sm:text-[15px] text-[var(--color-text)] leading-snug">
            {isCandidate
              ? `${application?.job?.title} \u2022 ${application?.job?.company?.name || "Verified Employer"}`
              : application?.name}
          </h3>
          <p className="text-[11px] sm:text-[12px] text-[var(--color-text-subtle)] mt-0.5">
            Applied on {new Date(application?.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Badge: 28px tall pill */}
          <span className={`inline-flex items-center gap-1.5 h-7 px-2.5 sm:px-3 rounded-[var(--radius-pill)] text-[11px] font-semibold border ${badge.bg}`}>
            <BadgeIcon className="w-3.5 h-3.5" />
            {badge.label}
          </span>

          {/* Download Resume Button */}
          {application?.resume && (
            <button
              onClick={handleDownload}
              className="h-7 px-2.5 rounded-[var(--radius-pill)] border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors flex items-center gap-1 text-[11px] font-medium"
              title="Download Resume"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>
          )}
        </div>
      </div>

      {/* Candidate Pipeline Progress Bar */}
      {isCandidate && !isRejected && (
        <div className="space-y-1 pt-1">
          <div className="grid grid-cols-3 gap-1.5">
            <div className={`h-1.5 rounded-[var(--radius-pill)] ${stages.indexOf(currentStatus) >= 0 ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"}`} />
            <div className={`h-1.5 rounded-[var(--radius-pill)] ${stages.indexOf(currentStatus) >= 1 ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"}`} />
            <div className={`h-1.5 rounded-[var(--radius-pill)] ${stages.indexOf(currentStatus) >= 2 ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"}`} />
          </div>
          <div className="flex justify-between text-[11px] text-[var(--color-text-subtle)] font-medium">
            <span className={stages.indexOf(currentStatus) >= 0 ? "text-[var(--color-text)] font-semibold" : ""}>Submitted</span>
            <span className={stages.indexOf(currentStatus) >= 1 ? "text-[var(--color-text)] font-semibold" : ""}>Interviewing</span>
            <span className={stages.indexOf(currentStatus) >= 2 ? "text-[var(--color-accent)] font-semibold" : ""}>Offer Decision</span>
          </div>
        </div>
      )}

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-4 text-[12px] text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-1.5">
          <BriefcaseBusiness className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span>{application?.experience} years experience</span>
        </div>
        <div className="flex items-center gap-1.5">
          <School className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span>{application?.education}</span>
        </div>
        {application?.skills && (
          <div className="flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span className="truncate max-w-xs">Skills: {application?.skills}</span>
          </div>
        )}
      </div>

      {/* Recruiter Stage Selector */}
      {!isCandidate && (
        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
          <span className="text-[12px] text-[var(--color-text-muted)]">Candidate Stage:</span>
          <Select onValueChange={handleStatusChange} defaultValue={currentStatus}>
            <SelectTrigger className="w-44 h-8 text-[12px] rounded-[var(--radius-pill)] bg-[var(--color-surface)]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Under Review</SelectItem>
              <SelectItem value="interviewing">Interview Scheduled</SelectItem>
              <SelectItem value="hired">Hired / Extended Offer</SelectItem>
              <SelectItem value="rejected">Not Selected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;
