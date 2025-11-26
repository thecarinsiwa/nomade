-- ============================================================================
-- TABLES DJANGO MANQUANTES
-- Script pour créer les tables Django nécessaires au fonctionnement de l'API
-- Compatible avec la base de données nomade existante
-- ============================================================================

USE nomade;

-- ============================================================================
-- 1. CONTENT TYPES (django_content_type)
-- ============================================================================

CREATE TABLE IF NOT EXISTS django_content_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_label VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    UNIQUE KEY django_content_type_app_label_model_76bd3d3b_uniq (app_label, model),
    INDEX django_content_type_app_label_76bd3d3b (app_label)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. AUTHENTICATION & AUTHORIZATION (django.contrib.auth)
-- ============================================================================

-- Table: auth_permission
CREATE TABLE IF NOT EXISTS auth_permission (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    content_type_id INT NOT NULL,
    codename VARCHAR(100) NOT NULL,
    FOREIGN KEY (content_type_id) REFERENCES django_content_type(id) ON DELETE CASCADE,
    UNIQUE KEY auth_permission_content_type_id_codename_01ab375a_uniq (content_type_id, codename),
    INDEX auth_permission_content_type_id_2f476e4b (content_type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: auth_group
CREATE TABLE IF NOT EXISTS auth_group (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: auth_group_permissions
CREATE TABLE IF NOT EXISTS auth_group_permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    permission_id INT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES auth_group(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES auth_permission(id) ON DELETE CASCADE,
    UNIQUE KEY auth_group_permissions_group_id_permission_id_0cd325b0_uniq (group_id, permission_id),
    INDEX auth_group_permissions_group_id_b120cbf9 (group_id),
    INDEX auth_group_permissions_permission_id_84c5c92e (permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Note: auth_user n'est pas créé car nous utilisons notre modèle User personnalisé

-- ============================================================================
-- 3. SESSIONS (django.contrib.sessions)
-- ============================================================================

CREATE TABLE IF NOT EXISTS django_session (
    session_key VARCHAR(40) PRIMARY KEY,
    session_data LONGTEXT NOT NULL,
    expire_date DATETIME(6) NOT NULL,
    INDEX django_session_expire_date_a5c62663 (expire_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 4. ADMIN (django.contrib.admin)
-- ============================================================================

CREATE TABLE IF NOT EXISTS django_admin_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action_time DATETIME(6) NOT NULL,
    object_id LONGTEXT,
    object_repr VARCHAR(200) NOT NULL,
    action_flag SMALLINT UNSIGNED NOT NULL CHECK (action_flag >= 0),
    change_message LONGTEXT NOT NULL,
    content_type_id INT,
    user_id CHAR(36) NOT NULL,
    FOREIGN KEY (content_type_id) REFERENCES django_content_type(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX django_admin_log_content_type_id_c4bce8eb (content_type_id),
    INDEX django_admin_log_user_id_c564eba6 (user_id),
    INDEX django_admin_log_action_time_2b8e5c4a (action_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5. AUTH TOKEN (rest_framework.authtoken)
-- ============================================================================

CREATE TABLE IF NOT EXISTS authtoken_token (
    key VARCHAR(40) PRIMARY KEY,
    created DATETIME(6) NOT NULL,
    user_id CHAR(36) NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX authtoken_token_user_id_35299abb (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 6. MIGRATIONS (django_migrations)
-- ============================================================================

CREATE TABLE IF NOT EXISTS django_migrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    app VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    applied DATETIME(6) NOT NULL,
    UNIQUE KEY django_migrations_app_name_975e4e8f_uniq (app, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================

