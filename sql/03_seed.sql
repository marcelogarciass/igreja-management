-- Dados iniciais para o banco de dados

-- Inserir configurações padrão da igreja
INSERT INTO church_settings (name, primary_color, secondary_color)
VALUES ('Igreja Management', '#1e3c72', '#2a5298')
ON CONFLICT (id) DO NOTHING;

-- Inserir usuário administrador padrão
INSERT INTO users (email, name, role)
VALUES ('admin@igreja.com', 'Administrador', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Função para verificar e criar usuário admin inicial
CREATE OR REPLACE FUNCTION ensure_admin_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_count integer;
    v_auth_id uuid;
BEGIN
    -- Verificar se o usuário está autenticado
    IF auth.role() != 'authenticated' THEN
        RAISE EXCEPTION 'Usuário não está autenticado';
    END IF;

    -- Obter o ID do usuário autenticado
    v_auth_id := auth.uid();
    
    -- Verificar se já existe algum admin
    SELECT COUNT(*) INTO v_count FROM users WHERE role = 'admin';
    
    IF v_count = 0 THEN
        -- Criar usuário admin apenas se não existir nenhum e o usuário atual não for admin
        IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_auth_id AND role = 'admin') THEN
            INSERT INTO users (id, email, name, role)
            VALUES (v_auth_id, 'admin@igreja.com', 'Administrador', 'admin')
            ON CONFLICT (id) DO UPDATE
            SET email = EXCLUDED.email,
                name = EXCLUDED.name,
                role = EXCLUDED.role;
        END IF;
    END IF;
END;
$$;