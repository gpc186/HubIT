CREATE TABLE educations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    curriculoID INT NOT NULL,
    curso VARCHAR(255) NOT NULL,
    instituicao VARCHAR(255) NOT NULL,
    dataInicio YEAR,
    dataFim YEAR,
    status ENUM('concluido', 'cursando', 'incompleto', 'trancado') DEFAULT 'cursando',
    FOREIGN KEY (curriculoID) REFERENCES curriculos(curriculoID) ON DELETE CASCADE,
    INDEX idx_curriculoID (curriculoID)
);