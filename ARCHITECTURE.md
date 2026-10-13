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