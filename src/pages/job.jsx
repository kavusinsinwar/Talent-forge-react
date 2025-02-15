import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplyJobDrawer } from "@/components/apply-job";
import ApplicationCard from "@/components/application-card";

import useFetch from "@/hooks/use-fetch";
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, { job_id: id });

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    { job_id: id }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  if (!isLoaded || loadingJob) {
    return <BarLoader className="w-full" color="#36d7b7" />;
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Job Title & Company Logo */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="gradient-title font-extrabold text-4xl sm:text-5xl text-center md:text-left">
          {job?.title}
        </h1>
        {job?.company?.logo_url && (
        <img
        src={job?.company?.logo_url}
        alt={job?.title}
        className="h-10 sm:h-12 md:h-14  shadow-lg"
      />
        )}
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-sm sm:text-base">
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-5 h-5 text-primary" /> {job?.location}
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          {job?.applications?.length} Applicants
        </div>
        <div className="flex items-center gap-2">
          {job?.isOpen ? (
            <>
              <DoorOpen className="w-5 h-5 text-green-500" /> Open
            </>
          ) : (
            <>
              <DoorClosed className="w-5 h-5 text-red-500" /> Closed
            </>
          )}
        </div>
      </div>

      {/* Recruiter Controls */}
      {job?.recruiter_id === user?.id && (
        <div className="mt-6">
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger
              className={`w-full sm:w-auto px-4 py-2 rounded-lg ${
                job?.isOpen ? "bg-green-700" : "bg-red-700"
              } text-white`}
            >
              <SelectValue
                placeholder={
                  "Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Job Description */}
      <div className="mt-8 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            About the Job
          </h2>
          <p className="text-gray-300 sm:text-lg mt-2">{job?.description}</p>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            What We Are Looking For
          </h2>
          <MDEditor.Markdown
            source={job?.requirements}
            className="bg-transparent sm:text-lg mt-2"
          />
        </div>
      </div>

      {/* Apply Button for Job Seekers */}
      {job?.recruiter_id !== user?.id && (
        <div className="mt-8">
          <ApplyJobDrawer
            job={job}
            user={user}
            fetchJob={fnJob}
            applied={job?.applications?.find(
              (ap) => ap.candidate_id === user.id
            )}
          />
        </div>
      )}

      {/* Loading Bar for Hiring Status */}
      {loadingHiringStatus && (
        <BarLoader className="mt-4 w-full" color="#36d7b7" />
      )}

      {/* Applications Section (Recruiters Only) */}
      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div className="mt-10">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            Applications
          </h2>
          <div className="flex flex-col gap-4 mt-4">
            {job?.applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPage;
