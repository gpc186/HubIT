ALTER TABLE jobs
MODIFY status ENUM('ativa', 'pausada', 'encerrada')
DEFAULT 'ativa';