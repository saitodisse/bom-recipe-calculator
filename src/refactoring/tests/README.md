# Testes da Refatoração do BOM Recipe Calculator

Este diretório contém os testes unitários e de integração para a refatoração do
módulo de cálculo de receitas (Bill of Materials).

## Estrutura de Diretórios

Os testes estão organizados nas seguintes categorias:

- **models**: Testes para as classes de modelo (Product, TreeNode, etc.)
- **services**: Testes para os serviços (Calculator, TreeValidator, Utils, etc.)
- **builders**: Testes para os construtores (MaterialsTreeBuilder, etc.)
- **traversers**: Testes para os traversers (TreeTraverser, etc.)
- **adapters**: Testes para os adaptadores (LegacyAdapter, etc.)
- **integration**: Testes de integração para o fluxo completo

## Dados de Teste

O arquivo `testData.ts` contém dados de teste compartilhados entre os diferentes
testes, incluindo:

- Produtos de exemplo (farinha, água, sal, fermento)
- Produtos semi-acabados (massa)
- Produtos finais (pão)
- Produtos para testar dependências circulares
- Resultados esperados para validação

## Como Executar os Testes

### Executar Todos os Testes

#### Windows (PowerShell)

```powershell
.\run_all_tests.ps1
```

#### Windows (CMD)

```cmd
run_all_tests.bat
```

#### Unix/Linux/Mac

```bash
./run_all_tests.sh
```

### Executar Testes Específicos

#### Windows (PowerShell)

```powershell
# Versão padrão
.\run_tests.ps1

# Versão compacta
.\run_tests_compact.ps1

# Versão ultra-compacta (todos os testes em uma linha)
.\run_tests_oneline.ps1

# Executar apenas testes que estão passando
.\run_passing_tests.ps1
```

#### Windows (CMD)

```cmd
run_tests.bat
```

#### Unix/Linux/Mac

```bash
./run_tests.sh
```

### Executar um Teste Individual

```
deno test --allow-all src/refactoring/tests/[categoria]/[NomeDoArquivo].test.ts
```

Exemplo:

```
deno test --allow-all src/refactoring/tests/traversers/TreeTraverser.test.ts
```

## Requisitos

- Deno runtime (versão 1.x ou superior)

## Convenções de Nomenclatura

- Arquivos de teste: `[NomeClasse].test.ts`
- Funções de teste:
  `Deno.test("[NomeClasse].[método] should [comportamento esperado]", () => { ... })`
