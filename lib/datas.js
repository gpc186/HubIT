// Leitura tolerante de datas.
//
// A maior parte dos registros guarda a data em ISO, mas as vagas criadas pela
// API antiga gravavam "d/m/aaaa", que `new Date()` não entende e transforma em
// NaN — o que fazia a ordenação por data simplesmente não acontecer.
//
// Hoje só se grava ISO (veja app/api/emprego/route.js), mas bancos criados
// antes disso ainda têm as duas formas, então a leitura aceita as duas.

const DIA_MES_ANO = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

// Devolve o timestamp em milissegundos, ou 0 quando não dá para entender a
// data — assim um registro sem data vai para o fim da lista em vez de
// contaminar a comparação inteira com NaN.
export function paraTimestamp(data) {
	if (!data) return 0;
	if (typeof data === 'number') return data;

	const diaMesAno = DIA_MES_ANO.exec(data);
	if (diaMesAno) {
		const [, dia, mes, ano] = diaMesAno;
		return Date.UTC(Number(ano), Number(mes) - 1, Number(dia));
	}

	const timestamp = new Date(data).getTime();
	return Number.isNaN(timestamp) ? 0 : timestamp;
}

// Comparador para ordenar da mais recente para a mais antiga.
export function maisRecentePrimeiro(campo) {
	return (a, b) => paraTimestamp(b[campo]) - paraTimestamp(a[campo]);
}
