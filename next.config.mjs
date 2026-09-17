/** @type {import('next').NextConfig} */
const nextConfig = {
	// O banco usa o módulo nativo `node:sqlite`; nunca deve ser empacotado.
	serverExternalPackages: ['node:sqlite'],
	// As páginas herdadas usam <img> apontando para /public; sem otimização do next/image.
	images: { unoptimized: true },
};

export default nextConfig;
