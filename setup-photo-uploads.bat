@echo off
echo Setting up photo upload functionality...

echo Running migration...
cd app
php artisan migrate

echo Creating storage link...
php artisan storage:link

echo Photo upload functionality setup complete!
echo.
echo Features added:
echo ✅ Photo upload field in add/edit player forms
echo ✅ Player photos displayed in leaderboards top 3  
echo ✅ File validation (images only, max 2MB)
echo ✅ Automatic cleanup of old photos when updating
echo.
echo To use:
echo 1. Add/edit players through the admin interface
echo 2. Upload photos using the new photo field
echo 3. Photos will appear in leaderboards for top 3 players

pause