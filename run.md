GAIA_EVAL_OUTPUT_DIR=physic/tools/agents/results/gaia_offline_full_attach \
GAIA_MODE=1 \
CDEM_LLM_PROVIDER=ollama CDEM_OLLAMA_BASE_URL=http://localhost:11434 \
CDEM_ENABLE_TOOLS=0 CDEM_ENABLE_VECTOR_KB=0 CDEM_ENABLE_RAG=0 CDEM_ENABLE_RAG_FALLBACK=0 \
python physic/tools/agents/evaluate_gaia.py \
  --dataset GAIA/2023/validation/metadata.jsonl \
  --only_with_file \
  --model llama3.1:latest \
  --timeout_s 300
