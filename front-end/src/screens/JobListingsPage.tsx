import { getJobListings } from "@/app/jobListSlice";
import type { AppDispatch, RootState } from "@/app/store";
import { FilterSidebar } from "@/components/FilterSidebar";
import { JobPost } from "@/components/JobPost";
import { CustomPagination } from "@/components/Pagination";

import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export function JobListingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, error, currentPage, totalPages, totalItems } =
    useSelector((state: RootState) => state.jobList);

  // Only fetch on initial mount — not on every re-render or filter change
  const hasFetched = useRef(false);
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getJobListings());
    }
  }, [dispatch]);

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(getJobListings({ page }));
    },
    [dispatch],
  );

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-border/70 bg-gradient-to-br from-card to-background p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Opportunities
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Discover Jobs That Match Your Craft
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Browse curated openings for developers and designers. Filter by
          category, location, and work style to find your best fit.
        </p>
      </header>

      <div className="grid grid-cols-7 items-start gap-6">
        <div className="col-span-2">
          <FilterSidebar />
        </div>
        <div className="col-span-5 space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 text-sm text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{jobs.length}</strong>{" "}
              of <strong className="text-foreground">{totalItems}</strong>{" "}
              results
            </span>
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              Could not load jobs. Try adjusting your filters.
            </div>
          )}

          <div className="space-y-3">
            {loading && jobs.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                Loading jobs…
              </div>
            ) : jobs.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                No jobs found matching your criteria.
              </div>
            ) : (
              jobs.map((job) => <JobPost key={job.id} {...job} />)
            )}
          </div>

          {loading && jobs.length > 0 && (
            <div className="py-2 text-center text-xs text-muted-foreground">
              Updating results…
            </div>
          )}

          <div className="pt-2">
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
