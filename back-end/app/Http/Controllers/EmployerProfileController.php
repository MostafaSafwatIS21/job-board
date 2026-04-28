<?php

namespace App\Http\Controllers;

use App\Models\EmployerProfile;
use Illuminate\Http\Request;

class EmployerProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employerProfiles = EmployerProfile::all();
        return response()->json(["message" => "Employer profiles retrieved successfully", "data" => $employerProfiles], 200);
    }

    // /**
    //  * Store a newly created resource in storage.
    //  */
    // public function store(Request $request)
    // {
    //     $employerProfile = EmployerProfile::create($request->all());
    //     return response()->json(["message" => "Employer profile created successfully", "data" => $employerProfile], 201);
    // }

    /**
     * Display the specified resource.
     */
    public function show(EmployerProfile $employerProfile)
    {
        return response()->json(["message" => "Employer profile retrieved successfully", "data" => $employerProfile], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        //get the authenticated user
        $user = $request->user();

        $employerProfile = $user->employerProfile;


        $request->validate([
            "company_name" => "sometimes|string|max:255",
            "company_description" => "sometimes|string",
            "company_website" => "sometimes|url|max:255",
            "company_location" => "sometimes|string|max:255",
        ]);
        $employerProfile->update($request->all());
        return response()->json(["message" => "Employer profile updated successfully", "data" => $employerProfile], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy()
    {
        return response()->json(["message" => "Employer profile deleted successfully","info"=>"This not currently available"], 200);
    }
}
