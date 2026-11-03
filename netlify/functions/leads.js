// Admin API. Checks the PIN, then returns every lead in this site's Blobs store.
// Env vars: ADMIN_PIN (what the coach types to sign in), COACH_SLUG, optional COACH_NAME.
const { getStore, connectLambda } = require("@netlify/blobs");
const json = (status, body) => ({ statusCode: status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }, body: JSON.stringify(body) });

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });
  try { if (event.blobs) connectLambda(event); } catch (e) {}
  const { ADMIN_PIN, COACH_SLUG, COACH_NAME } = process.env;
  if (!ADMIN_PIN) return json(500, { error: "Admin is not configured. Set ADMIN_PIN." });
  let p; try { p = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }
  const pin = String(p.pin || "").trim();
  if (!pin || pin !== String(ADMIN_PIN)) {
    await new Promise(r => setTimeout(r, 600)); // slow down guessing
    return json(401, { error: "That PIN isn\u2019t right." });
  }
  try {
    const store = getStore("leads");
    const { blobs } = await store.list();
    const keys = blobs.map(b => b.key).sort().reverse().slice(0, 2000);   // newest first (keys start with the timestamp)
    const leads = (await Promise.all(keys.map(k => store.get(k, { type: "json" }).catch(() => null)))).filter(Boolean);
    return json(200, { coach: { slug: COACH_SLUG || "coach", name: COACH_NAME || COACH_SLUG || "Leads" }, leads });
  } catch (e) { return json(502, { error: "Could not read the leads store: " + String(e.message || e) }); }
};
