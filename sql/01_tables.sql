-- Criação das tabelas principais

-- Tabela de configurações da igreja
CREATE TABLE church_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    logo TEXT,
    primary_color VARCHAR(7) DEFAULT '#1e3c72',
    secondary_color VARCHAR(7) DEFAULT '#2a5298',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_church_settings_updated_at
    BEFORE UPDATE ON church_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Tabela de usuários estendida
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança RLS (Row Level Security)
ALTER TABLE church_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Políticas para church_settings
CREATE POLICY "Permitir leitura pública das configurações da igreja"
    ON church_settings FOR SELECT
    USING (true);

CREATE POLICY "Permitir atualização apenas para administradores"
    ON church_settings FOR UPDATE
    USING (auth.role() = 'authenticated' AND EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
    ));

-- Políticas para users
CREATE POLICY "Permitir leitura de usuários para usuários autenticados"
    ON users FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir criação/atualização/deleção apenas para administradores"
    ON users FOR ALL
    USING (auth.role() = 'authenticated' AND EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
    ));

-- Índices para otimização
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);