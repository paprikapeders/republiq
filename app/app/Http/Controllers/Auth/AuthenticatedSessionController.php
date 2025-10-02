<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create()
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = auth()->user();
        
        // Role-based redirect logic
        switch ($user->role) {
            case 'admin':
                return redirect()->intended(route('dashboard'))
                    ->with('success', 'Welcome Admin! You have full access to all features.');
                    
            case 'coach':
                return redirect()->intended(route('teams.index'))
                    ->with('success', 'Welcome Coach! Start by managing your teams.');
                    
            case 'referee':
                return redirect()->intended(route('dashboard'))
                    ->with('success', 'Welcome Referee! You can enter game stats and manage matches.');
                    
            case 'player':
                return redirect()->intended(route('teams.index'))
                    ->with('success', 'Welcome Player! Join a team to get started.');
                    
            default:
                return redirect()->intended(route('dashboard'));
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
