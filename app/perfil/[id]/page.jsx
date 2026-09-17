'use client';

// Gerado a partir de public/pagina-de-perfil.html por scripts/html-para-jsx.mjs.
// A marcação é a mesma do HTML original; o comportamento continua vindo
// dos scripts em /public/assets/js, carregados abaixo.

import ScriptsLegados from '@/components/ScriptsLegados';
import { legado } from '@/lib/legado';

export default function PerfilPage() {
	return (
		<>
			<link rel="stylesheet" href="/assets/styles/pg-perfil.css" />
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossOrigin="anonymous" />
			<header>
				<nav className="navbar navbar-expand-lg">
					<div className="container-fluid">
						<a href="/" target="_self">
							<div className="logo">
								<img id="logo-animation" src="/../assets/img/svg/Hubit_svg_logo.svg" alt="" />
							</div>
						</a>
						<div className="navbar-search">
							{/* Botão do offcanvas (menu mobile) */}
							<button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
							{/* Offcanvas (Menu Mobile) */}
							<div className="offcanvas offcanvas-end text-bg-dark" tabIndex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
								<div className="offcanvas-header">
									<button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
								</div>
								<div className="offcanvas-body">
									<ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
										<div onClick={legado("location.href = '/home'")}>
											<li className="nav-item">
												<a className="nav-link">Home</a>
												{' '}
												<span>+</span>
											</li>
										</div>
										<hr />
										<div onClick={legado("location.href = '/portfolio'")}>
											<li className="nav-item">
												<a className="nav-link">Portfólios</a>
												{' '}
												<span>+</span>
											</li>
										</div>
										<hr />
										<div aria-current="page" onClick={legado("redirecionarPerfil()")}>
											<li className="nav-item">
												<a className="nav-link active">Perfil</a>
												{' '}
												<span>+</span>
											</li>
										</div>
										<hr />
										<div onClick={legado("sair()")}>
											<li className="nav-item"><a className="nav-link">Sair</a></li>
										</div>
									</ul>
								</div>
							</div>
							{/* Navegação Desktop */}
							<div className="navigation collapse navbar-collapse mb-2 mb-lg-0" id="navbarSupportedContent">
								<a href="/home" className="d-none d-lg-block">
									<div className="login-btn" id="empregosButton">
										<img src="/assets/img/svg/home-02-svgrepo-com.svg" alt="" />
									</div>
								</a>
								{' '}
								<a href="/portfolio" className="d-none d-lg-block">
									<div className="login-btn">
										<img src="/assets/img/svg/briefcase-02-svgrepo-com.svg" alt="" />
									</div>
								</a>
								{' '}
								<a href="#" className="d-none d-lg-block">
									<div className="login-btn">
										<img src="/assets/img/svg/notification-bell-svgrepo-com.svg" alt="" />
									</div>
								</a>
								{' '}
								<a className="d-none d-lg-block"></a>
								<div className="dropdown dropstart">
									<a className="d-none d-lg-block"></a>
									<a className="login-btn dropdown-toggle dropstart" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
										<img src="/assets/img/svg/user-circle-svgrepo-com.svg" alt="" />
									</a>
									<ul className="dropdown-menu">
										<li>
											<a className="dropdown-item" onClick={legado("redirecionarPerfil()")}>Perfil</a>
										</li>
										<li>
											<a className="dropdown-item" onClick={legado("sair()")}>Sair</a>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</nav>
			</header>
			<main>
				<br />
				<br />
				<br />
				<div className="buttons-create">
					<button className="mudarInfo-B" data-bs-toggle="modal" onClick={legado("abrirModalEdicao()")}>{" Alterar seus dados "}</button>
					{' '}
					<button id="propostaBtn" type="button" className="mudarInfo-B" data-bs-toggle="modal" data-bs-target="#modalNovoEmprego">{" Criar nova proposta "}</button>
				</div>
				{/* front */}
				<div className="container-banner">
					<div className="img-banner">
						<img src="/assets/img/imagem-perfil.jpg" alt="banner img" />
					</div>
					<div className="img-perfil">
						<img src="/assets/img/svg/Hubit_icon_profile.svg" alt="img perfil" />
					</div>
					<div className="container-info">
						<div className="ladoEsquerdo">
							{/* NOME+OQ FAZ + LOCALIDADE */}
							<h1 id="nomePrincipal"></h1>
							<h2 id="trabalho"></h2>
							<h3 id="localizacao"></h3>
							<h3></h3>
						</div>
						<div className="ladoDireito">
							{/* Links+ Bio */}
							<div className="links">
								<ul>
									<li><a id="lkdn" href=""></a></li>
									<li><a id="gthb" href=""></a></li>
								</ul>
							</div>
							<div className="bio"></div>
						</div>
					</div>
				</div>
				{/* CONTAINER EMPREGOS (só para empresas) */}
				<div className="container-empregos" id="container-empregos" style={{ display: "none" }}>
					<div className="title">
						<h1>Minhas Propostas</h1>
						<p style={{ color: "#a6a6a6", fontSize: "14px", marginTop: "5px" }}>Gerencie as vagas que você publicou</p>
						<div className="modal fade" id="modalNovoEmprego" tabIndex="-1" aria-labelledby="modalNovoEmpregoLabel" aria-hidden="true">
							<div className="modal-dialog modal-lg">
								<div className="modal-content">
									<div className="modal-header">
										<h5 className="modal-title" id="modalNovoEmpregoLabel">Criar Nova Oportunidade</h5>
										<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
									</div>
									<div className="modal-body">
										<form id="formNovoEmprego">
											{/* Título da Vaga */}
											<div className="mb-3">
												<label htmlFor="empregoTitulo" className="form-label">
													{"Título da Vaga "}
													<span className="text-danger">*</span>
												</label>
												{' '}
												<input type="text" className="form-control" id="empregoTitulo" placeholder="Ex: Desenvolvedor Full Stack" required={true} />
											</div>
											{/* Cor de Destaque */}
											<div className="mb-3">
												<label htmlFor="empregoCorDestaque" className="form-label">
													{" Cor de Destaque da Empresa "}
													<span className="text-danger">*</span>
												</label>
												<div className="d-flex align-items-center gap-3">
													<input type="color" className="form-control form-control-color" id="empregoCorDestaque" defaultValue="#2F6D88" title="Escolha a cor" />
													{' '}
													<small className="text-muted">Esta cor será aplicada ao nome da empresa nos posts</small>
												</div>
												<div className="form-text">
													<div className="mt-2 p-3 border rounded" style={{ backgroundColor: "#f8f9fa" }}>
														<strong>Preview:</strong>
														<div className="d-flex align-items-center gap-2 mt-2">
															<div style={{ width: "40px", height: "40px", background: "#ddd", borderRadius: "50%" }}></div>
															<div>
																<div id="previewNomeEmpresa" style={{ fontWeight: "600", fontSize: "14px", color: "#2F6D88" }}>{" Nome da Empresa"}</div>
																<small className="text-muted">Cargo | Localização</small>
															</div>
														</div>
													</div>
												</div>
											</div>
											{/* Descrição */}
											<div className="mb-3">
												<label htmlFor="empregoDescricao" className="form-label">
													{"Descrição "}
													<span className="text-danger">*</span>
												</label>
												{' '}
												<textarea className="form-control" id="empregoDescricao" rows="4" placeholder="Descreva a vaga..." required={true}></textarea>
											</div>
											{/* Área */}
											<div className="mb-3">
												<label htmlFor="empregoArea" className="form-label">
													{"Área "}
													<span className="text-danger">*</span>
												</label>
												{' '}
												<select className="form-select" id="empregoArea" required={true}>
													<option value="">Selecione...</option>
													<option value="Backend">Backend</option>
													<option value="Frontend">Frontend</option>
													<option value="Full Stack">Full Stack</option>
													<option value="Mobile">Mobile</option>
													<option value="Data / Backend">Data / Backend</option>
													<option value="Infraestrutura / Suporte">Infraestrutura / Suporte</option>
												</select>
											</div>
											{/* Tipo de Contrato e Trabalho */}
											<div className="row">
												<div className="col-md-6 mb-3">
													<label htmlFor="empregoContrato" className="form-label">
														{"Tipo de Contrato "}
														<span className="text-danger">*</span>
													</label>
													{' '}
													<select className="form-select" id="empregoContrato" required={true}>
														<option value="">Selecione...</option>
														<option value="CLT">CLT</option>
														<option value="PJ">PJ</option>
														<option value="Estágio">Estágio</option>
														<option value="Temporário">Temporário</option>
													</select>
												</div>
												<div className="col-md-6 mb-3">
													<label htmlFor="empregoTrabalho" className="form-label">
														{"Tipo de Trabalho "}
														<span className="text-danger">*</span>
													</label>
													{' '}
													<select className="form-select" id="empregoTrabalho" required={true}>
														<option value="">Selecione...</option>
														<option value="Remoto">Remoto</option>
														<option value="Presencial">Presencial</option>
														<option value="Híbrido">Híbrido</option>
													</select>
												</div>
											</div>
											{/* Salário e Localização */}
											<div className="row">
												<div className="col-md-6 mb-3">
													<label htmlFor="empregoSalario" className="form-label">Média Salarial (R$)</label>
													{' '}
													<input type="number" className="form-control" id="empregoSalario" placeholder="Ex: 5000" />
												</div>
												<div className="col-md-6 mb-3">
													<label htmlFor="empregoLocalizacao" className="form-label">
														{"Localização "}
														<span className="text-danger">*</span>
													</label>
													{' '}
													<input type="text" className="form-control" id="empregoLocalizacao" placeholder="Ex: São Paulo, SP" required={true} />
												</div>
											</div>
											{/* Requisitos */}
											<div className="mb-3">
												<label htmlFor="empregoRequisitos" className="form-label">Requisitos</label>
												{' '}
												<textarea className="form-control" id="empregoRequisitos" rows="3" placeholder="Separe os requisitos por vírgula"></textarea>
												<div className="form-text">Exemplo: JavaScript, React, Node.js</div>
											</div>
											{/* Benefícios */}
											<div className="mb-3">
												<label htmlFor="empregoBeneficios" className="form-label">Benefícios</label>
												{' '}
												<textarea className="form-control" id="empregoBeneficios" rows="3" placeholder="Separe os benefícios por vírgula"></textarea>
												<div className="form-text">{"Exemplo: Vale alimentação, Plano de saúde, Home office "}</div>
											</div>
										</form>
									</div>
									<div className="modal-footer">
										<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
										{' '}
										<button type="button" className="btn btn-primary" onClick={legado("publicarEmprego()")}>Publicar Vaga</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="sem-empregos" id="semEmpregos" style={{ display: "none" }}>
						<ion-icon name="briefcase-outline" style={{ fontSize: "48px", color: "#ccc" }}></ion-icon>
						<p>Você ainda não publicou nenhuma vaga</p>
					</div>
					<div id="empregosLista" className="empregos-lista"></div>
				</div>
				{/* CONTAINER CANDIDATOS (só para empresas) */}
				<div className="container-candidatos" id="container-candidatos" style={{ display: "none" }}>
					<div className="title"><h1>Candidatos Recentes</h1></div>
					<div id="candidatosRecentes"></div>
				</div>
				<div className="container-Analise " id="container-Analise">
					<div className="title"><h1>Candidaturas</h1></div>
					<div className="views">
						{/* Container para o carrossel */}
						<div id="candidaturasCarousel" className="candidaturas-carousel">
							{/* Mensagem de carregamento */}
							<div className="loading-candidaturas" id="loadingCandidaturas">
								<div className="spinner-border text-primary" role="status"><span className="visually-hidden">Carregando...</span></div>
							</div>
							{/* Mensagem quando não há candidaturas */}
							<div className="sem-candidaturas" id="semCandidaturas" style={{ display: "none" }}>
								<ion-icon name="briefcase-outline" style={{ fontSize: "48px", color: "#ccc" }}></ion-icon>
								<p>Você ainda não se candidatou a nenhuma vaga</p>
								<a href="/home" className="btn btn-primary mt-3">Ver Vagas Disponíveis</a>
							</div>
							{/* Container dos cards de candidatura */}
							<div className="candidaturas-wrapper" id="candidaturasWrapper" style={{ display: "none" }}>
								<button className="carousel-btn prev" id="prevBtn" onClick={legado("moverCarrossel(-1)")}><ion-icon name="chevron-back-outline"></ion-icon></button>
								<div className="candidaturas-track" id="candidaturasTrack">{/* Cards serão inseridos aqui via JS */}</div>
								<button className="carousel-btn next" id="nextBtn" onClick={legado("moverCarrossel(1)")}><ion-icon name="chevron-forward-outline"></ion-icon></button>
							</div>
							{/* Indicadores de página */}
							<div className="carousel-indicators" id="carouselIndicators"></div>
						</div>
					</div>
				</div>
				<div className="container-curriculos " id="container-curriculos">
					<div className="title">
						<h1>Currículos</h1>
						<p style={{ color: "#a6a6a6", fontSize: "14px", marginTop: "5px" }}>Crie até 3 currículos diferentes para vagas específicas</p>
					</div>
					<div className="curriculos">
						{/* Currículo 1 */}
						<div className="curriculo" id="curriculo-1">
							<div className="curriculo-header">
								<h3>Currículo 1</h3>
								<span className="status-curriculo" id="status-curriculo-1">Não criado</span>
							</div>
							<div className="curriculo-preview" id="preview-curriculo-1">
								<p className="sem-curriculo">Nenhum currículo criado ainda</p>
							</div>
							<button className="btn-criar-curriculo" onClick={legado("abrirModalCurriculo(1)")}>
								<ion-icon name="add-circle-outline"></ion-icon>
								{" Criar Currículo "}
							</button>
						</div>
						{/* Currículo 2 */}
						<div className="curriculo" id="curriculo-2">
							<div className="curriculo-header">
								<h3>Currículo 2</h3>
								<span className="status-curriculo" id="status-curriculo-2">Não criado</span>
							</div>
							<div className="curriculo-preview" id="preview-curriculo-2">
								<p className="sem-curriculo">Nenhum currículo criado ainda</p>
							</div>
							<button className="btn-criar-curriculo" onClick={legado("abrirModalCurriculo(2)")}>
								<ion-icon name="add-circle-outline"></ion-icon>
								{" Criar Currículo "}
							</button>
						</div>
						{/* Currículo 3 */}
						<div className="curriculo" id="curriculo-3">
							<div className="curriculo-header">
								<h3>Currículo 3</h3>
								<span className="status-curriculo" id="status-curriculo-3">Não criado</span>
							</div>
							<div className="curriculo-preview" id="preview-curriculo-3">
								<p className="sem-curriculo">Nenhum currículo criado ainda</p>
							</div>
							<button className="btn-criar-curriculo" onClick={legado("abrirModalCurriculo(3)")}>
								<ion-icon name="add-circle-outline"></ion-icon>
								{" Criar Currículo "}
							</button>
						</div>
					</div>
				</div>
				{/* MODAL: LISTA DE CANDIDATOS DE UMA VAGA */}
				<div className="modal fade" id="modalCandidatos" tabIndex="-1">
					<div className="modal-dialog modal-xl modal-dialog-scrollable">
						<div className="modal-content">
							<div className="modal-header">
								<div>
									<h5 className="modal-title" id="tituloVagaModal">Candidatos da Vaga</h5>
									<p className="text-muted mb-0 small">
										<span id="empresaNomeModal"></span>
										{" • "}
										<span id="totalCandidatos">0 candidatos</span>
									</p>
								</div>
								<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
							</div>
							<div className="modal-body">
								<div id="listaCandidatos">{/* Candidatos serão carregados via JS */}</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
							</div>
						</div>
					</div>
				</div>
				{/* MODAL: DETALHES DE UM CANDIDATO */}
				<div className="modal fade" id="modalDetalhesCandidato" tabIndex="-1">
					<div className="modal-dialog modal-lg modal-dialog-scrollable">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Detalhes do Candidato</h5>
								<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
							</div>
							<div className="modal-body">
								{/* Informações do Candidato */}
								<div className="card mb-4">
									<div className="card-header bg-primary text-white">
										<h6 className="mb-0">
											<ion-icon name="person-outline"></ion-icon>
											{" Informações Pessoais "}
										</h6>
									</div>
									<div className="card-body">
										<div className="row mb-3">
											<div className="col-md-6">
												<label className="text-muted small mb-1">Nome Completo</label>
												<p className="mb-0 fw-bold" id="detalhesNome">-</p>
											</div>
											<div className="col-md-6">
												<label className="text-muted small mb-1">Email</label>
												<p className="mb-0" id="detalhesEmail">-</p>
											</div>
										</div>
										<div className="row mb-3">
											<div className="col-md-6">
												<label className="text-muted small mb-1">Telefone</label>
												<p className="mb-0" id="detalhesTelefone">-</p>
											</div>
											<div className="col-md-6">
												<label className="text-muted small mb-1">Localização</label>
												<p className="mb-0" id="detalhesLocalizacao">-</p>
											</div>
										</div>
									</div>
								</div>
								{/* Informações Profissionais */}
								<div className="card mb-4">
									<div className="card-header bg-success text-white">
										<h6 className="mb-0">
											<ion-icon name="briefcase-outline"></ion-icon>
											{" Informações Profissionais "}
										</h6>
									</div>
									<div className="card-body">
										<div className="row mb-3">
											<div className="col-md-6">
												<label className="text-muted small mb-1">Área de Atuação</label>
												<p className="mb-0" id="detalhesArea">-</p>
											</div>
											<div className="col-md-6">
												<label className="text-muted small mb-1">Nível de Experiência</label>
												<p className="mb-0" id="detalhesNivel">-</p>
											</div>
										</div>
										{/* Links Profissionais */}
										<div id="detalhesLinks" style={{ display: "none" }}>
											<label className="text-muted small mb-2 d-block">Links Profissionais</label>
											<div className="d-flex gap-2 flex-wrap">
												<a id="detalhesLinkedin" href="#" target="_blank" className="btn btn-sm btn-outline-primary">
													<ion-icon name="logo-linkedin"></ion-icon>
													{" LinkedIn "}
												</a>
												{' '}
												<a id="detalhesGithub" href="#" target="_blank" className="btn btn-sm btn-outline-dark">
													<ion-icon name="logo-github"></ion-icon>
													{" GitHub "}
												</a>
											</div>
										</div>
									</div>
								</div>
								{/* Informações da Candidatura */}
								<div className="card">
									<div className="card-header bg-info text-white">
										<h6 className="mb-0">
											<ion-icon name="document-text-outline"></ion-icon>
											{" Informações da Candidatura "}
										</h6>
									</div>
									<div className="card-body">
										<div className="row">
											<div className="col-md-4">
												<label className="text-muted small mb-1">Vaga</label>
												<p className="mb-0" id="detalhesVagaTitulo">-</p>
											</div>
											<div className="col-md-4">
												<label className="text-muted small mb-1">Data da Candidatura</label>
												<p className="mb-0" id="detalhesDataCandidatura">-</p>
											</div>
											<div className="col-md-4">
												<label className="text-muted small mb-1">Currículo</label>
												<p className="mb-0">
													<span className="badge bg-secondary">
														{" ID: "}
														<span id="detalhesCurriculoID">-</span>
													</span>
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
								{' '}
								<a id="btnContatarCandidato" href="#" className="btn btn-primary">
									<ion-icon name="mail-outline"></ion-icon>
									{" Entrar em Contato "}
								</a>
							</div>
						</div>
					</div>
				</div>
				{/* MODAL CURRÍCULO 1 */}
				<div className="modal fade" id="modalCurriculo1" tabIndex="-1">
					<div className="modal-dialog modal-dialog-centered modal-lg">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Currículo 1</h5>
								<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
							</div>
							<div className="modal-body">
								<form id="formCurriculo1">
									{/* Informações Básicas */}
									<h6 className="mb-3">Informações Básicas</h6>
									<div className="row">
										<div className="col-md-12 mb-3">
											<label className="form-label">
												{"Título do Currículo "}
												<span className="text-danger">*</span>
											</label>
											{' '}
											<input type="text" className="form-control" id="titulo-1" placeholder="Ex: Desenvolvedor Full Stack" required={true} />
										</div>
									</div>
									{/* Objetivo Profissional */}
									<div className="mb-3">
										<label className="form-label">
											{"Objetivo Profissional "}
											<span className="text-danger">*</span>
										</label>
										{' '}
										<textarea className="form-control" id="objetivo-1" rows="3" placeholder="Descreva seu objetivo profissional..." required={true}></textarea>
									</div>
									<hr className="my-4" />
									{/* Experiências */}
									<h6 className="mb-3">Experiências Profissionais</h6>
									<div id="experiencias-container-1">
										<div className="experiencia-item mb-3">
											<div className="row">
												<div className="col-md-6 mb-2">
													<input type="text" className="form-control" placeholder="Cargo" />
												</div>
												<div className="col-md-6 mb-2">
													<input type="text" className="form-control" placeholder="Empresa" />
												</div>
												<div className="col-md-4 mb-2">
													<input type="month" className="form-control" placeholder="Data Início" />
												</div>
												<div className="col-md-4 mb-2">
													<input type="month" className="form-control" placeholder="Data Fim" />
												</div>
												<div className="col-md-4 mb-2">
													<div className="form-check">
														<input className="form-check-input" type="checkbox" id="atual-1-0" />
														{' '}
														<label className="form-check-label" htmlFor="atual-1-0">Trabalho atual</label>
													</div>
												</div>
												<div className="col-md-12 mb-2">
													<textarea className="form-control" rows="2" placeholder="Descrição das atividades"></textarea>
												</div>
											</div>
										</div>
									</div>
									<button type="button" className="btn btn-sm btn-outline-primary" onClick={legado("adicionarExperiencia(1)")}>
										<ion-icon name="add-outline"></ion-icon>
										{" Adicionar Experiência "}
									</button>
									<hr className="my-4" />
									{/* Formação Acadêmica */}
									<h6 className="mb-3">Formação Acadêmica</h6>
									<div id="formacao-container-1">
										<div className="formacao-item mb-3">
											<div className="row">
												<div className="col-md-6 mb-2">
													<input type="text" className="form-control" placeholder="Curso" />
												</div>
												<div className="col-md-6 mb-2">
													<input type="text" className="form-control" placeholder="Instituição" />
												</div>
												<div className="col-md-6 mb-2">
													<input type="month" className="form-control" placeholder="Data Início" />
												</div>
												<div className="col-md-6 mb-2">
													<input type="month" className="form-control" placeholder="Data Conclusão" />
												</div>
											</div>
										</div>
									</div>
									<button type="button" className="btn btn-sm btn-outline-primary" onClick={legado("adicionarFormacao(1)")}>
										<ion-icon name="add-outline"></ion-icon>
										{" Adicionar Formação "}
									</button>
									<hr className="my-4" />
									{/* Habilidades */}
									<h6 className="mb-3">Habilidades</h6>
									<div className="mb-3">
										<input type="text" className="form-control" id="habilidades-1" placeholder="Ex: JavaScript, React, Node.js (separadas por vírgula)" />
									</div>
									{/* Idiomas */}
									<h6 className="mb-3">Idiomas</h6>
									<div id="idiomas-container-1">
										<div className="idioma-item mb-2 row">
											<div className="col-md-6">
												<input type="text" className="form-control" placeholder="Idioma" />
											</div>
											<div className="col-md-6">
												<select className="form-select">
													<option value="">Nível</option>
													<option value="Básico">Básico</option>
													<option value="Intermediário">Intermediário</option>
													<option value="Avançado">Avançado</option>
													<option value="Fluente">Fluente</option>
													<option value="Nativo">Nativo</option>
												</select>
											</div>
										</div>
									</div>
									<button type="button" className="btn btn-sm btn-outline-primary" onClick={legado("adicionarIdioma(1)")}>
										<ion-icon name="add-outline"></ion-icon>
										{" Adicionar Idioma "}
									</button>
								</form>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
								{' '}
								<button type="button" className="btn btn-primary" onClick={legado("salvarCurriculo(1)")}>Salvar Currículo</button>
							</div>
						</div>
					</div>
				</div>
				{/* MODAL CURRÍCULO 2 */}
				<div className="modal fade" id="modalCurriculo2" tabIndex="-1">
					<div className="modal-dialog modal-dialog-centered modal-lg">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Currículo 2</h5>
								<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
							</div>
							<div className="modal-body">
								<form id="formCurriculo2">
									{/* Informações Básicas */}
									<h6 className="mb-3">Informações Básicas</h6>
									<div className="row">
										<div className="col-md-12 mb-3">
											<label className="form-label">
												{"Título do Currículo "}
												<span className="text-danger">*</span>
											</label>
											{' '}
											<input type="text" className="form-control" id="titulo-2" placeholder="Ex: Desenvolvedor Frontend" required={true} />
										</div>
									</div>
									<div className="mb-3">
										<label className="form-label">
											{"Objetivo Profissional "}
											<span className="text-danger">*</span>
										</label>
										{' '}
										<textarea className="form-control" id="objetivo-2" rows="3" placeholder="Descreva seu objetivo profissional..." required={true}></textarea>
									</div>
									<hr className="my-4" />
									<h6 className="mb-3">Experiências Profissionais</h6>
									<div id="experiencias-container-2">
										<div className="experiencia-item mb-3">
											<div className="row">
												<div className="col-md-6 mb-2">
													<input type="text" className="form-control" placeholder="Cargo" />
												</div>
												<div className="col-md-6 mb-2">
													<input type="text" className="form-control" placeholder="Empresa" />
												</div>
												<div className="col-md-4 mb-2">
													<input type="month" className="form-control" placeholder="Data Início" />
												</div>
												<div className="col-md-4 mb-2">
													<input type="month" className="form-control" placeholder="Data Fim" />
												</div>
												<div className="col-md-4 mb-2">
													<div className="form-check">
														<input className="form-check-input" type="checkbox" id="atual-2-0" />
														{' '}
														<label className="form-check-label" htmlFor="atual-2-0">Trabalho atual</label>
													</div>
												</div>
												<div className="col-md-12 mb-2">
													<textarea className="form-control" rows="2" placeholder="Descrição das atividades"></textarea>
												</div>
											</div>
										</div>
									</div>
									<button type="button" className="btn btn-sm btn-outline-primary" onClick={legado("adicionarExperiencia(2)")}>
										<ion-icon name="add-outline"></ion-icon>
										{" Adicionar Experiência "}
									</button>
									<hr className="my-4" />
									<h6 className="mb-3">Formação Acadêmica</h6>
									<div id="formacao-container-2">
										<div className="formacao-item mb-3">
											<div className="row">
												<div className="col-md-6 mb-2">
													<input type="text" className="form-control" placeholder="Curso" />
												</div>
												<div className="col-md-6 mb-2">
													<input type="text" className="form-control" placeholder="Instituição" />
												</div>
												<div className="col-md-6 mb-2">
													<input type="month" className="form-control" placeholder="Data Início" />
												</div>
												<div className="col-md-6 mb-2">
													<input type="month" className="form-control" placeholder="Data Conclusão" />
												</div>
											</div>
										</div>
									</div>
									<button type="button" className="btn btn-sm btn-outline-primary" onClick={legado("adicionarFormacao(2)")}>
										<ion-icon name="add-outline"></ion-icon>
										{" Adicionar Formação "}
									</button>
									<hr className="my-4" />
									<h6 className="mb-3">Habilidades</h6>
									<div className="mb-3">
										<input type="text" className="form-control" id="habilidades-2" placeholder="Ex: HTML, CSS, JavaScript (separadas por vírgula)" />
									</div>
									<h6 className="mb-3">Idiomas</h6>
									<div id="idiomas-container-2">
										<div className="idioma-item mb-2 row">
											<div className="col-md-6">
												<input type="text" className="form-control" placeholder="Idioma" />
											</div>
											<div className="col-md-6">
												<select className="form-select">
													<option value="">Nível</option>
													<option value="Básico">Básico</option>
													<option value="Intermediário">Intermediário</option>
													<option value="Avançado">Avançado</option>
													<option value="Fluente">Fluente</option>
													<option value="Nativo">Nativo</option>
												</select>
											</div>
										</div>
									</div>
									<button type="button" className="btn btn-sm btn-outline-primary" onClick={legado("adicionarIdioma(2)")}>
										<ion-icon name="add-outline"></ion-icon>
										{" Adicionar Idioma "}
									</button>
								</form>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
								{' '}
								<button type="button" className="btn btn-primary" onClick={legado("salvarCurriculo(2)")}>Salvar Currículo</button>
							</div>
						</div>
					</div>
				</div>
				{/* MODAL CURRÍCULO 3 */}
				<div className="modal fade" id="modalCurriculo3" tabIndex="-1">
					<div className="modal-dialog modal-dialog-centered modal-lg">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Currículo 3</h5>
								<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
							</div>
							<div className="modal-body">
								<form id="formCurriculo3">
									{/* Informações Básicas */}
									<h6 className="mb-3">Informações Básicas</h6>
									<div className="row">
										<div className="col-md-12 mb-3">
											<label className="form-label">
												{"Título do Currículo "}
												<span className="text-danger">*</span>
											</label>
											{' '}
											<input type="text" className="form-control" id="titulo-3" placeholder="Ex: Desenvolvedor Backend" required={true} />
										</div>
									</div>
									<div className="mb-3">
										<label className="form-label">
											{"Objetivo Profissional "}
											<span className="text-danger">*</span>
										</label>
										{' '}
										<textarea className="form-control" id="objetivo-3" rows="3" placeholder="Descreva seu objetivo profissional..." required={true}></textarea>
									</div>
									<hr className="my-4" />
									<h6 className="mb-3">Experiências Profissionais</h6>
									<div id="experiencias-container-3">
										<div className="experiencia-item mb-3">
											<div className="row">
												<div className="col-md-6 mb-2">
													<input type="text" className="form-control" placeholder="Cargo" />
												</div>
												<div className="col-md-6 mb-2">
													<input type="text" className="form-control" placeholder="Empresa" />
												</div>
												<div className="col-md-4 mb-2">
													<input type="month" className="form-control" placeholder="Data Início" />
												</div>
												<div className="col-md-4 mb-2">
													<input type="month" className="form-control" placeholder="Data Fim" />
												</div>
												<div className="col-md-4 mb-2">
													<div className="form-check">
														<input className="form-check-input" type="checkbox" id="atual-3-0" />
														{' '}
														<label className="form-check-label" htmlFor="atual-3-0">Trabalho atual</label>
													</div>
												</div>
												<div className="col-md-12 mb-2">
													<textarea className="form-control" rows="2" placeholder="Descrição das atividades"></textarea>
												</div>
											</div>
										</div>
									</div>
									<button type="button" className="btn btn-sm btn-outline-primary" onClick={legado("adicionarExperiencia(3)")}>
										<ion-icon name="add-outline"></ion-icon>
										{" Adicionar Experiência "}
									</button>
									<hr className="my-4" />
									<h6 className="mb-3">Formação Acadêmica</h6>
									<div id="formacao-container-3">
										<div className="formacao-item mb-3">
											<div className="row">
												<div className="col-md-6 mb-2">
													<input type="text" className="form-control" placeholder="Curso" />
												</div>
												<div className="col-md-6 mb-2">
													<input type="text" className="form-control" placeholder="Instituição" />
												</div>
												<div className="col-md-6 mb-2">
													<input type="month" className="form-control" placeholder="Data Início" />
												</div>
												<div className="col-md-6 mb-2">
													<input type="month" className="form-control" placeholder="Data Conclusão" />
												</div>
											</div>
										</div>
									</div>
									<button type="button" className="btn btn-sm btn-outline-primary" onClick={legado("adicionarFormacao(3)")}>
										<ion-icon name="add-outline"></ion-icon>
										{" Adicionar Formação "}
									</button>
									<hr className="my-4" />
									<h6 className="mb-3">Habilidades</h6>
									<div className="mb-3">
										<input type="text" className="form-control" id="habilidades-3" placeholder="Ex: Python, Django, PostgreSQL (separadas por vírgula)" />
									</div>
									<h6 className="mb-3">Idiomas</h6>
									<div id="idiomas-container-3">
										<div className="idioma-item mb-2 row">
											<div className="col-md-6">
												<input type="text" className="form-control" placeholder="Idioma" />
											</div>
											<div className="col-md-6">
												<select className="form-select">
													<option value="">Nível</option>
													<option value="Básico">Básico</option>
													<option value="Intermediário">Intermediário</option>
													<option value="Avançado">Avançado</option>
													<option value="Fluente">Fluente</option>
													<option value="Nativo">Nativo</option>
												</select>
											</div>
										</div>
									</div>
									<button type="button" className="btn btn-sm btn-outline-primary" onClick={legado("adicionarIdioma(3)")}>
										<ion-icon name="add-outline"></ion-icon>
										{" Adicionar Idioma "}
									</button>
								</form>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
								{' '}
								<button type="button" className="btn btn-primary" onClick={legado("salvarCurriculo(3)")}>Salvar Currículo</button>
							</div>
						</div>
					</div>
				</div>
				<div className="modal fade" id="modalCompletarPerfil" tabIndex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
					<div className="modal-dialog modal-dialog-centered modal-lg">
						<div className="modal-content">
							<div className="modal-header"><h5 className="modal-title">Complete seu Perfil</h5></div>
							<div className="modal-body">
								{/* Mensagem para o usuário no primeiro login, desaparece quando não é primeiro login */}
								<div className="alert alert-info mb-3" id="mensagemBoasVindas" style={{ display: "none" }}>
									{" Olá! Para continuar usando o HubIT, precisamos de algumas informações básicas. "}
								</div>
								{/* Formulário para usuário */}
								<div id="formUsuario" style={{ display: "none" }}>
									<h6 className="mb-3">Informações Pessoais</h6>
									<div className="row">
										<div className="col-md-6 mb-3">
											<label htmlFor="alterarNome" className="form-label">
												{" Nome Completo "}
												<span className="text-danger">*</span>
											</label>
											{' '}
											<input type="text" className="form-control" id="alterarNome" placeholder="Ex: João da Silva" required={true} />
										</div>
										<div className="col-md-6 mb-3">
											<label htmlFor="alterarTelefone" className="form-label">
												{" Telefone "}
												<span className="text-danger">*</span>
											</label>
											{' '}
											<input type="tel" className="form-control" id="alterarTelefone" placeholder="(11) 99999-9999" required={true} />
										</div>
									</div>
									<div className="row">
										<div className="col-md-6 mb-3">
											<label htmlFor="alterarDataNasc" className="form-label">
												{" Data de Nascimento "}
												<span className="text-danger">*</span>
											</label>
											{' '}
											<input type="date" className="form-control" id="alterarDataNasc" required={true} />
										</div>
										<div className="col-md-6 mb-3">
											<label htmlFor="alterarLocalizacao" className="form-label">
												{" Localização "}
												<span className="text-danger">*</span>
											</label>
											{' '}
											<input type="text" className="form-control" id="alterarLocalizacao" placeholder="Ex: São Paulo, SP" required={true} />
										</div>
									</div>
									<hr className="my-4" />
									<h6 className="mb-3">Informações Profissionais</h6>
									<div className="row">
										<div className="col-md-6 mb-3">
											<label htmlFor="alterarArea" className="form-label">
												{" Área de Atuação "}
												<span className="text-danger">*</span>
											</label>
											{' '}
											<select className="form-select" id="alterarArea" required={true}>
												<option value="">Selecione...</option>
												<option value="Frontend">Frontend</option>
												<option value="Backend">Backend</option>
												<option value="Fullstack">Fullstack</option>
												<option value="Mobile">Mobile</option>
												<option value="DevOps">DevOps</option>
												<option value="Data Science">Data Science</option>
												<option value="QA/Testes">QA/Testes</option>
												<option value="UI/UX Design">UI/UX Design</option>
												<option value="Segurança">Segurança</option>
												<option value="Outro">Outro</option>
											</select>
										</div>
										<div className="col-md-6 mb-3">
											<label htmlFor="alterarNivel" className="form-label">
												{" Nível de Experiência "}
												<span className="text-danger">*</span>
											</label>
											{' '}
											<select className="form-select" id="alterarNivel" required={true}>
												<option value="">Selecione...</option>
												<option value="Estudante">Estudante</option>
												<option value="Estagiário">Estagiário</option>
												<option value="Júnior">Júnior</option>
												<option value="Pleno">Pleno</option>
												<option value="Sênior">Sênior</option>
												<option value="Especialista">Especialista</option>
											</select>
										</div>
									</div>
									<hr className="my-4" />
									<h6 className="mb-3">Links e Redes (Opcional)</h6>
									<div className="row">
										<div className="col-md-6 mb-3">
											<label htmlFor="alterarLinkedin" className="form-label">{" LinkedIn "}</label>
											{' '}
											<input type="url" className="form-control" id="alterarLinkedin" placeholder="https://linkedin.com/in/seu-perfil" />
										</div>
										<div className="col-md-6 mb-3">
											<label htmlFor="alterarGithub" className="form-label">{" GitHub "}</label>
											{' '}
											<input type="url" className="form-control" id="alterarGithub" placeholder="https://github.com/seu-usuario" />
										</div>
									</div>
									<div className="mb-3">
										<label htmlFor="alterarBiografia" className="form-label">{" Sobre Você "}</label>
										{' '}
										<textarea className="form-control" id="alterarBiografia" rows="3" placeholder="Conte um pouco sobre sua experiência, projetos e objetivos..."></textarea>
										{' '}
										<small className="text-muted">Máximo 500 caracteres</small>
									</div>
								</div>
								{/* Formulário para empresa */}
								<div id="formEmpresa" style={{ display: "none" }}>
									<h6 className="mb-3">Informações da Empresa</h6>
									<div className="row">
										<div className="col-md-8 mb-3">
											<label htmlFor="alterarNomeEmpresa" className="form-label">
												{" Nome da Empresa "}
												<span className="text-danger">*</span>
											</label>
											{' '}
											<input type="text" className="form-control" id="alterarNomeEmpresa" placeholder="Ex: Tech Solutions LTDA" required={true} />
										</div>
										<div className="col-md-4 mb-3">
											<label htmlFor="alterarCNPJ" className="form-label">
												{" CNPJ "}
												<span className="text-danger">*</span>
											</label>
											{' '}
											<input type="text" className="form-control" id="alterarCNPJ" placeholder="00.000.000/0000-00" required={true} />
										</div>
									</div>
									<div className="row">
										<div className="col-md-6 mb-3">
											<label htmlFor="alterarTelefoneEmpresa" className="form-label">
												{" Telefone Comercial "}
												<span className="text-danger">*</span>
											</label>
											{' '}
											<input type="tel" className="form-control" id="alterarTelefoneEmpresa" placeholder="(11) 3000-0000" required={true} />
										</div>
										<div className="col-md-6 mb-3">
											<label htmlFor="alterarLocalizacaoEmpresa" className="form-label">
												{" Localização (Sede) "}
												<span className="text-danger">*</span>
											</label>
											{' '}
											<input type="text" className="form-control" id="alterarLocalizacaoEmpresa" placeholder="Ex: São Paulo, SP" required={true} />
										</div>
									</div>
									<hr className="my-4" />
									<h6 className="mb-3">Detalhes da Empresa</h6>
									<div className="row">
										<div className="col-md-6 mb-3">
											<label htmlFor="alterarSetor" className="form-label">
												{" Setor de Atuação "}
												<span className="text-danger">*</span>
											</label>
											{' '}
											<select className="form-select" id="alterarSetor" required={true}>
												<option value="">Selecione...</option>
												<option value="Tecnologia">Tecnologia</option>
												<option value="Consultoria">Consultoria</option>
												<option value="Educação">Educação</option>
												<option value="Saúde">Saúde</option>
												<option value="Fintech">Fintech</option>
												<option value="E-commerce">E-commerce</option>
												<option value="Indústria">Indústria</option>
												<option value="Startups">Startups</option>
												<option value="Outro">Outro</option>
											</select>
										</div>
										<div className="col-md-6 mb-3">
											<label htmlFor="alterarNumFuncionarios" className="form-label">
												{" Número de Funcionários "}
												<span className="text-danger">*</span>
											</label>
											{' '}
											<select className="form-select" id="alterarNumFuncionarios" required={true}>
												<option value="">Selecione...</option>
												<option value="1-10">1-10</option>
												<option value="11-50">11-50</option>
												<option value="51-200">51-200</option>
												<option value="201-500">201-500</option>
												<option value="501-1000">501-1000</option>
												<option value="1000+">1000+</option>
											</select>
										</div>
									</div>
									<hr className="my-4" />
									<h6 className="mb-3">Links e Redes (Opcional)</h6>
									<div className="row">
										<div className="col-md-6 mb-3">
											<label htmlFor="alterarSite" className="form-label">{" Site "}</label>
											{' '}
											<input type="url" className="form-control" id="alterarSite" placeholder="https://www.suaempresa.com.br" />
										</div>
										<div className="col-md-6 mb-3">
											<label htmlFor="alterarLinkedinEmpresa" className="form-label">{" LinkedIn "}</label>
											{' '}
											<input type="url" className="form-control" id="alterarLinkedinEmpresa" placeholder="https://linkedin.com/company/sua-empresa" />
										</div>
									</div>
									<div className="mb-3">
										<label htmlFor="alterarDescricao" className="form-label">{" Descrição da Empresa "}</label>
										{' '}
										<textarea className="form-control" id="alterarDescricao" rows="3" placeholder="Conte sobre a empresa, cultura, projetos e valores..."></textarea>
										{' '}
										<small className="text-muted">Máximo 500 caracteres</small>
									</div>
								</div>
								<small className="text-muted d-block mt-3">
									<span className="text-danger">*</span>
									{" Campos obrigatórios "}
								</small>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
								{' '}
								<button type="button" className="btn btn-primary" onClick={legado("salvarDados(event)")}>{" Salvar e Continuar "}</button>
							</div>
						</div>
					</div>
				</div>
			</main>
			<footer>
				<div className="footer-main">
					<div className="footer-main-content-svg">
						<img src="/assets/img/svg/Hubit_svg_logo_footer.svg" alt="" />
						<div className="footer-social-svg">
							<ul>
								<a href="" target="_blank">
									<li>
										<img src="/assets/img/svg/facebook-svgrepo-com.svg" alt="" />
									</li>
								</a>
								{' '}
								<a href="" target="_blank">
									<li>
										<img src="/assets/img/svg/instagram-167-svgrepo-com.svg" alt="" />
									</li>
								</a>
								{' '}
								<a href="https://github.com/gpc186/HubIT" target="_blank">
									<li>
										<img src="/assets/img/svg/github-142-svgrepo-com.svg" alt="" />
									</li>
								</a>
							</ul>
						</div>
						<div className="authors">
							<span>
								{"By Henrique Fiorotti; Gustavo "}
								<br />
								{" Cagega; Fernando Sanches"}
							</span>
						</div>
					</div>
				</div>
			</footer>
			{/* ANTES DO </body> */}
			{/* Remova TODOS os async e use defer para manter a ordem */}
			<ScriptsLegados
				scripts={[
				{ src: "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js" },
				{ src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" },
				{ src: "/assets/js/logoAnim.js" },
				{ src: "/assets/js/datas.js" },
				{ src: "/assets/js/curriculos.js" },
				{ src: "/assets/js/perfil.js" },
				{ src: "/assets/js/pg-perfil.js" },
				{ src: "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js", tipo: "module" },
				{ src: "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js", noModule: true },
				]}
			/>
		</>
	);
}
