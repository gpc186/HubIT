'use client';

// Gerado a partir de public/login.html por scripts/html-para-jsx.mjs.
// A marcação é a mesma do HTML original; o comportamento continua vindo
// dos scripts em /public/assets/js, carregados abaixo.

import ScriptsLegados from '@/components/ScriptsLegados';
import { legado } from '@/lib/legado';

export default function LandingPage() {
	return (
		<>
			<link rel="stylesheet" href="/assets/styles/style.css" />
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossOrigin="anonymous" />
			<link rel="stylesheet" href="/assets/styles/landing.css" />
			<link rel="stylesheet" href="/assets/styles/site-chrome.css" />
			<link rel="stylesheet" href="/assets/styles/landing-contact.css" />
			<link rel="stylesheet" href="/assets/styles/register-modal.css" />
			<header className="site-header">
				<nav className="nav-shell" aria-label="Navegação principal">
					<a className="brand" href="/" aria-label="Hubit — início">
						<img src="/assets/img/svg/Hubit_svg_logo.svg" alt="Hubit" />
					</a>
					<div className="desktop-links">
						<a href="#about">Conheça o hubit</a>
						<a href="#slots">Slots</a>
						{' '}
						<a href="#plans">Planos</a>
						<a href="#contact">Contato</a>
					</div>
					<a className="button nav-login" href="#email" onClick={legado("focar()")}>Login</a>
					<details className="mobile-menu">
						<summary aria-label="Menu de navegação">
							<span></span>
							<span></span>
							<span></span>
						</summary>
						<div className="mobile-links">
							<a href="#about">Conheça o hubit</a>
							<a href="#slots">Slots</a>
							{' '}
							<a href="#plans">Planos</a>
							<a href="#contact">Contato</a>
						</div>
					</details>
				</nav>
			</header>
			<main>
				<div className="main-content-1 container-fluid">
					<div className="rowr">
						<div className="col-md-6 col-12 main-block-1">
							<div className="text-login-block">
								<h1>
									{"Comece novo "}
									<br />
									{" Comece o "}
									<span id="text-alt" style={{ color: "#2F6D88", fontFamily: "Codec", fontWeight: "bold" }}>Expanda</span>
								</h1>
								<h2>
									{"Milhares de vagas para "}
									<br />
									{" área da tecnologia"}
								</h2>
							</div>
							<img src="/assets/img/svg/Hubit-login-hero-ascii.svg" alt="" />
						</div>
						<div className="main-block-2">
							<div className="login-block">
								<div className="login-block-text">
									<p>
										{"Faça seu "}
										<span style={{ color: "#2F6D88" }}>login</span>
										!
									</p>
									<img src="/assets/img/svg/login-svgrepo-com.svg" alt="" />
								</div>
								<hr />
								<input type="email" name="email" id="email" placeholder="E-mail" />
								{' '}
								<input type="password" name="passwd" id="passwd" placeholder="Senha" />
								<div className="remember-forgot">
									<div className="remember">
										<input className="checkbox" type="checkbox" name="checkbox" id="checkbox" />
										{' '}
										<label htmlFor="checkbox">{" Lembrar de mim"}</label>
									</div>
									<a type="button" className="forgot" data-bs-toggle="modal" data-bs-target="#exampleModal">{" Primeira vez aqui? "}</a>
								</div>
								<a className="enter-btn" onClick={legado("fazerLogin()")}><div className="login-block-enter">{" Entrar "}</div></a>
								<h3>
									{"Ao continuar, você reconhece a "}
									<br />
									{' '}
									<a style={{ color: "#30729e", textDecoration: "none" }} href="">{" Política de Privacidade "}</a>
									da Hubit
								</h3>
							</div>
						</div>
					</div>
				</div>
				<section id="about">
					<div className="about">
						<div className="about-steps-text">
							<h1>Conheça o hubit</h1>
							<h2>
								{"O hubit é uma plataforma de vagas de emprego "}
								<br />
								{" focada na área da Tecnologia da Informação"}
							</h2>
						</div>
						<div className="about-content">
							<div className="section-block-1">
								<div className="section-block-img-1"><img src="/assets/img/about_hero_img.jpg" alt="" /></div>
							</div>
							<div className="section-block-2">
								<div className="section-block-content-2">
									<h1 className="textwSvg">
										<img src="/assets/img/svg/chart-histogram-one-svgrepo-com.svg" alt="" />
										Currículo
									</h1>
									<hr />
									<p>
										{"Crie o seu currículo na hubit e use para "}
										<span style={{ color: "#2F6D88" }}>candidatar-se</span>
										{" para vagas de empresas "}
									</p>
									<br />
									<h1 className="textwSvg">
										<img src="/assets/img/svg/feed-svgrepo-com.svg" alt="" />
										{" Feed de vagas "}
									</h1>
									<hr />
									<p>
										{"Explore por um feed de vagas, com inúmeras "}
										<span style={{ color: "#2F6D88" }}>oportunidades de trabalho</span>
										, entre elas, Estágios, CLT ou PJ
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
				<hr className="hr-custom" />
				<section className="section-steps">
					<div className="about-steps">
						<div className="about-steps-text">
							<h1>Hubit em 3 etapas</h1>
							<h2>
								{"Poucos passos do seu próximo emprego. "}
								<br />
								{"Em 3 passos o seu currículo estará no mercado de trabalho "}
							</h2>
						</div>
						<div className="about-content-steps">
							<div className="section-block-1-steps">
								<div className="section-block-img-1-steps"><img src="/assets/img/svg/Hubit_steps.svg" alt="" /></div>
							</div>
						</div>
					</div>
				</section>
				<hr className="hr-custom" />
				<section id="slots">
					<div className="about">
						<div className="about-steps-text">
							<h1>Slots</h1>
							<h2>Uma alternativa prática para se candidatar!</h2>
						</div>
						<div className="about-content">
							<div className="section-block-1">
								<div className="section-block-img-2"><img src="/assets/img/Hubit (1).png" alt="" /></div>
							</div>
							<div className="section-block-2">
								<div className="section-block-content-2">
									<h1 className="textwSvg">
										<img src="/assets/img/svg/coin-alt-svgrepo-com.svg" alt="" />
										{"O que são os "}
										<span style={{ color: "#30729e" }}>Slots</span>
										{"? "}
									</h1>
									<hr />
									<p>
										Slots são espaços de currículos configurados por você, onde podem ser utilizados para se candidatar para vagas especificas.
									</p>
									<br />
									<h1 className="textwSvg">
										<img src="/assets/img/svg/form-one-svgrepo-com.svg" alt="" />
										<span style={{ color: "#30729e" }}>Formato desejado</span>
										{" pelas empresas"}
									</h1>
									<hr />
									<p>
										Aqui seu currículo já sai do jeitinho que as grandes empresas querem.
									</p>
									<br />
									{' '}
									<a href="#plans"><div className="slot-btn">{" Experimente agora "}</div></a>
								</div>
							</div>
						</div>
					</div>
				</section>
				<hr className="hr-custom" />
				<section id="plans">
					<div className="about">
						<h1>Planos</h1>
						<h2>
							{" Começe hoje mesmo! "}
							<br />
							Selecione um plano hubit
						</h2>
						<div className="plans-options">
							<div className="plans-content-options">
								<button className="plans-options-active" id="btnInd" onClick={legado("aparecerPlanInd()")}>Individual</button>
								{' '}
								<button className="plans-options-disable" id="btnEmp" onClick={legado("aparecerPlanEmp()")}>Empresarial</button>
							</div>
						</div>
						<div className="plans-content">
							<div id="plansInd" className="plan1 shine-plan">
								<div className="plan1-content">
									<div className="plan-heading">
										<h1>8 bits</h1>
										<span className="plan-badge">Standard</span>
									</div>
									<p className="plan-price">Grátis</p>
									<button type="button" className="plan-a-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
										{"Começar hoje "}
										<span aria-hidden="true">↗</span>
									</button>
									<div className="plan-content">
										<ul>
											<li>1 Slot de currículo</li>
											<li>Navegar pelo feed</li>
											<li>{"Candidatar-se "}</li>
											<li>Impulsionar o alcance do seu Currículo</li>
											<li>Fique em destaque</li>
										</ul>
									</div>
								</div>
							</div>
							<div id="plansInd2" className="plan1 shine-plan">
								<div className="plan1-content">
									<div className="plan-heading">
										<h1>64 bits</h1>
										<span className="plan-badge">Premium</span>
									</div>
									<p className="plan-price">
										{"R$ 29,90 "}
										<span>/mês</span>
									</p>
									<button type="button" className="plan-a-btn-2" data-bs-toggle="modal" data-bs-target="#exampleModal">
										{"Experimente agora "}
										<span aria-hidden="true">↗</span>
									</button>
									<div className="plan-content">
										<ul>
											<li>Slots ilimitados</li>
											<li>Seja o primeiro na lista de candidatos</li>
											<li>Impulsionar o alcance do seu Currículo</li>
											<li>Obtenha uma tag de premium no seu perfil</li>
										</ul>
									</div>
								</div>
							</div>
							{/* ----------------------------------------------------------------------------------------------------------- */}
							<div id="plansEmp" className="plan1 shine-plan">
								<div className="plan1-content">
									<div className="plan-heading">
										<h1>128 bits</h1>
										<span className="plan-badge">Empresarial</span>
									</div>
									<p className="plan-price plan-price-custom">Preço precisa ser combinado</p>
									<a className="plan-a-btn-2" href="#contact">
										{"Contatar vendas "}
										<span aria-hidden="true">↗</span>
									</a>
									<div className="plan-content">
										<ul>
											<li>1 Slot de currículo</li>
											<li>Navegar pelo feed</li>
											<li>{"Candidatar-se "}</li>
											<li>Impulsionar o alcance do seu Currículo</li>
											<li>Fique em destaque</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section id="contact" className="landing-contact" aria-label="Contato">
					<div className="contact-hero shell" aria-labelledby="contact-title">
						<div className="hero-copy">
							<span className="eyebrow">
								<span className="small-dot" aria-hidden="true"></span>
								{" CONTATO HUBIT"}
							</span>
							<h1 id="contact-title">
								{"Toda conexão começa com uma "}
								<span>boa conversa.</span>
							</h1>
							<p className="hero-description">
								Uma dúvida, uma ideia ou o próximo passo da sua empresa. Fale com a gente.
							</p>
							<a className="text-link" href="#faq">
								{"Talvez sua resposta esteja aqui "}
								<span aria-hidden="true">↓</span>
							</a>
							<div className="hero-note">
								<span className="note-icon">
									<img src="/assets/img/svg/headset-alt-svgrepo-com.svg" alt="" />
								</span>
								<p>
									Sobre a sua conta ou sobre o Hubit.
									<br />
									<strong>Vamos encontrar o melhor caminho.</strong>
								</p>
							</div>
						</div>
						<div className="contact-card" aria-labelledby="channels-title">
							<div className="card-top">
								<span className="card-label">VAMOS CONVERSAR</span>
								<span className="card-mark" aria-hidden="true">↗</span>
							</div>
							<h2 id="channels-title">Como podemos ajudar?</h2>
							<p className="card-description">Escolha o melhor canal para entrar em contato.</p>
							<div className="contact-channel">
								<span className="channel-icon"><img src="/assets/img/svg/mail-svgrepo-com.svg" alt="" /></span>
								<div className="channel-content">
									<span className="channel-label">E-mail</span>
									<a href="mailto:hubitcontato@gmail.com">hubitcontato@gmail.com</a>
								</div>
								<button className="copy-button" type="button" data-copy="hubitcontato@gmail.com" aria-label="Copiar e-mail">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
										<rect x="8" y="8" width="12" height="12" rx="3"></rect>
										<path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path>
									</svg>
								</button>
							</div>
							<div className="contact-channel">
								<span className="channel-icon">
									<img src="/assets/img/svg/telephone-svgrepo-com.svg" alt="" />
								</span>
								<div className="channel-content">
									<span className="channel-label">Telefone</span>
									<a href="tel:+551190008999">(11) 9000-8999</a>
								</div>
								<button className="copy-button" type="button" data-copy="11-9000-8999" aria-label="Copiar telefone">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
										<rect x="8" y="8" width="12" height="12" rx="3"></rect>
										<path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path>
									</svg>
								</button>
							</div>
							<a className="button card-cta" href="mailto:hubitcontato@gmail.com">
								{"Escrever um e-mail "}
								<span aria-hidden="true">↗</span>
							</a>
							<p className="contact-status" id="contact-status" role="status" aria-live="polite">Prefere copiar? Use o ícone ao lado de cada contato.</p>
						</div>
					</div>
					<div className="faq-section shell" id="faq" aria-labelledby="faq-title">
						<div className="faq-intro">
							<span className="eyebrow">ANTES DE ENVIAR</span>
							<h2 id="faq-title">
								Um atalho para
								<br />
								{" a sua dúvida."}
							</h2>
							<p>
								Respostas para começar a explorar as possibilidades do Hubit.
							</p>
							<a className="text-link" href="mailto:hubitcontato@gmail.com">
								{"Minha dúvida é outra "}
								<span aria-hidden="true">↗</span>
							</a>
						</div>
						<div className="faq-list">
							<details className="faq-item">
								<summary>
									<span className="faq-number">01</span>
									Como criar minha conta?
									<span className="faq-plus" aria-hidden="true">+</span>
								</summary>
								<div className="faq-answer">
									<p>
										{"Na "}
										<a href="#email">página inicial</a>
										, selecione “Primeira vez aqui?” no bloco de login. Preencha seu e-mail e senha e escolha o tipo de conta: Funcionário ou Empresa.
									</p>
								</div>
							</details>
							<details className="faq-item">
								<summary>
									<span className="faq-number">02</span>
									O que são os Slots?
									<span className="faq-plus" aria-hidden="true">+</span>
								</summary>
								<div className="faq-answer">
									<p>
										{"São espaços para configurar seus currículos e utilizá-los ao se candidatar a vagas. Você pode conhecer a proposta na "}
										<a href="#slots">seção Slots</a>
										.
									</p>
								</div>
							</details>
							<details className="faq-item">
								<summary>
									<span className="faq-number">03</span>
									Onde encontro os planos?
									<span className="faq-plus" aria-hidden="true">+</span>
								</summary>
								<div className="faq-answer">
									<p>
										{"Na "}
										<a href="#plans">seção de planos</a>
										, você pode comparar as opções individuais e empresariais e conferir os benefícios de cada uma.
									</p>
								</div>
							</details>
							<details className="faq-item">
								<summary>
									<span className="faq-number">04</span>
									Como falar sobre um plano empresarial?
									<span className="faq-plus" aria-hidden="true">+</span>
								</summary>
								<div className="faq-answer">
									<p>
										{"Envie um e-mail para "}
										<a href="mailto:hubitcontato@gmail.com">hubitcontato@gmail.com</a>
										{" contando um pouco sobre sua empresa e o que você procura no Hubit."}
									</p>
								</div>
							</details>
						</div>
					</div>
					<aside className="contact-banner shell">
						<div>
							<span className="eyebrow">SEU PRÓXIMO PASSO</span>
							<h2>Novas conexões esperam por você.</h2>
						</div>
						<a className="button" href="#about">
							{"Explorar o Hubit "}
							<span aria-hidden="true">↗</span>
						</a>
					</aside>
				</section>
			</main>
			<footer className="site-footer">
				<div className="footer-shell shell">
					<a href="/" aria-label="Hubit — início">
						<img src="/assets/img/svg/Hubit_svg_logo_footer.svg" alt="Hubit" />
					</a>
					<p>Conectando talentos e oportunidades em tecnologia.</p>
					<a className="footer-github" href="https://github.com/gpc186/HubIT" target="_blank" rel="noopener noreferrer">
						{"GitHub "}
						<span aria-hidden="true">↗</span>
					</a>
					{' '}
					<small>Por Henrique Fiorotti, Gustavo Cagega e Fernando Sanches.</small>
				</div>
			</footer>
			<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
					<div className="modal-content">
						<div className="modal-header">
							<span className="register-eyebrow">
								<span className="register-dot" aria-hidden="true"></span>
								{" COMEÇAR NO HUBIT"}
							</span>
							{' '}
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar cadastro"></button>
						</div>
						<div className="modal-body">
							<div className="register-intro">
								<h2 className="modal-title" id="exampleModalLabel">
									{"Sua próxima oportunidade "}
									<span>começa aqui.</span>
								</h2>
								<p>Crie sua conta para explorar o Hubit.</p>
							</div>
							<div className="register-fields">
								<div className="register-field">
									<label htmlFor="emailNewUser">E-mail</label>
									{' '}
									<input type="email" name="email" id="emailNewUser" placeholder="seu@email.com" autoComplete="email" />
								</div>
								<div className="register-field">
									<label htmlFor="passwdNewUser">Senha</label>
									{' '}
									<input type="password" name="passwd" id="passwdNewUser" placeholder="Crie uma senha" autoComplete="new-password" aria-describedby="passtip" />
									<p className="password-hint" id="passtip">Use 5 ou mais caracteres, 1 maiúscula e 1 número.</p>
								</div>
							</div>
							<fieldset className="account-type">
								<legend>Como você vai usar o Hubit?</legend>
								<div className="selection-modal">
									<label className="account-option" htmlFor="usuario">
										<input className="radio-modal" type="radio" name="option" id="usuario" />
										{' '}
										<span className="account-option-surface">
											<span className="account-option-icon" aria-hidden="true">
												<img src="/assets/img/svg/user-circle-svgrepo-com.svg" alt="" />
											</span>
											<span className="account-option-copy">
												<strong>Funcionário</strong>
												<small>Encontre sua próxima vaga</small>
											</span>
											<span className="account-option-check" aria-hidden="true"></span>
										</span>
									</label>
									{' '}
									<label className="account-option" htmlFor="empresa">
										<input className="radio-modal" type="radio" name="option" id="empresa" />
										{' '}
										<span className="account-option-surface">
											<span className="account-option-icon" aria-hidden="true">
												<img src="/assets/img/svg/briefcase-02-svgrepo-com.svg" alt="" />
											</span>
											<span className="account-option-copy">
												<strong>Empresa</strong>
												<small>Conecte-se a talentos</small>
											</span>
											<span className="account-option-check" aria-hidden="true"></span>
										</span>
									</label>
								</div>
							</fieldset>
						</div>
						<div className="modal-footer">
							<button id="btnNone" type="button" className="register-cancel" data-bs-dismiss="modal">Agora não</button>
							{' '}
							<button type="button" className="register-submit" onClick={legado("registrarNovoUsuario()")}>
								{"Criar conta "}
								<span aria-hidden="true">↗</span>
							</button>
						</div>
					</div>
				</div>
			</div>
			<ScriptsLegados
				scripts={[
				{ src: "/assets/js/vendor/gsap.min.js" },
				{ src: "/assets/js/vendor/ScrollTrigger.min.js" },
				{ src: "/assets/js/landing.js" },
				{ src: "/assets/js/site-nav.js" },
				{ src: "/assets/js/contact-copy.js" },
				{ src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" },
				{ src: "/assets/js/login.js" },
				{ src: "/assets/js/inline/login-inline.js" },
				]}
			/>
		</>
	);
}
