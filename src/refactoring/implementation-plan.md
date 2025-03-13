# Plano de Implementação da Refatoração

Este documento descreve o plano detalhado para implementar a refatoração do
`createMaterialsTree` usando classes TypeScript.

## Fase 1: Preparação e Estrutura Básica

### Etapa 1.1: Criar Estrutura de Diretórios

```
src/
├── models/
│   ├── Product.ts
│   ├── RecipeItem.ts
│   └── TreeNode.ts
├── services/
│   ├── Calculator.ts
│   ├── TreeValidator.ts
│   └── Utils.ts
├── builders/
│   ├── MaterialsTreeBuilder.ts
│   └── NodeProcessor.ts
├── traversers/
│   └── TreeTraverser.ts
├── adapters/
│   └── LegacyAdapter.ts
└── interfaces/
    ├── IProduct.ts
    ├── IRecipeItem.ts
    └── ITreeNode.ts
```

### Etapa 1.2: Definir Interfaces

1. Extrair interfaces existentes para arquivos separados
2. Refinar interfaces para suportar a nova estrutura orientada a objetos
3. Adicionar documentação JSDoc completa

### Etapa 1.3: Configurar Ambiente de Testes

1. Configurar estrutura de testes unitários
2. Criar dados de teste para uso em todos os testes
3. Configurar cobertura de código

## Fase 2: Implementação dos Modelos de Dados

### Etapa 2.1: Implementar Classe Product

1. Criar classe com propriedades privadas
2. Implementar getters para todas as propriedades
3. Adicionar métodos auxiliares (hasRecipe, isKilogram, etc.)
4. Adicionar validações no construtor
5. Escrever testes unitários

### Etapa 2.2: Implementar Classe RecipeItem

1. Criar classe com propriedades privadas
2. Implementar getters para todas as propriedades
3. Adicionar método calculateWithFactor
4. Adicionar validações no construtor
5. Escrever testes unitários

### Etapa 2.3: Implementar Classe TreeNode

1. Criar classe com propriedades privadas
2. Implementar getters para todas as propriedades
3. Adicionar métodos para manipulação de filhos
4. Implementar método toJSON para serialização
5. Escrever testes unitários

## Fase 3: Implementação dos Serviços

### Etapa 3.1: Implementar Classe Calculator

1. Extrair lógica de cálculo da função original
2. Implementar métodos estáticos para cada tipo de cálculo
3. Refatorar arredondamento para método utilitário
4. Escrever testes unitários para cada método

### Etapa 3.2: Implementar Classe TreeValidator

1. Criar validações para produtos, itens e nós
2. Implementar detecção de dependências circulares
3. Adicionar validações de entrada
4. Escrever testes unitários para cada validação

### Etapa 3.3: Implementar Classe Utils

1. Extrair funções utilitárias da função original
2. Implementar métodos para geração de IDs e caminhos
3. Adicionar outras funções utilitárias necessárias
4. Escrever testes unitários

## Fase 4: Implementação dos Construtores e Gerenciadores

### Etapa 4.1: Implementar Classe MaterialsTreeBuilder

1. Criar classe com padrão Builder
2. Implementar métodos fluentes para configuração
3. Implementar método build() para construção da árvore
4. Integrar com NodeProcessor
5. Escrever testes unitários

### Etapa 4.2: Implementar Classe NodeProcessor

1. Extrair lógica de processamento de nós da função original
2. Implementar processamento recursivo de filhos
3. Integrar com Calculator e Utils
4. Escrever testes unitários

### Etapa 4.3: Implementar Classe TreeTraverser

1. Criar métodos para percorrer a árvore
2. Implementar métodos para busca e manipulação
3. Adicionar suporte para callbacks
4. Escrever testes unitários

## Fase 5: Implementação dos Adaptadores

### Etapa 5.1: Implementar Classe LegacyAdapter

1. Criar adaptador para manter compatibilidade com API antiga
2. Implementar conversão entre formatos novo e antigo
3. Garantir que todos os parâmetros originais sejam suportados
4. Escrever testes de compatibilidade

## Fase 6: Integração e Testes

### Etapa 6.1: Testes de Integração

1. Criar testes que exercitam o fluxo completo
2. Comparar resultados com a implementação original
3. Verificar compatibilidade com código existente
4. Testar casos de borda e situações de erro

### Etapa 6.2: Documentação

1. Atualizar documentação de todas as classes e métodos
2. Criar exemplos de uso
3. Documentar estratégia de migração
4. Atualizar README e outros documentos

### Etapa 6.3: Otimizações

1. Identificar gargalos de desempenho
2. Implementar cache para cálculos repetitivos
3. Otimizar processamento recursivo
4. Medir e comparar desempenho com implementação original

## Fase 7: Lançamento e Migração

### Etapa 7.1: Estratégia de Migração

1. Criar guia de migração para usuários existentes
2. Implementar adaptadores adicionais se necessário
3. Planejar período de transição

### Etapa 7.2: Lançamento

1. Atualizar versão do pacote
2. Publicar documentação atualizada
3. Comunicar mudanças aos usuários

## Cronograma Estimado

| Fase      | Descrição                                      | Tempo Estimado |
| --------- | ---------------------------------------------- | -------------- |
| 1         | Preparação e Estrutura Básica                  | 1 dia          |
| 2         | Implementação dos Modelos de Dados             | 2 dias         |
| 3         | Implementação dos Serviços                     | 2 dias         |
| 4         | Implementação dos Construtores e Gerenciadores | 3 dias         |
| 5         | Implementação dos Adaptadores                  | 1 dia          |
| 6         | Integração e Testes                            | 3 dias         |
| 7         | Lançamento e Migração                          | 1 dia          |
| **Total** |                                                | **13 dias**    |

## Priorização de Tarefas

1. **Alta Prioridade**
   - Implementação dos modelos de dados básicos
   - Implementação do Calculator
   - Implementação do MaterialsTreeBuilder

2. **Média Prioridade**
   - Implementação do TreeValidator
   - Implementação do NodeProcessor
   - Testes de integração

3. **Baixa Prioridade**
   - Implementação do TreeTraverser
   - Otimizações de desempenho
   - Adaptadores adicionais

## Riscos e Mitigações

| Risco                                        | Impacto | Probabilidade | Mitigação                                                      |
| -------------------------------------------- | ------- | ------------- | -------------------------------------------------------------- |
| Incompatibilidade com código existente       | Alto    | Médio         | Testes extensivos de compatibilidade, adaptadores robustos     |
| Desempenho inferior à implementação original | Médio   | Baixo         | Benchmarks, otimizações específicas                            |
| Complexidade excessiva da nova API           | Médio   | Médio         | Foco na usabilidade, documentação clara, exemplos              |
| Bugs em casos de borda                       | Alto    | Médio         | Testes extensivos, validações robustas                         |
| Resistência dos usuários à migração          | Baixo   | Alto          | Documentação clara, período de transição, suporte à API antiga |
