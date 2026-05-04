<?php

namespace App\Http\Controllers;

use App\Models\EmployerCandidate;
use Illuminate\Http\Request;

class EmployerCandidateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $limit = min(request()->query("limit", 10), 100); // Cap limit at 100
        $page = max(request()->query("page", 1), 1); // Ensure page >= 1
        $offset = ($page - 1) * $limit;

        $employerCandidates = EmployerCandidate::offset($offset)
            ->limit($limit)
            ->get();
        return response()->json(["data" => $employerCandidates]);
    }

    /**
     * Display the specified resource. for admin
     */
    public function show(EmployerCandidate $employerCandidate)
    {
        return response()->json(["data" => $employerCandidate]);
    }

    public function update(Request $request)
    {
        // $employerCandidate = Auth::user()->employerCandidate;
        $userId = auth()->id();
        $employerCandidate = EmployerCandidate::where(
            "user_id",
            $userId,
        )->first();
        $validated = $request->validate([
            "headline" => "sometimes|string|max:255",
            "phone" => "sometimes|string|max:20",
            "location" => "sometimes|string|max:255",
            "social_media" => "sometimes|array|url|max:255",
        ]);

        $employerCandidate->update($validated);
        return response()->json([
            "message" => "Candidate updated successfully",
            "data" => $employerCandidate,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EmployerCandidate $employerCandidate)
    {
        //
    }
}
