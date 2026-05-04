import { memo } from "react";
import { Link } from "react-router-dom";

type JobPostProps = {
  id: number;
  title: string;
  description: string;
  location: string;
  work_type: "remote" | "on_site";
  experience_level:
    | "entry_level"
    | "mid_level"
    | "senior_level"
    | "executive_level";
  salary_min: number;
  salary_max: number;
  deadline: string;
  category_id: number;
  skills: string[];
};

const levelLabels: Record<JobPostProps["experience_level"], string> = {
  entry_level: "Entry Level",
  mid_level: "Mid Level",
  senior_level: "Senior Level",
  executive_level: "Executive Level",
};

const workTypeLabels: Record<JobPostProps["work_type"], string> = {
  remote: "Remote",
  on_site: "On-site",
};

function formatSalary(min: number, max: number) {
  return `$${(min / 1000).toFixed(1)}k – $${(max / 1000).toFixed(1)}k`;
}

function formatDeadline(deadline: string) {
  return `Deadline: ${new Date(deadline).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

export const JobPost = memo(function JobPost({
  id,
  title,
  description,
  location,
  work_type,
  experience_level,
  salary_min,
  salary_max,
  deadline,
  skills,
}: JobPostProps) {
  return (
    <Link to={`/job-listings/${id}`} className="block">
      <article className="group cursor-pointer rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
          <div className="inline-flex h-fit items-center rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground/80">
            {formatDeadline(deadline)}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            {workTypeLabels[work_type]}
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            {levelLabels[experience_level]}
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            {formatSalary(salary_min, salary_max)}
          </span>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        {skills && skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-md border border-border/70 bg-background px-2 py-1 text-xs font-medium text-foreground/80"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
});
