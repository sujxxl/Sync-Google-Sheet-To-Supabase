function setupAutoRefresh() {
  // delete existing triggers to avoid duplicates
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === "syncModelProfilesSmart") {
      ScriptApp.deleteTrigger(t);
    }
  });

  // create new time-based trigger
  ScriptApp.newTrigger("syncModelProfilesSmart")
    .timeBased()
    .everyHours(1)   // change to everyMinutes(30) or everyDays(1) if needed
    .create();
}
