function syncModelProfilesSmart() {
  const SUPABASE_URL = "PASTE_YOUR_SUPABASE_URL_HERE";
  const TABLE = "model_profiles";
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

  const url = `${SUPABASE_URL}/rest/v1/${TABLE}?select=${COLUMNS.join(",")}`;

  const res = UrlFetchApp.fetch(url, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`
    }
  });

  const data = JSON.parse(res.getContentText());
  const sheet = SpreadsheetApp.getActive().getActiveSheet();

  /* ---------- FORCE HEADER SYNC ---------- */
  sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]);

  const lastRow = sheet.getLastRow();

  /* ---------- Map existing rows by UUID (id column index = 1) ---------- */
  const existingMap = {};

  if (lastRow > 1) {
    const existingData = sheet
      .getRange(2, 1, lastRow - 1, COLUMNS.length)
      .getValues();

    existingData.forEach((row, index) => {
      const uuid = row[1]; // id column
      if (uuid) {
        existingMap[uuid] = {
          rowIndex: index + 2,
          values: row
        };
      }
    });
  }

  const newRows = [];

  data.forEach(record => {
    const uuid = record.id;
    if (!uuid) return;

    if (existingMap[uuid]) {
      // -------- UPDATE EXISTING (BY UUID) --------
      const sheetRow = existingMap[uuid];
      const updatedRow = [...sheetRow.values];

      COLUMNS.forEach((col, colIndex) => {
        const newValue = formatValue(record[col]);

        // Do NOT overwrite if new value is blank
        if (newValue !== "" && newValue !== null) {
          updatedRow[colIndex] = newValue;
        }
      });

      sheet
        .getRange(sheetRow.rowIndex, 1, 1, COLUMNS.length)
        .setValues([updatedRow]);

    } else {
      // -------- APPEND NEW UUID --------
      const rowData = COLUMNS.map(c => formatValue(record[c]));
      newRows.push(rowData);
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
    return value
      .map(v => typeof v === "object" ? JSON.stringify(v) : v)
      .join(", ");
  }

  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }

  return value ?? "";
}
