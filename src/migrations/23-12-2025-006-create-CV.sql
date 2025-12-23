CREATE TABLE resumes (
    curriculoID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    localizacao VARCHAR(255),
    titulo VARCHAR(255) NOT NULL,
    resumoProfissional TEXT NOT NULL,
    habilidades JSON,
    softSkills JSON,
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
    INDEX idx_userID (userID),
    INDEX idx_dataAtualizacao (dataAtualizacao)
);