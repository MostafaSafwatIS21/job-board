# Employer Slice Documentation

## Overview

Complete Redux state management for employer functionality. Handles fetching, updating, and deleting employer profiles, as well as uploading logos and avatars.

## File Location

```
src/app/employer/employerSlice.ts
```

## State Structure

```typescript
interface EmployerState {
  profile: EmployerProfileData | null;           // Current user's employer profile
  profiles: EmployerProfileData[];                // List of all employers
  isLoading: boolean;                             // Loading state for fetch operations
  error: string | null;                           // Error message from fetch operations
  isUpdating: boolean;                            // Loading state for update/delete/upload
  updateError: string | null;                     // Error message from update operations
}
```

## Types

### EmployerProfileData

```typescript
type EmployerProfileData = {
  id: number;                        // Profile ID
  user_id: number;                   // User ID
  company_name: string;              // Company name
  company_website: string;           // Company website URL
  company_description?: string;      // Company description
  company_logo?: string;             // Company logo URL
  company_location: string;          // Company location
  created_at: string;                // Creation timestamp
  updated_at: string;                // Last update timestamp
};
```

### CreateEmployerProfilePayload

```typescript
type CreateEmployerProfilePayload = {
  company_name: string;
  company_website: string;
  company_description?: string;
  company_logo?: string;
  company_location: string;
};
```

### UpdateEmployerProfilePayload

```typescript
type UpdateEmployerProfilePayload = Partial<CreateEmployerProfilePayload>;
```

## Thunks (Async Actions)

### 1. fetchEmployerProfileThunk

Get current user's employer profile.

**Parameters:** None

**Returns:** `EmployerProfileData`

**Endpoint:** `GET /employers`

**Usage:**
```typescript
const { profile, isLoading } = useSelector((state) => state.employer);
const dispatch = useDispatch<AppDispatch>();

useEffect(() => {
  dispatch(fetchEmployerProfileThunk());
}, [dispatch]);
```

---

### 2. fetchAllEmployersThunk

Get all employer profiles (paginated, public view).

**Parameters:**
```typescript
{
  page?: number;    // Page number (default: 1)
  limit?: number;   // Items per page (default: 10)
}
```

**Returns:** `{ data: EmployerProfileData[]; total: number }`

**Endpoint:** `GET /employers?page=1&limit=10`

**Usage:**
```typescript
dispatch(fetchAllEmployersThunk({ page: 1, limit: 20 }))
  .then(() => {
    const { profiles } = useSelector((state) => state.employer);
  });
```

---

### 3. fetchEmployerByIdThunk

Get specific employer profile by ID.

**Parameters:** `employerId: number`

**Returns:** `EmployerProfileData`

**Endpoint:** `GET /employers/{employerId}`

**Usage:**
```typescript
dispatch(fetchEmployerByIdThunk(123))
  .then(() => {
    const { profile } = useSelector((state) => state.employer);
  });
```

---

### 4. updateEmployerProfileThunk

Update current employer profile.

**Parameters:**
```typescript
{
  company_name?: string;
  company_website?: string;
  company_description?: string;
  company_logo?: string;
  company_location?: string;
}
```

**Returns:** `EmployerProfileData`

**Endpoint:** `PUT /employers`

**Usage:**
```typescript
dispatch(updateEmployerProfileThunk({
  company_name: "New Company Name",
  company_location: "New York, NY"
}))
  .then(() => {
    // Profile updated
  });
```

---

### 5. deleteEmployerProfileThunk

Delete current employer profile.

**Parameters:** None

**Returns:** `void`

**Endpoint:** `DELETE /employers`

**Usage:**
```typescript
dispatch(deleteEmployerProfileThunk())
  .then(() => {
    // Profile deleted, profile state becomes null
  });
```

---

### 6. uploadLogoThunk

Upload company logo.

**Parameters:** `file: File`

**Returns:** `EmployerProfileData`

**Endpoint:** `PUT /upload/logos`

**Usage:**
```typescript
const fileInput = document.getElementById('logo') as HTMLInputElement;
const file = fileInput.files?.[0];

if (file) {
  dispatch(uploadLogoThunk(file))
    .then(() => {
      // Logo uploaded and profile updated
    });
}
```

---

### 7. uploadAvatarThunk

Upload user avatar.

**Parameters:** `file: File`

**Returns:** `string` (avatar URL)

**Endpoint:** `PUT /upload/avatars`

**Usage:**
```typescript
const fileInput = document.getElementById('avatar') as HTMLInputElement;
const file = fileInput.files?.[0];

if (file) {
  dispatch(uploadAvatarThunk(file))
    .then(() => {
      // Avatar uploaded
    });
}
```

---

## Actions (Synchronous)

### clearError

Clear fetch error message.

```typescript
dispatch(clearError());
```

### clearUpdateError

Clear update error message.

```typescript
dispatch(clearUpdateError());
```

### clearProfile

Clear current profile.

```typescript
dispatch(clearProfile());
```

---

## Selectors

### selectEmployerProfile

Get current user's employer profile.

```typescript
const profile = useSelector(selectEmployerProfile);
```

### selectAllEmployers

Get list of all employers.

```typescript
const employers = useSelector(selectAllEmployers);
```

### selectEmployerIsLoading

Get loading state for fetch operations.

```typescript
const isLoading = useSelector(selectEmployerIsLoading);
```

### selectEmployerError

Get error from fetch operations.

```typescript
const error = useSelector(selectEmployerError);
```

### selectEmployerIsUpdating

Get loading state for update/delete/upload operations.

```typescript
const isUpdating = useSelector(selectEmployerIsUpdating);
```

### selectEmployerUpdateError

Get error from update operations.

```typescript
const updateError = useSelector(selectEmployerUpdateError);
```

---

## Complete Example

```typescript
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store";
import {
  fetchEmployerProfileThunk,
  updateEmployerProfileThunk,
  uploadLogoThunk,
  selectEmployerProfile,
  selectEmployerIsLoading,
  selectEmployerError,
} from "@/app/employer/employerSlice";

export function EmployerProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector(selectEmployerProfile);
  const isLoading = useSelector(selectEmployerIsLoading);
  const error = useSelector(selectEmployerError);

  useEffect(() => {
    dispatch(fetchEmployerProfileThunk());
  }, [dispatch]);

  const handleUpdateProfile = (data: UpdateEmployerProfilePayload) => {
    dispatch(updateEmployerProfileThunk(data));
  };

  const handleLogoUpload = (file: File) => {
    dispatch(uploadLogoThunk(file));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div>
      <h1>{profile.company_name}</h1>
      <p>{profile.company_description}</p>
      {/* Form to update profile */}
      {/* File upload for logo */}
    </div>
  );
}
```

---

## API Endpoints Reference

| Action | Method | Endpoint | Payload |
|--------|--------|----------|---------|
| Get own profile | GET | `/employers` | - |
| Get all employers | GET | `/employers?page=1&limit=10` | - |
| Get by ID | GET | `/employers/{id}` | - |
| Update profile | PUT | `/employers` | Profile data |
| Delete profile | DELETE | `/employers` | - |
| Upload logo | PUT | `/upload/logos` | FormData with file |
| Upload avatar | PUT | `/upload/avatars` | FormData with file |

---

## Error Handling

All thunks include automatic error handling with toast notifications:

```typescript
// Success toast
toast.success("Profile updated successfully!");

// Error toast
toast.error(errorMessage, {
  description: "Failed to update employer profile.",
});
```

Errors are stored in Redux state:
- `error` - for fetch operations
- `updateError` - for update/delete/upload operations

---

## Loading States

Different operations use different loading states:

| Operation | Loading State |
|-----------|---------------|
| Fetch profile | `isLoading` |
| Fetch all employers | `isLoading` |
| Fetch by ID | `isLoading` |
| Update profile | `isUpdating` |
| Delete profile | `isUpdating` |
| Upload logo | `isUpdating` |
| Upload avatar | `isUpdating` |

---

## Best Practices

1. **Always check loading/error states** before rendering
2. **Use selectors** instead of accessing state directly
3. **Clear errors** after displaying them to user
4. **Handle file uploads** with proper validation
5. **Use `.unwrap()`** for promise-based error handling:

```typescript
try {
  await dispatch(updateEmployerProfileThunk(data)).unwrap();
  // Success
} catch (error) {
  // Error handling
}
```

---

## Redux Store Integration

The employer slice is automatically integrated into the Redux store:

```typescript
store.reducer = {
  auth: authSlice,
  jobList: jobListReducer,
  applications: applicationReducer,
  admin: adminReducer,
  employer: employerReducer,  // ← Here
};
```

Access employer state:
```typescript
const employer = useSelector((state: RootState) => state.employer);
```

---

## Testing

Example test for employer slice:

```typescript
import { fetchEmployerProfileThunk } from "@/app/employer/employerSlice";
import store from "@/app/store";

describe("Employer Slice", () => {
  it("should fetch employer profile", async () => {
    await store.dispatch(fetchEmployerProfileThunk());
    const { employer } = store.getState();
    expect(employer.profile).toBeDefined();
  });

  it("should update employer profile", async () => {
    await store.dispatch(updateEmployerProfileThunk({
      company_name: "Updated Name"
    }));
    const { employer } = store.getState();
    expect(employer.profile?.company_name).toBe("Updated Name");
  });
});
```

---

*Employer Slice v1.0 — Complete API Integration*
