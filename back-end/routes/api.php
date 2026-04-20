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

Route::apiResource("categories", CategoriesController::class);
Route::apiResource("job-listings", JobListingController::class);
Route::apiResource("applications", ApplicationController::class);
Route::apiResource("employer-profiles", EmployerProfileController::class);
Route::apiResource("employer-candidates", EmployerCandidateController::class);
Route::apiResource("messages", MessageController::class);
Route::apiResource("notifications", NotificationController::class);
