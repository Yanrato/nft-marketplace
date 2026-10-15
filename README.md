# Kurio — NFT Marketplace

Marketplace de NFTs desenvolvido com React e TypeScript, com catálogo de colecionáveis digitais, filtros de busca, autenticação simulada e fluxo de carrinho e pedidos.

O projeto utiliza uma API simulada com **Mock Service Worker (MSW)** para executar as funcionalidades sem depender de um backend externo.

## Funcionalidades

### Catálogo de NFTs
- Listagem de NFTs e colecionáveis digitais.
- Pesquisa por nome do NFT ou coleção.
- Filtros por categoria e rede.
- Filtro por faixa de preço.
- Ordenação por preço crescente, preço decrescente e popularidade.
- Paginação dos resultados.
- Visualização dos detalhes de um NFT, incluindo preço, coleção, rede, edições disponíveis e outras informações cadastradas.

### Autenticação
- Cadastro de usuário.
- Login e logout.
- Validação dos dados enviados.
- Verificação e expiração de sessão simulada.
- Armazenamento local dos dados utilizados pela API simulada.

### Carrinho e pedidos
- Fluxo de carrinho de compras.
- Cotação dos itens antes da criação do pedido.
- Cálculo de subtotal, desconto, taxa de rede e total.
- Validação de itens, edições disponíveis e estoque.
- Aplicação do cupom `KURIO10`.
- Tratamento de cupons inválidos ou expirados.
- Criação e consulta de pedidos.
- Simulação de confirmação ou rejeição de pedidos.
- Uso de chave de idempotência na criação de pedidos.

### Persistência e comunicação
- Persistência local dos dados simulados no navegador, permitindo manter determinados dados após atualizar a página.
- API simulada com MSW para catálogo, autenticação, cotação e pedidos.
- Estrutura de comunicação em tempo real utilizando Socket.IO e um adaptador de WebSocket para o MSW.

> **Observação:** o projeto utiliza dados e serviços simulados. A persistência local não equivale a um banco de dados compartilhado entre usuários. O fluxo de pedidos não representa processamento real de pagamentos, e os dados de NFTs não comprovam transações em uma blockchain.

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Tailwind CSS
- Radix UI
- React Hook Form
- Zod
- Axios
- Mock Service Worker (MSW)
- Socket.IO Client
- Decimal.js
- ESLint

## Pré-requisitos

- Node.js compatível com a versão do Vite utilizada pelo projeto.
- npm.
- Git, caso queira clonar o repositório.

## Como executar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/Yanrato/nft-marketplace.git
```

### 2. Acesse a pasta

```bash
cd nft-marketplace
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure os mocks

Na raiz do projeto, crie um arquivo chamado `.env.local` com o seguinte conteúdo:

```env
VITE_ENABLE_MOCKS=true
```

Essa variável habilita o MSW, responsável por interceptar as requisições e fornecer as respostas simuladas utilizadas pela aplicação.

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O Vite exibirá no terminal o endereço local para abrir a aplicação no navegador, normalmente `http://localhost:5173`.

## Comandos disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Executa a verificação TypeScript e gera a versão de produção. |
| `npm run preview` | Inicia uma prévia local da versão compilada. |
| `npm run typecheck` | Executa a verificação de tipos TypeScript. |
| `npm run lint` | Executa o ESLint. |

## Estrutura de mocks

Os handlers da API simulada estão organizados em `src/mocks/`:

- `handlers.ts`: catálogo, filtros, ordenação, paginação e detalhes dos NFTs.
- `authHandlers.ts`: cadastro, login, sessão e logout.
- `orderHandlers.ts`: cotação, criação e consulta de pedidos.
- `socketHandlers.ts`: comunicação em tempo real.
- `db.ts`: dados iniciais e persistência local dos NFTs.

A inicialização dos mocks é controlada pela variável `VITE_ENABLE_MOCKS`, verificada em `src/main.tsx`.

## Build de produção

Para gerar a versão de produção:

```bash
npm run build
```

Os arquivos gerados ficam no diretório `dist/`.

Para visualizar a versão compilada localmente:

```bash
npm run preview
```

## Projeto

Repositório: [github.com/Yanrato/nft-marketplace](https://github.com/Yanrato/nft-marketplace)
