<?php

namespace App\Http\Controllers;

use App\Models\EmployerProfile;
use Illuminate\Http\Request;

class EmployerProfileController extends Controller
{
    public function index()
    {
        $limit = min(request()->query("limit", 10), 100); // Cap limit at 100
        $page = max(request()->query("page", 1), 1); // Ensure page >= 1
        $offset = ($page - 1) * $limit;

        $employerProfiles = EmployerProfile::offset($offset)
            ->limit($limit)
            ->get();
        return response()->json(
            [
                "message" => "Employer profiles retrieved successfully",
                "data" => $employerProfiles,
            ],
            200,
        );
    }

    public function show(EmployerProfile $employerProfile)
    {
        return response()->json(
            [
                "message" => "Employer profile retrieved successfully",
                "data" => $employerProfile,
            ],
            200,
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $employerProfile = $user->employerProfile;

        $request->validate([
            "company_name" => "sometimes|string|max:255",
            "company_description" => "sometimes|string",
            "company_website" => "sometimes|url|max:255",
            "company_location" => "sometimes|string|max:255",
        ]);
        $employerProfile->update($request->all());
        return response()->json(
            [
                "message" => "Employer profile updated successfully",
                "data" => $employerProfile,
            ],
            200,
        );
    }

    public function destroy()
    {
        return response()->json(
            [
                "message" => "Employer profile deleted successfully",
                "info" => "This not currently available",
            ],
            200,
        );
    }
}
