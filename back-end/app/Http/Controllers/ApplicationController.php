<?php

namespace App\Http\Controllers;

use App\Events\UserNotified;
use App\Models\Application;
use App\Models\JobListing;
use App\Models\Notification;
use App\Models\EmployerCandidate;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jobId = request()->route("job_id");
        $applications = Application::with("candidate")->where("job_id", $jobId)->get();

        return response()->json(["data" => $applications], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $userId = auth()->id();
        $jobId = request()->route("job_id");
        $job = JobListing::findOrFail($jobId);
        $existingApplication = Application::where("candidate_id", $userId)
            ->where("job_id", $jobId)
            ->first();

        if ($existingApplication) {
            return response()->json(
                [
                    "message" => "You have already applied for this job",
                ],
                400,
            );
        }

        $request->validate([
            "links" => "sometimes|array",
            "cover_letter" => "required|string|min:100",
        ]);
        $application = Application::create([
            "job_id" => $jobId,
            "candidate_id" => $userId,
            "links" => $request->input("links", []),
            "cover_letter" => $request->input("cover_letter"),
            "status" => "pending",
        ]);

        $candidateName = $request->user()?->name ?? "A candidate";
        $notification = Notification::create([
            "user_id" => $job->employer_id,
            "title" => "New application received",
            "body" => $candidateName . " applied to " . $job->title . ".",
            "read" => false,
        ]);
        broadcast(new UserNotified($notification));

        return response()->json(
                    [
                        "message" => "Application submitted successfully",
                        "data" => $application,
                    ],
                    201,
                );

    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $applicationId)
    {
        $application = Application::with("candidate:id,name")
            ->with("job")
            ->find($applicationId);

        if (!$application) {
            return response()->json(
                [
                    "message" => "Application not found",
                ],
                404,
            );
        }

        $candidateProfile = EmployerCandidate::where(
            "user_id",
            $application->candidate_id,
        )->first();

        if ($application->candidate && $candidateProfile) {
            $application->candidate->resume_url = $candidateProfile->resume_url;
        }
        if (
            $application->job?->employer_id !== auth()->id() &&
            $application->candidate_id !== auth()->id()
        ) {
            return response()->json(
                [
                    "message" =>
                        "You are not authorized to view this application",
                ],
                403,
            );
        }

        if (!$application->job) {
            return response()->json(
                [
                    "message" =>
                        "The job associated with this application no longer exists",
                ],
                404,
            );
        }

        return response()->json(["data" => $application], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Application $application)
    {
        $userId = auth()->id();
        $applicationId = request()->route("applicationId");
        $application = Application::findOrFail($applicationId);

        if ($application->candidate_id !== $userId) {
            return response()->json(
                [
                    "message" =>
                        "You are not authorized to update this application",
                ],
                403,
            );
        }

        if ($application->status !== "pending") {
            return response()->json(
                [
                    "message" =>
                        "Only pending applications can be updated",
                ],
                400,
            );
        }

        $validated = $request->validate([
            "links" => "sometimes|array",
            "cover_letter" => "sometimes|required|string|min:100",
        ]);

        $application->update($validated);

        return response()->json(
            [
                "message" => "Application updated successfully",
                "data" => $application,
            ],
            200,
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Application $application)
    {
        $userId = auth()->id();
        $applicationId = request()->route("applicationId");
        $application = Application::findOrFail($applicationId);

        if ($application->candidate_id !== $userId) {
            return response()->json(
                [
                    "message" =>
                        "You are not authorized to delete this application",
                ],
                403,
            );
        }

        if ($application->status !== "pending") {
            return response()->json(
                [
                    "message" =>
                        "Only pending applications can be deleted",
                ],
                400,
            );
        }

        $application->delete();

        return response()->json(
            [
                "message" => "Application deleted successfully",
                "data" => $application,
            ],
            200,
        );
    }

    /**
     * Update application status by employer.
     */
    public function updateStatusByEmployer(Request $request)
    {
        $applicationId = request()->route("applicationId");
        $application = Application::with("job")->findOrFail($applicationId);

        $userId = auth()->id();
        if ($application->job?->employer_id !== $userId) {
            return response()->json(
                [
                    "message" =>
                        "You are not authorized to update this application",
                ],
                403,
            );
        }

        $validated = $request->validate([
            "status" => "required|in:pending,approved,rejected",
        ]);

        $application->update([
            "status" => $validated["status"],
        ]);

        $statusLabel = $validated["status"];
        $notification = Notification::create([
            "user_id" => $application->candidate_id,
            "title" => "Application status updated",
            "body" =>
                "Your application for " .
                ($application->job?->title ?? "the job") .
                " was " .
                $statusLabel .
                ".",
            "read" => false,
        ]);
        broadcast(new UserNotified($notification));

        return response()->json(
            [
                "message" => "Application status updated successfully",
                "data" => $application,
            ],
            200,
        );
    }
    public function candidateApplications()
    {
        $userId = auth()->id();
        $applications = Application::with("job")->where("candidate_id", $userId)->get();

        return response()->json(["data" => $applications], 200);
    }
}
