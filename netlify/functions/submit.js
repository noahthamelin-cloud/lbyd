// Receives a finished assessment from the page and stores it in this site's Netlify Blobs store.
// No external setup. Env var: COACH_SLUG (must match coach.slug in public/config.js).
const { getStore } = require("@netlify/blobs");
const crypto = require("crypto");
const json = (status, body) => ({ statusCode: status, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });
  const COACH_SLUG = process.env.COACH_SLUG;
  if (!COACH_SLUG) return json(500, { error: "Site is not configured. Set COACH_SLUG." });

  let p;
  try { p = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }
  if (p.coach !== COACH_SLUG) return json(403, { error: "Wrong coach" });
  const lead = p.lead || {};
  if (!lead.name || !String(lead.name).trim()) return json(400, { error: "Name is required" });
  if (!lead.whatsapp || String(lead.whatsapp).replace(/\D/g, "").length < 7) return json(400, { error: "WhatsApp number is required" });

  const created_at = new Date().toISOString();
  const id = `${created_at.replace(/[-:.TZ]/g, "")}-${crypto.randomUUID().slice(0, 8)}`;   // sorts by time
  const row = {
    id, created_at,
    coach_id: COACH_SLUG,
    assessment_id: String(p.assessment || "").slice(0, 60),
    assessment_title: String(p.assessment_title || "").slice(0, 120),
    name: String(lead.name).trim().slice(0, 120),
    whatsapp: String(lead.whatsapp).trim().slice(0, 40),
    email: lead.email ? String(lead.email).trim().toLowerCase().slice(0, 160) : null,
    instagram: lead.instagram ? String(lead.instagram).trim().replace(/^@/, "").slice(0, 80) : null,
    pattern: String(p.pattern || "").slice(0, 40),
    pattern_label: String(p.pattern_label || "").slice(0, 120),
    scores: p.scores || {},
    picks: p.picks || {},
    lowest: p.lowest || null,
    overall: typeof p.overall === "number" ? p.overall : null,
    branch: p.branch ? String(p.branch).slice(0, 40) : null,
    lead_extra: Object.fromEntries(Object.entries(lead).filter(([k]) => !["name","whatsapp","email","instagram"].includes(k)).map(([k,v]) => [k, String(v).slice(0, 200)])),
    answers: Array.isArray(p.answers) ? p.answers : [],
    actions: Array.isArray(p.actions) ? p.actions : [],
    meta: p.meta || {}
  };

  try {
    const store = getStore({ name: "leads", consistency: "strong" });
    await store.setJSON(id, row);
  } catch (e) { return json(502, { error: "Could not save the lead", detail: String(e.message || e) }); }
  return json(200, { ok: true, id });
};
