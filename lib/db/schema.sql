-- Esquema do HubIT.
-- Campos que antes eram objetos/arrays dentro do JSON continuam guardados como
-- JSON em colunas TEXT: o formato exposto pela API não muda em nada.

CREATE TABLE IF NOT EXISTS users (
	userID     INTEGER PRIMARY KEY,
	email      TEXT NOT NULL UNIQUE,
	passwd     TEXT NOT NULL,
	tipoConta  TEXT NOT NULL,
	dados      TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS empregos (
	empregoID       INTEGER PRIMARY KEY,
	-- empresaID fica como TEXT porque a API sempre devolveu o valor cru do
	-- header 'user-id' (string); mudar o tipo quebraria comparações no front.
	empresaID       TEXT NOT NULL,
	empresaNome     TEXT,
	imgEmpresa      TEXT,
	qtdFuncionario  INTEGER,
	titulo          TEXT NOT NULL,
	descricao       TEXT NOT NULL,
	area            TEXT NOT NULL,
	nivel           TEXT,
	tipoContrato    TEXT,
	tipoTrabalho    TEXT,
	cargaHoraria    TEXT,
	mediaSalario    REAL,
	localizacao     TEXT,
	requisitos      TEXT,
	diferenciais    TEXT,
	beneficios      TEXT,
	corDestaque     TEXT,
	dataCriacao     TEXT,
	candidatos      INTEGER NOT NULL DEFAULT 0,
	status          TEXT NOT NULL DEFAULT 'ativo'
);

CREATE TABLE IF NOT EXISTS portfolios (
	portfolioID  INTEGER PRIMARY KEY,
	userID       INTEGER NOT NULL,
	usuarioNome  TEXT,
	titulo       TEXT NOT NULL,
	descricao    TEXT NOT NULL,
	tecnologias  TEXT,
	categoria    TEXT,
	linkGithub   TEXT,
	linkDemo     TEXT,
	linkOutros   TEXT,
	dataCriacao  TEXT,
	curtidas     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS curriculos (
	curriculoID        INTEGER PRIMARY KEY,
	userID             INTEGER NOT NULL,
	nome               TEXT,
	email              TEXT,
	telefone           TEXT,
	localizacao        TEXT,
	titulo             TEXT NOT NULL,
	resumoProfissional TEXT NOT NULL,
	habilidades        TEXT,
	experiencias       TEXT,
	educacao           TEXT,
	softSkills         TEXT,
	certificados       TEXT,
	idiomas            TEXT,
	links              TEXT,
	dataCriacao        TEXT,
	dataAtualizacao    TEXT
);

CREATE TABLE IF NOT EXISTS candidaturas (
	candidaturaID    INTEGER PRIMARY KEY,
	empregoID        INTEGER NOT NULL,
	userID           INTEGER NOT NULL,
	curriculoID      INTEGER NOT NULL,
	candidato        TEXT,
	vaga             TEXT,
	dataCandidatura  TEXT,
	status           TEXT NOT NULL DEFAULT 'pendente'
);

CREATE INDEX IF NOT EXISTS idx_empregos_empresa      ON empregos (empresaID);
CREATE INDEX IF NOT EXISTS idx_portfolios_user       ON portfolios (userID);
CREATE INDEX IF NOT EXISTS idx_curriculos_user       ON curriculos (userID);
CREATE INDEX IF NOT EXISTS idx_candidaturas_user     ON candidaturas (userID);
CREATE INDEX IF NOT EXISTS idx_candidaturas_emprego  ON candidaturas (empregoID);
