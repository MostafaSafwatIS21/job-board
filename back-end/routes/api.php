<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get("/user", function (Request $request) {
    return $request->user();
})->middleware("auth:sanctum");

Route::get("/login", function (Request $request) {
    return response()->json(["message" => "Login"]);
});

Route::get("/jobs", function (Request $request) {
    return response()->json(["message" => "Jobs"]);
});
