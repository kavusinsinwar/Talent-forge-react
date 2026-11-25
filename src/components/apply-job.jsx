/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useFetch from "@/hooks/use-fetch";
import { applyToJob } from "@/api/apiApplication";
import { BarLoader } from "react-spinners";
import { Zap, CheckCircle2, FileUp } from "lucide-react";

const schema = z.object({
  experience: z
    .number()
    .min(0, { message: "Experience must be at least 0" })
    .int(),
  skills: z.string().min(1, { message: "Skills are required" }),
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Please select your education level",
  }),
  resume: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword" ||
          file[0].type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
      { message: "Only PDF or Word documents are allowed" }
    ),
});

export function ApplyJobDrawer({ user, job, fetchJob, applied = false }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob);

  const onSubmit = (data) => {
    fnApply({
      ...data,
      job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      status: "applied",
      resume: data.resume[0],
    }).then(() => {
      fetchJob();
      reset();
    });
  };

  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          size="default"
          className={
            applied
              ? "bg-[var(--color-primary-soft)] text-[var(--color-accent)] border border-[var(--color-accent)]/30 cursor-default"
              : job?.isOpen
              ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-[var(--radius-pill)] shadow-xs gap-1.5"
              : "bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] cursor-not-allowed"
          }
          disabled={!job?.isOpen || applied}
        >
          {applied ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Applied
            </>
          ) : job?.isOpen ? (
            <>
              <Zap className="w-4 h-4" />
              Easy Apply
            </>
          ) : (
            "Hiring Closed"
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-2xl mx-auto rounded-t-3xl border-t border-border bg-card">
        <DrawerHeader className="text-left pb-2">
          <DrawerTitle className="text-xl font-bold text-foreground">
            Apply to {job?.title}
          </DrawerTitle>
          <DrawerDescription className="text-xs text-muted-foreground">
            {job?.company?.name} &bull; {job?.location} &bull; Easy Apply takes less than 1 minute
          </DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4 pt-1"
        >
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Total Years of Experience</Label>
            <Input
              type="number"
              placeholder="e.g. 3"
              className="bg-background h-10"
              {...register("experience", {
                valueAsNumber: true,
              })}
            />
            {errors.experience && (
              <p className="text-red-500 text-xs">{errors.experience.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold">Key Skills (Comma Separated)</Label>
            <Input
              type="text"
              placeholder="e.g. React, TypeScript, Node.js, Next.js, PostgreSQL"
              className="bg-background h-10"
              {...register("skills")}
            />
            {errors.skills && (
              <p className="text-red-500 text-xs">{errors.skills.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Highest Education Level</Label>
            <Controller
              name="education"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-4 text-xs pt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Intermediate" id="intermediate" />
                    <Label htmlFor="intermediate" className="cursor-pointer">Intermediate / High School</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Graduate" id="graduate" />
                    <Label htmlFor="graduate" className="cursor-pointer">Graduate (Bachelors)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Post Graduate" id="post-graduate" />
                    <Label htmlFor="post-graduate" className="cursor-pointer">Post Graduate (Masters/PhD)</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.education && (
              <p className="text-red-500 text-xs">{errors.education.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <FileUp className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              Upload CV / Resume (PDF or Word)
            </Label>
            <Input
              type="file"
              accept=".pdf, .doc, .docx"
              className="bg-background file:text-foreground file:font-semibold"
              {...register("resume")}
            />
            {errors.resume && (
              <p className="text-red-500 text-xs">{errors.resume.message}</p>
            )}
          </div>

          {errorApply?.message && (
            <p className="text-red-500 text-xs">{errorApply?.message}</p>
          )}

          {loadingApply && <BarLoader width={"100%"} color="#0a66c2" />}

          <Button
            type="submit"
            disabled={loadingApply}
            className="w-full h-10 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-[var(--radius-pill)] mt-2 gap-2"
          >
            <Zap className="w-4 h-4" />
            Submit Application
          </Button>
        </form>

        <DrawerFooter className="pt-0">
          <DrawerClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
