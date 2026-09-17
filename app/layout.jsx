// Layout raiz: reúne o que era repetido no <head> de todos os .html.
// Cada página ainda carrega os próprios .css, porque os arquivos continuam
// exatamente onde estavam, em /public/assets/styles.

export const metadata = {
	title: 'Hubit',
	description: 'Milhares de vagas para a área da tecnologia.',
	icons: {
		icon: [
			{ url: '/assets/img/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
			{ url: '/assets/img/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
		],
		shortcut: '/assets/img/favicon/favicon.ico',
		apple: '/apple-touch-icon.png',
	},
};

export const viewport = {
	width: 'device-width',
	initialScale: 1,
};

export default function RootLayout({ children }) {
	return (
		<html lang="pt-BR">
			<body>{children}</body>
		</html>
	);
}
