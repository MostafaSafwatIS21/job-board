<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Models\EmployerProfile;
use Illuminate\Http\Request;

class JobListingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $limit = min(request()->query("limit", 10), 100); // Cap limit at 100
        $page = max(request()->query("page", 1), 1); // Ensure page >= 1
        $offset = ($page - 1) * $limit;

        $query = JobListing::with([
            "employer:id,name",
            "category:id,name",
        ])->where("status", "approved");

        // Optimize search with validation
        $search = request()->query("search");
        if ($search) {
            $search = trim($search);
            // Limit search term length to prevent performance issues
            if (strlen($search) > 100) {
                $search = substr($search, 0, 100);
            }

            // Use case-insensitive search with proper escaping
            $query->where(function ($q) use ($search) {
                // Search in individual text columns (case-insensitive)
                $q->whereRaw("LOWER(title) LIKE ?", [
                    "%" . strtolower($search) . "%",
                ])
                    ->orWhereRaw("LOWER(description) LIKE ?", [
                        "%" . strtolower($search) . "%",
                    ])
                    ->orWhereRaw("LOWER(location) LIKE ?", [
                        "%" . strtolower($search) . "%",
                    ])
                    ->orWhereRaw("LOWER(experience_level) LIKE ?", [
                        "%" . strtolower($search) . "%",
                    ])
                    ->orWhereRaw("LOWER(work_type) LIKE ?", [
                        "%" . strtolower($search) . "%",
                    ])
                    // For JSON skills column: case-insensitive search
                    ->orWhereRaw("LOWER(skills) LIKE ?", [
                        "%" . strtolower($search) . "%",
                    ]);
            });
        }
        $category = request()->query("category");
        if ($category) {
            $query->where("category_id", $category);
        }
        $job_type = request()->query("job_type");
        if ($job_type) {
            $query->where("work_type", $job_type);
        }
        $location = request()->query("location");
        if ($location) {
            $query->whereRaw("LOWER(location) LIKE ?", [
                "%" . strtolower($location) . "%",
            ]);
        }
        $salaryRange = request()->query("salaryRange");

        if ($salaryRange) {
            $query
                ->where("salary_min", ">=", $salaryRange[0])
                ->where("salary_max", "<=", $salaryRange[1]);
        }

        $total = $query->count();
        $dataFind = $query->skip($offset)->take($limit)->get();

        return response()->json(
            [
                "message" => "Job listings retrieved successfully",
                "total_pages" => ceil($total / $limit),
                "data" => $dataFind,
            ],
            200,
        );
    }

    public function store(Request $request)
    {
        // get employer id from auth
        $employerId = auth()->id();
        if (
            !$request->user()->employerProfile ||
            !EmployerProfile::where("user_id", $employerId)->exists()
        ) {
            return response()->json(
                [
                    "message" =>
                        "Please complete your profile before creating a job listing",
                ],
                400,
            );
        }

        $validatedData = $request->validate([
            "title" => "required|string|max:255",
            "description" => "required|string",
            "location" => "required|string|max:255",
            "salary" => "required|numeric",
            "work_type" => "required|in:remote,on_site",
            "experience_level" =>
                "required|in:entry_level,mid_level,senior_level,executive_level",
            "salary_min" => "required|numeric",
            "salary_max" => "required|numeric",
            "deadline" => "required|date",
            "category_id" => "required|exists:categories,id",
            "skills" => "nullable|array",
            "skills.*" => "string|max:100",
        ]);
        $jobListing = JobListing::create(
            $request->all() + ["employer_id" => $employerId],
        );
        return response()->json(
            [
                "message" => "Job listing created successfully",
                "data" => $jobListing,
            ],
            201,
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(JobListing $jobListing)
    {
        // show job and his employer and category
        $employer = $jobListing->employer()->first();

        $jobListing->load(["employer", "category:id,name"]);

        return response()->json(
            [
                "message" => "Job listing retrieved successfully",
                "data" => $jobListing,
                "employer" => $employer,
            ],
            200,
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobListing $jobListing)
    {
        // get employer id from auth
        $employerId = auth()->id();
        if ($jobListing->employer_id !== $employerId) {
            return response()->json(
                [
                    "message" =>
                        "You are not authorized to update this job listing",
                ],
                403,
            );
        }

        $validatedData = $request->validate([
            "title" => "sometimes|required|string|max:255",
            "description" => "sometimes|required|string",
            "location" => "sometimes|required|string|max:255",
            "salary" => "sometimes|required|numeric",
            "work_type" => "sometimes|required|in:remote,on_site",
            "experience_level" =>
                "sometimes|required|in:entry_level,mid_level,senior_level,executive_level",
            "salary_min" => "sometimes|required|numeric",
            "salary_max" => "sometimes|required|numeric",
            "deadline" => "sometimes|required|date",
            "category_id" => "sometimes|required|exists:categories,id",
            "skills" => "nullable|array",
            "skills.*" => "string|max:100",
        ]);

        $jobListing->update($request->all());
        return response()->json(
            [
                "message" => "Job listing updated successfully",
                "data" => $jobListing,
            ],
            200,
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobListing $jobListing)
    {
        $jobListing->delete();
        return response()->json(
            [
                "message" => "Job listing deleted successfully",
                "data" => $jobListing,
            ],
            200,
        );
    }
}
