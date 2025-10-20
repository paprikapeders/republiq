<?php
require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Resetting password for jacob.green@pbl.com...\n";

// Generate new password hash
$newHash = Hash::make('defaultpassword123');
echo "Generated new hash: " . $newHash . "\n";

// Update the user's password
$user = App\Models\User::where('email', 'jacob.green@pbl.com')->first();

if ($user) {
    $user->update(['password' => $newHash]);
    echo "Password successfully updated for: " . $user->name . " (" . $user->email . ")\n";
    
    // Verify the new password works
    $isValid = Hash::check('defaultpassword123', $newHash);
    echo "Password verification: " . ($isValid ? 'SUCCESS' : 'FAILED') . "\n";
} else {
    echo "User not found!\n";
}
?>