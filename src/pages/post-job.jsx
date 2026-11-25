import React, { useEffect } from "react";
import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/add-company-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Briefcase } from "lucide-react";
import { SkeletonJobDetails } from "@/components/skeleton-card";

const schema = z.object({
  title: z.string().min(1, { message: "Job title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Please select a location" }),
  company_id: z.string().min(1, { message: "Please select or add a company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

const PostJob = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/jobs");
  }, [dataCreateJob, navigate]);

  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  if (!isLoaded || loadingCompanies) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <SkeletonJobDetails />
      </div>
    );
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header Card */}
      <div className="bg-[var(--color-surface)] p-5 sm:p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[var(--radius-pill)] text-[11px] font-semibold bg-[var(--color-primary-soft)] text-[var(--color-primary)] mb-2">
          <Briefcase className="w-3.5 h-3.5" />
          Recruiter Hub
        </div>
        <h1 className="text-[20px] font-bold text-[var(--color-text)]">
          Post an Engineering Role
        </h1>
        <p className="text-[13px] text-[var(--color-text-muted)] mt-0.5">
          Reach qualified developers and manage candidates directly in your pipeline.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-[var(--color-surface)] p-5 sm:p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Job Title */}
          <div className="space-y-1">
            <label className="text-[13px] font-medium text-[var(--color-text)]">
              Job Title
            </label>
            <Input
              placeholder="e.g. Senior Frontend Engineer, React Architect"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-[var(--color-danger)] text-[12px]">{errors.title.message}</p>
            )}
          </div>

          {/* About Role */}
          <div className="space-y-1">
            <label className="text-[13px] font-medium text-[var(--color-text)]">
              About the Role
            </label>
            <Textarea
              placeholder="Describe your engineering mission, responsibilities, and team culture..."
              {...register("description")}
              className="min-h-28 text-[14px] bg-[var(--color-surface)] border-[var(--color-border)] rounded-[var(--radius-sm)] focus-visible:border-[var(--color-primary)] focus-visible:ring-3 focus-visible:ring-[var(--color-primary-soft)]"
            />
            {errors.description && (
              <p className="text-[var(--color-danger)] text-[12px]">{errors.description.message}</p>
            )}
          </div>

          {/* Location & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[13px] font-medium text-[var(--color-text)]">
                Location
              </label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-10 text-[14px] rounded-[var(--radius-sm)]">
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Remote (Worldwide)">Remote (Worldwide)</SelectItem>
                        <SelectItem value="Remote (India)">Remote (India)</SelectItem>
                        {State.getStatesOfCountry("IN").map(({ name }) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.location && (
                <p className="text-[var(--color-danger)] text-[12px]">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-[var(--color-text)]">
                  Company
                </label>
                <AddCompanyDrawer fetchCompanies={fnCompanies} />
              </div>
              <Controller
                name="company_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-10 text-[14px] rounded-[var(--radius-sm)]">
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {companies?.map(({ name, id }) => (
                          <SelectItem key={id} value={String(id)}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.company_id && (
                <p className="text-[var(--color-danger)] text-[12px]">{errors.company_id.message}</p>
              )}
            </div>
          </div>

          {/* Markdown Requirements */}
          <div className="space-y-1">
            <label className="text-[13px] font-medium text-[var(--color-text)]">
              Candidate Requirements & Stack (Markdown)
            </label>
            <div className="border border-[var(--color-border)] rounded-[var(--radius-sm)] overflow-hidden">
              <Controller
                name="requirements"
                control={control}
                render={({ field }) => (
                  <MDEditor
                    value={field.value}
                    onChange={field.onChange}
                    preview="edit"
                    height={200}
                  />
                )}
              />
            </div>
            {errors.requirements && (
              <p className="text-[var(--color-danger)] text-[12px]">{errors.requirements.message}</p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loadingCreateJob}
              size="lg"
              className="w-full h-10 font-bold"
            >
              Publish Job Listing
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
