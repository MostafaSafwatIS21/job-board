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
        $data = JobListing::all();
        return response()->json(["message" => "Job listings retrieved successfully", "data" => $data], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // get employer id from auth
        $employerId = auth()->id();
        if (!$request->user()->employerProfile || !EmployerProfile::where("user_id", $employerId)->exists()) {
            return response()->json(["message" => "Please complete your profile before creating a job listing"], 400);
        }

        $validatedData = $request->validate([
            "title" => "required|string|max:255",
            "description" => "required|string",
            "location" => "required|string|max:255",
            "salary" => "required|numeric",
            "work_type" => "required|in:remote,on_site",
            "experience_level" => "required|in:entry_level,mid_level,senior_level,executive_level",
            "salary_min" => "required|numeric",
            "salary_max" => "required|numeric",
            "deadline" => "required|date",
            "category_id" => "required|exists:categories,id",
        ]);
        $jobListing = JobListing::create($request->all() + ['employer_id' => $employerId]);
        return response()->json(["message" => "Job listing created successfully", "data" => $jobListing], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(JobListing $jobListing)
    {

        return response()->json(["message" => "Job listing retrieved successfully", "data" => $jobListing], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobListing $jobListing)
    {
        // get employer id from auth
        $employerId = auth()->id();
        if($jobListing->employer_id !== $employerId) {
            return response()->json(["message" => "You are not authorized to update this job listing"], 403);
        }

         $validatedData = $request->validate([
            "title" => "sometimes|required|string|max:255",
            "description" => "sometimes|required|string",
            "location" => "sometimes|required|string|max:255",
            "salary" => "sometimes|required|numeric",
            "work_type" => "sometimes|required|in:remote,on_site",
            "experience_level" => "sometimes|required|in:entry_level,mid_level,senior_level,executive_level",
            "salary_min" => "sometimes|required|numeric",
            "salary_max" => "sometimes|required|numeric",
            "deadline" => "sometimes|required|date",
            "category_id" => "sometimes|required|exists:categories,id",
        ]);




        $jobListing->update($request->all());
        return response()->json(["message" => "Job listing updated successfully", "data" => $jobListing], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobListing $jobListing)
    {
        $jobListing->delete();
        return response()->json(["message" => "Job listing deleted successfully", "data" => $jobListing], 200);
    }
}
