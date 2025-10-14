#!/bin/bash

# Script to set up photo upload functionality

echo "Setting up photo upload functionality..."

# Run the migration to add photo_path column
echo "Running migration..."
php artisan migrate

# Create storage link for public file access
echo "Creating storage link..."
php artisan storage:link

echo "Photo upload functionality setup complete!"
echo ""
echo "Features added:"
echo "✅ Photo upload field in add/edit player forms"
echo "✅ Player photos displayed in leaderboards top 3"
echo "✅ File validation (images only, max 2MB)"
echo "✅ Automatic cleanup of old photos when updating"
echo ""
echo "To use:"
echo "1. Add/edit players through the admin interface"
echo "2. Upload photos using the new photo field"
echo "3. Photos will appear in leaderboards for top 3 players"