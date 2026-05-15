# Dashboard — User Roles & Privileges

> Based on `project.md`, `api.php`, and all backend controllers.

---

## Table of Contents

- [Roles Overview](#roles-overview)
- [Admin](#-admin)
- [Employer](#-employer)
- [Candidate](#-candidate)
- [Shared / All Authenticated Users](#-shared--all-authenticated-users)
- [Access Matrix](#access-matrix)

---

## Roles Overview

| Role        | Description                                                                 |
|-------------|-----------------------------------------------------------------------------|
| `admin`     | Platform moderator. Approves/rejects job listings, monitors all activity.  |
| `employer`  | Company user. Posts and manages job listings, reviews candidate applications.|
| `candidate` | Job seeker. Searches for jobs, submits applications, manages own profile.   |

> **Note:** Role is assigned after registration via `POST /api/complete-profile`.  
> A new user has **no role** until they complete their profile and select `employer` or `candidate`.  
> Admin role is assigned manually (not via registration).

---

## 👑 Admin

> Middleware: `auth:sanctum` + `AllowTo:admin`

### Dashboard Sections

| Section               | Access | Description                                      |
|-----------------------|--------|--------------------------------------------------|
| Employer Profiles     | ✅ Read | View all registered employer profiles            |
| Single Employer       | ✅ Read | View a specific employer's profile details       |
| All Job Listings      | ✅ Read | View ALL job listings (pending, approved, rejected) |
| Single Job Listing    | ✅ Read | View details of any specific job listing         |
| Job Listing Status    | ✅ Write| Approve / Reject / Set pending on any job listing|

### API Endpoints

| Method | Endpoint                                  | Action                                  |
|--------|-------------------------------------------|-----------------------------------------|
| `GET`  | `/api/admin/employers`                    | List all employer profiles              |
| `GET`  | `/api/admin/employers/{employerId}`       | View a single employer profile          |
| `GET`  | `/api/admin/job-listings`                 | List all job listings (any status)      |
| `GET`  | `/api/admin/job-listings/{jobListingId}`  | View a single job listing               |
| `PUT`  | `/api/admin/job-listings/{id}/status`     | Update status → `approved / rejected / pending` |

### What Admin **Cannot** Do

- ❌ Cannot post job listings
- ❌ Cannot apply for jobs
- ❌ Cannot edit employer/candidate profiles directly
- ❌ Cannot register as admin through the normal registration flow

---

## 🏢 Employer

> Middleware: `auth:sanctum` + `AllowTo:employer`

### Dashboard Sections

| Section                | Access       | Description                                               |
|------------------------|--------------|-----------------------------------------------------------|
| Own Profile            | ✅ Read/Write | View and update their own company profile                 |
| Company Logo           | ✅ Upload     | Upload/change company logo (jpg, png, webp)               |
| Avatar                 | ✅ Upload     | Upload/change personal avatar                             |
| Job Listings (public)  | ✅ Read       | Browse all **approved** job listings                      |
| Own Job Listings       | ✅ Full CRUD  | Create, edit, and delete their own job listings           |
| Candidate Profiles     | ✅ Read       | Browse and view candidate profiles                        |
| Applications (by job)  | ✅ Read       | View all applications submitted for their job listings    |
| Single Application     | ✅ Read       | View details of a specific application                    |

### API Endpoints

| Method   | Endpoint                                   | Action                                      |
|----------|--------------------------------------------|---------------------------------------------|
| `POST`   | `/api/auth/register`                       | Register a new account                      |
| `POST`   | `/api/auth/login`                          | Login                                       |
| `POST`   | `/api/auth/logout`                         | Logout                                      |
| `POST`   | `/api/complete-profile`                    | Set role to `employer` + fill company info  |
| `GET`    | `/api/employers/{employerProfile}`         | View a specific employer profile            |
| `PUT`    | `/api/employers`                           | Update **own** company profile              |
| `DELETE` | `/api/employers`                           | Delete own profile *(not yet available)*    |
| `PUT`    | `/api/upload/logos`                        | Upload company logo                         |
| `PUT`    | `/api/upload/avatars`                      | Upload avatar                               |
| `GET`    | `/api/job-listings`                        | Browse approved job listings (search/filter)|
| `GET`    | `/api/job-listings/{job_listing}`          | View a single job listing                   |
| `POST`   | `/api/job-listings`                        | Create a new job listing                    |
| `PUT`    | `/api/job-listings/{job_listing}`          | Update **own** job listing                  |
| `DELETE` | `/api/job-listings/{job_listing}`          | Delete **own** job listing                  |
| `GET`    | `/api/candidates`                          | Browse all candidate profiles               |
| `GET`    | `/api/candidates/{candidateId}`            | View a specific candidate profile           |
| `GET`    | `/api/applications/{job_id}/job`           | View all applications for a specific job    |
| `GET`    | `/api/applications/{applicationId}`        | View details of a specific application      |

### Job Listing Fields (on create/update)

| Field              | Required | Notes                                              |
|--------------------|----------|----------------------------------------------------|
| `title`            | ✅        | max 255 chars                                      |
| `description`      | ✅        | Full job description                               |
| `location`         | ✅        | max 255 chars                                      |
| `salary`           | ✅        | Numeric                                            |
| `salary_min`       | ✅        | Numeric                                            |
| `salary_max`       | ✅        | Numeric                                            |
| `work_type`        | ✅        | `remote` or `on_site`                              |
| `experience_level` | ✅        | `entry_level`, `mid_level`, `senior_level`, `executive_level` |
| `deadline`         | ✅        | Date format                                        |
| `category_id`      | ✅        | Must exist in `categories` table                   |
| `skills`           | ❌        | Optional array of strings (max 100 chars each)     |

> ⚠️ **Note:** New job listings start with status `pending` and require **admin approval** before becoming visible to candidates.

### What Employer **Cannot** Do

- ❌ Cannot apply for jobs
- ❌ Cannot edit another employer's job listing
- ❌ Cannot approve/reject job listings (admin only)
- ❌ Cannot update candidate profiles

---

## 🙋 Candidate

> Middleware: `auth:sanctum` + `AllowTo:candidate`

### Dashboard Sections

| Section               | Access       | Description                                                   |
|-----------------------|--------------|---------------------------------------------------------------|
| Own Profile           | ✅ Read/Write | View and update their own candidate profile                   |
| Resume                | ✅ Upload     | Upload/update resume (PDF only)                               |
| Avatar                | ✅ Upload     | Upload/change personal avatar                                 |
| Job Listings          | ✅ Read       | Browse and search all **approved** job listings               |
| Single Job Listing    | ✅ Read       | View details of a specific job                                |
| Employer Profiles     | ✅ Read       | View employer/company profiles                                |
| Applications          | ✅ Full CRUD  | Submit, view, update, and cancel **own** applications         |

### API Endpoints

| Method   | Endpoint                                    | Action                                         |
|----------|---------------------------------------------|------------------------------------------------|
| `POST`   | `/api/auth/register`                        | Register a new account                         |
| `POST`   | `/api/auth/login`                           | Login                                          |
| `POST`   | `/api/auth/logout`                          | Logout                                         |
| `POST`   | `/api/complete-profile`                     | Set role to `candidate` + fill personal info   |
| `PUT`    | `/api/candidates/`                          | Update **own** candidate profile               |
| `PUT`    | `/api/candidates/upload/resumes`            | Upload resume (PDF, max 5MB)                   |
| `PUT`    | `/api/upload/avatars`                       | Upload avatar                                  |
| `GET`    | `/api/job-listings`                         | Browse approved job listings (search/filter)   |
| `GET`    | `/api/job-listings/{job_listing}`           | View a single job listing                      |
| `GET`    | `/api/employers/{employerProfile}`          | View a specific employer profile               |
| `POST`   | `/api/applications/{job_id}/`               | Submit a new application                       |
| `GET`    | `/api/applications/{job_id}/job`            | View all applications for a job                |
| `GET`    | `/api/applications/{applicationId}/`        | View a specific application                    |
| `PUT`    | `/api/applications/{applicationId}/`        | Update **own** application *(pending only)*    |
| `DELETE` | `/api/applications/{applicationId}/`        | Cancel/delete **own** application *(pending only)* |

### Application Fields (on submit/update)

| Field          | Required | Notes                                          |
|----------------|----------|------------------------------------------------|
| `cover_letter` | ✅        | String, minimum 100 characters                 |
| `links`        | ❌        | Optional array (e.g. portfolio, LinkedIn, etc.)|

> ⚠️ **Rules:**
> - A candidate **cannot apply twice** to the same job.
> - Only **pending** applications can be updated or deleted.
> - Once an application is `accepted` or `rejected` by the employer, it is **locked**.

### Candidate Profile Fields (on complete-profile / update)

| Field          | Required | Notes                                |
|----------------|----------|--------------------------------------|
| `headline`     | ✅        | Short bio/headline, max 255 chars    |
| `phone`        | ✅        | max 20 chars                         |
| `location`     | ✅        | max 255 chars                        |
| `resume_url`   | ❌        | Optional URL                         |
| `social_media` | ❌        | Optional array of URLs               |

### Job Search Filters Available to Candidate

| Filter        | Query Param   | Notes                               |
|---------------|---------------|-------------------------------------|
| Keyword       | `search`      | Searches title, description, location, skills, work type, experience level |
| Category      | `category`    | Category ID                         |
| Work Type     | `job_type`    | `remote` or `on_site`               |
| Location      | `location`    | Partial text match                  |
| Salary Range  | `salaryRange` | Array `[min, max]`                  |
| Pagination    | `page`, `limit` | Default: 10 per page, max 100    |

### What Candidate **Cannot** Do

- ❌ Cannot create or manage job listings
- ❌ Cannot view admin panel
- ❌ Cannot update another candidate's profile
- ❌ Cannot modify an application that is no longer `pending`

---

## 🌐 Shared / All Authenticated Users

> These endpoints are available to **any logged-in user** regardless of role.

| Method | Endpoint                         | Action                                    |
|--------|----------------------------------|-------------------------------------------|
| `GET`  | `/api/user`                      | Get the currently authenticated user info |
| `POST` | `/api/tokens/create`             | Create a new personal API token           |
| `GET`  | `/api/job-listings`              | Browse approved job listings              |
| `GET`  | `/api/job-listings/{id}`         | View a specific job listing               |
| `GET`  | `/api/employers/{id}`            | View a specific employer profile          |
| `GET`  | `/api/candidates`                | Browse all candidate profiles             |
| `GET`  | `/api/candidates/{id}`           | View a specific candidate profile         |
| `GET`  | `/api/applications/{job_id}/job` | View all applications for a job           |
| `GET`  | `/api/applications/{id}`         | View a specific application               |

---

## Access Matrix

| Feature                          | Admin | Employer | Candidate |
|----------------------------------|:-----:|:--------:|:---------:|
| Register / Login / Logout        | —     | ✅        | ✅         |
| Complete Profile                 | —     | ✅        | ✅         |
| Browse Approved Job Listings     | —     | ✅        | ✅         |
| View Employer Profile            | ✅    | ✅        | ✅         |
| View Candidate Profiles          | ✅    | ✅        | ✅         |
| **Create Job Listing**           | ❌    | ✅        | ❌         |
| **Edit Own Job Listing**         | ❌    | ✅        | ❌         |
| **Delete Own Job Listing**       | ❌    | ✅        | ❌         |
| **Upload Company Logo**          | ❌    | ✅        | ❌         |
| **Update Own Employer Profile**  | ❌    | ✅        | ❌         |
| **Submit Application**           | ❌    | ❌        | ✅         |
| **Update Own Application**       | ❌    | ❌        | ✅         |
| **Cancel Own Application**       | ❌    | ❌        | ✅         |
| **Upload Resume**                | ❌    | ❌        | ✅         |
| **Update Own Candidate Profile** | ❌    | ❌        | ✅         |
| **Review All Employer Profiles** | ✅    | ❌        | ❌         |
| **Review All Job Listings**      | ✅    | ❌        | ❌         |
| **Approve / Reject Job Listing** | ✅    | ❌        | ❌         |

---

## 🔮 Planned / Bonus Features (Not Yet Implemented)

| Feature                  | Relevant Controller     | Status              |
|--------------------------|-------------------------|---------------------|
| Notifications            | `NotificationController`| ⏳ Scaffold only    |
| Messaging / Chat         | `MessageController`     | ⏳ Scaffold only    |
| Job Categories CRUD      | `CategoriesController`  | ⏳ Scaffold only    |
| Mobile Responsive UI     | Front-end               | 🔲 Planned          |
| Social Media Integration | Front-end               | 🔲 Planned          |
| Resume Database Search   | Back-end                | 🔲 Planned          |

---

*Last updated: based on current backend routes and controllers.*
