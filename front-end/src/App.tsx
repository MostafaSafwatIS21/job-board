import { useEffect } from "react";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/ui/navbar";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchCurrentUserThunk, selectAuth } from "@/app/auth/authSlice";
import { Toaster } from "./components/ui/sonner";

function App() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);

  useEffect(() => {
    if (!auth.token || auth.user) return;
    dispatch(fetchCurrentUserThunk());
  }, [auth.token, auth.user, dispatch]);

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar
        navigationLinks={[
          { href: "/", label: "Home" },
          { href: "/job-listings", label: "Job Listings" },
        ]}
      />
      <main className="container mx-auto flex-1 max-w-screen-2xl px-4 py-6 md:px-6">
        <Toaster />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
