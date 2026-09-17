import { redirect } from 'next/navigation';

// Mantém o endereço antigo apontando para a seção de contato na landing.
export default function ContactRedirect() {
	redirect('/#contact');
}
