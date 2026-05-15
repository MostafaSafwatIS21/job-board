import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import {
  fetchEmployersThunk,
  fetchJobListingsThunk,
  fetchEmployerJobListingsDetailThunk,
  selectSelectedEmployerJobListings,
} from "@/app/admin/adminSlice";

import type { EmployerProfileData } from "@/app/admin/adminSlice";
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
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  BuildingsIcon,
  EnvelopeIcon,
  GlobeIcon,
  EyeIcon,
  BriefcaseIcon,
} from "@phosphor-icons/react";

export default function AdminEmployers() {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedEmployer, setSelectedEmployer] =
    useState<EmployerProfileData | null>(null);

  const { employers, jobListings, isLoading, error } = useSelector(
    (state: RootState) => state.admin,
  );
  const selectedEmployerJobListings = useSelector(
    selectSelectedEmployerJobListings,
  );

  useEffect(() => {
    dispatch(fetchEmployersThunk({ page: 1, limit: 100 }));
    dispatch(fetchJobListingsThunk({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Count jobs per employer
  const getEmployerJobCount = (employerId: number) => {
    return jobListings.filter((j) => j.employer_id === employerId).length;
  };

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Employers</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Manage registered employer accounts on the platform
        </p>
      </div>

      {/* ── Stats Cards ────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employers
            </CardTitle>
            <BuildingsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employers.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered companies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Listings
            </CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobListings.filter((j) => j.status === "approved").length}
            </div>
            <p className="text-xs text-muted-foreground">From all employers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Jobs/Employer
            </CardTitle>
            <GlobeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employers.length > 0
                ? (jobListings.length / employers.length).toFixed(1)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Average job postings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Error Message ─────────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Employers Table</CardTitle>
          <CardDescription>
            Click on an employer to view details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading employers...
            </div>
          ) : employers.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No employers found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Job Listings</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employers.map((employer) => (
                    <TableRow key={employer.id}>
                      <TableCell className="font-medium">
                        {employer.company_name}
                      </TableCell>
                      <TableCell className="text-sm">
                        {employer.user?.name || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {employer.user?.email || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {employer.company_location}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600">
                          <BriefcaseIcon className="w-3 h-3" />
                          {getEmployerJobCount(employer.id)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(employer.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedEmployer(employer);
                            // Fetch detailed job listings for this employer
                            dispatch(
                              fetchEmployerJobListingsDetailThunk(employer.id),
                            );
                          }}
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
        open={!!selectedEmployer}
        onOpenChange={(open) => !open && setSelectedEmployer(null)}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{selectedEmployer?.company_name}</DrawerTitle>
            <DrawerDescription>Employer profile information</DrawerDescription>
          </DrawerHeader>

          {selectedEmployer && (
            <div className="space-y-6">
              {/* ── Company Details ────────────────────────────────── */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">
                    Company Name
                  </p>
                  <p className="font-medium">{selectedEmployer.company_name}</p>
                </div>

                {selectedEmployer.company_logo && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-1">
                      Company Logo
                    </p>
                    <img
                      src={selectedEmployer.company_logo}
                      alt="Company logo"
                      className="h-20 w-auto"
                    />
                  </div>
                )}

                {selectedEmployer.company_description && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-1">
                      Description
                    </p>
                    <p className="text-sm leading-relaxed">
                      {selectedEmployer.company_description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-1">
                      Location
                    </p>
                    <p className="font-medium">
                      {selectedEmployer.company_location}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-1">
                      Website
                    </p>
                    <a
                      href={selectedEmployer.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <GlobeIcon className="w-4 h-4" />
                      Visit
                    </a>
                  </div>
                </div>
              </div>

              {/* ── Contact Information ────────────────────────────── */}
              <div className="border-t pt-4 space-y-3">
                <p className="text-sm font-semibold">Contact Person</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-1">
                      Name
                    </p>
                    <p className="font-medium">
                      {selectedEmployer.user?.name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${selectedEmployer.user?.email}`}
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <EnvelopeIcon className="w-4 h-4" />
                      {selectedEmployer.user?.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* ── Job Listings ───────────────────────────────────── */}
              <div className="border-t pt-4">
                <p className="text-sm font-semibold mb-3">Job Listings</p>
                {!selectedEmployerJobListings ||
                selectedEmployerJobListings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No job listings yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedEmployerJobListings.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-2 rounded border border-input text-sm"
                      >
                        <span>{job.title}</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            job.status === "approved"
                              ? "bg-green-500/10 text-green-600"
                              : job.status === "pending"
                                ? "bg-amber-500/10 text-amber-600"
                                : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Metadata ───────────────────────────────────────── */}
              <div className="border-t pt-4 text-xs text-muted-foreground space-y-1">
                <p>
                  Registered:{" "}
                  {new Date(selectedEmployer.created_at).toLocaleString()}
                </p>
                <p>User ID: {selectedEmployer.user_id}</p>
                <p>Profile ID: {selectedEmployer.id}</p>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
