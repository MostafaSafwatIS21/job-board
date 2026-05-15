# Employer Job Listings - Quick Reference

## When to Use Which Thunk

### 1. **`fetchEmployerJobListingsThunk`** ✅ 
**Use for**: Employer's personal job listing dashboard

```typescript
// Import
import { fetchEmployerJobListingsThunk } from "@/app/employer/employerSlice";

// Usage
useEffect(() => {
  dispatch(fetchEmployerJobListingsThunk()); // Fetch current user's listings
}, [dispatch]);

// Get data
const jobListings = useSelector(selectEmployerJobListings);
```

**Endpoint**: `GET /employers/job-listings`  
**Returns**: All job listings created by the **authenticated employer**  
**State**: `state.employer.jobListings`

### 2. **`fetchJobListingsThunk`** ✅
**Use for**: Admin dashboard to view all job listings across all employers

```typescript
// Import
import { fetchJobListingsThunk } from "@/app/admin/adminSlice";

// Usage
useEffect(() => {
  dispatch(fetchJobListingsThunk({ page: 1, limit: 100 }));
}, [dispatch]);

// Get data
const jobListings = useSelector((state: RootState) => state.admin.jobListings);
```

**Endpoint**: `GET /job-listings`  
**Returns**: All job listings from **all employers**  
**State**: `state.admin.jobListings`  
**Params**: `{ page?: number; limit?: number }`

---

## Common Scenarios

### Scenario 1: Employer Views Their Own Job Listings
```typescript
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchEmployerJobListingsThunk, 
  selectEmployerJobListings 
} from "@/app/employer/employerSlice";

function EmployerDashboard() {
  const dispatch = useDispatch();
  const myJobListings = useSelector(selectEmployerJobListings);

  useEffect(() => {
    dispatch(fetchEmployerJobListingsThunk());
  }, [dispatch]);

  return <div>{myJobListings.map(job => <div key={job.id}>{job.title}</div>)}</div>;
}
```

### Scenario 2: Admin Views All Job Listings
```typescript
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobListingsThunk } from "@/app/admin/adminSlice";

function AdminDashboard() {
  const dispatch = useDispatch();
  const allJobListings = useSelector((state) => state.admin.jobListings);

  useEffect(() => {
    dispatch(fetchJobListingsThunk({ page: 1, limit: 100 }));
  }, [dispatch]);

  return <div>{allJobListings.map(job => <div key={job.id}>{job.title}</div>)}</div>;
}
```

### Scenario 3: Admin Views Jobs for Specific Employer
```typescript
function AdminEmployers() {
  const dispatch = useDispatch();
  const allJobListings = useSelector((state) => state.admin.jobListings);
  const [selectedEmployerId, setSelectedEmployerId] = useState(null);

  useEffect(() => {
    dispatch(fetchJobListingsThunk({ page: 1, limit: 100 })); // Fetch all
  }, [dispatch]);

  const employerJobs = allJobListings.filter(
    j => j.employer_id === selectedEmployerId
  );

  return <div>{employerJobs.map(job => <div key={job.id}>{job.title}</div>)}</div>;
}
```

---

## Selectors Available

### From Employer Slice
```typescript
import {
  selectEmployerJobListings,      // JobListingData[]
  selectEmployerIsLoading,        // boolean
  selectEmployerError,            // string | null
  selectEmployerIsUpdating,       // boolean
  selectEmployerUpdateError       // string | null
} from "@/app/employer/employerSlice";
```

### From Admin Slice
```typescript
import {
  selectJobListings,              // JobListingData[]
  selectEmployers,                // EmployerProfileData[]
  selectSelectedJobListing,       // JobListingData | null
  selectSelectedEmployer,         // EmployerProfileData | null
} from "@/app/admin/adminSlice";

// Or destructure directly
const { jobListings, employers, isLoading, error } = useSelector(
  (state: RootState) => state.admin
);
```

---

## API Endpoints Reference

| Endpoint | Method | Purpose | Authentication | Returns |
|----------|--------|---------|-----------------|---------|
| `/employers/job-listings` | GET | Get current employer's job listings | ✅ Required | `{ message, data: JobListingData[] }` |
| `/job-listings` | GET | Get all job listings | ✅ Required | `{ data: JobListingData[], total: number }` |
| `/job-listings` | POST | Create new job listing | ✅ Employer | `{ data: JobListingData }` |
| `/job-listings/{id}` | GET | Get job listing details | ✅ Required | `{ data: JobListingData }` |
| `/job-listings/{id}` | PUT | Update job listing | ✅ Employer | `{ data: JobListingData }` |
| `/job-listings/{id}` | DELETE | Delete job listing | ✅ Employer | `{ message }` |
| `/admin/job-listings` | GET | Admin: view all job listings | ✅ Admin | `{ data: JobListingData[] }` |
| `/admin/job-listings/{id}` | GET | Admin: view job listing details | ✅ Admin | `{ data: JobListingData }` |
| `/admin/job-listings/{id}/status` | PUT | Admin: update job listing status | ✅ Admin | `{ data: JobListingData }` |

---

## Troubleshooting

### Issue: "Showing only current user's jobs in admin view"
❌ Wrong:
```typescript
dispatch(fetchEmployerJobListingsThunk()); // ← Only gets current user's jobs
```

✅ Correct:
```typescript
dispatch(fetchJobListingsThunk({ page: 1, limit: 100 })); // ← Gets all jobs
```

### Issue: "Job count shows 0 for all employers"
❌ Wrong:
```typescript
const jobListings = useSelector((state) => state.employer.jobListings); // ← Wrong slice
```

✅ Correct:
```typescript
const jobListings = useSelector((state) => state.admin.jobListings); // ← Correct slice
```

### Issue: "Dispatcher not finding the thunk"
❌ Wrong:
```typescript
import { fetchEmployerJobListingsThunk } from "@/app/admin/adminSlice"; // ← Wrong!
```

✅ Correct:
```typescript
import { fetchEmployerJobListingsThunk } from "@/app/employer/employerSlice"; // ✅
```

---

## State Breakdown

```
Redux Store
├── state.admin
│   ├── jobListings: JobListingData[]  ← ALL job listings
│   ├── employers: EmployerProfileData[]
│   ├── isLoading: boolean
│   └── error: string | null
│
└── state.employer
    ├── profile: EmployerProfileData | null
    ├── profiles: EmployerProfileData[]
    ├── jobListings: JobListingData[]  ← CURRENT USER'S job listings
    ├── isLoading: boolean
    └── error: string | null
```

