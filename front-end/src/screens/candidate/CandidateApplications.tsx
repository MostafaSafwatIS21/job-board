import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store";
import { fetchCandidateApplications } from "@/app/application/appSlice";
import ApplicationList from "@/components/ApplicationList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CandidateApplications() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCandidateApplications());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Track and update your submitted applications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>Your most recent submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationList />
        </CardContent>
      </Card>
    </div>
  );
}
