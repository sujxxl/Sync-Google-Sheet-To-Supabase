function syncModelProfilesDirect() {
  const SUPABASE_URL = "PASTE_YOUR_SUPABASE_URL_HERE";
  const TABLE = "model_profiles";
  const API_KEY = "PASTE_YOUR_SUPABASE_API_KEY_HERE";

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
    `${SUPABASE_URL}/rest/v1/${TABLE}?select=${COLUMNS.join(",")}`;

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
    sheet.appendRow(COLUMNS.map(c => formatValue(row[c])));
  });
}

/* ---------- helper ---------- */
function formatValue(value) {
  if (Array.isArray(value)) {
    // arrays (languages, skills, brands, instagram)
    return value
      .map(v => typeof v === "object" ? JSON.stringify(v) : v)
      .join(", ");
  }

  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }

  return value ?? "";
}
