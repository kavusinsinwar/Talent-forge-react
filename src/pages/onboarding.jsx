import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  UserCheck,
  Briefcase,
  ArrowRight,
  Compass,
  Sparkles,
  Check,
  X,
  Plus,
  Save,
} from "lucide-react";
import { SkeletonJobDetails } from "@/components/skeleton-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SUGGESTED_SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "Next.js",
  "Tailwind CSS",
  "PostgreSQL",
  "Docker",
  "AWS",
  "GraphQL",
  "System Design",
];

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const currentRole = user?.unsafeMetadata?.role || "";
  const [selectedRole, setSelectedRole] = useState(currentRole || "candidate");
  const [headline, setHeadline] = useState(
    user?.unsafeMetadata?.headline || "Software Engineer & Builder"
  );
  const [skillsString, setSkillsString] = useState(
    user?.unsafeMetadata?.skills || "React, JavaScript, Node.js, Tailwind CSS"
  );
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isLoaded) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <SkeletonJobDetails />
      </div>
    );
  }

  const skillsList = skillsString
    ? skillsString
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const handleAddSkill = (skillToAdd) => {
    const val = (skillToAdd || skillInput).trim();
    if (!val) return;
    if (skillsList.some((s) => s.toLowerCase() === val.toLowerCase())) {
      setSkillInput("");
      return;
    }
    const updated = [...skillsList, val].join(", ");
    setSkillsString(updated);
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skillsList.filter(
      (s) => s.toLowerCase() !== skillToRemove.toLowerCase()
    );
    setSkillsString(updated.join(", "));
  };

  const handleSaveProfile = async (targetRole) => {
    const roleToSave = targetRole || selectedRole;
    setSaving(true);
    try {
      await user.update({
        unsafeMetadata: {
          role: roleToSave,
          headline: headline.trim(),
          skills: skillsString.trim(),
        },
      });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        navigate(roleToSave === "recruiter" ? "/post-job" : "/jobs");
      }, 800);
    } catch (err) {
      console.error("Error updating profile settings:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 space-y-6">
      {/* Header Banner Card */}
      <div className="bg-[var(--color-surface)] p-5 sm:p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-pill)] text-[12px] font-semibold bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Compass className="w-3.5 h-3.5" />
          <span>TalentForge Network Profile</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]">
          Profile & Account Preferences
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[var(--color-text-muted)] leading-relaxed">
          Configure your professional identity, target skills, and account mode. These details power your Gemini AI Profile Fit Scores and job recommendations.
        </p>
      </div>

      {/* Role Selection Section */}
      <div className="bg-[var(--color-surface)] p-5 sm:p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card space-y-4">
        <div className="space-y-1">
          <label className="text-[14px] font-semibold text-[var(--color-text)]">
            Account Role
          </label>
          <p className="text-[12px] text-[var(--color-text-muted)]">
            Switch between applying for engineering roles or managing recruitment pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Candidate Card */}
          <div
            onClick={() => setSelectedRole("candidate")}
            className={`p-4 rounded-[var(--radius-md)] border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              selectedRole === "candidate"
                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]/30 ring-1 ring-[var(--color-primary)]"
                : "border-[var(--color-border)] hover:bg-[var(--color-surface-alt)]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              {selectedRole === "candidate" && (
                <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-[var(--color-text)]">
                Job Candidate
              </h3>
              <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
                Explore tech roles, run AI match assessments, and track active applications.
              </p>
            </div>
          </div>

          {/* Recruiter Card */}
          <div
            onClick={() => setSelectedRole("recruiter")}
            className={`p-4 rounded-[var(--radius-md)] border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              selectedRole === "recruiter"
                ? "border-[var(--color-accent)] bg-[var(--color-primary-soft)]/30 ring-1 ring-[var(--color-accent)]"
                : "border-[var(--color-border)] hover:bg-[var(--color-surface-alt)]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-accent)] flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              {selectedRole === "recruiter" && (
                <span className="w-5 h-5 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center text-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-[var(--color-text)]">
                Recruiter / Founder
              </h3>
              <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
                Post technical openings, review candidate resumes, and manage applicant status.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Headline & Bio */}
      <div className="bg-[var(--color-surface)] p-5 sm:p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card space-y-4">
        <div className="space-y-1">
          <label className="text-[14px] font-semibold text-[var(--color-text)]">
            Professional Headline
          </label>
          <p className="text-[12px] text-[var(--color-text-muted)]">
            Displayed on your profile summary card and visible when submitting applications.
          </p>
        </div>

        <Input
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="e.g. Senior Frontend Engineer | React, TypeScript & Performance"
          className="h-10 text-[14px]"
        />
      </div>

      {/* Key Technical Skills (Used by Gemini AI Fit Score) */}
      <div className="bg-[var(--color-surface)] p-5 sm:p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-text)]">
            <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Key Technical Skills</span>
          </div>
          <p className="text-[12px] text-[var(--color-text-muted)]">
            Gemini AI uses these skills to calculate your real-time <strong>AI Fit Score</strong> against job requirements.
          </p>
        </div>

        {/* Current Skills Chips */}
        <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2.5 rounded-[var(--radius-sm)] bg-[var(--color-surface-alt)] border border-[var(--color-border)]">
          {skillsList.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 h-7 pl-2.5 pr-1.5 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[12px] font-medium text-[var(--color-text)] shadow-xs"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="w-4 h-4 rounded-full hover:bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] hover:text-[var(--color-danger)] flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {skillsList.length === 0 && (
            <span className="text-[12px] text-[var(--color-text-subtle)] self-center px-1">
              No skills added yet. Add skills below.
            </span>
          )}
        </div>

        {/* Add Skill Input */}
        <div className="flex gap-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder="Add a skill (e.g. Next.js, GraphQL) and press Enter"
            className="h-9 text-[13px] flex-1"
          />
          <Button
            type="button"
            size="sm"
            onClick={() => handleAddSkill()}
            className="h-9 px-3 gap-1 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </Button>
        </div>

        {/* Suggested Skills */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide">
            Popular Technical Skills:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_SKILLS.filter(
              (s) => !skillsList.some((cur) => cur.toLowerCase() === s.toLowerCase())
            ).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleAddSkill(s)}
                className="h-6 px-2.5 rounded-[var(--radius-pill)] bg-[var(--color-surface-alt)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] border border-[var(--color-border)] text-[11px] text-[var(--color-text-muted)] transition-colors flex items-center gap-1"
              >
                <Plus className="w-2.5 h-2.5" />
                <span>{s}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          onClick={() => handleSaveProfile()}
          disabled={saving}
          size="lg"
          className="w-full sm:flex-1 h-11 font-semibold gap-2"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              Preferences Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Profile Preferences
            </>
          )}
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={() => navigate(selectedRole === "recruiter" ? "/post-job" : "/jobs")}
          className="w-full sm:w-auto h-11"
        >
          Skip to Jobs &rarr;
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
