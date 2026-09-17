'use client';

// Gerado a partir de public/principal.html por scripts/html-para-jsx.mjs.
// A marcação é a mesma do HTML original; o comportamento continua vindo
// dos scripts em /public/assets/js, carregados abaixo.

import ScriptsLegados from '@/components/ScriptsLegados';
import { legado } from '@/lib/legado';

export default function HomePage() {
	return (
		<>
			<link rel="stylesheet" href="/assets/styles/principal.css" />
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossOrigin="anonymous" />
			<link rel="stylesheet" href="/assets/styles/principal.css" />
			<header>
				<nav className="navbar navbar-expand-lg">
					<div className="container-fluid">
						<a href="/" target="_self">
							<div className="logo">
								<img id="logo-animation" src="/assets/img/svg/Hubit_svg_logo.svg" alt="" />
							</div>
						</a>
						<div className="navbar-search">
							<div className="search-content">
								<div className="search">
									<input type="search" placeholder="Pesquisar..." />
									{' '}
									<img src="/assets/img/svg/search-alt-1-svgrepo-com.svg" alt="" />
								</div>
							</div>
							<button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
							<div className="offcanvas offcanvas-end text-bg-dark" tabIndex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
								<div className="offcanvas-header">
									<button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
								</div>
								<div className="offcanvas-body">
									{/* Conteúdo do offcanvas (você pode adicionar o que quiser aqui) */}
									<ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
										<div aria-current="page" onClick={legado("location.href = '/home'")}>
											<li className="nav-item">
												<a className="nav-link active">Home</a>
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
									<div className="login-btn">
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
								{"Suas "}
								<span style={{ color: "#2F6D88", fontFamily: "Codec" }}>oportunidades</span>
								{" de hoje!"}
							</span>
						</div>
					</div>
					<div className="accordion" id="accordionExample">
						<div className="accordion-item">
							<h2 className="accordion-header">
								<button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">{" Filtros de Busca "}</button>
							</h2>
							<div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
								<div className="accordion-body">
									<div className="filters-container">
										<div className="row">
											<div className="col-md-4 filter-group">
												<label htmlFor="filtroArea">Área</label>
												{' '}
												<select id="filtroArea">
													<option value="">Todas as áreas</option>
													<option value="Backend">Backend</option>
													<option value="Frontend">Frontend</option>
													<option value="Full Stack">Full Stack</option>
													<option value="Mobile">Mobile</option>
													<option value="Data / Backend">Data / Backend</option>
													<option value="Infraestrutura / Suporte">Infraestrutura / Suporte</option>
												</select>
											</div>
											<div className="col-md-4 filter-group">
												<label htmlFor="filtroNivelEx">Nível</label>
												{' '}
												<select id="filtroNivelEx">
													<option value="">Todos os níveis</option>
													<option value="Júnior">Junior</option>
													<option value="Sênior">Senior</option>
													<option value="Pleno">Pleno</option>
													<option value="Aprendiz">Aprendiz</option>
												</select>
											</div>
											<div className="col-md-4 filter-group">
												<label htmlFor="filtroLocalizacao">Localização</label>
												{' '}
												<input type="text" id="filtroLocalizacao" placeholder="Ex: São Paulo" />
											</div>
											<div className="col-md-4 filter-group">
												<label htmlFor="filtroContrato">Tipo de Contrato</label>
												{' '}
												<select id="filtroContrato">
													<option value="">Todos</option>
													<option value="CLT">CLT</option>
													<option value="PJ">PJ</option>
													<option value="Estágio">Estágio</option>
													<option value="Temporário">Temporário</option>
												</select>
											</div>
											<div className="col-md-4 filter-group">
												<label htmlFor="filtroTrabalho">Tipo de Trabalho</label>
												{' '}
												<select id="filtroTrabalho">
													<option value="">Todos</option>
													<option value="Remoto">Remoto</option>
													<option value="Presencial">Presencial</option>
													<option value="Híbrido">Híbrido</option>
												</select>
											</div>
											<div className="col-md-4 filter-group">
												<label htmlFor="filtroLocalizacao">Faixa Salarial (R$)</label>
												{' '}
												<input type="number" id="salarioMin" placeholder="Salário mínimo" />
											</div>
										</div>
										<div className="buttons-filter">
											<button className="btn-clear" onClick={legado("limparFiltros()")}>Limpar Filtros</button>
											{' '}
											<button className="btn-filter" onClick={legado("aplicarFiltros()")}>Aplicar Filtros</button>
										</div>
										<div className="active-filters" id="activeFiltros"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/* <div class="create-post">
                <div class="create-post-input">
                    <div class="create-post-avatar">
                        <img src="assets/img/svg/Hubit_icon_profile.svg" alt="">
                    </div>
                    <div class="create-post-button"><input type="text" name="" id="" placeholder="Insira uma ideia">
                    </div>
                </div>
                <div class="create-post-actions">
                    <button class="action-button">📷 Foto</button>
                    <button class="action-button">🎥 Vídeo</button>
                    <button class="action-button">📄 Artigo</button>
                </div>
            </div> */}
					<div id="empregosContainer"></div>
					<div className="endMsg">
						<hr />
						<h1>Opa, parece que por hoje é só...</h1>
						<p>
							{"Experimente atualizar a página "}
							<br />
							ou volte amanhã para mais oportunidades
						</p>
						<a href="/home" target="_self">Atualizar</a>
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
			<ScriptsLegados
				scripts={[
				{ src: "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js" },
				{ src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" },
				{ src: "/assets/js/logoAnim.js" },
				{ src: "/assets/js/perfil.js" },
				{ src: "/assets/js/home.js" },
				]}
			/>
		</>
	);
}
