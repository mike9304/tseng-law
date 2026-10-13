# Work order: publish a packed tseng-law.com build to its Codex Site

Do every step yourself in this thread (no sub-agents). Never print, log or write credentials. Do not create a site,
change its access, or touch custom domains — those are the owner's decisions.

## Fixed facts
- Site `project_id` `__PROJECT_ID__` (title tseng-law.com).
- Checkout `__SITE_REPO__` tracks the Site's repository. `main` already has the commit to publish:
  `__HEAD_SHA__` (made by `codex-sites-deploy.sh`; `dist/` is the packed Worker build, git-ignored).
- Packager: `__PACKAGER__`. Sites refuses archives over 256 MiB expanded (268,435,456 bytes).

## Steps
1. `get_site`: record the audience/access mode and URLs.
2. `create_source_repository_write_credential` (no `publish_on_push`). `git push origin main` (fast-forward only;
   if the remote has commits the checkout lacks, stop and report).
3. Package with macOS metadata disabled:
   `COPYFILE_DISABLE=1 bash __PACKAGER__ __SITE_REPO__ __ARCHIVE__`.
   Check with `tar -tzf`: `dist/.openai/hosting.json`, `dist/server/index.js`, `dist/server/wrangler.json`,
   `dist/client/__p/ko.html.gz` present, no `._*` entries; sum of file sizes below 268,435,456 bytes.
4. Publish `__HEAD_SHA__` with that archive, keeping the Site's audience:
   - audience `custom` (owner only) → `save_version_and_deploy_private`;
   - any other audience → `save_site_version`, then `deploy_site_version` with the saved version.
   Poll `get_deployment_status` only while pending/building/publishing. A failing call: stop and report the exact text.
5. Check the deployed URL with curl (save headers under `__RESULTS__`):
   `curl -sS -D - -o /dev/null -H 'Accept-Encoding: gzip' <url>/ko`, `curl -sS <url>/build-info.json`,
   `curl -sS -D - -o /dev/null <url>/`. A sign-in gate (401 "Log in to access") on an owner-only Site is expected.

## Report (final message)
Audience, HEAD SHA, archive path/size/expanded bytes, saved version id, deployment id + final status, URL,
and the three curl results (status line, content-encoding, body of build-info.json). Errors verbatim.
