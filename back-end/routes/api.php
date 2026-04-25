<?php

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\EmployerCandidateController;
use App\Http\Controllers\EmployerProfileController;
use App\Http\Controllers\JobListingController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Middleware\AllowTo;

Route::middleware("auth:sanctum")->get("/user", function (Request $request) {
    return response()->json(["user" => $request->user()]);
});
Route::prefix('auth')->group(function () {
    Route::post("/login", [AuthController::class, "login"]);
    Route::post("/register", [AuthController::class, "register"]);
    Route::middleware("auth:sanctum")->post("/logout", [AuthController::class, "logout"]);
});

Route::middleware("auth:sanctum")->post("/tokens/create", function (
    Request $request
) {
    $token = $request->user()->createToken($request->input("token_name", "api"));

    return ["token" => $token->plainTextToken];
});

// complete profile
Route::middleware("auth:sanctum")->post("/complete-profile",[AuthController::class, "completeProfile"]);

Route::middleware(['auth:sanctum'])->group(function () {

Route::get("job-listings", [JobListingController::class, "index"]);
Route::get("/job-listings/{job_listing}", [JobListingController::class, "show"]);

Route::post("/job-listings", [JobListingController::class, "store"])->middleware(AllowTo::class . ":employer");
Route::put("/job-listings/{job_listing}", [JobListingController::class, "update"])->middleware(AllowTo::class . ":employer");
Route::delete("/job-listings/{job_listing}", [JobListingController::class, "destroy"])->middleware(AllowTo::class . ":employer");

});



Route::apiResource("categories", CategoriesController::class);
Route::apiResource("applications", ApplicationController::class);
Route::apiResource("employer-profiles", EmployerProfileController::class);
Route::apiResource("employer-candidates", EmployerCandidateController::class);
Route::apiResource("messages", MessageController::class);
Route::apiResource("notifications", NotificationController::class);
