CREATE TABLE certificates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    curriculoID BIGINT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    instituicao VARCHAR(255) NOT NULL,
    dataEmissao DATE,
    dataValidade DATE,
    linkCredencial VARCHAR(500),
    FOREIGN KEY (curriculoID) REFERENCES curriculos(curriculoID) ON DELETE CASCADE,
    INDEX idx_curriculoID (curriculoID)
);