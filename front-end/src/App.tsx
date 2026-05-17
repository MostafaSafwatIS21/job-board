import { useEffect, useMemo } from "react";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/ui/navbar";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchCurrentUserThunk, selectAuth } from "@/app/auth/authSlice";
import { Toaster } from "./components/ui/sonner";

function App() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const isLoggedIn = Boolean(auth.isAuthenticated || auth.token);
  const isCompleted = Boolean(
    auth.user?.completed_profile ?? auth.completed_profile,
  );
  const userRole = auth.user?.role ?? "";

  useEffect(() => {
    if (!auth.token || auth.user) return;
    dispatch(fetchCurrentUserThunk());
  }, [auth.token, auth.user, dispatch]);

  const navigationLinks = useMemo(() => {
    const links = [{ href: "/", label: "Home" }];

    if (!isLoggedIn) {
      return links;
    }

    if (!isCompleted) {
      links.push({ href: "/complete-profile", label: "Complete Profile" });
      return links;
    }

    if (userRole === "admin") {
      return links.concat([
        { href: "/dashboard/admin", label: "Admin Dashboard" },
        { href: "/dashboard/admin/job-listings", label: "Job Listings" },
        { href: "/dashboard/admin/employers", label: "Employers" },
        { href: "/dashboard/admin/candidates", label: "Candidates" },
      ]);
    }

    if (userRole === "employer") {
      return links.concat([
        { href: "/job-listings", label: "Job Listings" },
        { href: "/dashboard/employer", label: "Dashboard" },
        { href: "/dashboard/employer/job-listings", label: "My Listings" },
        { href: "/dashboard/employer/job-listings/new", label: "Post Job" },
        { href: "/dashboard/employer/applications", label: "Applications" },
        { href: "/dashboard/employer/profile", label: "Profile" },
      ]);
    }

    if (userRole === "candidate") {
      return links.concat([
        { href: "/job-listings", label: "Job Listings" },
        { href: "/dashboard/candidate", label: "Dashboard" },
        { href: "/dashboard/candidate/applications", label: "Applications" },
        { href: "/dashboard/candidate/profile", label: "Profile" },
      ]);
    }

    return links;
  }, [isLoggedIn, isCompleted, userRole]);

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar navigationLinks={navigationLinks} />
      <main className="container mx-auto flex-1 max-w-screen-2xl px-4 py-6 md:px-6">
        <Toaster />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
