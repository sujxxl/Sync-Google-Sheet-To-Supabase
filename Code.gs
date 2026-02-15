function syncSupabase() {
  const SUPABASE_URL = "https://PROJECT_ID.supabase.co";
  const TABLE = "models"; // change this
  const API_KEY = "PUBLIC_ANON_KEY";

  const url = `${SUPABASE_URL}/rest/v1/${TABLE}?select=*`;

  const res = UrlFetchApp.fetch(url, {
    method: "get",
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    }
  });

  const data = JSON.parse(res.getContentText());
  if (!data.length) return;

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear();

  const headers = Object.keys(data[0]);
  sheet.appendRow(headers);

  data.forEach(row =>
    sheet.appendRow(headers.map(h => row[h] ?? ""))
  );
}
