import type { RootState } from "@/app/store";
import { FileSearchIcon } from "@phosphor-icons/react";
import { useSelector } from "react-redux";

export function HomePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  console.log(user);

  return (
    <section className="space-y-3  gap-3 bg-gray-300  p-10 min-w-lg lg:flex flex-5 items-center justify-around flex-col md:flex-row">
      <div className="flex-2 space-y-6">
        <h1>Job Board For Developers and Designers </h1>
        <p className="text-muted-foreground">
          Find your dream job or the perfect candidate with our job board for
          developers and designers. Browse through a wide range of job listings
          and connect with top talent in the industry.
        </p>
        <button>
          Get Started <FileSearchIcon />
        </button>
      </div>
      <div className="flex-3">
        <img
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          alt="Job Search"
          className="rounded-lg object-cover"
        />
      </div>
      <h1 className="text-center text-2xl font-bold">
        {user?.completed_profile}
      </h1>
    </section>
  );
}
