import { useEffect } from "react";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/ui/navbar";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchCurrentUserThunk, selectAuth } from "@/app/auth/authSlice";

function App() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);

  useEffect(() => {
    if (!auth.token || auth.user || auth.isHydrating) return;
    dispatch(fetchCurrentUserThunk());
  }, [auth.token, auth.user, auth.isHydrating, dispatch]);

  return (
    <>
      <Navbar
        navigationLinks={[
          { href: "/", label: "Home" },
          { href: "/job-listings", label: "Job Listings" },
        ]}
      />
      <main className="container mx-auto h-dvh max-w-screen-2xl px-4 py-6 md:px-6">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
