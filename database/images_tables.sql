-- ============================================================================
-- TABLES D'IMAGES POUR L'APERÇU CLIENT
-- Base de Données NOMADE
-- ============================================================================
-- Description: Tables pour gérer toutes les images nécessaires à une bonne
--              expérience client (galeries, photos, bannières, etc.)
-- Date: 2025
-- ============================================================================

USE nomade;

-- ============================================================================
--zzzzzzz 1. IMAGES DES CHAMBRES (ROOM IMAGES)
-- ============================================================================
-- Permet d'afficher des photos détaillées de chaque chambre

CREATE TABLE IF NOT EXISTS room_images (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    room_id CHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('main', 'gallery', 'bathroom', 'bedroom', 'view', 'amenity', 'other') DEFAULT 'gallery',
    display_order INT DEFAULT 0,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    width INT,
    height INT,
    file_size INT COMMENT 'Taille en bytes',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    INDEX idx_room_id (room_id),
    INDEX idx_image_type (image_type),
    INDEX idx_display_order (display_order),
    INDEX idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. IMAGES DES DESTINATIONS (DESTINATION IMAGES)
-- ============================================================================
-- Galeries de photos pour les destinations touristiques

CREATE TABLE IF NOT EXISTS destination_images (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    destination_id CHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('main', 'gallery', 'landmark', 'culture', 'nature', 'food', 'other') DEFAULT 'gallery',
    display_order INT DEFAULT 0,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    caption VARCHAR(500) COMMENT 'Légende de l\'image',
    photographer VARCHAR(255) COMMENT 'Crédit photo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
    INDEX idx_destination_id (destination_id),
    INDEX idx_image_type (image_type),
    INDEX idx_display_order (display_order),
    INDEX idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. IMAGES DES ACTIVITÉS (ACTIVITY IMAGES)
-- ============================================================================
-- Photos des activités et expériences proposées

CREATE TABLE IF NOT EXISTS activity_images (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    activity_id CHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('main', 'gallery', 'experience', 'location', 'participants', 'other') DEFAULT 'gallery',
    display_order INT DEFAULT 0,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    caption VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    INDEX idx_activity_id (activity_id),
    INDEX idx_image_type (image_type),
    INDEX idx_display_order (display_order),
    INDEX idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
--zzzzzz 4. IMAGES DES COMPAGNIES AÉRIENNES (AIRLINE IMAGES)
-- ============================================================================
-- Logos et images des compagnies aériennes

CREATE TABLE IF NOT EXISTS airline_images (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    airline_id CHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('logo', 'aircraft', 'cabin', 'service', 'other') DEFAULT 'logo',
    display_order INT DEFAULT 0,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (airline_id) REFERENCES airlines(id) ON DELETE CASCADE,
    INDEX idx_airline_id (airline_id),
    INDEX idx_image_type (image_type),
    INDEX idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5. IMAGES DES VOLS (FLIGHT IMAGES)
-- ============================================================================
-- Photos des avions, cabines, services pour les vols spécifiques

CREATE TABLE IF NOT EXISTS flight_images (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    flight_id CHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('aircraft', 'cabin_economy', 'cabin_business', 'cabin_first', 'meal', 'service', 'other') DEFAULT 'aircraft',
    display_order INT DEFAULT 0,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE,
    INDEX idx_flight_id (flight_id),
    INDEX idx_image_type (image_type),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 6. IMAGES DES VOITURES DE LOCATION (CAR IMAGES)
-- ============================================================================
-- Photos des véhicules disponibles à la location

CREATE TABLE IF NOT EXISTS car_images (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    car_id CHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('main', 'exterior', 'interior', 'dashboard', 'trunk', 'engine', 'other') DEFAULT 'main',
    display_order INT DEFAULT 0,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    angle VARCHAR(50) COMMENT 'Angle de la photo (front, side, back, etc.)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    INDEX idx_car_id (car_id),
    INDEX idx_image_type (image_type),
    INDEX idx_display_order (display_order),
    INDEX idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 7. IMAGES DES CROISIÈRES (CRUISE IMAGES)
-- ============================================================================
-- Photos des navires de croisière

CREATE TABLE IF NOT EXISTS cruise_ship_images (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    cruise_ship_id CHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('main', 'exterior', 'deck', 'pool', 'restaurant', 'cabin', 'entertainment', 'spa', 'other') DEFAULT 'main',
    display_order INT DEFAULT 0,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    caption VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cruise_ship_id) REFERENCES cruise_ships(id) ON DELETE CASCADE,
    INDEX idx_cruise_ship_id (cruise_ship_id),
    INDEX idx_image_type (image_type),
    INDEX idx_display_order (display_order),
    INDEX idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 8. IMAGES DES CABINES DE CROISIÈRE (CRUISE CABIN IMAGES)
-- ============================================================================
-- Photos détaillées des différents types de cabines

CREATE TABLE IF NOT EXISTS cruise_cabin_images (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    cruise_cabin_id CHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('main', 'interior', 'bathroom', 'balcony', 'view', 'amenity', 'other') DEFAULT 'main',
    display_order INT DEFAULT 0,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cruise_cabin_id) REFERENCES cruise_cabins(id) ON DELETE CASCADE,
    INDEX idx_cruise_cabin_id (cruise_cabin_id),
    INDEX idx_image_type (image_type),
    INDEX idx_display_order (display_order),
    INDEX idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 9. IMAGES DES CROISIÈRES (CRUISE IMAGES)
-- ============================================================================
-- Photos générales des croisières (itinéraires, destinations, etc.)

CREATE TABLE IF NOT EXISTS cruise_images (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    cruise_id CHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('main', 'itinerary', 'destination', 'excursion', 'other') DEFAULT 'main',
    display_order INT DEFAULT 0,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    caption VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cruise_id) REFERENCES cruises(id) ON DELETE CASCADE,
    INDEX idx_cruise_id (cruise_id),
    INDEX idx_image_type (image_type),
    INDEX idx_display_order (display_order),
    INDEX idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 10. IMAGES DES UTILISATEURS (USER IMAGES)
-- ============================================================================
-- Avatars et photos de profil des utilisateurs

CREATE TABLE IF NOT EXISTS user_images (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('avatar', 'profile', 'verification', 'other') DEFAULT 'avatar',
    display_order INT DEFAULT 0,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE COMMENT 'Photo vérifiée par l\'administration',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_image_type (image_type),
    INDEX idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 11. IMAGES DES PROMOTIONS (PROMOTION IMAGES)
-- ============================================================================
-- Bannières et images promotionnelles

CREATE TABLE IF NOT EXISTS promotion_images (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    promotion_id CHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('banner', 'thumbnail', 'hero', 'mobile', 'desktop', 'other') DEFAULT 'banner',
    display_order INT DEFAULT 0,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    target_url VARCHAR(500) COMMENT 'URL de redirection au clic',
    start_date DATE COMMENT 'Date de début d\'affichage',
    end_date DATE COMMENT 'Date de fin d\'affichage',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE,
    INDEX idx_promotion_id (promotion_id),
    INDEX idx_image_type (image_type),
    INDEX idx_display_order (display_order),
    INDEX idx_is_primary (is_primary),
    INDEX idx_is_active (is_active),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 12. IMAGES DES PACKAGES (PACKAGE IMAGES)
-- ============================================================================
-- Photos des forfaits et packages proposés

CREATE TABLE IF NOT EXISTS package_images (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    package_id CHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('main', 'gallery', 'itinerary', 'included', 'other') DEFAULT 'main',
    display_order INT DEFAULT 0,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    caption VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    INDEX idx_package_id (package_id),
    INDEX idx_image_type (image_type),
    INDEX idx_display_order (display_order),
    INDEX idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
--zzzz 13. IMAGES DES AÉROPORTS (AIRPORT IMAGES)
-- ============================================================================
-- Photos des aéroports pour l'aperçu des destinations

CREATE TABLE IF NOT EXISTS airport_images (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    airport_id CHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('main', 'terminal', 'gate', 'lounge', 'facility', 'other') DEFAULT 'main',
    display_order INT DEFAULT 0,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (airport_id) REFERENCES airports(id) ON DELETE CASCADE,
    INDEX idx_airport_id (airport_id),
    INDEX idx_image_type (image_type),
    INDEX idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 14. IMAGES GÉNÉRIQUES (GENERIC IMAGES)
-- ============================================================================
-- Table pour les images génériques utilisées dans l'application
-- (logos, icônes, images de fond, etc.)

CREATE TABLE IF NOT EXISTS generic_images (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('logo', 'icon', 'background', 'placeholder', 'banner', 'other') NOT NULL,
    category VARCHAR(100) COMMENT 'Catégorie de l\'image (header, footer, etc.)',
    display_name VARCHAR(255) COMMENT 'Nom d\'affichage',
    alt_text VARCHAR(255),
    target_url VARCHAR(500) COMMENT 'URL de redirection si applicable',
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_image_type (image_type),
    INDEX idx_category (category),
    INDEX idx_is_active (is_active),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 15. MÉTADONNÉES DES IMAGES (IMAGE METADATA)
-- ============================================================================
-- Table pour stocker les métadonnées techniques des images
-- (dimensions, format, taille, etc.)

CREATE TABLE IF NOT EXISTS image_metadata (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    image_url VARCHAR(500) NOT NULL UNIQUE COMMENT 'URL de l\'image',
    entity_type VARCHAR(50) NOT NULL COMMENT 'Type d\'entité (property, room, etc.)',
    entity_id CHAR(36) COMMENT 'ID de l\'entité associée',
    width INT,
    height INT,
    file_size INT COMMENT 'Taille en bytes',
    mime_type VARCHAR(100) COMMENT 'Type MIME (image/jpeg, image/png, etc.)',
    format VARCHAR(10) COMMENT 'Format (JPEG, PNG, WEBP, etc.)',
    color_space VARCHAR(20) COMMENT 'Espace colorimétrique (RGB, CMYK, etc.)',
    has_thumbnail BOOLEAN DEFAULT FALSE,
    thumbnail_url VARCHAR(500) COMMENT 'URL de la miniature',
    is_optimized BOOLEAN DEFAULT FALSE,
    optimization_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_image_url (image_url),
    INDEX idx_format (format)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- NOTES IMPORTANTES
-- ============================================================================
-- 
-- 1. Toutes les tables utilisent UUID (CHAR(36)) comme identifiant principal
-- 2. Les images sont stockées via URL (pas de stockage BLOB dans la BDD)
-- 3. Chaque table a un champ 'is_primary' pour identifier l'image principale
-- 4. Le champ 'display_order' permet de contrôler l'ordre d'affichage
-- 5. Les clés étrangères utilisent ON DELETE CASCADE pour la cohérence
-- 6. Des index sont créés sur les colonnes fréquemment utilisées pour les recherches
-- 7. Les types d'images sont définis via ENUM pour garantir la cohérence
-- 
-- ============================================================================
-- UTILISATION RECOMMANDÉE
-- ============================================================================
-- 
-- Pour une bonne expérience client, il est recommandé d'avoir :
-- - Au moins 1 image principale (is_primary = TRUE) par entité
-- - 3-5 images de galerie pour les propriétés
-- - 2-3 images pour les chambres
-- - 1 logo pour chaque compagnie aérienne
-- - Des bannières promotionnelles de qualité
-- 
-- ============================================================================

