import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import {
  fetchJobListingsThunk,
  fetchEmployersThunk,
} from "@/app/admin/adminSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BriefcaseIcon,
  BuildingsIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@phosphor-icons/react";

interface StatCard {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
}

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { jobListings, totalJobListings, totalEmployers } = useSelector(
    (state: RootState) => state.admin,
  );

  useEffect(() => {
    dispatch(fetchJobListingsThunk({ page: 1, limit: 100 }));
    dispatch(fetchEmployersThunk({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Calculate stats
  const approvedCount = jobListings.filter(
    (j) => j.status === "approved",
  ).length;
  const pendingCount = jobListings.filter((j) => j.status === "pending").length;
  const rejectedCount = jobListings.filter(
    (j) => j.status === "rejected",
  ).length;

  const stats: StatCard[] = [
    {
      title: "Total Job Listings",
      value: totalJobListings,
      description: "All job postings on the platform",
      icon: <BriefcaseIcon className="h-6 w-6" />,
      bgColor: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Total Employers",
      value: totalEmployers,
      description: "Registered employer accounts",
      icon: <BuildingsIcon className="h-6 w-6" />,
      bgColor: "bg-purple-500/10 text-purple-600",
    },
    {
      title: "Approved Listings",
      value: approvedCount,
      description: "Live job postings",
      icon: <CheckCircleIcon className="h-6 w-6" />,
      bgColor: "bg-green-500/10 text-green-600",
    },
    {
      title: "Pending Review",
      value: pendingCount,
      description: "Awaiting approval",
      icon: <ClockIcon className="h-6 w-6" />,
      bgColor: "bg-amber-500/10 text-amber-600",
    },
    {
      title: "Rejected Listings",
      value: rejectedCount,
      description: "Rejected postings",
      icon: <XCircleIcon className="h-6 w-6" />,
      bgColor: "bg-red-500/10 text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Platform overview and management
        </p>
      </div>

      {/* ── Stats Grid ────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Quick Actions ─────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Navigate to specific management areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/dashboard/admin/job-listings/pending"
              className="flex items-center gap-3 p-4 rounded-lg border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <div className="bg-amber-500/10 text-amber-600 p-3 rounded-lg">
                <ClockIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Review Pending Jobs</p>
                <p className="text-xs text-muted-foreground">
                  {pendingCount} awaiting approval
                </p>
              </div>
            </a>

            <a
              href="/dashboard/admin/employers"
              className="flex items-center gap-3 p-4 rounded-lg border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <div className="bg-purple-500/10 text-purple-600 p-3 rounded-lg">
                <BuildingsIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Manage Employers</p>
                <p className="text-xs text-muted-foreground">
                  {totalEmployers} registered
                </p>
              </div>
            </a>

            <a
              href="/dashboard/admin/job-listings"
              className="flex items-center gap-3 p-4 rounded-lg border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <div className="bg-blue-500/10 text-blue-600 p-3 rounded-lg">
                <BriefcaseIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">All Job Listings</p>
                <p className="text-xs text-muted-foreground">
                  {totalJobListings} total postings
                </p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
