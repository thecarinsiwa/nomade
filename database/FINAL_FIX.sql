-- ============================================================================
-- CORRECTION FINALE - auth_permission
-- Ce script doit être exécuté AVANT les migrations Django
-- ============================================================================

USE nomade;

-- Désactiver temporairement les vérifications
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = '';

-- Supprimer la table si elle existe (pour repartir à zéro)
DROP TABLE IF EXISTS auth_group_permissions;
DROP TABLE IF EXISTS auth_permission;

-- Recréer auth_permission avec la bonne structure
CREATE TABLE auth_permission (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL DEFAULT '',
    content_type_id INT NOT NULL,
    codename VARCHAR(100) NOT NULL,
    FOREIGN KEY (content_type_id) REFERENCES django_content_type(id) ON DELETE CASCADE,
    UNIQUE KEY auth_permission_content_type_id_codename_01ab375a_uniq (content_type_id, codename),
    INDEX auth_permission_content_type_id_2f476e4b (content_type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Recréer auth_group_permissions
CREATE TABLE auth_group_permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    permission_id INT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES auth_group(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES auth_permission(id) ON DELETE CASCADE,
    UNIQUE KEY auth_group_permissions_group_id_permission_id_0cd325b0_uniq (group_id, permission_id),
    INDEX auth_group_permissions_group_id_b120cbf9 (group_id),
    INDEX auth_group_permissions_permission_id_84c5c92e (permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Réactiver les vérifications
SET FOREIGN_KEY_CHECKS = 1;
SET SQL_MODE = 'STRICT_TRANS_TABLES';

-- Vérification
DESCRIBE auth_permission;

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================

