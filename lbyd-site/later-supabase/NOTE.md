Not in use yet. v1 stores leads in Netlify Blobs (zero setup). When volume justifies it,
create a Supabase project, run schema.sql, and swap the store calls in
netlify/functions/submit.js and ica-admin/netlify/functions/leads.js for the REST calls.
The row shape is identical, so nothing else changes.
