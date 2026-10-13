# Work order: publish a prebuilt tseng-law static snapshot to the existing Site

Filled in and run by `scripts/static-site/air-deployer.sh` (`codex exec`). Do every step yourself in
this thread (no sub-agents). Do not edit, rebuild, or reformat any website file.

## Fixed facts
- Site `project_id` `__PROJECT_ID__` (title tseng-law.com). Audience: __ACCESS__.
  Never create a site, change its access, or touch custom domains.
- Input snapshot (read-only): `__OUT_DIR__`. Videos are not part of it (media.tseng-law.com).
- Checkout `__SITES_REPO__` tracks the site's source repository on `main`. Get a fresh write
  credential with `create_source_repository_write_credential`; never print, log, or write it to a file.
- The deploy archive limit is 536,870,912 bytes; the official packager compresses.

## Steps
1. In the checkout: fetch; make local `main` equal `origin/main`. Keep `.openai/hosting.json` exactly
   `{"project_id":"__PROJECT_ID__","static":{"directory":"out","not_found_handling":"404-page"}}`.
2. `rsync -a --delete "__OUT_DIR__/" out/`, verify byte-for-byte, commit `static snapshot __STAMP__`,
   push `main` (split into several commits/pushes only if the server answers HTTP 413). If nothing
   changed, use the current HEAD.
3. `bash /Users/son7/.codex/plugins/cache/openai-curated-remote/sites/1.0.0/skills/sites/scripts/package-site.sh __SITES_REPO__ __ARCHIVE__`
   and confirm the archive is below 536,870,912 bytes and contains `dist/.openai/hosting.json`.
4. Publish with the full HEAD SHA and the archive:
   - Audience `private`: `save_version_and_deploy_private`.
   - Audience `public`: `save_site_version`, then `deploy_site_version` with the returned version.
   Poll `get_deployment_status` only while pending/building/publishing.
5. Write `__RESULT_FILE__` as one JSON object:
   `{"status":"succeeded"|"failed","commit_sha":"…","version_id":"…","deployment_id":"…","url":"…","error":"…"}`
   (`error` = exact error text without secrets, empty on success). Write it on failure too.
