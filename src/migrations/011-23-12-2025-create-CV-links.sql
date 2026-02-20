CREATE TABLE resumes_links (
    resumes_linksID INT AUTO_INCREMENT PRIMARY KEY,
    curriculoID INT UNIQUE NOT NULL,
    linkedin VARCHAR(500),
    github VARCHAR(500),
    portfolio VARCHAR(500),
    outros JSON,
    FOREIGN KEY (curriculoID) REFERENCES resumes(curriculoID) ON DELETE CASCADE
);