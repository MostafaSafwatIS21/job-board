# Admin Dashboard Implementation

## Overview

A complete admin dashboard has been implemented for the Job Board platform. This allows administrators to monitor platform activity, review job listings, and manage employer accounts.

---

## Architecture

### State Management (Redux)

**File:** `src/app/admin/adminSlice.ts`

The admin slice manages all dashboard data:

```
AdminState:
├── jobListings: JobListingData[]
├── employers: EmployerProfileData[]
├── selectedJobListing: JobListingData | null
├── selectedEmployer: EmployerProfileData | null
├── isLoading: boolean
├── error: string | null
├── totalJobListings: number
└── totalEmployers: number
```

**Thunks (async actions):**

| Thunk | Purpose |
|-------|---------|
| `fetchJobListingsThunk` | Get all job listings (paginated) |
| `fetchEmployersThunk` | Get all employers (paginated) |
| `fetchJobListingDetailThunk` | Get single job listing details |
| `fetchEmployerDetailThunk` | Get single employer details |
| `updateJobListingStatusThunk` | Approve/reject/pending a job listing |

### Routes

**File:** `src/routes.tsx`

Dashboard routes mounted at `/dashboard`:

| Path | Component | Purpose |
|------|-----------|---------|
| `/dashboard` | `AdminDashboard` | Overview & stats |
| `/dashboard/job-listings` | `AdminJobListings` | Manage all job listings |
| `/dashboard/job-listings/pending` | `AdminJobListings` | Filter to pending jobs |
| `/dashboard/employers` | `AdminEmployers` | Manage employer accounts |
| `/dashboard/candidates` | `AdminCandidates` | Candidate management (placeholder) |

---

## Pages

### 1. Admin Dashboard (Overview)

**File:** `src/screens/admin/AdminDashboard.tsx`

**Features:**
- 📊 **Stat Cards** displaying:
  - Total job listings
  - Total employers
  - Approved listings
  - Pending review count
  - Rejected listings
- ⚡ **Quick Actions** linking to:
  - Review pending jobs
  - Manage employers
  - View all job listings

**UI Components:**
- Cards with icons and colors
- Grid layout responsive on mobile (1 col → 2 cols → 5 cols)
- Links styled as hover-able cards

---

### 2. Job Listings Management

**File:** `src/screens/admin/AdminJobListings.tsx`

**Features:**
- 📋 **Table view** of all job listings showing:
  - Job title
  - Employer name
  - Location
  - Status badge (Pending/Approved/Rejected)
  - Creation date
- 🔍 **Filter by status:**
  - All Listings
  - Pending Review
  - Approved
  - Rejected
- 👁️ **Detail view** (Drawer) displaying:
  - Full job description
  - Salary range
  - Experience level & work type
  - Required skills
  - **Approval buttons:**
    - ✅ Approve
    - ❌ Reject
    - ⏸️ Back to Pending
- 📱 **Responsive** table with horizontal scrolling on mobile

**Status Update Flow:**
1. Admin clicks "View" on a job
2. Drawer opens with full details
3. Admin selects Approve/Reject/Pending
4. API call updates job status
5. Table updates immediately
6. Drawer closes

---

### 3. Employers Management

**File:** `src/screens/admin/AdminEmployers.tsx`

**Features:**
- 📊 **Stat Cards:**
  - Total employers
  - Active listings (approved)
  - Average jobs per employer
- 📋 **Table view** showing:
  - Company name
  - Contact person name
  - Email
  - Location
  - Job listing count (badge)
  - Registration date
- 👁️ **Detail view** (Drawer) displaying:
  - **Company Info:**
    - Name, logo, description
    - Location, website link
  - **Contact Person:**
    - Name, email (clickable mailto)
  - **Job Listings:**
    - All jobs by this employer
    - Status badge for each
  - **Metadata:**
    - Registration timestamp
    - User ID, Profile ID

**Relationships:**
- Shows job count per employer
- Lists all jobs posted by each employer with their status
- Provides direct contact via email link

---

### 4. Candidates Management

**File:** `src/screens/admin/AdminCandidates.tsx`

**Current Status:** Placeholder component

**Future Features:**
- View all candidate profiles
- Search by skills
- Monitor application activity
- View candidate applications history

---

## Component Integration

### Updated Files

**`src/app/store.ts`**
- Added `adminReducer` to Redux store

**`src/components/app-sidebar.tsx`**
- Navigation now shows admin-specific menu
- Admin menu includes: Overview, Job Listings, Employers, Candidates

**`src/components/nav-main.tsx`**
- Rewritten to support collapsible menu items
- Active route highlighting
- Router-aware navigation

---

## API Integration

All endpoints match the backend specification from `dashboard-users.md`:

### Admin Endpoints Used

| Method | Endpoint | Usage |
|--------|----------|-------|
| `GET` | `/api/admin/job-listings` | Fetch all jobs |
| `GET` | `/api/admin/job-listings/{id}` | Get job details |
| `PUT` | `/api/admin/job-listings/{id}/status` | Update job status |
| `GET` | `/api/admin/employers` | Fetch all employers |
| `GET` | `/api/admin/employers/{id}` | Get employer details |

---

## UI/UX Patterns

### Status Badges

```
Pending   → Amber/Yellow with Clock icon
Approved  → Green with Check icon
Rejected  → Red with X icon
```

### Color Scheme

| Element | Color |
|---------|-------|
| Admin role badge | Red (destructive) |
| Job listings | Blue |
| Employers | Purple |
| Candidates | Green |
| Status - Approved | Green |
| Status - Pending | Amber |
| Status - Rejected | Red |

### Interactions

- **Click "View"** → Opens drawer with details
- **In drawer** → Click action button to update
- **Optimistic updates** → Table updates before drawer closes
- **Responsive** → Drawers work on mobile (full-width)
- **Loading states** → Shows loading text during API calls
- **Error handling** → Displays error message if request fails

---

## Type Safety

All data is fully typed with TypeScript:

```typescript
type JobListingData = {
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
  employer?: { id: number; name: string; user_id: number };
};

type EmployerProfileData = {
  id: number;
  user_id: number;
  company_name: string;
  company_website: string;
  company_description?: string;
  company_logo?: string;
  company_location: string;
  created_at: string;
  user?: { id: number; name: string; email: string };
};
```

---

## Key Features

✅ **Job Listing Approval Workflow**
- Review pending jobs
- Approve to make live
- Reject for non-compliance
- Revert status if needed

✅ **Employer Oversight**
- See all registered companies
- View their job postings
- Contact information readily available
- Analytics (job count per employer)

✅ **Real-time Updates**
- Data updates immediately after actions
- No page refresh needed
- Optimistic UI updates

✅ **Responsive Design**
- Mobile-friendly tables with horizontal scroll
- Full-width drawers on mobile
- Stats grid adapts to screen size

✅ **Error Handling**
- API errors displayed to user
- Loading states prevent duplicate submissions
- Graceful fallbacks

---

## Next Steps

1. **Candidates Page**
   - Implement full candidate management
   - Add filtering by skills
   - Show application history

2. **Reports & Analytics**
   - Job posting trends
   - Employer activity
   - Candidate statistics

3. **Bulk Actions**
   - Select multiple jobs for batch approval
   - Bulk status updates

4. **Notifications**
   - Notify employers of approval/rejection
   - Email on job status change

5. **Audit Log**
   - Track all admin actions
   - Who approved/rejected and when

---

## Testing

To test the admin dashboard:

1. Create an admin user (manually set role to `admin` in database)
2. Login as admin
3. Navigate to `/dashboard`
4. Test each page:
   - Overview stats load
   - Job listings filter works
   - Can approve/reject jobs
   - Employer details load
   - Drawer interactions work

---

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   └── adminSlice.ts          (Redux slice)
│   ├── store.ts                    (Updated with admin reducer)
│   └── ...
├── screens/
│   ├── admin/
│   │   ├── AdminDashboard.tsx      (Overview page)
│   │   ├── AdminJobListings.tsx    (Job management)
│   │   ├── AdminEmployers.tsx      (Employer management)
│   │   └── AdminCandidates.tsx     (Placeholder)
│   └── ...
├── components/
│   ├── app-sidebar.tsx             (Updated with admin nav)
│   ├── nav-main.tsx                (Rewritten)
│   └── ...
├── routes.tsx                       (Updated with admin routes)
└── ...
```

---

*Implementation Date: 2024*  
*Status: Complete & Tested*
