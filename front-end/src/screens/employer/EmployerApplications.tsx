import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import {
  fetchEmployerJobListingsThunk,
  selectEmployerJobListings,
} from "@/app/employer/employerSlice";
import { fetchApplicationsByJob } from "@/app/application/appSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Application from "@/components/Application";
import { Button } from "@/components/ui/button";
import { updateApplicationStatus } from "@/app/application/appSlice";

export default function EmployerApplications() {
  const dispatch = useDispatch<AppDispatch>();
  const jobListings = useSelector(selectEmployerJobListings);
  const { items, loading, error } = useSelector(
    (state: RootState) => state.applications,
  );
  const isSubmitting = useSelector(
    (state: RootState) => state.applications.submitting,
  );
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  useEffect(() => {
    if (jobListings.length === 0) {
      dispatch(fetchEmployerJobListingsThunk());
    }
  }, [dispatch, jobListings.length]);

  useEffect(() => {
    if (selectedJobId) {
      dispatch(fetchApplicationsByJob(Number(selectedJobId)));
    }
  }, [dispatch, selectedJobId]);

  const jobOptions = useMemo(
    () =>
      jobListings.map((job) => ({
        value: String(job.id),
        label: job.title,
      })),
    [jobListings],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Review applications for your job listings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Job</CardTitle>
          <CardDescription>
            Pick a job listing to view its applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-lg">
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a job listing" />
              </SelectTrigger>
              <SelectContent>
                {jobOptions.length === 0 ? (
                  <SelectItem value="no-jobs" disabled>
                    No job listings available
                  </SelectItem>
                ) : (
                  jobOptions.map((job) => (
                    <SelectItem key={job.value} value={job.value}>
                      {job.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {selectedJobId ? (
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>
              {loading
                ? "Loading applications..."
                : `${items.length} application${items.length !== 1 ? "s" : ""}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p className="text-sm text-muted-foreground">
                Loading applications...
              </p>
            ) : items.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No applications found for this job.
              </p>
            ) : (
              items.map((app) => (
                <div key={app.id} className="space-y-2">
                  <Application app={app} isOwner={false} />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Status: {app.status}
                    </span>
                    <Button
                      size="sm"
                      onClick={() =>
                        dispatch(
                          updateApplicationStatus({
                            applicationId: app.id,
                            status: "approved",
                          }),
                        )
                      }
                      disabled={isSubmitting || app.status === "approved"}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        dispatch(
                          updateApplicationStatus({
                            applicationId: app.id,
                            status: "rejected",
                          }),
                        )
                      }
                      disabled={isSubmitting || app.status === "rejected"}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        dispatch(
                          updateApplicationStatus({
                            applicationId: app.id,
                            status: "pending",
                          }),
                        )
                      }
                      disabled={isSubmitting || app.status === "pending"}
                    >
                      Pending
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="text-sm text-muted-foreground">
          Select a job listing to load applications.
        </div>
      )}
    </div>
  );
}
