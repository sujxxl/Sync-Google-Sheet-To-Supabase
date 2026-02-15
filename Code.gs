function syncModelProfilesDirect() {
  const SUPABASE_URL = "https://PROJECT_ID.supabase.co";
  const API_KEY = "PUBLIC_ANON_KEY";

  const COLUMNS = [
    "full_name","dob","gender","phone","email",
    "country","state","city","category","instagram",
    "experience_level","languages","skills","open_to_travel",
    "ramp_walk_experience","ramp_walk_description",
    "height_feet","height_inches","bust_chest","waist","hips",
    "shoe_size","status","model_code","overall_rating",
    "min_budget_half_day","min_budget_full_day",
    "size","nationality","brands","skin_tone"
  ];

  const url =
    `${SUPABASE_URL}/rest/v1/model_profiles?select=${COLUMNS.join(",")}`;

  const res = UrlFetchApp.fetch(url, {
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${API_KEY}`
    }
  });

  const data = JSON.parse(res.getContentText());
  if (!data.length) return;

  const sheet = SpreadsheetApp.getActive().getActiveSheet();
  sheet.clear();
  sheet.appendRow(COLUMNS);

  data.forEach(row => {
    sheet.appendRow(COLUMNS.map(c => row[c] ?? ""));
  });
}
