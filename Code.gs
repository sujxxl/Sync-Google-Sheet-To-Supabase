function syncModelProfilesAppendOnly() {
  const SUPABASE_URL = "PASTE_YOUR_SUPABASE_URL_HERE";
  const TABLE = "model_profiles";

  // ⚠️ SERVICE ROLE KEY (admin access)
  const SERVICE_ROLE_KEY = "PASTE_YOUR_SERVICE_ROLE_KEY_HERE";

  /* -------- Pretty & Logical Column Order -------- */
  const COLUMNS = [
    // identity
    "id", "model_code", "status", "category",

    // personal
    "full_name", "gender", "dob", "nationality", "skin_tone",

    // contact
    "email", "phone",
    "country", "state", "city",

    // physical
    "height_feet", "height_inches",
    "bust_chest", "waist", "hips",
    "shoe_size", "size",

    // experience
    "experience_level",
    "ramp_walk_experience",
    "ramp_walk_description",
    "open_to_travel",
    "overall_rating",

    // commercial
    "min_budget_half_day",
    "min_budget_full_day",
    "brands",

    // skills
    "languages", "skills",

    // media
    "instagram",
    "polaroids",
    "portfolio_images",
    "portfolio_videos",
    "intro_video",
    "cover_photo",

    // meta
    "user_id",
    "created_at",
    "updated_at"
  ];

  const url = `${SUPABASE_URL}/rest/v1/${TABLE}?select=${COLUMNS.join(",")}`;

  const res = UrlFetchApp.fetch(url, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`
    }
  });

  const data = JSON.parse(res.getContentText());
  if (!data.length) return;

  const sheet = SpreadsheetApp.getActive().getActiveSheet();

  /* ---------- Setup header if empty ---------- */
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
  }

  /* ---------- Existing IDs ---------- */
  const existingIds = new Set(
    sheet
      .getRange(2, 1, Math.max(sheet.getLastRow() - 1, 0), 1)
      .getValues()
      .flat()
      .filter(Boolean)
  );

  /* ---------- Append only new rows ---------- */
  const newRows = [];

  data.forEach(row => {
    if (!existingIds.has(row.id)) {
      newRows.push(COLUMNS.map(c => formatValue(row[c])));
    }
  });

  if (newRows.length) {
    sheet
      .getRange(sheet.getLastRow() + 1, 1, newRows.length, COLUMNS.length)
      .setValues(newRows);
  }
}

/* ---------- helper ---------- */
function formatValue(value) {
  if (Array.isArray(value)) {
    return value
      .map(v => typeof v === "object" ? JSON.stringify(v) : v)
      .join(", ");
  }

  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }

  return value ?? "";
}
