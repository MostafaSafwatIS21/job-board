import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import type { AppDispatch, RootState } from "@/app/store";
import {
  fetchEmployerJobListingsThunk,
  updateJobListingThunk,
} from "@/app/employer/employerSlice";
import type { JobListingData } from "@/app/admin/adminSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  XCircleIcon,
} from "@phosphor-icons/react";

const statusBadge: Record<string, { bg: string; text: string }> = {
  approved: { bg: "bg-green-500/10", text: "text-green-600" },
  pending: { bg: "bg-amber-500/10", text: "text-amber-600" },
  rejected: { bg: "bg-red-500/10", text: "text-red-600" },
};

const workTypeOptions = [
  { value: "remote", label: "Remote" },
  { value: "on_site", label: "On-site" },
];

const experienceOptions = [
  { value: "entry_level", label: "Entry Level" },
  { value: "mid_level", label: "Mid Level" },
  { value: "senior_level", label: "Senior Level" },
  { value: "executive_level", label: "Executive Level" },
];

type JobDraft = {
  title: string;
  description: string;
  location: string;
  salary_min: string;
  salary_max: string;
  work_type: string;
  experience_level: string;
  deadline: string;
  skillsText: string;
};

export default function EmployerJobListings() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedJob, setSelectedJob] = useState<JobListingData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<JobDraft | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >(() => {
    const status = searchParams.get("status");
    if (
      status === "pending" ||
      status === "approved" ||
      status === "rejected"
    ) {
      return status;
    }
    return "all";
  });

  const { jobListings, isLoading, error } = useSelector(
    (state: RootState) => state.employer,
  );

  useEffect(() => {
    dispatch(fetchEmployerJobListingsThunk());
  }, [dispatch]);

  const filteredJobs = useMemo(() => {
    if (filterStatus === "all") {
      return jobListings;
    }
    return jobListings.filter((job) => job.status === filterStatus);
  }, [filterStatus, jobListings]);

  const handleFilterChange = (value: string) => {
    setFilterStatus(value as "all" | "pending" | "approved" | "rejected");
    setSearchParams(value === "all" ? {} : { status: value });
  };

  const handleStartEdit = (job: JobListingData) => {
    const deadline = job.deadline ? job.deadline.split("T")[0] : "";
    setDraft({
      title: job.title,
      description: job.description,
      location: job.location,
      salary_min: String(job.salary_min ?? ""),
      salary_max: String(job.salary_max ?? ""),
      work_type: job.work_type,
      experience_level: job.experience_level,
      deadline,
      skillsText: (job.skills ?? []).join(", "),
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDraft(null);
  };

  const handleSaveEdit = async () => {
    if (!selectedJob || !draft) return;

    const skills = draft.skillsText
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const payload = {
      title: draft.title.trim(),
      description: draft.description.trim(),
      location: draft.location.trim(),
      salary_min: Number(draft.salary_min),
      salary_max: Number(draft.salary_max),
      work_type: draft.work_type,
      experience_level: draft.experience_level,
      deadline: draft.deadline,
      skills,
    };

    await dispatch(
      updateJobListingThunk({ jobId: selectedJob.id, data: payload }),
    );
    setIsEditing(false);
    setDraft(null);
    dispatch(fetchEmployerJobListingsThunk());
  };

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Job Listings</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Review and manage your job postings
        </p>
      </div>

      {/* ── Filter ────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="w-48">
            <label className="text-sm font-medium mb-2 block">
              Filter by Status
            </label>
            <Select value={filterStatus} onValueChange={handleFilterChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Listings</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredJobs.length} listing
              {filteredJobs.length !== 1 ? "s" : ""}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ── Error Message ─────────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Listings Table</CardTitle>
          <CardDescription>Click on a listing to view details</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading job listings...
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No job listings found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Employer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div className="font-medium text-sm truncate max-w-xs">
                          {job.title}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {job.employer?.name || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm">{job.location}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            statusBadge[job.status]?.bg
                          } ${statusBadge[job.status]?.text}`}
                        >
                          {job.status === "pending" && (
                            <span className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                          {job.status === "approved" && (
                            <span className="flex items-center gap-1">
                              <CheckCircleIcon className="w-3 h-3" />
                              Approved
                            </span>
                          )}
                          {job.status === "rejected" && (
                            <span className="flex items-center gap-1">
                              <XCircleIcon className="w-3 h-3" />
                              Rejected
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(job.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedJob(job)}
                          className="gap-2"
                        >
                          <EyeIcon className="w-4 h-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Detail Drawer ─────────────────────────────────────── */}
      <Drawer
        open={!!selectedJob}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedJob(null);
            setIsEditing(false);
            setDraft(null);
          }
        }}
      >
        <DrawerContent className="max-h-[90vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>{selectedJob?.title}</DrawerTitle>
            <DrawerDescription>Job listing details</DrawerDescription>
          </DrawerHeader>

          {selectedJob && (
            <div className="space-y-6">
              {isEditing && draft ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={draft.title}
                        onChange={(event) =>
                          setDraft({ ...draft, title: event.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={draft.location}
                        onChange={(event) =>
                          setDraft({ ...draft, location: event.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary_min">Salary Min</Label>
                      <Input
                        id="salary_min"
                        type="number"
                        value={draft.salary_min}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            salary_min: event.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary_max">Salary Max</Label>
                      <Input
                        id="salary_max"
                        type="number"
                        value={draft.salary_max}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            salary_max: event.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Work Type</Label>
                      <Select
                        value={draft.work_type}
                        onValueChange={(value) =>
                          setDraft({ ...draft, work_type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {workTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Experience Level</Label>
                      <Select
                        value={draft.experience_level}
                        onValueChange={(value) =>
                          setDraft({ ...draft, experience_level: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={draft.deadline}
                        onChange={(event) =>
                          setDraft({ ...draft, deadline: event.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={draft.description}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          description: event.target.value,
                        })
                      }
                      rows={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma separated)</Label>
                    <Input
                      id="skills"
                      value={draft.skillsText}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          skillsText: event.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex gap-2 border-t pt-4">
                    <Button onClick={handleSaveEdit} className="gap-2">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">
                        Employer
                      </p>
                      <p className="font-medium mt-1">
                        {selectedJob.employer?.name || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">
                        Status
                      </p>
                      <p className="font-medium mt-1 capitalize">
                        {selectedJob.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">
                        Location
                      </p>
                      <p className="font-medium mt-1">{selectedJob.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">
                        Work Type
                      </p>
                      <p className="font-medium mt-1 capitalize">
                        {selectedJob.work_type.replace("_", " ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">
                        Experience Level
                      </p>
                      <p className="font-medium mt-1 capitalize">
                        {selectedJob.experience_level.replace("_", " ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">
                        Salary
                      </p>
                      <p className="font-medium mt-1">
                        ${selectedJob.salary_min.toLocaleString()} - $
                        {selectedJob.salary_max.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-2">
                      Description
                    </p>
                    <p className="text-sm leading-relaxed">
                      {selectedJob.description}
                    </p>
                  </div>

                  {selectedJob.skills && selectedJob.skills.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-2">
                        Required Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(selectedJob.skills as string[]).map((skill) => (
                          <span
                            key={skill}
                            className="inline-block px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="border-t pt-4">
                    <Button onClick={() => handleStartEdit(selectedJob)}>
                      Edit Listing
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
