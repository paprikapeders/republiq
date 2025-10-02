<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request)
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     */
    public function share(Request $request)
    {
        // Ensure HTTPS URLs for Inertia
        if (env('APP_ENV') === 'production' || 
            env('FORCE_HTTPS', false) ||
            $request->header('X-Forwarded-Proto') === 'https') {
            URL::forceScheme('https');
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'app_url' => config('app.url'),
        ]);
    }
}
