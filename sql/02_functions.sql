-- Funções RPC para operações CRUD

-- Função para obter configurações da igreja
CREATE OR REPLACE FUNCTION get_church_settings()
RETURNS TABLE (id UUID, name VARCHAR, logo TEXT, primary_color VARCHAR, secondary_color VARCHAR)
SECURITY DEFINER
LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT cs.id, cs.name, cs.logo, cs.primary_color, cs.secondary_color
    FROM church_settings cs
    LIMIT 1;
END;
$$;

-- Função para atualizar configurações da igreja
CREATE OR REPLACE FUNCTION update_church_settings(
    p_name VARCHAR,
    p_logo TEXT,
    p_primary_color VARCHAR,
    p_secondary_color VARCHAR
)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql AS $$
DECLARE
    v_is_admin BOOLEAN;
BEGIN
    -- Verificar se o usuário é administrador
    SELECT EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role = 'admin'
    ) INTO v_is_admin;

    IF NOT v_is_admin THEN
        RAISE EXCEPTION 'Apenas administradores podem atualizar as configurações';
    END IF;

    -- Atualizar ou inserir configurações
    INSERT INTO church_settings (name, logo, primary_color, secondary_color)
    VALUES (p_name, p_logo, p_primary_color, p_secondary_color)
    ON CONFLICT (id) DO UPDATE
    SET name = p_name,
        logo = p_logo,
        primary_color = p_primary_color,
        secondary_color = p_secondary_color,
        updated_at = CURRENT_TIMESTAMP;

    RETURN TRUE;
END;
$$;

-- Função para criar novo usuário
CREATE OR REPLACE FUNCTION create_user(
    p_email VARCHAR,
    p_name VARCHAR,
    p_role VARCHAR DEFAULT 'user'
)
RETURNS UUID
SECURITY DEFINER
LANGUAGE plpgsql AS $$
DECLARE
    v_is_admin BOOLEAN;
    v_user_id UUID;
BEGIN
    -- Verificar se o usuário é administrador
    SELECT EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role = 'admin'
    ) INTO v_is_admin;

    IF NOT v_is_admin THEN
        RAISE EXCEPTION 'Apenas administradores podem criar usuários';
    END IF;

    -- Inserir novo usuário
    INSERT INTO users (email, name, role)
    VALUES (p_email, p_name, p_role)
    RETURNING id INTO v_user_id;

    RETURN v_user_id;
END;
$$;

-- Função para atualizar usuário
CREATE OR REPLACE FUNCTION update_user(
    p_user_id UUID,
    p_name VARCHAR,
    p_role VARCHAR
)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql AS $$
DECLARE
    v_is_admin BOOLEAN;
BEGIN
    -- Verificar se o usuário é administrador
    SELECT EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role = 'admin'
    ) INTO v_is_admin;

    IF NOT v_is_admin THEN
        RAISE EXCEPTION 'Apenas administradores podem atualizar usuários';
    END IF;

    -- Atualizar usuário
    UPDATE users
    SET name = p_name,
        role = p_role,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_user_id;

    RETURN FOUND;
END;
$$;

-- Função para deletar usuário
CREATE OR REPLACE FUNCTION delete_user(p_user_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql AS $$
DECLARE
    v_is_admin BOOLEAN;
BEGIN
    -- Verificar se o usuário é administrador
    SELECT EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role = 'admin'
    ) INTO v_is_admin;

    IF NOT v_is_admin THEN
        RAISE EXCEPTION 'Apenas administradores podem deletar usuários';
    END IF;

    -- Não permitir deletar o próprio usuário
    IF p_user_id = auth.uid() THEN
        RAISE EXCEPTION 'Não é permitido deletar o próprio usuário';
    END IF;

    -- Deletar usuário
    DELETE FROM users
    WHERE id = p_user_id;

    RETURN FOUND;
END;
$$;