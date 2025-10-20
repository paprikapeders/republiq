<?php
// Test password verification for multiple users
$jacobHash = '$2y$12$p0ljxuxvSuplvfrr2swhDuR17jFte41mJDGvPxjpTxE4dWRAwrype';
$recentHash = '$2y$12$IzdGFTqbXdlaCQcdG0XYCOnMs8fELtXK4NgGk8QpqS/tM4MC74kD2';
$testPassword = 'defaultpassword123';

echo "Testing password verification...\n";
echo "Test Password: " . $testPassword . "\n\n";

echo "Jacob Green (jacob.green@pbl.com):\n";
echo "Hash: " . $jacobHash . "\n";
echo "Valid: " . (password_verify($testPassword, $jacobHash) ? 'YES' : 'NO') . "\n\n";

echo "Recent User (jsagmit@gmail.com):\n";
echo "Hash: " . $recentHash . "\n";
echo "Valid: " . (password_verify($testPassword, $recentHash) ? 'YES' : 'NO') . "\n\n";

// Test generating a new hash
echo "Generating new hash for 'defaultpassword123':\n";
$newHash = password_hash($testPassword, PASSWORD_DEFAULT);
echo "New Hash: " . $newHash . "\n";
echo "Verifying new hash: " . (password_verify($testPassword, $newHash) ? 'YES' : 'NO') . "\n";
?>