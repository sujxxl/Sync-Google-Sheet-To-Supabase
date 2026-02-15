# Google Sheets Sync with Supabase

This project provides an automated solution to sync model profiles data from a Supabase database to a Google Sheets spreadsheet. The synchronization is append-only, ensuring that new records are added to the sheet without overwriting existing data.

## Purpose

The script fetches data from the `model_profiles` table in Supabase and appends new entries to a Google Sheets document. This is useful for maintaining a live, up-to-date view of model data in a spreadsheet format for easy access, reporting, and collaboration.

## Features

- **Append-Only Sync**: Only adds new records, never overwrites existing data
- **Column Order Enforcement**: Ensures consistent column structure
- **Data Formatting**: Properly handles arrays, objects, and null values
- **Auto-Run Capability**: Can be scheduled to run automatically
- **Error Handling**: Graceful handling of API responses and data parsing

## What You'll Need
- Google Account with access to Sheets and Apps Scripts
- A Supabase project with any table set up
- Your Supabase Service Role Key (this gives admin access, so keep it safe)

## Let's Get You Set Up - Step by Step

### Step 1: Make a New Google Sheet

Head over to [Google Sheets](https://sheets.google.com) and create a fresh spreadsheet. Give it a good name like "Model Profiles Sync" so you know what it's for.

### Step 2: Open Apps Script

1. In your Google Sheets document, click on **Extensions** in the menu
2. Select **Apps Script**
3. This will open the Google Apps Script editor in a new tab

### Step 3: Add the Code

In the Apps Script editor, you'll see some default code. Delete that stuff. Now, grab the `Code.gs` file from this repo, copy all of it, and paste it in. Don't forget to swap out the placeholders:
- Change `"PASTE_YOUR_SUPABASE_URL_HERE"` to your real Supabase URL (something like `"https://your-project.supabase.co"`)
- Replace `"PASTE_YOUR_SERVICE_ROLE_KEY_HERE"` with your actual Service Role Key from Supabase

### Step 4: Save Your Work

Hit the save button (or Ctrl+S) and give your project a name, like "Supabase Sheets Sync". Easy!

### Step 5: Run the Script Manually (Optional)

1. Select the `syncModelProfilesSmart` function from the function dropdown
2. Click the play button to run it
3. Grant necessary permissions when prompted
4. Check your Google Sheet - it should now have headers and any existing data

## Auto-Run Setup

To automate the synchronization, we've made it easy with the `autorun.gs` file!

### Quick Auto-Setup (Recommended)

1. Make sure you've added both `Code.gs` and `autorun.gs` from this repo to your Apps Script project
2. Run the `setupAutoRefresh()` function (find it in the function dropdown)
3. Boom! It automatically sets up a trigger to run `syncModelProfilesSmart` every hour

(You can tweak the time interval in `autorun.gs` - change `.everyHours(1)` to `.everyMinutes(30)` or `.everyDays(1)` if needed)

### Manual Setup (If You Prefer the UI Way)

If you want to set it up manually:

1. In the Apps Script editor, click the clock icon on the left (that's Triggers)
2. Hit **+ Add Trigger** down at the bottom right
3. Configure the trigger:
   - **Function**: `syncModelProfilesSmart`
   - **Event Source**: Time-driven
   - **Type**: Hour timer (or choose your preferred interval)
   - **Hour interval**: 1 hour (adjust as needed)
4. Click **Save**
5. Authorize the script if prompted

The script will now run automatically every hour (or your chosen interval).

## Configuration

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create a table called `model_profiles` with the required columns
3. Go to Settings > API in your Supabase dashboard
4. Copy the Project URL and Service Role Key

### Column Configuration

The script syncs these columns in this exact order:
- model_code, id, status, category
- full_name, gender, dob, nationality, skin_tone
- email, phone, country, state, city
- height_feet, height_inches, bust_chest, waist, hips
- shoe_size, size, experience_level, ramp_walk_experience
- ramp_walk_description, open_to_travel, overall_rating
- min_budget_half_day, min_budget_full_day, brands
- languages, skills, instagram, polaroids
- portfolio_images, portfolio_videos, intro_video
- cover_photo, user_id, created_at, updated_at

If you need different columns, just edit the `COLUMNS` array in the code.

## Usage

### Manual Sync

- Open your Google Sheet
- Go to Extensions > Apps Script
- Run the `syncModelProfilesSmart` function

### Monitoring

- Check the execution logs in Apps Script under View > Logs
- Monitor your sheet for new rows being added

## Troubleshooting

### Common Issues

1. **"UrlFetchApp" permission error**
   - This happens on first run. Grant the necessary permissions.

2. **No data appearing**
   - Check your Supabase URL and key
   - Ensure the `model_profiles` table exists and has data
   - Verify the table has the expected columns

3. **Column mismatch**
   - The script will clear and reset headers if there's a mismatch
   - This is normal behavior to ensure data integrity

4. **Script timeout**
   - For large datasets, consider increasing the timeout or reducing sync frequency

### Logs and Debugging

- Use `Logger.log()` statements in the code for debugging
- View logs in Apps Script: View > Logs

## Security Notes

- Never commit your actual Supabase URL or Service Role Key to version control
- Use environment variables or secure storage for sensitive data
- The Service Role Key has admin privileges - keep it secure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source. Please check the license file for details.