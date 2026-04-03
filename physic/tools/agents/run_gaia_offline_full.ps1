Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = (Resolve-Path (Join-Path $scriptDir "..\\..\\..")).Path
Set-Location $repoRoot

$cliArgs = @($args)
$datasetPath = "GAIA/2023/validation/metadata.jsonl"
$rest = @()

if ($cliArgs -contains "-h" -or $cliArgs -contains "--help" -or $cliArgs -contains "-?") {
    Write-Host "Usage:"
    Write-Host "  powershell -NoProfile -ExecutionPolicy Bypass -File physic/tools/agents/run_gaia_offline_full.ps1 [DATASET_PATH] [-- extra args passed to evaluate_gaia.py]"
    Write-Host ""
    Write-Host "Defaults:"
    Write-Host "  DATASET_PATH = GAIA/2023/validation/metadata.jsonl"
    Write-Host "  MODEL_NAME env default = llama3.1:latest"
    Write-Host "  TIMEOUT_S env default = 300"
    Write-Host "  GAIA_EVAL_OUTPUT_DIR env default = physic/tools/agents/results/gaia_offline_full_attach"
    exit 0
}

if ($cliArgs.Count -gt 0 -and -not $cliArgs[0].StartsWith("-")) {
    $datasetPath = $cliArgs[0]
    if ($cliArgs.Count -gt 1) {
        $rest = $cliArgs[1..($cliArgs.Count - 1)]
    }
} else {
    $rest = $cliArgs
}

$modelName = if ($env:MODEL_NAME -and $env:MODEL_NAME.Trim()) { $env:MODEL_NAME.Trim() } else { "llama3.1:latest" }
$timeoutS = if ($env:TIMEOUT_S -and $env:TIMEOUT_S.Trim()) { $env:TIMEOUT_S.Trim() } else { "300" }
$outputDir = if ($env:GAIA_EVAL_OUTPUT_DIR -and $env:GAIA_EVAL_OUTPUT_DIR.Trim()) { $env:GAIA_EVAL_OUTPUT_DIR.Trim() } else { "physic/tools/agents/results/gaia_offline_full_attach" }

if (-not ($env:GAIA_MODE -and $env:GAIA_MODE.Trim())) { $env:GAIA_MODE = "1" }
$env:GAIA_EVAL_OUTPUT_DIR = $outputDir

if (-not ($env:CDEM_LLM_PROVIDER -and $env:CDEM_LLM_PROVIDER.Trim())) { $env:CDEM_LLM_PROVIDER = "ollama" }
if (-not ($env:CDEM_OLLAMA_BASE_URL -and $env:CDEM_OLLAMA_BASE_URL.Trim())) { $env:CDEM_OLLAMA_BASE_URL = "http://localhost:11434" }
if (-not ($env:CDEM_LLM_MODEL -and $env:CDEM_LLM_MODEL.Trim())) { $env:CDEM_LLM_MODEL = $modelName }

if (-not ($env:CDEM_ENABLE_TOOLS -and $env:CDEM_ENABLE_TOOLS.Trim())) { $env:CDEM_ENABLE_TOOLS = "0" }
if (-not ($env:CDEM_ENABLE_VECTOR_KB -and $env:CDEM_ENABLE_VECTOR_KB.Trim())) { $env:CDEM_ENABLE_VECTOR_KB = "0" }
if (-not ($env:CDEM_ENABLE_RAG -and $env:CDEM_ENABLE_RAG.Trim())) { $env:CDEM_ENABLE_RAG = "0" }
if (-not ($env:CDEM_ENABLE_RAG_FALLBACK -and $env:CDEM_ENABLE_RAG_FALLBACK.Trim())) { $env:CDEM_ENABLE_RAG_FALLBACK = "0" }

& python "physic/tools/agents/evaluate_gaia.py" `
    "--dataset" $datasetPath `
    "--only_with_file" `
    "--model" $modelName `
    "--timeout_s" $timeoutS `
    @rest

exit $LASTEXITCODE
