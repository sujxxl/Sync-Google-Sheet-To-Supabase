function syncSupabaseSelectedColumns() {
  const SUPABASE_URL = "https://PROJECT_ID.supabase.co";
  const API_KEY = "PUBLIC_ANON_KEY";

  // 👇 choose columns here (comma-separated)
  const COLUMNS = "id,full_name,instagram,status";

  const url = `${SUPABASE_URL}/rest/v1/models?select=${COLUMNS}`;

  const res = UrlFetchApp.fetch(url, {
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${API_KEY}`
    }
  });

  const data = JSON.parse(res.getContentText());
  if (!data.length) return;

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear();

  // keep column order exactly as you defined
  const headers = COLUMNS.split(",");
  sheet.appendRow(headers);

  data.forEach(row => {
    sheet.appendRow(headers.map(h => row[h] ?? ""));
  });
}
