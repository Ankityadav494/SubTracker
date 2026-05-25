/**
 * Gmail OTP relay for SubTracker (Render cannot use SMTP).
 * Deploy: script.google.com -> New project -> paste -> Deploy -> Web app -> Anyone
 * Set EMAIL_WEBHOOK_URL to the deployment URL on Render.
 */
function doPost(e) {
  const secret = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");
  if (secret && e?.postData?.type === "application/json") {
    const body = JSON.parse(e.postData.contents);
    if (body.secret !== secret && e.parameter?.secret !== secret) {
      return json({ error: "unauthorized" }, 401);
    }
  }

  const data = JSON.parse(e.postData.contents);
  const { to, subject, text, html } = data;
  if (!to || !subject) {
    return json({ error: "to and subject required" }, 400);
  }

  GmailApp.sendEmail(to, subject, text || "", { htmlBody: html || text });
  return json({ ok: true });
}

function json(obj, code) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
