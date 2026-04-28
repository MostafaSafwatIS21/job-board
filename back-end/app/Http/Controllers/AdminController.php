<?php

namespace App\Http\Controllers;

use App\Models\EmployerProfile;
use App\Models\JobListing;
use Illuminate\Http\Request;

class AdminController extends Controller


{

    public function reviewEmployerProfiles(Request $request)
    {

        $employerProfiles = EmployerProfile::all();
        return response()->json(['message' => 'Employer profiles found', 'data' => $employerProfiles], 200);

    }

    public function reviewEmployerProfile(Request $request, $employerId)
    {

        $employerProfile = EmployerProfile::findOrFail($employerId);
        return response()->json(['message' => 'Employer profile found', 'data' => $employerProfile], 200);

    }


    public function reviewJobListings(Request $request)
    {

        $jobListings = JobListing::all();
        return response()->json(['message' => 'Job listings found', 'data' => $jobListings], 200);

    }


    public function reviewJobListing(Request $request, $jobListingId)
    {

        $jobListing = JobListing::findOrFail($jobListingId);
        return response()->json(['message' => 'Job listing found', 'data' => $jobListing], 200);

    }

    public function updateJobListingStatus(Request $request, $jobListingId)
    {


        $validatedData = $request->validate([
            'status' => 'required|in:approved,rejected,pending',
        ]);

        $jobList = JobListing::findOrFail($jobListingId);
        $jobList->status = $request->input('status');
        $jobList->save();

        return response()->json(['message' => 'Job listing status updated successfully', 'data' => $jobList], 200);
    }


}
