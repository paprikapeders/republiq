# Player Photo Upload Feature

This feature adds photo upload capability for players and displays their photos in the leaderboards.

## Changes Made

### Backend Changes

#### 1. Database Migration
- **File**: `database/migrations/2025_01_18_120000_add_photo_path_to_players_table.php`
- **Purpose**: Adds `photo_path` column to store the uploaded photo file path

#### 2. Player Model
- **File**: `app/Models/Player.php`
- **Changes**: Added `photo_path` to fillable array

#### 3. Controller Updates
- **File**: `app/Http/Controllers/TeamManagementController.php`
- **Changes**:
  - Added photo validation (image files, max 2MB)
  - Photo upload handling in `addPlayerToTeam()` method
  - Photo upload and replacement in `updatePlayer()` method
  - Photo cleanup when players are deleted
  - Added Storage facade import

### Frontend Changes

#### 4. Team Management Form
- **File**: `resources/js/Pages/TeamManagement.jsx`
- **Changes**:
  - Added `photo` field to both add and edit player forms
  - Added file input elements for photo upload
  - Updated form submissions with `forceFormData: true` for file uploads
  - Display current photo filename in edit form

#### 5. Leaderboards Display
- **File**: `resources/js/Pages/Public/Leaderboards.jsx`
- **Changes**:
  - Updated top 3 podium sections (1st, 2nd, 3rd place)
  - Display actual player photos if available
  - Fallback to default user icon if no photo

## Features

### ✅ Photo Upload
- Upload photos when adding new players
- Upload photos when editing existing players
- File validation: Images only, maximum 2MB
- Photos stored in `storage/app/public/player_photos/`

### ✅ Photo Display
- Player photos displayed in leaderboards for top 3 positions
- Responsive design with proper sizing
- Fallback to default icon if no photo uploaded

### ✅ Photo Management
- Automatic cleanup of old photos when updating
- Photo deletion when players are removed
- Proper file storage using Laravel's Storage system

## Usage

### For Administrators/Coaches:
1. Navigate to Team Management
2. Add new player or edit existing player
3. Use the "Player Photo" field to upload an image
4. Photos will automatically appear in leaderboards if player ranks in top 3

### File Requirements:
- **Format**: JPG, PNG, GIF, or other image formats
- **Size**: Maximum 2MB
- **Storage**: Files saved to `storage/app/public/player_photos/`

## Setup Instructions

### Option 1: Automatic Setup (Recommended)
Run the setup script:
```bash
# On Windows
.\setup-photo-uploads.bat

# On Unix/Linux/Mac
chmod +x setup-photo-uploads.sh
./setup-photo-uploads.sh
```

### Option 2: Manual Setup
1. Run the migration:
   ```bash
   cd app
   php artisan migrate
   ```

2. Create storage symlink:
   ```bash
   php artisan storage:link
   ```

## Technical Details

### File Storage
- Photos are stored using Laravel's `Storage::disk('public')`
- Files saved to `storage/app/public/player_photos/`
- Accessible via `/storage/player_photos/{filename}`

### Security
- File type validation (images only)
- File size limit (2MB maximum)
- Proper sanitization of uploaded files

### Performance
- Photos are only loaded for top 3 leaderboard positions
- Lazy loading of images
- Automatic cleanup prevents storage bloat

## Future Enhancements

Potential improvements for future versions:
- Image resizing/optimization on upload
- Thumbnail generation for better performance
- Bulk photo upload functionality
- Photo gallery for team management
- Player photo requirements/guidelines