CREATE TABLE experiences (
    experiencesID INT AUTO_INCREMENT PRIMARY KEY,
    curriculoID INT NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    empresa VARCHAR(255) NOT NULL,
    dataInicio DATE NOT NULL,
    dataFim DATE,
    atual BOOLEAN DEFAULT FALSE,
    descricao TEXT,
    FOREIGN KEY (curriculoID) REFERENCES resumes(curriculoID) ON DELETE CASCADE,
    INDEX idx_curriculoID (curriculoID)
);