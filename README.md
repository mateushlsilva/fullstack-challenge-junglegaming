# 🧩 Sistema de Gestão de Tarefas Colaborativo

**Desafio Full-stack Júnior — Jungle Gaming**

Este repositório contém a implementação completa do sistema solicitado no desafio Full-stack, incluindo monorepo com Turborepo, microserviços Nest.js comunicando-se via RabbitMQ, API Gateway, WebSocket em tempo real e frontend React com TanStack Router + shadcn/ui.

---

# 📐 Arquitetura Geral

```
                      ┌───────────────────────┐
                      │       Front-end       │
                      │   React + TanStack    │
                      │   WebSocket Client    │
                      └──────────┬────────────┘
                                 │ HTTP / WS
                                 ▼
                     ┌──────────────────────────┐
                     │      API Gateway         │
                     │  Nest.js (HTTP + WS)     │
                     │  Auth Guards + Swagger   │
                     └──────────┬───────────────┘
                                │ RPC + Events (RabbitMQ)
        ┌───────────────────────┼─────────────────────────────┐
        ▼                       ▼                             ▼
┌───────────────┐     ┌────────────────┐          ┌────────────────────┐
│ Auth Service  │     │ Tasks Service  │          │ Notifications Svc  │
│ JWT, Users    │     │ CRUD, Comments │          │ WebSocket,         │
│ PostgreSQL    │     │ PostgreSQL     │          │ RabbitMQ Consumer  │
└───────────────┘     └────────────────┘          └────────────────────┘

                     ┌─────────────────────────────┐
                     │         RabbitMQ            │
                     │   broker de mensageria      │
                     └─────────────────────────────┘

                     ┌─────────────────────────────┐
                     │          PostgreSQL         │
                     │ DB compartilhado por serviços│
                     └─────────────────────────────┘
```

---

# 🚀 Tecnologias Utilizadas

### **Front-end**

* React.js
* TanStack Router
* TanStack Query (diferencial)
* shadcn/ui + Tailwind CSS
* WebSocket Client (Socket.io)
* Zustand para auth
* React Hook Form + Zod
* Skeleton loaders e toast notifications.


### **Back-end**

* Nest.js (API Gateway + 3 microserviços)
* TypeORM + PostgreSQL
* RabbitMQ (event-driven)
* Swagger / OpenAPI
* WebSocket Gateway
* Pino para logs
* JWT
* class-validator
* health checks

### **Infra**

* Docker & Docker Compose
* Turborepo para monorepo

---

# 📂 Estrutura do Repositório

```
.
├── apps/
│   ├── web/                     # Front-end React
│   ├── api-gateway/             # HTTP + WebSocket + Swagger
│   ├── auth-service/            # Login, cadastro e JWT
│   ├── tasks-service/           # CRUD + comentários + histórico
│   └── notifications-service/   # WebSockets + eventos tempo real
├── packages/
│   ├── common/
│   ├── utils/
│   ├── eslint-config/
│   └── tsconfig/
├── docker-compose.yml
├── turbo.json
└── README.md
```

---

# ⚙️ Como Rodar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/mateushlsilva/fullstack-challenge-junglegaming.git
cd fullstack-challenge-junglegaming
```

### 2. Criar os arquivos `.env`

Cada app possui `.env.example`.

Crie os arquivos via Makefile:

```bash
make env
```

### 3. Subir toda a stack

```bash
make run
```

### 4. Parar toda a stack

```bash
make stop
```

### 5. Acesse:

| Serviço     | URL                                                              |
| ----------- | ---------------------------------------------------------------- |
| Front-end   | [http://localhost:3000](http://localhost:3000)                             |
| API Gateway | [http://localhost:3001](http://localhost:3001)                   |
| Swagger     | [http://localhost:3001/api/docs](http://localhost:3001/api/docs) |
| RabbitMQ UI | [http://localhost:15672](http://localhost:15672) (admin/admin)   |
| PostgreSQL  | localhost:5432                                                   |

---

# 🔐 Autenticação

* Register: `POST /api/auth/register`
* Login: `POST /api/auth/login`
* Refresh Token: `POST /api/auth/refresh`
* AccessToken 15min
* RefreshToken 7 dias

Proteção de rotas configurada no **API Gateway** com Guards.

---

# 📌 Funcionalidades

### ✔ CRUD de Tarefas

### ✔ Comentários

### ✔ Histórico/Audit Log

### ✔ Atribuição a usuários

### ✔ Paginação

### ✔ Busca e filtros

### ✔ UI responsiva com shadcn/ui

### ✔ WebSocket com notificações em tempo real

* `task:created`
* `task:updated`
* `comment:new`

---

# 🔄 Fluxo de Eventos (RabbitMQ)

```
Usuário cria tarefa
       │
       ▼
API Gateway -> tasks-service (rpc)
       │
       ▼
tasks-service publica "task.created" no RabbitMQ
       │
       ▼
notifications-service consome evento
       │
       ▼
envia WebSocket para usuários conectados
```

---

# 🧠 Decisões Técnicas & Trade-offs

### ✔ **Usei API Gateway centralizado**

Motivo: controlar JWT, documentação e rate-limit em um único ponto.

### ✔ **Banco único (Postgres) em vez de um por serviço**

Trade-off: menos isolamento.

### ✔ **Socket.io**

Facilita reconexão e fallback (melhor DX).

### ✔ **TanStack Router ao invés de React Router**

Mais moderno, sem loaders opcionais, navegação mais controlada.

### ✔ **Mensageria para consistência eventual**

Garantir que tasks e comentários sempre gerem eventos.

### ✔ **TanStack Query para gerenciamento de dados remotos**

Gerenciar dados assíncronos por oferecer cache automático, revalidação inteligente e sincronização em tempo real.

### ✔ **Zustand para estado global de autenticação**

Leve, simples e permitir um fluxo de estado previsível sem a complexidade de soluções maiores como Redux.

### ✔ **Kanban para gerenciamento de tarefas**

Implementei o Kanban para organizar e manipular visualmente as tarefas de forma prática e intuitiva.

---

# 🐛 Problemas Conhecidos

### 1. 💬 WebSocket pode demorar alguns minutos para conectar via Nginx

Mesmo configurando `proxy_set_header Upgrade`, o handshake fica lento.
Procure usar o WebSocket no modo de `desenvolvimento`.

### 2. 📦 Turborepo + hot reload no Docker pode ficar mais lento

Montagem de volumes gera I/O elevado.

---

# 🚀 Melhorias Futuras

* [ ] Testes unitários e2e
* [ ] Cache com Redis
* [ ] Alertas por e-mail quando tarefa mudar

---

# ⏱ Tempo Gasto no Desenvolvimento

| Parte                               | Tempo estimado |
| ----------------------------------- | -------------- |
| **Back-end (1 semana)**             | ~25h           |
| Configuração do monorepo + Docker   | ~4h            |
| API Gateway + Auth                  | ~7h            |
| Tasks Service + CRUD + histórico    | ~8h            |
| Notifications + WebSocket + eventos | ~6h            |
| **Front-end (1 semana)**            | ~21h           |
| React + TanStack Router + UI        | ~9h            |
| Kanban + filtros + comentários      | ~8h            |
| Documentação e refinamentos         | ~4h            |



---

# 📜 Instruções Específicas

* Para trocar URLs no front, use o `.env` e variáveis `VITE_API_URL` e `VITE_WS_URL`.
* Para reconstruir tudo do zero:

```bash
make stop
make run
```

## 🧑‍💻 Autor

Mateus Silva