# AdminEmployers Component Fix

## Issue
The `AdminEmployers` component was trying to fetch job listings using `fetchEmployerJobListingsThunk`, which is designed to fetch **only the current authenticated user's job listings**, not all job listings across all employers.

## Root Cause
- **`fetchEmployerJobListingsThunk`**: Calls `/employers/job-listings` - Returns only the logged-in employer's job listings
- **Component needed**: All job listings from all employers to display job counts per employer

## Solution
Changed the component to use **`fetchJobListingsThunk`** from the admin slice, which fetches all job listings from all employers.

### Changes Made

1. **Updated imports** (line 3-6):
```diff
- import { fetchEmployersThunk } from "@/app/admin/adminSlice";
- import { fetchEmployerJobListingsThunk } from "@/app/employer/employerSlice";
+ import {
+   fetchEmployersThunk,
+   fetchJobListingsThunk,
+ } from "@/app/admin/adminSlice";
```

2. **Updated state selector** (line 46-47):
```diff
- const { employers, isLoading, error } = useSelector((state: RootState) => state.admin);
- const { jobListings } = useSelector((state: RootState) => state.employer);
+ const { employers, jobListings, isLoading, error } = useSelector(
+   (state: RootState) => state.admin,
+ );
```

3. **Updated useEffect** (line 51-54):
```diff
useEffect(() => {
  dispatch(fetchEmployersThunk({ page: 1, limit: 100 }));
- dispatch(fetchEmployerJobListingsThunk());
- }, [dispatch, jobListings]);
+ dispatch(fetchJobListingsThunk({ page: 1, limit: 100 }));
+ }, [dispatch]);
```

4. **Improved null-safety check** (line 308-310):
```diff
- {jobListings.filter((j) => j.employer_id === selectedEmployer.id).length === 0 ?
+ {!jobListings || jobListings.filter((j) => j.employer_id === selectedEmployer.id).length === 0 ?
```

## Key Differences

| Thunk | Endpoint | Returns | Use Case |
|-------|----------|---------|----------|
| `fetchJobListingsThunk` | `GET /job-listings` | All job listings from all employers | Admin dashboard, filtering across employers |
| `fetchEmployerJobListingsThunk` | `GET /employers/job-listings` | Only current employer's job listings | Employer dashboard, personal job management |

## How It Works Now

1. When `AdminEmployers` component mounts:
   - Fetches all employers: `dispatch(fetchEmployersThunk({ page: 1, limit: 100 }))`
   - Fetches all job listings: `dispatch(fetchJobListingsThunk({ page: 1, limit: 100 }))`

2. Both pieces of data are stored in `state.admin` (admin slice)

3. Job listings are filtered by `employer_id` to show which jobs belong to each employer:
```typescript
const getEmployerJobCount = (employerId: number) => {
  return jobListings.filter((j) => j.employer_id === employerId).length;
};
```

4. When viewing an employer's detail:
   - Job listings are filtered again: `jobListings.filter((j) => j.employer_id === selectedEmployer.id)`
   - Shows each job with title and approval status

## Testing

To verify the fix works:
1. Navigate to the Admin Employers page
2. Verify that the "Job Listings" column shows the correct count for each employer
3. Click "View" on an employer
4. Verify the detail drawer shows all job listings for that specific employer
5. Check that job status badges (approved/pending/rejected) display correctly

## Frontend File Changed
- **Path**: `front-end/src/screens/admin/AdminEmployers.tsx`
- **Lines changed**: 3-6, 46-50, 51-54, 308-310

