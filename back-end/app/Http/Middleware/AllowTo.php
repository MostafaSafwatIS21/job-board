<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class AllowTo
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // check if user complete his profile
        if (Auth::check() && !Auth::user()->completed_profile) {
            return response()->json(["message" => "Please complete your profile first","test"=>Auth::user()], 403);
        }

        if (!auth('sanctum')->check() || !in_array(auth('sanctum')->user()->role, $roles)) {
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}
