'use client';

// Gerado a partir de public/contactLogin.html por scripts/html-para-jsx.mjs.
// A marcação é a mesma do HTML original; o comportamento continua vindo
// dos scripts em /public/assets/js, carregados abaixo.

import ScriptsLegados from '@/components/ScriptsLegados';
import { legado } from '@/lib/legado';

export default function ContatoPage() {
	return (
		<>
			<link rel="stylesheet" href="/assets/styles/contact.css" />
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossOrigin="anonymous" />
			{"select 1 from depar "}
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
						</div>
					</div>
				</nav>
			</header>
			<main>
				<br />
				<br />
				<br />
				<br />
				<div className="container">
					<div className="img-phone"><img src="/assets/img/contact_hero_img.png" alt="" /></div>
					<div className="container-right">
						<div className="headset">
							<img src="/assets/img/svg/headset-alt-svgrepo-com.svg" alt="" />
						</div>
						<div className="texto1"><h1>Enfrentando dúvidas ou problemas?</h1></div>
						<div className="texto2"><h2>Entre em contato conosco</h2></div>
						<div className="SAC">
							<div className="title-SAC"><h2>SAC</h2></div>
							<button className="btn-email" onClick={legado("CopiarEmail()")}>
								<img src="/assets/img/svg/mail-svgrepo-com.svg" alt="email-icon" />
								{' '}
								<input className="copiar" type="text" id="copiarE" defaultValue="hubitcontato@gmail.com" readOnly={true} />
							</button>
							<div className="btn-phone" onClick={legado("CopiarPhone()")}>
								<img src="/assets/img/svg/telephone-svgrepo-com.svg" alt="phone-icon" />
								{' '}
								<input className="copiar" type="text" id="copiarP" defaultValue="11-9000-8999" readOnly={true} />
							</div>
						</div>
					</div>
				</div>
				<div className="container-FAQ">
					<div className="texto2"><h1>Dúvidas Frequentes</h1></div>
					<div className="border-d">
						<div className="faq-item">
							{/* duvida 1 */}
							<div className="faq-question" onClick={legado("toggleFAQ(this)")}>
								<span style={{ color: "#2f6d88" }}>Dúvida 1</span>
								{' '}
								<span className="arrow">▼</span>
							</div>
							<div className="faq-answer"><p>blablabla</p></div>
						</div>
						{/* duvida 2 */}
						<div className="faq-item">
							<div className="faq-question" onClick={legado("toggleFAQ(this)")}>
								<span style={{ color: "#2f6d88" }}>Dúvida 1</span>
								{' '}
								<span className="arrow">▼</span>
							</div>
							<div className="faq-answer"><p>blablabla</p></div>
						</div>
						{/* duvida 3 */}
						<div className="faq-item">
							<div className="faq-question" onClick={legado("toggleFAQ(this)")}>
								<span style={{ color: "#2f6d88" }}>Dúvida 1</span>
								{' '}
								<span className="arrow">▼</span>
							</div>
							<div className="faq-answer"><p>blablabla</p></div>
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
			<ScriptsLegados
				scripts={[
				{ src: "/assets/js/contact.js" },
				{ src: "/assets/js/logoAnim.js" },
				]}
			/>
		</>
	);
}
