#!/bin/zsh

set -o pipefail

readonly SCRIPT_DIR="${0:A:h}"
readonly SNAPSHOT_SCRIPT="${SCRIPT_DIR}/seo-external-snapshot.mjs"
readonly LOG_DIR="${HOME}/Library/Logs/seo-geo-recheck"
readonly LOG_FILE="${LOG_DIR}/tseng-snapshot.log"

/bin/mkdir -p "${LOG_DIR}"

if [[ -n "${NODE_BIN:-}" && -x "${NODE_BIN}" ]]; then
  node_bin="${NODE_BIN}"
elif (( $+commands[node] )); then
  node_bin="${commands[node]}"
else
  setopt local_options null_glob
  node_candidates=("${HOME}"/.nvm/versions/node/*/bin/node(.Nom))
  if (( ${#node_candidates} == 0 )); then
    print -u2 "Unable to find node. Set NODE_BIN to an executable node path."
    exit 127
  fi
  node_bin="${node_candidates[1]}"
fi

"${node_bin}" "${SNAPSHOT_SCRIPT}" 2>&1 | /usr/bin/tee -a "${LOG_FILE}"
exit "${pipestatus[1]}"
