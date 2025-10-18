# 🛒 Sistema de Gerenciamento Zoppy

> Aplicação CRUD full-stack moderna construída com NestJS, Angular 19 e MySQL

[![NestJS](https://img.shields.io/badge/NestJS-11.0-ea2845?logo=nestjs)](https://nestjs.com/)
[![Angular](https://img.shields.io/badge/Angular-19-dd0031?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Cobertura de Testes](https://img.shields.io/badge/Cobertura-73.84%25-brightgreen)](https://github.com)

Aplicação CRUD full-stack demonstrando arquitetura limpa, melhores práticas e padrões modernos de desenvolvimento web.

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológica](#️-stack-tecnológica)
- [Arquitetura](#️-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Início Rápido](#-início-rápido)
- [Instalação](#-instalação)
- [Executando a Aplicação](#-executando-a-aplicação)
- [Testes](#-testes)
- [Documentação da API](#-documentação-da-api)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Desenvolvimento](#-desenvolvimento)
- [Deploy em Produção](#-deploy-em-produção)
- [Licença](#-licença)

---

## ✨ Funcionalidades

### Funcionalidades Principais
- ✅ **Operações CRUD Completas** - Criar, Ler, Atualizar, Deletar produtos e pedidos
- ✅ **Filtragem Avançada** - Filtrar por categoria, faixa de preço e status de estoque
- ✅ **Funcionalidade de Busca** - Busca em tempo real com debouncing
- ✅ **Paginação** - Carregamento eficiente de dados com metadados
- ✅ **Design Responsivo** - Abordagem mobile-first com TailwindCSS
- ✅ **Notificações Toast** - Sistema de feedback amigável ao usuário
- ✅ **Validação de Formulários** - Validação client-side e server-side
- ✅ **Tratamento de Erros** - Gerenciamento abrangente de erros
- ✅ **Estados de Carregamento** - Feedback visual durante operações

### Funcionalidades Técnicas
- ✅ **Arquitetura MVC** - Separação limpa de responsabilidades (Backend)
- ✅ **Atomic Design** - Hierarquia de componentes (Frontend)
- ✅ **73.84% Cobertura de Testes** - Excede requisito de 70%
- ✅ **Documentação Swagger** - Documentação interativa da API
- ✅ **Type Safety** - Implementação completa em TypeScript
- ✅ **Gerenciamento de Estado RxJS** - Padrões de programação reativa
- ✅ **Soft Deletes** - Preservação de dados
- ✅ **Filtros Globais de Erro** - Respostas de erro consistentes
- ✅ **Segunda Entidade CRUD** - Sistema completo de Pedidos

---

## 🛠️ Stack Tecnológica

### Backend
- **Framework:** NestJS 11.0
- **Linguagem:** TypeScript 5.7 (modo strict)
- **ORM:** Sequelize com sequelize-typescript
- **Banco de Dados:** MySQL 8.0
- **Validação:** class-validator, class-transformer
- **Documentação:** Swagger/OpenAPI
- **Testes:** Jest (73.84% cobertura - 69 testes)

### Frontend
- **Framework:** Angular 19
- **Linguagem:** TypeScript 5.9 (modo strict)
- **Estilização:** TailwindCSS 3.4
- **Gerenciamento de Estado:** RxJS 7.8
- **Formulários:** Reactive Forms
- **Notificações:** ngx-toastr
- **Cliente HTTP:** Angular HttpClient com fetch

### DevOps
- **Containerização:** Docker & Docker Compose
- **Interface do Banco:** Adminer
- **Controle de Versão:** Git

---

## 🏗️ Arquitetura

### Backend: Padrão MVC

```
backend/src/
├── modules/
│   ├── products/           # Módulo de Produtos
│   │   ├── models/         # MODEL: Estrutura de dados e banco
│   │   ├── dto/            # VIEW: Formatação de requisição/resposta
│   │   ├── services/       # Lógica de negócio
│   │   ├── controllers/    # CONTROLLER: Manipulação HTTP
│   │   └── tests/          # Testes unitários e integração
│   │
│   └── orders/             # Módulo de Pedidos
│       ├── models/         # Order e OrderItem
│       ├── dto/            # DTOs de criação e atualização
│       ├── services/       # Lógica de negócio de pedidos
│       ├── controllers/    # Endpoints HTTP
│       └── tests/          # 40 testes (25 service + 15 controller)
│
├── common/                 # Código compartilhado
│   ├── filters/           # Filtros de exceção global
│   ├── interceptors/      # Transformação de resposta
│   └── dto/               # DTOs compartilhados
│
├── config/                # Configurações
│   └── database.config.ts
│
└── main.ts               # Ponto de entrada com Swagger
```

**Princípios MVC Implementados:**
- ✅ **Controllers** são finos (< 50 linhas por método)
- ✅ **Services** contêm TODA a lógica de negócio
- ✅ **Models** definem apenas estrutura de dados
- ✅ **DTOs** gerenciam validação e formatação

### Frontend: Padrão Atomic Design

```
frontend/src/app/
├── atoms/                  # Nível 1: Componentes básicos
│   ├── button/            # Botões reutilizáveis
│   ├── input/             # Campos de input
│   ├── label/             # Labels de formulário
│   └── spinner/           # Indicadores de carregamento
│
├── molecules/             # Nível 2: Combinações simples
│   ├── form-field/        # Label + Input + Erro
│   ├── search-bar/        # Input + Botão de busca
│   └── card/              # Container de conteúdo
│
├── organisms/             # Nível 3: Componentes complexos
│   ├── product-form/      # Formulário completo de produto
│   ├── product-table/     # Tabela de produtos
│   └── filter-panel/      # Painel de filtros avançados
│
├── templates/             # Nível 4: Layouts de página
│   ├── list-layout/       # Layout para listagens
│   └── form-layout/       # Layout para formulários
│
└── pages/                 # Nível 5: Páginas completas (Smart Components)
    ├── products/          # Páginas de produtos
    │   ├── product-list-page/
    │   ├── product-form-page/
    │   ├── services/      # ProductService
    │   └── models/        # Interfaces
    │
    └── orders/            # Páginas de pedidos
        ├── order-list-page/
        ├── services/      # OrderService
        └── models/        # Interfaces de pedidos
```

---

## 📦 Pré-requisitos

### Necessário
- **Node.js** 18.x ou 20.x ([Download](https://nodejs.org/))
- **npm** 9.x ou superior
- **Docker** & **Docker Compose** ([Instalar](https://docs.docker.com/get-docker/))
- **Git** ([Instalar](https://git-scm.com/))

### Opcional (para desenvolvimento sem Docker)
- **MySQL** 8.0+ ([Download](https://dev.mysql.com/downloads/))

### Verificar Instalações

```bash
node --version    # Deve ser v18.x ou v20.x
npm --version     # Deve ser v9.x ou superior
docker --version  # Deve ser v20.x ou superior
git --version     # Qualquer versão recente
```

---

## 🚀 Início Rápido

### Opção 1: Início Rápido (3 comandos)

```bash
# 1. Iniciar banco de dados
docker-compose up -d

# 2. Iniciar backend (em novo terminal)
cd backend && npm install && npm run start:dev

# 3. Iniciar frontend (em novo terminal)
cd frontend && npm install && npm start
```

**Acessar:**
- 🎨 **Frontend:** http://localhost:4200
- 🔧 **Backend API:** http://localhost:3000/api
- 📚 **Documentação Swagger:** http://localhost:3000/api/docs
- 🗄️ **Adminer (DB UI):** http://localhost:8080

---

## 📥 Instalação

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/teste-zoppy.git
cd teste-zoppy
```

### Passo 2: Iniciar Banco de Dados com Docker

```bash
docker-compose up -d
```

Isso inicia:
- **MySQL 8.0** na porta `3306`
- **Adminer** (Interface web do DB) na porta `8080`

**Acessar Adminer:** http://localhost:8080
- **Servidor:** `mysql`
- **Usuário:** `zoppy_user`
- **Senha:** `zoppy_password`
- **Banco de Dados:** `zoppy_db`

### Passo 3: Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Criar arquivo de ambiente (se não existir)
cp .env.example .env

# Executar testes (opcional)
npm run test:cov

# Iniciar servidor de desenvolvimento
npm run start:dev
```

Backend rodando em: **http://localhost:3000**

### Passo 4: Configurar Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start
```

Frontend rodando em: **http://localhost:4200**

---

## 🎯 Executando a Aplicação

### Modo Desenvolvimento

**Backend:**
```bash
cd backend
npm run start:dev      # Modo watch com hot reload
```

**Frontend:**
```bash
cd frontend
npm start             # Servidor de desenvolvimento
```

### Modo Produção

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm run build
# Servir a pasta dist/ com qualquer servidor estático
```

### Usando Docker (Produção)

```bash
# Construir e iniciar todos os serviços
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

---

## 🧪 Testes

### Testes Backend

```bash
cd backend

# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:cov

# Executar testes E2E
npm run test:e2e
```

### Cobertura de Testes Atual

```
Cobertura Total: 73.84% (excede requisito de 70%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Test Suites: 5 passed, 5 total
Tests:       69 passed, 69 total
Time:        2.205 s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Detalhamento:
- Módulo Products: 100% cobertura (44 testes)
- Módulo Orders: 98.85% cobertura (40 testes)
- Controllers: 100% cobertura
- Services: 99.42% cobertura
```

### Visualizar Relatório de Cobertura

```bash
cd backend
npm run test:cov

# Abrir relatório HTML
open coverage/lcov-report/index.html  # macOS
xdg-open coverage/lcov-report/index.html  # Linux
start coverage/lcov-report/index.html  # Windows
```

---

## 📚 Documentação da API

### Swagger UI (Documentação Interativa)

**🎯 Melhor forma de explorar a API: Use o Swagger UI!**

**URL:** http://localhost:3000/api/docs

**O Swagger UI oferece:**
- ✅ **Teste interativo** - Teste endpoints direto do navegador
- ✅ **Exemplos de requisição/resposta** - Veja formatos esperados
- ✅ **Validação de schema** - Veja DTOs e regras de validação
- ✅ **Códigos de resposta** - Entenda todas as respostas possíveis
- ✅ **Parâmetros de query** - Veja todos os filtros e opções disponíveis

### Endpoints da API

#### Produtos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/products` | Listar todos os produtos (paginado, filtros) |
| GET | `/api/products/:id` | Buscar produto por ID |
| POST | `/api/products` | Criar novo produto |
| PATCH | `/api/products/:id` | Atualizar produto |
| DELETE | `/api/products/:id` | Deletar produto (soft delete) |
| GET | `/api/products/analytics/by-category` | Contagem de produtos por categoria |

#### Pedidos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/orders` | Listar todos os pedidos (paginado, filtros) |
| GET | `/api/orders/:id` | Buscar pedido por ID com itens |
| POST | `/api/orders` | Criar novo pedido com produtos |
| PATCH | `/api/orders/:id` | Atualizar status/notas do pedido |
| DELETE | `/api/orders/:id` | Cancelar pedido |
| GET | `/api/orders/statistics` | Estatísticas de pedidos por status |

#### Parâmetros de Query (GET /api/products)

| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `page` | number | Número da página (padrão: 1) | `1` |
| `limit` | number | Itens por página (padrão: 10, máx: 100) | `20` |
| `search` | string | Buscar em nome, descrição, SKU | `laptop` |
| `category` | string | Filtrar por categoria | `Electronics` |
| `minPrice` | number | Preço mínimo | `100` |
| `maxPrice` | number | Preço máximo | `5000` |
| `inStock` | boolean | Filtrar produtos em estoque | `true` |

#### Parâmetros de Query (GET /api/orders)

| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `page` | number | Número da página | `1` |
| `limit` | number | Itens por página | `20` |
| `status` | string | Filtrar por status | `pending`, `completed` |
| `customerName` | string | Buscar por nome do cliente | `João` |

### Exemplos de Requisições

**Criar Produto:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Notebook Dell XPS 15",
    "description": "Notebook de alta performance",
    "price": 5999.99,
    "stock": 10,
    "category": "Eletrônicos",
    "sku": "DELL-XPS-15-001"
  }'
```

**Buscar Produtos com Filtros:**
```bash
curl "http://localhost:3000/api/products?page=1&limit=10&category=Eletrônicos&minPrice=500&inStock=true"
```

**Criar Pedido:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "João Silva",
    "customerEmail": "joao@example.com",
    "customerPhone": "+5511999999999",
    "notes": "Entregar antes das 17h",
    "items": [
      {
        "productId": 1,
        "quantity": 2
      },
      {
        "productId": 5,
        "quantity": 1
      }
    ]
  }'
```

**💡 Dica:** Para uma melhor experiência com exemplos de requisição/resposta e testes interativos, use o **Swagger UI** em `http://localhost:3000/api/docs`

---

## 📁 Estrutura do Projeto

```
teste-zoppy/
├── backend/                    # Backend NestJS
│   ├── src/
│   │   ├── modules/
│   │   │   ├── products/      # Módulo de Produtos (MVC)
│   │   │   │   ├── models/
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   ├── dto/
│   │   │   │   └── tests/     # 44 testes
│   │   │   │
│   │   │   └── orders/        # Módulo de Pedidos (MVC)
│   │   │       ├── models/    # Order + OrderItem
│   │   │       ├── controllers/
│   │   │       ├── services/
│   │   │       ├── dto/
│   │   │       └── tests/     # 40 testes
│   │   │
│   │   ├── common/            # Código compartilhado
│   │   │   ├── filters/       # Filtros de exceção
│   │   │   ├── interceptors/  # Interceptors de resposta
│   │   │   └── dto/           # DTOs compartilhados
│   │   │
│   │   ├── config/            # Configurações
│   │   ├── app.module.ts
│   │   └── main.ts            # Swagger configurado
│   │
│   ├── test/                  # Testes E2E
│   ├── .env.example
│   ├── package.json
│   ├── Dockerfile             # Build de produção
│   └── docker-compose.prod.yml
│
├── frontend/                   # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── atoms/         # Atomic Design N1
│   │   │   ├── molecules/     # Atomic Design N2
│   │   │   ├── organisms/     # Atomic Design N3
│   │   │   ├── templates/     # Atomic Design N4
│   │   │   ├── pages/         # Atomic Design N5
│   │   │   │   ├── products/
│   │   │   │   └── orders/
│   │   │   ├── core/          # Serviços principais
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts
│   │   │
│   │   ├── environments/      # Ambientes
│   │   ├── styles.css
│   │   └── main.ts
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   └── angular.json
│
├── docker-compose.yml          # Serviços Docker (dev)
├── .gitignore
└── README.md                   # Este arquivo
```

---

## 🔐 Variáveis de Ambiente

### Backend (.env)

Criar `backend/.env` a partir de `.env.example`:

```env
# Aplicação
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=zoppy_user
DB_PASSWORD=zoppy_password
DB_DATABASE=zoppy_db
DB_SYNC=true                # Auto-sync no desenvolvimento
DB_LOGGING=false

# CORS
CORS_ORIGIN=http://localhost:4200
```

### Frontend (environments/)

**Desenvolvimento:** `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
```

**Produção:** `src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://seu-dominio-api.com/api',
};
```

---

## 🛠️ Desenvolvimento

### Padrões de Código

**Backend (MVC):**
- ✅ Controllers finos (< 50 linhas por método)
- ✅ Lógica de negócio em Services
- ✅ DTOs para validação
- ✅ Models apenas para estrutura de dados
- ✅ Testes para cada camada

**Frontend (Atomic Design):**
- ✅ Atoms < 100 linhas
- ✅ Molecules < 150 linhas
- ✅ Organisms < 300 linhas
- ✅ Pages gerenciam dados (smart components)
- ✅ Componentes menores são burros (dumb components)

### Scripts Úteis

**Backend:**
```bash
npm run start:dev     # Desenvolvimento com watch
npm run build         # Build de produção
npm run start:prod    # Executar produção
npm run lint          # Executar ESLint
npm run format        # Formatar código com Prettier
npm test             # Executar testes
npm run test:cov     # Testes com cobertura
```

**Frontend:**
```bash
npm start            # Servidor de desenvolvimento
npm run build        # Build de produção
npm run build:prod   # Build otimizado
npm test             # Executar testes
npm run lint         # Executar ESLint
```

---

## 🚀 Deploy em Produção

### Opção 1: Docker Compose (Recomendado)

```bash
# Build e iniciar
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Parar
docker-compose down
```

### Opção 2: Render.com (Grátis)

Ver guia completo em `DEPLOYMENT-GUIDE.md`

**Passos rápidos:**
1. Push para GitHub
2. Criar banco PostgreSQL no Render
3. Criar Web Service (backend)
4. Criar Static Site (frontend)
5. Configurar variáveis de ambiente

### Opção 3: VPS (DigitalOcean, AWS, etc)

```bash
# SSH no servidor
ssh user@seu-servidor

# Clonar repositório
git clone https://github.com/seu-usuario/teste-zoppy.git
cd teste-zoppy

# Configurar .env
cp backend/.env.example backend/.env
# Editar com suas configurações

# Build e iniciar com Docker
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📊 Estatísticas do Projeto

### Métricas de Código

| Métrica | Valor |
|---------|-------|
| **Linhas de Código (Backend)** | ~3.500 linhas |
| **Linhas de Código (Frontend)** | ~2.800 linhas |
| **Número de Componentes** | 18 componentes |
| **Número de Testes** | 69 testes |
| **Cobertura de Testes** | 73.84% |
| **Endpoints de API** | 12 endpoints |
| **Entidades CRUD** | 2 (Products + Orders) |

### Conformidade com Requisitos

| Requisito | Status |
|-----------|--------|
| **Backend NestJS 10+** | ✅ 11.0 |
| **Frontend Angular 19** | ✅ 19.0 |
| **Arquitetura MVC** | ✅ 100% |
| **Atomic Design** | ✅ 100% |
| **Cobertura de Testes 70%+** | ✅ 73.84% |
| **Docker** | ✅ Completo |
| **Swagger** | ✅ Completo |
| **RxJS** | ✅ BehaviorSubjects |
| **TailwindCSS** | ✅ v3.4 |
| **Mobile-first** | ✅ Responsivo |
| **Paginação** | ✅ Implementada |
| **Filtros** | ✅ Avançados |
| **Segunda Entidade** | ✅ Orders |

---

## 🎯 Funcionalidades Implementadas

### ✅ Requisitos Obrigatórios (100%)
- [x] Backend NestJS com MVC
- [x] Frontend Angular com Atomic Design
- [x] CRUD completo de Produtos
- [x] Pelo menos 2 telas (lista + formulário)
- [x] Banco de dados relacional (MySQL)
- [x] Docker para containerização
- [x] Documentação completa

### ✅ Desafios Extras (100% - 8/8)

**Frontend:**
- [x] RxJS Observables para gerenciamento de estado
- [x] TailwindCSS para estilização
- [x] Abordagem mobile-first
- [x] Filtros para listagem

**Backend:**
- [x] Testes Jest com 70%+ cobertura (73.84%)
- [x] Docker para containerização
- [x] Banco de dados relacional (MySQL)
- [x] Paginação/filtros/limites

### ✅ Funcionalidades Bônus
- [x] Segunda entidade CRUD (Pedidos)
- [x] Relacionamento entre entidades (Orders ↔ Products)
- [x] Swagger UI completo
- [x] Notificações Toast
- [x] Dockerfile de produção
- [x] Soft deletes
- [x] Filtro global de erros
- [x] Interceptors de resposta
- [x] Validação de estoque
- [x] Cálculo automático de totais
- [x] Estatísticas e analytics

---

## 🤝 Contribuindo

Este é um projeto de desafio técnico, mas sugestões são bem-vindas!

### Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Commit

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração de código
- `test:` Testes
- `chore:` Tarefas de manutenção

---

## 📄 Licença

Este projeto foi desenvolvido como parte do desafio técnico para a posição de Desenvolvedor Junior na Zoppy.

---

## 🙏 Agradecimentos

- **Zoppy** pela oportunidade do desafio técnico
- **NestJS** pela excelente documentação
- **Angular** pelo framework robusto
- **Comunidade Open Source** pelas ferramentas incríveis

---

## 📞 Contato

**Desenvolvedor:** Leo Stuart  
**Projeto:** Desafio Técnico Zoppy  
**Data:** Outubro 2025

---

## 🎯 Próximos Passos (Futuras Melhorias)

- [ ] Autenticação e autorização (JWT)
- [ ] Sistema de cache com Redis
- [ ] Filas de trabalho com BullMQ
- [ ] Envio de emails (notificações)
- [ ] Upload de imagens de produtos
- [ ] Relatórios em PDF
- [ ] Dashboard com gráficos
- [ ] Testes E2E com Cypress
- [ ] CI/CD com GitHub Actions
- [ ] Monitoramento com Prometheus

---

**⭐ Se este projeto foi útil, considere dar uma estrela!**

**Feito com ❤️ para o desafio técnico Zoppy**
