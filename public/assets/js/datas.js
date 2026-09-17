/**
 * Leitura e formatação de datas, compartilhado entre as páginas.
 *
 * As datas vêm da API em ISO, mas bancos criados antes da normalização ainda
 * podem ter vagas no formato "d/m/aaaa" — por isso a leitura aceita os dois.
 * A contraparte no servidor é lib/datas.js.
 */

/**
 * Converte diferentes formatos de data para timestamp em milissegundos.
 * Devolve 0 quando não dá para entender a data, para o registro ir parar no
 * fim das listas em vez de contaminar a ordenação com NaN.
 */
function converterDataParaTimestamp(data) {
    if (!data) return 0;

    // Se já é um timestamp ou número
    if (typeof data === 'number') return data;

    // Formato antigo DD/MM/YYYY
    const diaMesAno = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(data);
    if (diaMesAno) {
        const [, dia, mes, ano] = diaMesAno;
        return Date.UTC(Number(ano), Number(mes) - 1, Number(dia));
    }

    // ISO, ou qualquer coisa que o Date entenda
    const timestamp = new Date(data).getTime();
    return isNaN(timestamp) ? 0 : timestamp;
}

/**
 * Formata a data para leitura, no padrão brasileiro (ex.: 29/10/2025).
 * Uma data vazia ou ilegível vira string vazia, e não "Invalid Date".
 */
function formatarDataBR(data) {
    const timestamp = converterDataParaTimestamp(data);
    if (!timestamp) return '';

    return new Date(timestamp).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC',
    });
}
