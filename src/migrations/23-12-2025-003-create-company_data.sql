CREATE TABLE company_data (
    company_dataID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT UNIQUE NOT NULL,
    nomeEmpresa VARCHAR(255),
    cnpj VARCHAR(14) UNIQUE,
    telefone VARCHAR(20),
    localizacao VARCHAR(255),
    setor VARCHAR(100),
    numeroFuncionarios ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'),
    site VARCHAR(500),
    linkedin VARCHAR(500),
    descricao TEXT,
    logoEmpresa VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
    INDEX idx_setor (setor),
    INDEX idx_localizacao (localizacao)
);