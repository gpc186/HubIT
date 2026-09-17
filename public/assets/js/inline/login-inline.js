// Extraído do <script> inline de public/login.html durante a migração para Next.js.

        function focar() {
            document.getElementById('email').focus();
        }

        function aparecerPlanInd() {
            const btnInd = document.getElementById('btnInd');
            const btnEmp = document.getElementById('btnEmp');
            const plansInd = document.getElementById('plansInd');
            const plansInd2 = document.getElementById('plansInd2')
            const plansEmp = document.getElementById('plansEmp');


            plansEmp.style.display = 'none';
            plansInd.style.display = 'block';
            btnInd.style.background = '#357ab8';
            btnEmp.style.background = '#2F6D88';
            plansInd2.style.display = 'block';

        }

        function aparecerPlanEmp() {
            const btnInd = document.getElementById('btnInd');
            const btnEmp = document.getElementById('btnEmp');
            const plansInd = document.getElementById('plansInd');
            const plansInd2 = document.getElementById('plansInd2')
            const plansEmp = document.getElementById('plansEmp');

            plansEmp.style.display = 'block';
            btnEmp.style.background = '#357ab8';
            btnInd.style.background = '#2F6D88';
            plansInd.style.display = 'none';
            plansInd2.style.display = 'none';
        }

        var email = document.getElementById('email');
        var emailHasFocus = (document.activeElement === email);

        var passwd = document.getElementById('passwd');
        var passwdHasFocus = (document.activeElement === passwd);

        document.addEventListener('keydown', (e) => {
            if (e.key === "Enter") {
                const elementoAtivo = document.activeElement;
                if (elementoAtivo === email || elementoAtivo === passwd) {
                    fazerLogin();
                }
            }
        });

        // Seleciona o elemento de texto que será animado
        const textAlt = document.getElementById('text-alt');

        // Lista de palavras que serão exibidas no efeito máquina de escrever
        const palavrasAlt = ["futuro.", "Hubit.", "amanhã.", "sucesso.", "código.", "upgrade.", "legado.", "impacto."];

        // Índice da palavra atual no array
        let palavraIndex = 0;

        // Índice do caractere atual da palavra
        let charIndex = 0;

        // Flag para indicar se está apagando (true) ou escrevendo (false)
        let apagando = false;

        /**
         * Função principal do efeito máquina de escrever.
         * Escreve e apaga as palavras do array 'palavrasAlt' no elemento 'textAlt'.
         */
        function typeWriter() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                textAlt.textContent = 'futuro.';
                setTimeout(typeWriter, 1300);
                return;
            }
            // Palavra atual a ser exibida
            const palavraAtual = palavrasAlt[palavraIndex];

            if (!apagando) { // Se não estiver apagando, escreve letra por letra
                textAlt.textContent = palavraAtual.substring(0, charIndex + 1); // Atualiza o texto exibido
                charIndex++; // Avança para o próximo caractere

                // Se terminou de escrever a palavra inteira
                if (charIndex === palavraAtual.length) {
                    apagando = true; // Muda para modo de apagar
                    setTimeout(typeWriter, 1300); // Espera 1.3s antes de começar a apagar
                    return;
                }
            } else { // Se estiver apagando, remove letra por letra
                textAlt.textContent = palavraAtual.substring(0, charIndex - 1); // Atualiza o texto exibido
                charIndex--; // Volta para o caractere anterior

                // Se terminou de apagar toda a palavra
                if (charIndex === 0) {
                    apagando = false; // Muda para modo de escrever
                    palavraIndex = (palavraIndex + 1) % palavrasAlt.length; // Vai para a próxima palavra (loop)
                }
            }

            // Define a velocidade de digitação e de apagar
            setTimeout(typeWriter, apagando ? 50 : 100); // 50ms para apagar, 100ms para escrever
        }

        // Inicia o efeito ao carregar a página
        typeWriter();
    