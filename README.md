# Herme URL Shortener

## Descrição do Projeto

Herme URL Shortener é uma aplicação para encurtamento de URLs, desenvolvida com Node.js, MongoDB e Docker. O projeto permite criar URLs curtas e personalizadas, facilitando o compartilhamento de links longos.

## Funcionalidades

- Geração de URLs curtas únicas
- Redirecionamento de URLs encurtadas
- Registro de histórico de visitas
- Ambiente containerizado com Docker

## Pré-requisitos

- Docker (versão 20.10 ou superior)
- Docker Compose (versão 1.29 ou superior)
- Node.js 16+ (opcional, para desenvolvimento local)

## Tecnologias Utilizadas

- Node.js
- Express.js
- MongoDB
- Docker
- Docker Compose

## Configuração do Ambiente

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com a seguinte configuração:

```env
#API_KEY, serve para segurança com o uso da API, apenas quem a tem no header da requisição consegue usar as barras
API_KEY='xxxxxxxxxxx'

# URI de conexão com o MongoDB
# Use sua própria URI de conexão (MongoDB Atlas, local, etc.)
MONGO_URI=mongodb+srv://seu_usuario:sua_senha@seu_cluster.mongodb.net/herme-url-shortener?retryWrites=true&w=majority

#Porta
PORT='0000'

```

### Instalação e Execução

#### Desenvolvimento

```bash
# Construir os containers
docker-compose build
# Iniciar os containers
docker-compose up
# Iniciar em modo background
docker-compose up -d
```

#### Produção

```bash
# Construir para produção
docker-compose -f docker-compose.prod.yml up -d
```

#### Parar Containers

```bash
docker-compose down
```

## Estrutura do Projeto

```
herme-url-shortener/
│
├── models/
├── routes/
├── controllers/
│
├── Dockerfile
├── docker-compose.yml
├── index.js
├── package.json
└── README.md
```

## Configurações Importantes

- Porta padrão: 8001
- Banco de dados: MongoDB
- Ambiente: Containerizado

## Rotas da Aplicação

### Rota de Encurtamento de URL

```javascript
router.post("/");
```

- **Descrição**: Cria uma nova URL encurtada
- **Método**: POST
- **Corpo da Requisição**:
  ```json
  {
    "url": "URL original a ser encurtada"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "id": "shortId"
  }
  ```
- **Códigos de Status**:
  - `201`: URL encurtada com sucesso
  - `400`: URL não fornecida

### Rota de Redirecionamento

```javascript
app.get("/:shortId");
```

- **Descrição**: Redireciona para a URL original e registra visita
- **Método**: GET
- **Parâmetros**:
  - `shortId`: Identificador curto da URL
- **Comportamento**:
  - Redireciona para URL original
  - Registra timestamp da visita
- **Códigos de Status**:
  - Redirecionamento bem-sucedido
  - `404`: URL encurtada não encontrada
  - `500`: Erro interno do servidor

### Rota de Analytics

```javascript
router.get("/analytics/:shortId");
```

- **Descrição**: Obtém estatísticas de uma URL encurtada
- **Método**: GET
- **Parâmetros**:
  - `shortId`: Identificador curto da URL
- **Resposta de Sucesso**:
  ```json
  {
    "totalClicks": 10,
    "analytics": [{ "timestamp": 1623456789 }, { "timestamp": 1623456790 }]
  }
  ```
- **Códigos de Status**:
  - `200`: Estatísticas retornadas com sucesso
  - `404`: URL encurtada não encontrada

## Solução de Problemas

### Verificação de Logs

```bash
# Logs gerais
docker-compose logs
# Logs de um serviço específico
docker-compose logs app
docker-compose logs mongo
```

### Verificar Containers

```bash
docker-compose ps
```

## Testes

Este projeto inclui uma suíte de testes automatizados utilizando o framework **Jest** para garantir a qualidade e o funcionamento das funcionalidades implementadas.

### Configuração para Testes

1. **Rodar os Testes**:

   ```bash
   npm test
   ```

2. **Cobertura de Código**:
   Para gerar um relatório de cobertura de código:
   ```bash
   npm test -- --coverage
   ```

### Estrutura dos Testes

Os testes estão localizados no diretório `__tests__` e cobrem as principais rotas e funcionalidades da aplicação, incluindo:

- **POST /url**:
  - Verifica se uma URL curta é criada corretamente.
  - Retorna erro se a URL não for fornecida.
- **GET /:shortId**:

  - Testa o redirecionamento para a URL original.
  - Verifica o comportamento para IDs inválidos.

- **GET /analytics/:shortId**:
  - Garante que as estatísticas de cliques e visitas sejam retornadas corretamente.
  - Retorna erro para IDs inexistentes.

### Solução de Problemas com Testes

- **Conexão com o MongoDB em Memória**:
  Os testes utilizam o `mongodb-memory-server` para criar um banco de dados MongoDB em memória, garantindo isolamento dos dados e limpeza automática após cada teste.
