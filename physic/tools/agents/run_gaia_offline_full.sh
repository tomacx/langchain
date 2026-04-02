#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

cd "${REPO_ROOT}"

DATASET_PATH="GAIA/2023/validation/metadata.jsonl"
if [[ "${1:-}" != "" && "${1:-}" != "-"* ]]; then
  DATASET_PATH="$1"
  shift
fi
MODEL_NAME="${MODEL_NAME:-llama3.1:latest}"
TIMEOUT_S="${TIMEOUT_S:-300}"
OUTPUT_DIR="${GAIA_EVAL_OUTPUT_DIR:-physic/tools/agents/results/gaia_offline_full_attach}"

export GAIA_MODE="${GAIA_MODE:-1}"
export GAIA_EVAL_OUTPUT_DIR="${OUTPUT_DIR}"

export CDEM_LLM_PROVIDER="${CDEM_LLM_PROVIDER:-ollama}"
export CDEM_OLLAMA_BASE_URL="${CDEM_OLLAMA_BASE_URL:-http://localhost:11434}"
export CDEM_LLM_MODEL="${CDEM_LLM_MODEL:-$MODEL_NAME}"

export CDEM_ENABLE_TOOLS="${CDEM_ENABLE_TOOLS:-1}"
export CDEM_ENABLE_VECTOR_KB="${CDEM_ENABLE_VECTOR_KB:-0}"
export CDEM_ENABLE_RAG="${CDEM_ENABLE_RAG:-0}"
export CDEM_ENABLE_RAG_FALLBACK="${CDEM_ENABLE_RAG_FALLBACK:-0}"

INLINE_FLAG=""
if [[ "${CDEM_ENABLE_TOOLS}" == "1" || "${CDEM_ENABLE_TOOLS}" == "true" || "${CDEM_ENABLE_TOOLS}" == "True" ]]; then
  INLINE_FLAG="--no_inline_attachment"
fi

python physic/tools/agents/evaluate_gaia.py \
  --dataset "${DATASET_PATH}" \
  --only_with_file \
  --model "${MODEL_NAME}" \
  --timeout_s "${TIMEOUT_S}" \
  ${INLINE_FLAG} \
  "$@"
