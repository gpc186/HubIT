CREATE TABLE educations (
    educationsID INT AUTO_INCREMENT PRIMARY KEY,
    curriculoID INT NOT NULL,
    curso VARCHAR(255) NOT NULL,
    instituicao VARCHAR(255) NOT NULL,
    dataInicio YEAR,
    dataFim YEAR,
    status ENUM('concluido', 'cursando', 'incompleto', 'trancado') DEFAULT 'cursando',
    FOREIGN KEY (curriculoID) REFERENCES resumes(curriculoID) ON DELETE CASCADE,
    INDEX idx_curriculoID (curriculoID)
);