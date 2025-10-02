<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        Vite::prefetch(3);
        
        // Force HTTPS URLs in production, when FORCE_HTTPS is set, or when behind proxy
        if (env('APP_ENV') === 'production' || 
            env('FORCE_HTTPS', false) ||
            (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') ||
            (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on')) {
            URL::forceScheme('https');
            URL::forceRootUrl(env('APP_URL'));
        }
    }
}
