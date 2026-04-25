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

        if (!auth('sanctum')->check() || !in_array(auth('sanctum')->user()->role, $roles)) {
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}
