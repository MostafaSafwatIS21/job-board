<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\AuthRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    public function register (AuthRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'email' => $validated['email'],
            'name' => $validated['name'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json(['message' => 'User registered successfully', 'user' => $user, 'token' => $token], 201);
    }
    public function login( Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);
        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json(['message' => 'Login successful', 'user' => $user, 'token' => $token], 200);
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out successfully'], 200);
    }

    public function completeProfile(Request $request)
    {
        // chck if user has already completed profile
        if ($request->user()->completed_profile) {
            return response()->json(["message" => "Profile already completed, you can update it at any time"], 400);
        }

        $validatedRole = $request->validate([
            "role" => "required|in:employer,candidate",
        ]);

        $user = $request->user();
        $profile = null;

        if ($validatedRole["role"] === "employer") {
            $validatedProfile = $request->validate([
                "company_name" => "required|string|max:255",
                "company_website" => "required|url|max:255",
                "company_description" => "nullable|string",
                "company_logo" => "nullable|string|max:255",
                "company_location" => "required|string|max:255",
            ]);

            $profile = $user->employerProfile()->updateOrCreate(
                ["user_id" => $user->id],
                [
                    "company_name" => $validatedProfile["company_name"],
                    "company_website" =>
                        $validatedProfile["company_website"] ?? null,
                    "company_description" =>
                        $validatedProfile["company_description"] ?? null,
                    "company_logo" => $validatedProfile["company_logo"] ?? null,
                    "company_location" =>
                        $validatedProfile["company_location"] ?? null,
                ]
            );
        } else {
            $validatedProfile = $request->validate([
                "headline" => "nullable|string|max:255",
                "phone" => "nullable|string|max:20",
                "location" => "nullable|string|max:255",
                "resume_url" => "nullable|url|max:255",
                "social_media" => "nullable|array",
            ]);

            $profile = $user->employerCandidates()->updateOrCreate(
                [
                    "user_id" => $user->id,
                ],
                [
                    "headline" => $validatedProfile["headline"] ?? null,
                    "phone" => $validatedProfile["phone"] ?? null,
                    "location" => $validatedProfile["location"] ?? null,
                    "resume_url" => $validatedProfile["resume_url"] ?? null,
                    "social_media" => $validatedProfile["social_media"] ?? null,
                ]
            );
        }

        $user->role = $validatedRole["role"];
        $user->completed_profile = true;
        $user->save();

        return response()->json(
            [
                "message" => "Profile completed successfully",
                "user" => $user,
                "profile" => $profile,
            ],
            200
        );
    }
}
