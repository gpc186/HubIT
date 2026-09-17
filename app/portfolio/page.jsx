'use client';

// Gerado a partir de public/portfolio.html por scripts/html-para-jsx.mjs.
// A marcação é a mesma do HTML original; o comportamento continua vindo
// dos scripts em /public/assets/js, carregados abaixo.

import ScriptsLegados from '@/components/ScriptsLegados';
import { legado } from '@/lib/legado';

export default function PortfolioPage() {
	return (
		<>
			<link rel="stylesheet" href="/assets/styles/principal.css" />
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossOrigin="anonymous" />
			<header>
				<nav className="navbar navbar-expand-lg">
					<div className="container-fluid">
						<a href="/" target="_self">
							<div className="logo">
								<img id="logo-animation" src="/assets/img/svg/Hubit_svg_logo.svg" alt="" />
							</div>
						</a>
						<div className="navbar-search">
							<div className="search-content" id="searchButton">
								<div className="search">
									<input type="search" placeholder="Pesquisar..." />
									{' '}
									<img src="/assets/img/svg/search-alt-1-svgrepo-com.svg" alt="" />
								</div>
							</div>
							<button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
							<div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
								<div className="offcanvas-header">
									<button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
								</div>
								<div className="offcanvas-body">
									{/* Conteúdo do offcanvas (você pode adicionar o que quiser aqui) */}
									<ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
										<div onClick={legado("location.href = '/home'")}>
											<li className="nav-item">
												<a className="nav-link">Home</a>
												{' '}
												<span>+</span>
											</li>
										</div>
										<hr />
										<div aria-current="page" onClick={legado("location.href = '/portfolio'")}>
											<li className="nav-item">
												<a className="nav-link active">Portfólios</a>
												{' '}
												<span>+</span>
											</li>
										</div>
										<hr />
										<div onClick={legado("redirecionarPerfil()")}>
											<li className="nav-item">
												<a className="nav-link">Perfil</a>
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
				{/* Coluna Esquerda - Perfil */}
				<aside className="sidebar-left">
					<div className="profile-card">
						<div className="profile-header">
							<div className="profile-photo"><img src="/assets/img/svg/Hubit_icon_profile.svg" alt="" /></div>
						</div>
						<div className="profile-info">
							<div className="profile-name" id="nomePrincipal">Seu Nome</div>
							<div id="areaAtuacao" className="profile-headline">Cargo | Empresa</div>
							<div id="nivelExperiencia" className="profile-headline">Nivel Experiencia</div>
							<div id="nomeLocal" className="profile-headline">Estado</div>
						</div>
						<div className="profile-stats">
							<div className="stat-item">
								<span className="stat-label">Networks</span>
								{' '}
								<span className="stat-value">50+</span>
							</div>
							<div className="stat-item">
								<span className="stat-label">Visualizações do perfil</span>
								{' '}
								<span className="stat-value">127</span>
							</div>
						</div>
						<div className="profile-premium">
							<a href="#" className="premium-link">{" Experimente o 64 bits! "}</a>
						</div>
					</div>
				</aside>
				{/* Coluna Centro - Feed */}
				<section className="feed">
					<div className="greeting-card">
						<div className="weatherIcon" id="weatherIcon">
							<img id="weatherIconImg" src="/assets/img/svg/moon-svgrepo-com.svg" alt="" />
						</div>
						<div id="mensagemGreeting" className="greeting-text">
							{"Boa noite, "}
							<span id="nomeSaudacao">Seu Nome.</span>
							<br />
							{' '}
							<span>
								{"Explore os "}
								<span style={{ color: "#2F6D88", fontFamily: "Codec" }}>portfólios</span>
								{" de hoje!"}
							</span>
						</div>
					</div>
					<div id="create-postx" className="create-post">
						<div className="create-post-input">
							<div className="create-post-avatar"><img src="/assets/img/svg/Hubit_icon_profile.svg" alt="" /></div>
							<div className="input-hr"></div>
							<button className="create-post-button" data-bs-toggle="modal" data-bs-target="#modalNovoPortfolio"><span>Postar</span></button>
						</div>
					</div>
					<div id="portfoliosContainer"><div className="loading">Carregando portfólios...</div></div>
					<div className="endMsg">
						<hr />
						<h1>Opa, parece que por hoje é só...</h1>
						<p>
							{"Experimente atualizar a página "}
							<br />
							ou volte amanhã para mais projetos de portfólio
						</p>
						<a href="/portfolio" target="_self">Atualizar</a>
					</div>
				</section>
				{/* Coluna Direita - Info Adicional */}
				<aside className="sidebar-right">
					<div className="color-bar"></div>
					<div className="news-card">
						<div className="card-hubtrends"><img src="/assets/img/svg/Hutrends_svg_logo.svg" alt="" /></div>
						<hr />
						<div className="news-item">
							<div className="news-title">Tendências em tecnologia</div>
							<div className="news-meta">5.234 leitores</div>
						</div>
						<div className="news-item">
							<div className="news-title">Mercado de trabalho aquecido</div>
							<div className="news-meta">3.891 leitores</div>
						</div>
						<div className="news-item">
							<div className="news-title">Inovações em IA</div>
							<div className="news-meta">7.652 leitores</div>
						</div>
					</div>
					<div className="footer-card">
						<div className="footer-links">
							<a href="#">Sobre</a>
							{' '}
							<a href="#">Acessibilidade</a>
							{' '}
							<a href="#">Central de Ajuda</a>
							{' '}
							<a href="#">Privacidade</a>
							{' '}
							<a href="#">Termos</a>
							{' '}
							<a href="#">Configurações</a>
						</div>
						<div className="footer-copyright">
							<img src="/assets/img/svg/Hubit_footer_p_logo.svg" alt="" />
						</div>
					</div>
				</aside>
			</main>
			{/* Modal Novo Portfólio */}
			<div className="modal fade" id="modalNovoPortfolio" tabIndex="-1" aria-labelledby="modalNovoPortfolioLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-scrollable modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5" id="modalNovoPortfolioLabel">
								<ion-icon name="folder-open-outline"></ion-icon>
								{" Criar Novo Portfólio "}
							</h1>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<form id="formNovoPortfolio">
								{/* Título */}
								<div className="mb-3">
									<label htmlFor="portfolioTitulo" className="form-label fw-semibold">
										{" Título do Projeto "}
										<span className="text-danger">*</span>
									</label>
									{' '}
									<input type="text" className="form-control" id="portfolioTitulo" placeholder="Ex: Sistema de E-commerce" required={true} />
									<div className="form-text">Dê um nome atraente para seu projeto</div>
								</div>
								{/* Descrição */}
								<div className="mb-3">
									<label htmlFor="portfolioDescricao" className="form-label fw-semibold">
										{" Descrição "}
										<span className="text-danger">*</span>
									</label>
									{' '}
									<textarea className="form-control" id="portfolioDescricao" rows="4" placeholder="Descreva seu projeto, os problemas que resolve e suas funcionalidades..." required={true}></textarea>
									<div className="form-text">Seja claro e objetivo sobre o que seu projeto faz</div>
								</div>
								{/* Categoria */}
								<div className="mb-3">
									<label htmlFor="portfolioCategoria" className="form-label fw-semibold">
										{" Categoria "}
										<span className="text-danger">*</span>
									</label>
									{' '}
									<select className="form-select" id="portfolioCategoria" required={true}>
										<option value="" selected={true}>Selecione uma categoria</option>
										<option value="Web Development">Web Development</option>
										<option value="Mobile Development">Mobile Development</option>
										<option value="Backend">Backend</option>
										<option value="Frontend">Frontend</option>
										<option value="Full Stack">Full Stack</option>
										<option value="Data Science">Data Science</option>
										<option value="Machine Learning">Machine Learning</option>
										<option value="UI/UX Design">UI/UX Design</option>
										<option value="Game Development">Game Development</option>
										<option value="DevOps">DevOps</option>
										<option value="Outro">Outro</option>
									</select>
								</div>
								{/* Tecnologias */}
								<div className="mb-3">
									<label htmlFor="portfolioTecnologias" className="form-label fw-semibold">
										{" Tecnologias Utilizadas "}
										<span className="text-danger">*</span>
									</label>
									{' '}
									<input type="text" className="form-control" id="portfolioTecnologias" placeholder="Ex: React, Node.js, MongoDB" required={true} />
									<div className="form-text">Separe as tecnologias por vírgula</div>
								</div>
								{/* Link GitHub */}
								<div className="mb-3">
									<label htmlFor="portfolioGithub" className="form-label fw-semibold">
										{" Link do GitHub "}
										<span className="text-danger">*</span>
									</label>
									{' '}
									<input type="url" className="form-control" id="portfolioGithub" placeholder="https://github.com/seu-usuario/projeto" required={true} />
									<div className="form-text">O repositório deve estar no GitHub</div>
								</div>
								{/* Link Demo (Opcional) */}
								<div className="mb-3">
									<label htmlFor="portfolioDemo" className="form-label fw-semibold">
										{" Link da Demo "}
										<span className="text-muted">(Opcional)</span>
									</label>
									{' '}
									<input type="url" className="form-control" id="portfolioDemo" placeholder="https://meu-projeto.com" />
									<div className="form-text">Link para a aplicação online, se disponível</div>
								</div>
								{/* Links Adicionais (Opcional) */}
								<div className="mb-3">
									<label htmlFor="portfolioOutros" className="form-label fw-semibold">
										{" Links Adicionais "}
										<span className="text-muted">(Opcional)</span>
									</label>
									{' '}
									<input type="text" className="form-control" id="portfolioOutros" placeholder="https://link1.com, https://link2.com" />
									<div className="form-text">
										Outros links relevantes (artigos, vídeos, etc). Separe por vírgula
									</div>
								</div>
							</form>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
							{' '}
							<button type="button" className="btn btn-primary" style={{ backgroundColor: "#2F6D88" }} onClick={legado("publicarPortfolio()")}>
								<ion-icon name="rocket-outline"></ion-icon>
								{" Publicar Portfólio "}
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* Scripts */}
			<ScriptsLegados
				scripts={[
				{ src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" },
				{ src: "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js", tipo: "module" },
				{ src: "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js", noModule: true },
				{ src: "/assets/js/logoAnim.js" },
				{ src: "/assets/js/portfolio.js" },
				]}
			/>
		</>
	);
}
