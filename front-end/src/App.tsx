import { Footer } from "./components/Footer";
import { Navbar } from "./components/ui/navbar";
import { Outlet } from "react-router-dom";

function App() {
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
