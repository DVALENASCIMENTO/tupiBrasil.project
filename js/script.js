document.addEventListener("DOMContentLoaded", () => {
    const quizButton = document.getElementById("startQuiz");
    let knownWords = 0; // Contagem de palavras que o usuário conhece

    // Função para carregar o quiz JSON
    const loadQuiz = async () => {
        try {
            const response = await fetch('quiz_data.json');
            const quizData = await response.json();
            startQuiz(quizData);
        } catch (error) {
            console.error("Erro ao carregar o quiz:", error);
        }
    };

    // Função para iniciar o quiz
    const startQuiz = (quizData) => {
        const quizContainer = document.getElementById("quiz");
        quizContainer.innerHTML = "";  // Limpa o conteúdo anterior
        knownWords = 0; // Zera o contador de palavras conhecidas

        quizData.Animais.forEach((animal, index) => {
            const question = document.createElement("div");
            question.classList.add("question");

            question.innerHTML = `
                <p>Você conhece o significado da palavra "${animal.nome}"?</p>
                <button class="option" data-known="yes">Sim</button>
                <button class="option" data-known="no">Não</button>
            `;

            quizContainer.appendChild(question);

            // Adiciona evento para capturar se o usuário conhece ou não a palavra
            question.querySelectorAll('.option').forEach(button => {
                button.addEventListener('click', () => {
                    if (button.getAttribute('data-known') === "yes") {
                        knownWords++; // Incrementa se o usuário conhecer a palavra
                    }

                    // Desabilita os botões após resposta
                    question.querySelectorAll('button').forEach(btn => btn.disabled = true);

                    // Exibe o resultado após a última pergunta
                    if (index === quizData.Animais.length - 1) {
                        showResult();
                    }
                });
            });
        });
    };

    // Função para exibir o resultado final
    const showResult = () => {
        const quizContainer = document.getElementById("quiz");
        const totalQuestions = document.querySelectorAll('.question').length;

        setTimeout(() => {
            quizContainer.innerHTML = `<h2>Você conhece ${knownWords} de ${totalQuestions} palavras!</h2>`;
        }, 500);
    };

    // Evento de clique para iniciar o quiz
    quizButton.addEventListener("click", loadQuiz);

    // Lógica para carregar tópicos adicionais
    const topicButtons = document.querySelectorAll(".topic");

    topicButtons.forEach(button => {
        button.addEventListener("click", async (event) => {
            const topic = event.target.getAttribute("data-topic");
            const response = await fetch(`${topic}.json`);
            const topicData = await response.json();
            displayTopic(topicData);
        });
    });

    const displayTopic = (topicData) => {
        const quizContainer = document.getElementById("quiz");
        quizContainer.innerHTML = `<h3>${topicData.title}</h3><p>${topicData.description}</p>`;
    };
});
