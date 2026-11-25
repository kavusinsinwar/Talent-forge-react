import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Bookmark, FileText, Sparkles, UserCheck } from "lucide-react";

export function ProfileSummaryCard({ appliedCount = 0, savedCount = 0 }) {
  const { user } = useUser();

  const isRecruiter = user?.unsafeMetadata?.role === "recruiter";
  const userInitials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "TF";

  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card overflow-hidden">
      {/* 56px Tall Banner */}
      <div className="h-14 bg-gradient-to-r from-[var(--color-primary-soft)] via-[var(--color-surface-alt)] to-[var(--color-primary-soft)] relative" />

      {/* Profile Info (overlapping avatar) */}
      <div className="px-4 pb-4 pt-0 text-center relative">
        <div className="-mt-8 mb-2 flex justify-center">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.fullName || "User Avatar"}
              className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-surface)] shadow-xs"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg flex items-center justify-center border-2 border-[var(--color-surface)] shadow-xs">
              {userInitials}
            </div>
          )}
        </div>

        <Link
          to="/onboarding"
          className="font-semibold text-[15px] text-[var(--color-text)] hover:underline block leading-snug"
        >
          {user?.fullName || "Welcome, Professional"}
        </Link>
        <p className="text-[12px] text-[var(--color-text-muted)] line-clamp-2 mt-0.5 leading-tight">
          {isRecruiter
            ? "Talent Acquisition & Hiring Lead"
            : (user?.unsafeMetadata?.headline || "Software Engineer & Builder")}
        </p>

        {/* Skills Chips */}
        {user?.unsafeMetadata?.skills && (
          <div className="flex flex-wrap gap-1 justify-center mt-2">
            {user.unsafeMetadata.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .slice(0, 3)
              .map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-[var(--radius-pill)] text-[10px] font-medium bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                >
                  {skill}
                </span>
              ))}
          </div>
        )}
      </div>

      <div className="border-t border-[var(--color-border)]" />

      {/* Stats Rows */}
      <div className="py-2 text-[12px]">
        <Link
          to="/my-jobs"
          className="flex items-center justify-between px-4 py-1.5 hover:bg-[var(--color-surface-alt)] transition-colors"
        >
          <span className="text-[var(--color-text-muted)]">
            {isRecruiter ? "Active Postings" : "Applications Submitted"}
          </span>
          <span className="font-semibold text-[var(--color-primary)]">
            {appliedCount}
          </span>
        </Link>

        <Link
          to="/saved-jobs"
          className="flex items-center justify-between px-4 py-1.5 hover:bg-[var(--color-surface-alt)] transition-colors"
        >
          <span className="text-[var(--color-text-muted)]">Saved Roles</span>
          <span className="font-semibold text-[var(--color-primary)]">
            {savedCount}
          </span>
        </Link>
      </div>

      <div className="border-t border-[var(--color-border)]" />

      {/* Quick Access */}
      <div className="p-3 bg-[var(--color-surface-alt)] text-[12px] text-[var(--color-text-muted)] flex flex-col gap-1.5">
        <Link
          to="/Chat-bot"
          className="flex items-center gap-2 hover:text-[var(--color-primary)] transition-colors font-medium"
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span>AI Career Coach Copilot</span>
        </Link>
        <Link
          to="/onboarding"
          className="flex items-center gap-2 hover:text-[var(--color-primary)] transition-colors font-medium"
        >
          <UserCheck className="w-3.5 h-3.5 text-[var(--color-accent)]" />
          <span>Switch Profile Preferences</span>
        </Link>
      </div>
    </div>
  );
}

export default ProfileSummaryCard;
