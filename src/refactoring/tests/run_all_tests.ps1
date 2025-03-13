# Script para executar todos os testes da refatoração no PowerShell usando glob pattern
# Uso: .\run_all_tests.ps1

Write-Host "Executando todos os testes unitários..." -ForegroundColor Cyan;

deno test --allow-all --no-check **/*.test.ts;

Write-Host "Todos os testes foram executados!" -ForegroundColor Green 