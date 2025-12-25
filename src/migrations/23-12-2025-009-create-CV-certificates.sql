CREATE TABLE certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    curriculoID INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    instituicao VARCHAR(255) NOT NULL,
    dataEmissao DATE,
    dataValidade DATE,
    linkCredencial VARCHAR(500),
    FOREIGN KEY (curriculoID) REFERENCES resumes(curriculoID) ON DELETE CASCADE,
    INDEX idx_curriculoID (curriculoID)
);