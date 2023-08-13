CREATE DATABASE IF NOT EXISTS db_server;

USE db_server;

CREATE TABLE IF NOT EXISTS society (
    id INT AUTO_INCREMENT PRIMARY KEY,
    siren VARCHAR(20) NOT NULL,
    nom_complet VARCHAR(100) NOT NULL,
    nom_raison_sociale VARCHAR(100) NOT NULL,
    sigle VARCHAR(100),
    adresse VARCHAR(100) NOT NULL,
    code_postal VARCHAR(100) NOT NULL,
    coordonnees VARCHAR(100),
    departement VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
