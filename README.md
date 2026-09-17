# Visão geral do projeto

**Nome do sistema**: Plataforma de empregos e portfólio para a área de TI

**Objetivo**: Criar um ambiente empregativo com o foco na área de TI, facilitando o contato do empregador com o possivel candidato

**Problema que resolve**: Procura por diversas plataformas sobre empregos e estágios em TI, também é focado para empregos PJ, não só CLT

**Proposta de valor**: A nossa plataforma visa ser diferente das outras plataformas de empregos, sendo focada em empregos de TI, mas não só isso, uma plataforma que agrega um feed de portfólios, empregos tanto de estágio, CLT ou como PJ, focando mais no emprego em si do que em burocracias. Além disso, o sistema será integrado com outras plataformas na área de TI, assim, facilitando a criação de currículos para usuários, e também para mais fácil visualização das habilidades de um candidato

**Público-alvo**: Estudantes da área de TI, empresas interessadas em candidatos na área, e também profissionais da área em busca de outras oportunidades

**Lucrabilidade**: Sistema de contas premium, onde mais informações são mostradas na sessão do usuário, como que empresas visualizaram o seu perfil. E para as empresas, serão colocadas "taxas" sobre as vagas de emprego que o candidato foi contratado veio pela nossa plataforma.

Funcionalidade básica:
- Poder fazer um currículo com forms para o usuário
- Acesso a vagas de empregos colocadas pelas empresas
- Página com portfólios
- Conta premium com vantagens para candidatos
## Requisitos do sistema

### Requisitos funcionais

- O sistema deve permitir o cadastro de currículos de usuários
- O sistema deve permitir o cadastro de vagas com parâmetros específicos
- O sistema deve permitir o cadastro de empresas
- O sistema deve permitir os usuários postarem seus portifólios
- O sistema deve mostrar vagas de empregos para o usuário
- O sistema deve mostrar os portifólios para as empresas e usuários
### Requisitos não funcionais

- O sistema deve ser fácil de se utilizar e poder ser controlado pelo "tab"
- O sistema deve ser compativel com todos os browsers chromium e também non-chromium
- O sistema deve impedir usuários comuns de terem acesso. ou criarem contas de empresa
- O sistema não pode demorar mais de 5 segundos para carregar as páginas
### Regras de negócio

- O usuário não pode ter acesso ao login da empresa e vice-versa
- O sistema deve mostrar vagas de emprego apenas para usuários
- Toda vaga de emprego deve ter informações vitais como espectativa de salário, qual área é a vaga, quais requisitos são necessários, etc..
- Os usuários também deverão preencher campos obrigatórios dentro do currículo, como meio de contato, idade, etc...
- O sistema deve mostrar mais vagas de estágio para os usuários estudantes
## Design

### Telas

- Pagina de login
- Pagina sobre nós
- Pagina de contato
- Pagina de usuário (Currículo)
- Feed de portfólios (usuário e empresa)
- Feed de empregos (usuários)
- Pagina da empresa (Postar empregos)
- Pagina dashboard (usuário home)
### Palheta de cores

Cor primaria:#2f6d88 (Azul)
Cor secundária:#f8f7f2 (Offwhite)
Cor terciária:#000000 (Preto)
## Programação

| Atividade        | Responsável       | Prazo    |
| ---------------- | ----------------- | -------- |
| Documentação     | Gustavo Cagega    | 1 semana |
| Protótipo design | Henrique Berdoldi e Fernando Sanches | 1 semana |
### Ferramentas

- [Canva](https://www.canva.com/design/DAG0kGld3IU/sPwNyhWepc-rpi5JbhvEXQ/edit?utm_content=DAG0kGld3IU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
- [Figma](https://www.figma.com/site/IdbyzYJKUWhjjsXexnTA9Q/Sem-t%C3%ADtulo?node-id=0-1&t=JrBRalb5UlEjX8GJ-1)
- [ClickUp](https://app.clickup.com/90131499698/v/s/901310955873)
- [Github](https://github.com/gpc186/HubIT)

---

## Stack e estrutura

O projeto roda em **Next.js 16 (App Router)** com React 19 e componentes em `.jsx`.
Os dados ficam em **SQLite** (`data/hubit.db`), acessado pelo módulo nativo
`node:sqlite` — sem dependência de banco para instalar.

### Como rodar

```bash
npm install
npm run db:seed   # cria data/hubit.db a partir dos arquivos data/*.json
npm run dev       # http://localhost:3000
```

`npm run db:seed` pode ser rodado de novo a qualquer momento para voltar o banco
ao estado inicial — ele recria as tabelas a partir dos JSON.

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm start` | Build e servidor de produção |
| `npm run db:seed` | Popula/reinicia o SQLite a partir de `data/*.json` |
| `npm run test:navegador` | Teste de fumaça das páginas num Edge/Chrome headless |

### Organização

```
app/
  layout.jsx            <head> comum a todas as páginas
  page.jsx              landing + login   (era public/login.html)
  home/page.jsx         feed de vagas     (era public/principal.html)
  portfolio/page.jsx    feed de portfólios
  perfil/[id]/page.jsx  página de perfil
  contato/page.jsx      contato
  not-found.jsx         404
  api/…/route.js        a API (era middlewares/*.js no Express)
components/
  ScriptsLegados.jsx    carrega os scripts de /public/assets/js
lib/
  db/                   conexão, esquema e acesso ao SQLite
  api.js                ajudantes dos route handlers
  legado.js             ponte para os handlers onclick do HTML antigo
public/assets/          css, imagens e js exatamente como antes
scripts/                seed, conversor de HTML e teste de navegador
```

### Sobre o código legado

As páginas foram convertidas de HTML para JSX mantendo a marcação igual: os
mesmos arquivos `.css` e os mesmos scripts de `public/assets/js` continuam
valendo, e nenhum deles precisou ser reescrito.

Dois pontos merecem atenção na hora de mexer nessas páginas:

- **`components/ScriptsLegados.jsx`** carrega os scripts antigos em ordem e
  redispara `DOMContentLoaded` e `load` depois — os handlers de `window.onload`
  nunca rodariam sozinhos, porque esses eventos já passaram quando o React monta
  a página.
- **`lib/legado.js`** avalia as expressões que eram atributos `onclick` no HTML,
  chamando as funções globais definidas nos scripts de `public/assets/js`.

Quando uma página for reescrita em React de verdade, o caminho é trocar o script
correspondente por estado e efeitos e tirar a página da ponte.
