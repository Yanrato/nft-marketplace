# Arquitetura

## Cache, retries e sincronização (TanStack Query)
- `staleTime` 60 s, `gcTime` 5 min, refetch ao focar a janela.
- Retries: até 2 para falhas de rede e 5xx; nenhum para 4xx.
- Mutations: sem retry automático. Pedidos usam chave de idempotência.
- Query keys: `["nfts", params]` (params da URL), `["nft", id]`, `["nft-facets"]`.
  Dados privados incluirão o id do usuário na chave.
- Respostas obsoletas: `signal` do Axios cancela a requisição anterior e a chave
  inclui todos os parâmetros, então uma resposta antiga nunca ocupa a chave nova.

## Estado da URL (TanStack Router)
- Catálogo: `q`, `category`, `network`, `sort`, `page`, `minPrice`, `maxPrice`.
- Trocar filtro/ordenação adiciona uma entrada no histórico e zera `page`.
- Digitação na busca usa `replace` (não polui o histórico).

## Decisões de UX
- Abas "Novos lançamentos" e "Em alta" são atalhos de ordenação (`recent`, `popular`).
## Decisões de UX e desvios do Figma (catálogo)
- Contagens, categorias e faixa de preço dos filtros vêm de `GET /api/nfts/facets`
  (nenhum número fixo nos componentes).
- Abas e "Ordenar por" compartilham o parâmetro `sort`: "Todos" = sem ordenação,
  "Novos lançamentos" = `recent`, "Em alta" = `popular`.
- Faixa de preço usa dois campos numéricos rotulados (acessíveis) no lugar do slider.
- Em telas menores que `lg`, os filtros abrem em gaveta (`Sheet`) com controle de foco.
- O botão de favorito dos cards só aparece quando a ação real existir (etapa de favoritos).
- Skeletons usam shimmer com as mesmas proporções do card e respeitam `prefers-reduced-motion`.