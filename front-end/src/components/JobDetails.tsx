import { clearCurrentJob, getJobListingById } from "@/app/jobListSlice";
import type { AppDispatch, RootState } from "@/app/store";
import { ArrowArcRightIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const levelLabels: Record<string, string> = {
  entry_level: "Entry Level",
  mid_level: "Mid Level",
  senior_level: "Senior Level",
  executive_level: "Executive Level",
};

const workTypeLabels: Record<string, string> = {
  remote: "Remote",
  on_site: "On-site",
};

function formatSalary(min: number, max: number) {
  return `$${(min / 1000).toFixed(1)}k – $${(max / 1000).toFixed(1)}k`;
}

function formatDeadline(deadline: string) {
  return new Date(deadline).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function JobDetails() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const {
    currentJob: job,
    loading,
    error,
  } = useSelector((state: RootState) => state.jobList);

  useEffect(() => {
    if (jobId) {
      dispatch(getJobListingById(Number(jobId)));
    }
    return () => {
      dispatch(clearCurrentJob());
    };
  }, [dispatch, jobId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Loading job details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-sm text-destructive">Could not load job details.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-primary underline"
        >
          <ArrowArcRightIcon />
          Go back
        </button>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <section className="">
      {/* ── Left column: job info + apply ── */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-primary underline cursor-pointer flex items-center gap-1"
        >
          <ArrowLeftIcon />
          Back
        </button>
      </div>
      <div className="mt-10 grid grid-cols-10 items-start gap-6">
        <div className="col-span-6 space-y-6">
          <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-card to-background p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {job.location}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {job.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {job.description}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Apply for this job
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Application form coming soon.
            </p>
          </div>
        </div>

        {/* ── Right column: sidebar details ── */}
        <div className="col-span-4 space-y-6">
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm space-y-3">
            <p className="text-sm">
              Status:{" "}
              <span className="inline-block rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                {job.status}
              </span>
            </p>

            <p className="text-sm">
              Budget:{" "}
              <span className="font-medium text-foreground">
                {formatSalary(job.salary_min, job.salary_max)}
              </span>
            </p>

            <p className="text-sm">
              Work Type:{" "}
              <span className="font-medium text-foreground">
                {workTypeLabels[job.work_type] ?? job.work_type}
              </span>
            </p>

            <p className="text-sm">
              Experience Level:{" "}
              <span className="font-medium text-foreground">
                {levelLabels[job.experience_level] ?? job.experience_level}
              </span>
            </p>

            <p className="text-sm">
              Deadline:{" "}
              <span className="font-medium text-foreground">
                {formatDeadline(job.deadline)}
              </span>
            </p>

            {job.skills && job.skills.length > 0 && (
              <div className="pt-2">
                <p className="mb-2 text-sm">Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-block rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Posted by employer</p>
          </div>
        </div>
      </div>
    </section>
  );
}
