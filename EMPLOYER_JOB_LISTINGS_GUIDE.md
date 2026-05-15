# Employer Job Listings API Integration Guide

## Overview

This guide explains how to use the `fetchEmployerJobListingsThunk` to fetch and manage an employer's own job listings in the React frontend.

---

## Backend API Endpoint

- **Route**: `GET /employers/job-listings`
- **Authentication**: Required (auth:sanctum)
- **Controller**: `EmployerProfileController@jobListings`
- **Returns**: All job listings created by the authenticated employer

### Backend Implementation

```php
public function jobListings()
{
    $jobListings = auth()->user()->employerProfile->jobListings;
    return response()->json(
        [
            "message" => "Employer job listings retrieved successfully",
            "data" => $jobListings,
        ],
        200,
    );
}
```

---

## Frontend Redux Integration

### 1. Import the Thunk and Selectors

```typescript
import { 
  fetchEmployerJobListingsThunk, 
  selectEmployerJobListings,
  selectEmployerIsLoading,
  selectEmployerError 
} from "@/app/employer/employerSlice";
import { useDispatch, useSelector } from "react-redux";
```

### 2. Dispatch the Thunk in a Component

#### Basic Usage Example

```typescript
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployerJobListingsThunk, selectEmployerJobListings } from "@/app/employer/employerSlice";

export function EmployerJobListingsPage() {
  const dispatch = useDispatch();
  const jobListings = useSelector(selectEmployerJobListings);
  const isLoading = useSelector(selectEmployerIsLoading);
  const error = useSelector(selectEmployerError);

  useEffect(() => {
    dispatch(fetchEmployerJobListingsThunk());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading job listings...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (jobListings.length === 0) {
    return <div>No job listings found.</div>;
  }

  return (
    <div>
      <h1>Your Job Listings</h1>
      <ul>
        {jobListings.map((listing) => (
          <li key={listing.id}>
            <h3>{listing.title}</h3>
            <p>{listing.description}</p>
            <p>Location: {listing.location}</p>
            <p>Status: {listing.status}</p>
            <p>Salary: ${listing.salary_min} - ${listing.salary_max}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 3. Thunk Definition

**Location**: `front-end/src/app/employer/employerSlice.ts`

```typescript
export const fetchEmployerJobListingsThunk = createAsyncThunk<
  { message: string; data: JobListingData[] },
  void,
  { rejectValue: string }
>("employer/fetchJobListings", async (_, thunkApi) => {
  try {
    const res = await api.get("/employers/job-listings");
    return res.data;
  } catch (error) {
    const errorMessage = getApiErrorMessage(error);
    toast.error(errorMessage, {
      description: "Failed to fetch job listings.",
    });
    return thunkApi.rejectWithValue(errorMessage);
  }
});
```

---

## State Structure

The thunk updates the employer slice state with the following structure:

```typescript
interface EmployerState {
  profile: EmployerProfileData | null;
  profiles: EmployerProfileData[];
  jobListings: JobListingData[];  // ← Populated by fetchEmployerJobListingsThunk
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
  updateError: string | null;
}
```

---

## Available Selectors

### Job Listings Selector
```typescript
const jobListings = useSelector(selectEmployerJobListings);
// Returns: JobListingData[]
```

### Loading State Selector
```typescript
const isLoading = useSelector(selectEmployerIsLoading);
// Returns: boolean
```

### Error State Selector
```typescript
const error = useSelector(selectEmployerError);
// Returns: string | null
```

---

## JobListingData Type

```typescript
export type JobListingData = {
  id: number;
  title: string;
  description: string;
  location: string;
  salary_min: number;
  salary_max: number;
  work_type: string;
  experience_level: string;
  deadline: string;
  status: "pending" | "approved" | "rejected";
  category_id: number;
  employer_id: number;
  created_at: string;
  skills?: string[];
  employer?: {
    id: number;
    name: string;
    user_id: number;
  };
};
```

---

## Error Handling

The thunk automatically handles errors and displays a toast notification:

```typescript
toast.error(errorMessage, {
  description: "Failed to fetch job listings.",
});
```

Common error scenarios:
- **401 Unauthorized**: User is not authenticated
- **403 Forbidden**: User doesn't have permission to view these listings
- **500 Server Error**: Backend error occurred

---

## Best Practices

1. **Call once on mount**: Use `useEffect` with `dispatch` dependency to fetch on component mount
2. **Handle loading states**: Always check `isLoading` before rendering content
3. **Display errors**: Show error messages to users via error state
4. **Cache invalidation**: Re-call the thunk when the list should be refreshed (e.g., after creating a new job listing)

### Example: Full Component with Refresh Button

```typescript
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchEmployerJobListingsThunk, 
  selectEmployerJobListings,
  selectEmployerIsLoading,
  selectEmployerError 
} from "@/app/employer/employerSlice";

export function EmployerJobListingsPanel() {
  const dispatch = useDispatch();
  const jobListings = useSelector(selectEmployerJobListings);
  const isLoading = useSelector(selectEmployerIsLoading);
  const error = useSelector(selectEmployerError);

  useEffect(() => {
    dispatch(fetchEmployerJobListingsThunk());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchEmployerJobListingsThunk());
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Job Listings</h2>
        <button 
          onClick={handleRefresh}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      )}

      {isLoading && jobListings.length === 0 && (
        <div className="text-center py-8">Loading...</div>
      )}

      <div className="space-y-4">
        {jobListings.map((listing) => (
          <div key={listing.id} className="p-4 border rounded shadow">
            <h3 className="font-bold text-lg">{listing.title}</h3>
            <p className="text-gray-600">{listing.location}</p>
            <p className="text-sm mt-2">{listing.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className={`px-2 py-1 rounded text-sm font-semibold ${
                listing.status === 'approved' ? 'bg-green-100 text-green-800' :
                listing.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {listing.status}
              </span>
              <span className="text-gray-600">
                ${listing.salary_min} - ${listing.salary_max}
              </span>
            </div>
          </div>
        ))}
      </div>

      {!isLoading && jobListings.length === 0 && !error && (
        <div className="text-center py-8 text-gray-500">
          No job listings found. Create one to get started!
        </div>
      )}
    </div>
  );
}
```

---

## Summary

| Item | Details |
|------|---------|
| **Thunk Name** | `fetchEmployerJobListingsThunk` |
| **Endpoint** | `GET /employers/job-listings` |
| **State Key** | `employer.jobListings` |
| **Selector** | `selectEmployerJobListings` |
| **Data Type** | `JobListingData[]` |
| **Authentication** | Required (auth:sanctum) |

