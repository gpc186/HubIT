CREATE TABLE languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    curriculoID INT NOT NULL,
    idioma VARCHAR(100) NOT NULL,
    nivel ENUM('Básico', 'Intermediário', 'Avançado', 'Fluente', 'Nativo') NOT NULL,
    FOREIGN KEY (curriculoID) REFERENCES curriculos(curriculoID) ON DELETE CASCADE,
    INDEX idx_curriculoID (curriculoID)
);