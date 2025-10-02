<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class ForceHttps
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Force HTTPS URLs in production or when behind proxy
        if (env('APP_ENV') === 'production' || 
            env('FORCE_HTTPS', false) ||
            $request->header('X-Forwarded-Proto') === 'https') {
            URL::forceScheme('https');
        }

        return $next($request);
    }
}