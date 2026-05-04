import React, { useCallback, memo } from "react";
import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import type { IQuery } from "@/interfaces";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store";
import { getJobListings } from "@/app/jobListSlice";

function FilterSidebarComponent() {
  const [value, setValue] = React.useState([0.3, 0.7]);
  const [query, setQuery] = React.useState<IQuery>({
    search: "",
    category: "",
    location: "",
    job_type: "",
    salaryRange: [0, 5000],
  });
  const dispatch = useDispatch<AppDispatch>();

  const updateQuery = useCallback(
    (partial: Partial<IQuery>) => {
      // 1. Calculate the new merged state outside the setQuery function
      const nextQuery = { ...query, ...partial };

      // 2. Update the local state
      setQuery(nextQuery);

      // 3. Dispatch the Redux action
      dispatch(getJobListings(nextQuery));
    },
    // Make sure to add 'query' to your dependency array since you are using it now!
    [dispatch, query],
  );

  const searchHandler = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(getJobListings(query));
    },
    [dispatch, query],
  );

  return (
    <aside className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm lg:sticky lg:top-24">
      <h2 className="mb-4 text-lg font-semibold tracking-tight">Filters</h2>
      <div className="space-y-4">
        <div>
          <Field orientation="horizontal" className="py-2 ">
            <div className="flex w-full items-center gap-2">
              <Input
                type="search"
                value={query.search}
                onChange={(e) => updateQuery({ search: e.target.value })}
                placeholder="Search..."
              />
              <Button type="button" onClick={searchHandler}>
                Search
              </Button>
            </div>
          </Field>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            onChange={(e) => {
              const category = e.target.value === "-1" ? "" : e.target.value;
              updateQuery({ category });
            }}
          >
            <option value="-1">All Categories</option>
            <option value="1">Engineering</option>
            <option value="2">Design</option>
            <option value="3">Marketing</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Location</label>
          <input
            type="text"
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter location"
            value={query.location}
            onChange={(e) => updateQuery({ location: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Job Type</label>
          <select
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            onChange={(e) => {
              const job_type = e.target.value;
              updateQuery({ job_type });
            }}
          >
            <option value="">All Types</option>
            <option value="remote">Remote</option>
            <option value="on_site">On-Site</option>
          </select>
        </div>

        <div className=" grid w-full max-w-xs gap-3">
          <div className="flex items-center justify-between gap-2">
            <Label
              htmlFor="slider-demo-temperature"
              className="text-sm font-medium"
            >
              Salary Range
            </Label>
            <span className="text-sm text-muted-foreground">
              {value.join(", ")}
            </span>
          </div>
          <Slider
            id="slider-demo-temperature"
            value={value}
            onValueChange={(next) => {
              // 1. Only update the local UI state here so the slider moves smoothly
              setValue(next as [number, number]);
            }}
            onValueCommit={(next) => {
              // 2. Only trigger the fetch/query update when the user drops the handle
              updateQuery({ salaryRange: next as [number, number] });
            }}
            min={1000}
            max={10000}
            step={50}
          />
        </div>
      </div>
      <div>
        <Button
          type="button"
          variant="destructive"
          className="mt-4 w-full"
          onClick={() => {
            setQuery({
              search: "",
              category: "",
              location: "",
              job_type: "",
              salaryRange: [0, 5000],
            });
            setValue([0.3, 0.7]);
            dispatch(
              getJobListings({
                search: "",
                category: "",
                location: "",
                job_type: "",
                salaryRange: [0, 5000],
              }),
            );
          }}
        >
          Clear Filters
        </Button>
      </div>
    </aside>
  );
}

export const FilterSidebar = memo(FilterSidebarComponent);
