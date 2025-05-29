-- Tabela de apartamentos
CREATE TABLE apartments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    max_guests INTEGER NOT NULL CHECK (max_guests > 0),
    daily_rate NUMERIC(10,2) NOT NULL CHECK (daily_rate >= 0)
);

-- Tabela de contatos
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('individual','company')),
    document VARCHAR(20) NOT NULL UNIQUE
);

-- Tabela de reservas
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    apartment_id INTEGER NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL,
    checkout_date DATE NOT NULL,
    guests INTEGER NOT NULL CHECK (guests > 0),
    total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('airbnb', 'booking.com', 'direto')),
    CONSTRAINT chk_dates CHECK (checkout_date > checkin_date)
);

-- Tabela de login
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
);
