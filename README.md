
# Teste Booksantos / Booksite

## Teste Técnico - Estágio Full Stack (Locação por Temporada)

Este projeto implementa uma aplicação de **gestão de reservas** para uma plataforma de **locação por temporada**, conforme especificações do teste técnico da BookSantos.

---

## Requisitos Atendidos

### 1. Banco de Dados

Foram criadas 3 tabelas principais, conforme solicitado:

- `apartments` — id, title, city, state, max_guests, daily_rate
- `contacts` — id, name, email, phone, type, document
- `reservations` — id, apartment_id, contact_id, checkin_date, checkout_date, guests, total_price, channel

O banco é relacional e pode ser facilmente adaptado para PostgreSQL, SQLite ou MySQL.

### 2. Backend

A API foi construída em **Python + Flask**, atendendo aos seguintes endpoints:

- `GET /reservas` — Lista todas as reservas com dados de apartamento e contato.
- `POST /reservas` — Cria uma nova reserva.
- `POST /filtro` — Filtra reservas por cidade e intervalo de datas.
- `GET /dashboard` — Retorna total de reservas e faturamento por canal no último mês.

### Extras(opcional)

- `GET /` — Retorna uma mensagem simples de boas-vindas da API.
- `POST /cadastro` — Cria um novo cadastro de contato e login com hash de senha.
- `GET /login` — Realiza login via query string, valida email e senha.

 O script `Backend/seed.py` pode ser usado para popular o banco com dados de teste.

### 3. Frontend

A interface web foi construída com **React**, incluindo:

- Página de login e autenticação simples.
- Tela de **lista de reservas**, com filtros por cidade e período.
- Tela de **criação de nova reserva**.
- **Dashboard** com as métricas solicitadas:
    - Total de reservas no mês
    - Faturamento por canal
    - Lista de cidades com mais reservas

### Extras(opcional)

- Login funcional com autenticação básica (Login.js)
- Estrutura modular com componentes React reutilizáveis
- Validação dos relacionamentos via ORM (SQLAlchemy)

---

##  Como rodar localmente

### Pré-requisitos

- Python 3.13+
- Node.js e npm 20+
- Banco de dados relacional usado PostgreSQL

### Passo 1: Clonar o projeto

```bash
git clone https://github.com/darrrlan/Teste-Booksantos-Booksite.git
cd Teste-Booksantos-Booksite-main
```

### Passo 2: Banco de Dados

- Crie o banco e execute:

Acesse o terminal do PostgreSQL:
```bash
psql -U postgres
```
Crie o banco:
```bash
CREATE DATABASE gestao_reservas;
```
Conecte-se ao banco:
```bash
\c gestao_reservas
```
Rode o script SQL para criar as tabelas:
```bash
\i /caminho/para/o/arquivo/table_booksite.sql
```
- Atualize as configurações do banco em `Backend/app.py`
```bash
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://<usuário>:<senha>@localhost:5432/gestao_reservas"
```
- (Opcional) Rode `Backend/seed.py` para popular com dados iniciais

### Passo 3: Backend (Flask)

```bash
cd Backend
pip install -r requirements.txt
python app.py
```

### Passo 4: Frontend (React)

```bash
cd frontend
npm install
npm start
```

Acesse a aplicação em `http://localhost:3000`

---

### Passo 5: Acesso à aplicação
Para acessar a Dashboard, é necessário realizar login com as seguintes credenciais padrão:

```bash
Email: admin
Senha: admin
```

## Tecnologias Usadas

### Backend

- Python + Flask
- SQLAlchemy
- SQLite / PostgreSQL
- Flask-CORS

### Frontend

- React
- JavaScript (ES6)
- Axios
- CSS

---

## Decisões de Arquitetura

- Separação clara entre `frontend` e `Backend`
- API REST para comunicação entre frontend e backend
- SQLAlchemy como ORM para facilitar manutenções
- Dados de exemplo incluídos via script `seed.py`
- Frontend estruturado por componentes (`src/components/`)

---
