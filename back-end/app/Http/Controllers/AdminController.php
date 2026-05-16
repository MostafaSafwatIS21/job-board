<?php

namespace App\Http\Controllers;

use App\Events\UserNotified;
use App\Models\EmployerProfile;
use App\Models\JobListing;
use App\Models\Notification;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function reviewEmployerProfiles(Request $request)
    {
        $employerProfiles = EmployerProfile::all();
        return response()->json(
            [
                "message" => "Employer profiles found",
                "data" => $employerProfiles,
            ],
            200,
        );
    }

    public function reviewEmployerProfile(Request $request, $employerId)
    {
        $employerProfile = EmployerProfile::findOrFail($employerId);
        return response()->json(
            ["message" => "Employer profile found", "data" => $employerProfile],
            200,
        );
    }

    public function reviewJobListings(Request $request)
    {
        $jobListings = JobListing::all();
        return response()->json(
            ["message" => "Job listings found", "data" => $jobListings],
            200,
        );
    }

    public function reviewJobListing(Request $request, $jobListingId)
    {
        $jobListing = JobListing::findOrFail($jobListingId);
        return response()->json(
            ["message" => "Job listing found", "data" => $jobListing],
            200,
        );
    }

    public function updateJobListingStatus(Request $request, $jobListingId)
    {
        $validatedData = $request->validate([
            "status" => "required|in:approved,rejected,pending",
        ]);

        $jobList = JobListing::findOrFail($jobListingId);
        $jobList->status = $request->input("status");
        $jobList->save();

        $notification = Notification::create([
            "user_id" => $jobList->employer_id,
            "title" => "Job listing status updated",
            "body" =>
                "Your job listing \"" .
                $jobList->title .
                "\" was " .
                $jobList->status .
                ".",
            "read" => false,
        ]);
        broadcast(new UserNotified($notification));

        return response()->json(
            [
                "message" => "Job listing status updated successfully",
                "data" => $jobList,
            ],
            200,
        );
    }

    /**
     * Get all job listings for a specific employer
     */
    public function reviewEmployerJobListings(Request $request, $employerId)
    {
        $employerProfile = EmployerProfile::findOrFail($employerId);
        $jobListings = $employerProfile->jobListings;

        return response()->json(
            [
                "message" => "Employer job listings retrieved successfully",
                "data" => $jobListings,
            ],
            200,
        );
    }
}
