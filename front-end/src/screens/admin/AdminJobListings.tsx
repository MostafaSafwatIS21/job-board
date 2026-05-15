import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import type { AppDispatch, RootState } from "@/app/store";
import {
  fetchJobListingsThunk,
  updateJobListingStatusThunk,
} from "@/app/admin/adminSlice";
import type { JobListingData } from "@/app/admin/adminSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  XCircleIcon,
  ClockIcon,
  EyeIcon,
} from "@phosphor-icons/react";

const statusBadge: Record<string, { bg: string; text: string }> = {
  approved: { bg: "bg-green-500/10", text: "text-green-600" },
  pending: { bg: "bg-amber-500/10", text: "text-amber-600" },
  rejected: { bg: "bg-red-500/10", text: "text-red-600" },
};

export default function AdminJobListings() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedJob, setSelectedJob] = useState<JobListingData | null>(null);
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
    (state: RootState) => state.admin,
  );

  useEffect(() => {
    dispatch(fetchJobListingsThunk({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Filter jobs based on status
  const filteredJobs =
    filterStatus === "all"
      ? jobListings
      : jobListings.filter((j) => j.status === filterStatus);

  const handleStatusChange = (status: "approved" | "rejected" | "pending") => {
    if (!selectedJob) return;
    dispatch(
      updateJobListingStatusThunk({ jobId: selectedJob.id, status }),
    ).then(() => {
      setSelectedJob(null);
    });
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value as "all" | "pending" | "approved" | "rejected");
    setSearchParams(value === "all" ? {} : { status: value });
  };

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Listings</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Review and manage all job postings on the platform
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
          <CardDescription>
            Click on a listing to view details and change its status
          </CardDescription>
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
        onOpenChange={(open) => !open && setSelectedJob(null)}
      >
        <DrawerContent className="max-h-[90vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>{selectedJob?.title}</DrawerTitle>
            <DrawerDescription>
              Job listing details and approval options
            </DrawerDescription>
          </DrawerHeader>

          {selectedJob && (
            <div className="space-y-6">
              {/* ── Job Details ────────────────────────────────────── */}
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

              {/* ── Description ────────────────────────────────────── */}
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-2">
                  Description
                </p>
                <p className="text-sm leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>

              {/* ── Skills ─────────────────────────────────────────── */}
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

              {/* ── Actions ────────────────────────────────────────── */}
              <div className="border-t pt-6 flex gap-2">
                {selectedJob.status !== "approved" && (
                  <Button
                    onClick={() => handleStatusChange("approved")}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    Approve
                  </Button>
                )}
                {selectedJob.status !== "rejected" && (
                  <Button
                    onClick={() => handleStatusChange("rejected")}
                    variant="destructive"
                    className="gap-2"
                  >
                    <XCircleIcon className="w-4 h-4" />
                    Reject
                  </Button>
                )}
                {selectedJob.status !== "pending" && (
                  <Button
                    onClick={() => handleStatusChange("pending")}
                    variant="outline"
                    className="gap-2"
                  >
                    <ClockIcon className="w-4 h-4" />
                    Back to Pending
                  </Button>
                )}
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
