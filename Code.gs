function syncModelProfilesAppendOnly() {
  const SUPABASE_URL = "PASTE_YOUR_SUPABASE_URL_HERE";
  const TABLE = "model_profiles";

  // ⚠️ SERVICE ROLE KEY (admin access)
  const SERVICE_ROLE_KEY = "PASTE_YOUR_SERVICE_ROLE_KEY_HERE";
  
  const COLUMNS = [
    "model_code","id","status","category",
    "full_name","gender","dob","nationality","skin_tone",
    "email","phone","country","state","city",
    "height_feet","height_inches","bust_chest","waist","hips",
    "shoe_size","size","experience_level","ramp_walk_experience",
    "ramp_walk_description","open_to_travel","overall_rating",
    "min_budget_half_day","min_budget_full_day","brands",
    "languages","skills","instagram","polaroids",
    "portfolio_images","portfolio_videos","intro_video",
    "cover_photo","user_id","created_at","updated_at"
  ];

  const url = `${SUPABASE_URL}/rest/v1/${TABLE}?select=${COLUMNS.join(",")}&order=created_at.asc`;

  const res = UrlFetchApp.fetch(url, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`
    }
  });

  const data = JSON.parse(res.getContentText());
  if (!data.length) return;

  const sheet = SpreadsheetApp.getActive().getActiveSheet();

  /* ---------- FORCE HEADER SYNC ---------- */
  const existingHeader = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  const headerMismatch =
    existingHeader.length !== COLUMNS.length ||
    existingHeader.some((h, i) => h !== COLUMNS[i]);

  if (headerMismatch) {
    sheet.clear();
    sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]);
  }

  /* ---------- GET EXISTING MODEL_CODES ---------- */
  const lastRow = sheet.getLastRow();

  const existingModelCodes = new Set(
    lastRow > 1
      ? sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat()
      : []
  );

  /* ---------- APPEND NEW ---------- */
  const newRows = [];

  data.forEach(row => {
    if (!existingModelCodes.has(row.model_code)) {
      newRows.push(COLUMNS.map(c => formatValue(row[c])));
    }
  });

  if (newRows.length) {
    sheet
      .getRange(sheet.getLastRow() + 1, 1, newRows.length, COLUMNS.length)
      .setValues(newRows);
  }
}

/* ---------- FORMATTER ---------- */
function formatValue(value) {
  if (Array.isArray(value)) {
    return value.map(v =>
      typeof v === "object" ? JSON.stringify(v) : v
    ).join(", ");
  }

  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }

  return value ?? "";
}
