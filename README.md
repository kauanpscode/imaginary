# Imaginary API

*Read this in other languages: [English](#english) | [Português](#português)*

---

## 🇧🇷 Português

A Imaginary é uma robusta aplicação backend Node.js construída com Express e TypeScript. Ela fornece autenticação segura e um poderoso conjunto de APIs para upload, recuperação e transformação de imagens usando Cloudflare R2 (armazenamento compatível com S3) e a biblioteca de processamento de imagens Sharp.

### Funcionalidades

- **Autenticação de Usuário**: Registro seguro e login usando JWT (JSON Web Tokens) e bcrypt para hash de senhas.
- **Upload de Imagem**: Envio de imagens diretamente para o Cloudflare R2 (ou qualquer armazenamento compatível com S3) via multipart/form-data.
- **Transformação de Imagem**: Manipulação de imagens em tempo real usando a poderosa biblioteca `sharp`. Transformações suportadas incluem:
  - Redimensionamento (largura, altura)
  - Corte (largura, altura, coordenadas x, y)
  - Rotação (graus)
  - Conversão de Formato (jpeg, png, webp)
  - Filtros (tons de cinza, sépia)
- **Recuperação de Imagem**: Busca de imagens individuais diretamente ou obtenção de uma lista paginada de todas as imagens enviadas.
- **Banco de Dados PostgreSQL**: Os dados do usuário são armazenados de forma segura em um banco de dados PostgreSQL.

### Tecnologias Utilizadas

- **Ambiente de Execução**: Node.js
- **Framework**: Express.js
- **Linguagem**: TypeScript
- **Armazenamento**: Cloudflare R2 / AWS S3 SDK (`@aws-sdk/client-s3`)
- **Processamento de Imagem**: Sharp
- **Banco de Dados**: PostgreSQL (`pg`)
- **Segurança**: JWT (`jsonwebtoken`), Bcrypt (`bcrypt`)
- **Uploads de Arquivos**: Multer

### Pré-requisitos

Antes de executar este projeto, certifique-se de ter o seguinte instalado:
- Node.js (v18+ recomendado)
- npm ou yarn
- PostgreSQL (rodando localmente ou uma string de conexão remota)
- Conta no Cloudflare R2 (ou credenciais AWS S3)

### Variáveis de Ambiente

Crie um arquivo `.env` no diretório raiz e adicione as seguintes variáveis de ambiente:

```env
# Aplicação
PORT=3000

# Autenticação
JWT_SECRET=sua_chave_jwt_super_secreta

# Banco de Dados PostgreSQL
# Configure de acordo com seu ambiente de BD local ou remoto

# Cloudflare R2 (Armazenamento compatível com S3)
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=seu_access_key_id
R2_SECRET_ACCESS_KEY=seu_secret_access_key
R2_BUCKET=nome_do_seu_bucket
R2_PUBLIC_URL=https://pub-xxxxxxxxxxxxxx.r2.dev
```

### Configuração e Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/your-username/imaginary.git
   cd imaginary
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Migração do Banco de Dados:**
   Execute o script SQL localizado em `Migrations/DB_imaginary.sql` na sua instância do PostgreSQL para criar a tabela de `users` necessária.

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   O servidor será iniciado em `http://localhost:3000` (ou na porta especificada no seu arquivo `.env`).

### Endpoints da API

#### Autenticação (`/auth`)
- `POST /auth/register`: Registra um novo usuário (requer `username`, `email`, `password`).
- `POST /auth/login`: Autentica um usuário e recebe um JWT.

#### Imagens (`/images`)
*Nota: A maioria das rotas de imagem requer um cabeçalho `Authorization: Bearer <token>`.*

- `POST /images`: Faz o upload de uma imagem. Espera `multipart/form-data` com o campo `image`.
- `GET /images`: Retorna uma lista paginada de todas as imagens. Suporta parâmetros de consulta `?page=1&limit=10`.
- `GET /images/:id`: Recupera uma imagem através do seu ID ou nome do arquivo.
- `POST /images/:id/transform`: Aplica transformações a uma imagem existente. Espera o corpo em formato JSON:
  ```json
  {
    "transformations": {
      "resize": { "width": 300, "height": 300 },
      "rotate": 90,
      "format": "webp",
      "filters": { "grayscale": true }
    }
  }
  ```

### Collection do Postman
Uma coleção do Postman com as requisições predefinidas está disponível no diretório `postman/` para te ajudar a testar e interagir de forma mais fácil com a API.

### Licença

Este projeto está licenciado sob a licença ISC.

---

## 🇺🇸 English

Imaginary is a robust Node.js backend application built with Express and TypeScript. It provides secure authentication and a powerful set of APIs for uploading, retrieving, and transforming images using Cloudflare R2 (S3-compatible storage) and the Sharp image processing library.

### Features

- **User Authentication**: Secure registration and login using JWT (JSON Web Tokens) and bcrypt for password hashing.
- **Image Upload**: Upload images directly to Cloudflare R2 (or any S3-compatible storage) via multipart/form-data.
- **Image Transformation**: Manipulate images on-the-fly using the powerful `sharp` library. Supported transformations include:
  - Resize (width, height)
  - Crop (width, height, x, y coordinates)
  - Rotate (degrees)
  - Format Conversion (jpeg, png, webp)
  - Filters (grayscale, sepia)
- **Image Retrieval**: Fetch individual images directly or get a paginated list of all uploaded images.
- **PostgreSQL Database**: User data is securely stored in a PostgreSQL database.

### Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Storage**: Cloudflare R2 / AWS S3 SDK (`@aws-sdk/client-s3`)
- **Image Processing**: Sharp
- **Database**: PostgreSQL (`pg`)
- **Security**: JWT (`jsonwebtoken`), Bcrypt (`bcrypt`)
- **File Uploads**: Multer

### Prerequisites

Before running this project, ensure you have the following installed:
- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL (running locally or a remote connection string)
- Cloudflare R2 account (or AWS S3 credentials)

### Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
# Application
PORT=3000

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# PostgreSQL Database
# Configure these according to your local or remote DB setup

# Cloudflare R2 (S3 Compatible Storage)
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET=your_bucket_name
R2_PUBLIC_URL=https://pub-xxxxxxxxxxxxxx.r2.dev
```

### Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/imaginary.git
   cd imaginary
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Database Migration:**
   Run the SQL script located in `Migrations/DB_imaginary.sql` in your PostgreSQL instance to create the required `users` table.

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

### API Endpoints

#### Authentication (`/auth`)
- `POST /auth/register`: Register a new user (requires `username`, `email`, `password`).
- `POST /auth/login`: Authenticate a user and receive a JWT.

#### Images (`/images`)
*Note: Most image routes require an `Authorization: Bearer <token>` header.*

- `POST /images`: Upload an image. Expects `multipart/form-data` with an `image` field.
- `GET /images`: Get a paginated list of all images. Supports `?page=1&limit=10` query parameters.
- `GET /images/:id`: Retrieve an image by its ID or filename.
- `POST /images/:id/transform`: Apply transformations to an existing image. Expects a JSON body:
  ```json
  {
    "transformations": {
      "resize": { "width": 300, "height": 300 },
      "rotate": 90,
      "format": "webp",
      "filters": { "grayscale": true }
    }
  }
  ```

### Postman Collection
A Postman collection with predefined requests is available in the `postman/` directory to help you easily test and interact with the API.

### License

This project is licensed under the ISC License.
