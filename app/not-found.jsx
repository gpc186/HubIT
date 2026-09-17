'use client';

// Gerado a partir de public/404.html por scripts/html-para-jsx.mjs.
// A marcação é a mesma do HTML original; o comportamento continua vindo
// dos scripts em /public/assets/js, carregados abaixo.

import ScriptsLegados from '@/components/ScriptsLegados';

export default function NaoEncontrada() {
	return (
		<>
			<link rel="stylesheet" href="/assets/styles/contact.css" />
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossOrigin="anonymous" />
			<header>
				<nav className="navbar navbar-expand-lg">
					<div className="container-fluid">
						<a href="/" className="logo">
							<img id="logo-animation" src="/assets/img/svg/Hubit_svg_logo.svg" alt="" />
						</a>
						<div className="navigation collapse navbar-collapse ms-auto mb-2 mb-lg-0" id="navbarSupportedContent">
							<ul className="navbar-nav">
								<li className="nav-item"><a className="nav-link" href="/#about">Conheça o hubit</a></li>
								<li className="nav-item"><a className="nav-link" href="/#slots">Slots</a></li>
								<li className="nav-item"><a className="nav-link" href="/#plans">Planos</a></li>
							</ul>
							<a href="/" className="d-none d-lg-block"><div className="login-btn">{" Login "}</div></a>
						</div>
					</div>
				</nav>
			</header>
			<main>
				<div className="container">
					<div className="block-404">
						<img src="/assets/img/svg/Hubit_404_svg.svg" alt="" />
						<p>
							{"Se tiver dúvidas contate o "}
							<a href="/contact" style={{ color: "#1A607B", textDecoration: "underline !important" }}>suporte</a>
						</p>
						<p>
							{"Voltar para "}
							<a href="/" style={{ color: "#1A607B", textDecoration: "underline !important" }}>página principal</a>
						</p>
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
			<ScriptsLegados
				scripts={[
				{ src: "/assets/js/contact.js" },
				{ src: "/assets/js/logoAnim.js" },
				]}
			/>
		</>
	);
}
