const perfis = [
    {
        id: 1,
        nome: "Engenheiro de Sistemas",
        categoria: "Construção",
        descricao: "Transforma problemas em soluções e desenvolve tecnologias para superar desafios.",
        imagem: "imagens/perfil-1.jpg",
        recomendacao: "Você ficará responsável por reparar equipamentos, construir ferramentas e manter os sistemas da nave funcionando."
    },
    {
        id: 2,
        nome: "Cientista Explorador",
        categoria: "Investigação",
        descricao: "É curioso, observador e gosta de pesquisar e descobrir como as coisas funcionam.",
        imagem: "imagens/perfil-2.jpg",
        recomendacao: "Você analisará amostras, estudará formas de vida e investigará os mistérios do planeta."
    },
    {
        id: 3,
        nome: "Explorador de Campo",
        categoria: "Exploração",
        descricao: "É aventureiro, gosta de conhecer lugares novos e sabe lidar com situações inesperadas.",
        imagem: "imagens/perfil-3.jpg",
        recomendacao: "Você liderará as explorações fora da nave, mapeará territórios e identificará caminhos seguros."
    },
    {
        id: 4,
        nome: "Estrategista da Missão",
        categoria: "Planejamento",
        descricao: "É organizado, analítico e sabe coordenar pessoas para alcançar objetivos.",
        imagem: "imagens/perfil-4.jpg",
        recomendacao: "Você organizará as operações, coordenará a equipe e ajudará a decidir os próximos passos da missão."
    }
];

const formulario = document.getElementById("formulario");
const campoNome = document.getElementById("nome");
const campoNascimento = document.getElementById("nascimento");
const resultado = document.getElementById("resultado");
const dadosResultado = document.getElementById("dadosResultado");
const botaoRefazer = document.getElementById("refazer");

// Impede a escolha de uma data futura no calendário.
campoNascimento.max = new Date().toLocaleDateString("en-CA");

// Calcula a idade considerando se o aniversário já aconteceu.
function calcularIdade(dataNascimento) {
    const nascimento = new Date(dataNascimento + "T00:00:00");
    const hoje = new Date();

    let idade = hoje.getFullYear() - nascimento.getFullYear();

    const aniversarioAindaNaoChegou =
        hoje.getMonth() < nascimento.getMonth() ||
        (
            hoje.getMonth() === nascimento.getMonth() &&
            hoje.getDate() < nascimento.getDate()
        );

    if (aniversarioAindaNaoChegou) {
        idade--;
    }

    return idade;
}

// Recebe as respostas e calcula a pontuação de cada perfil.
function calcularPerfil() {
    const pontuacao = [0, 0, 0, 0];

    for (let i = 1; i <= 4; i++) {
        const resposta = document.querySelector(
            `input[name="p${i}"]:checked`
        );

        if (resposta) {
            const numeroPerfil = Number(resposta.value);
            pontuacao[numeroPerfil - 1]++;
        }
    }

    const maiorPontuacao = Math.max(...pontuacao);

    const vencedores = pontuacao
        .map((pontos, indice) => ({
            indice: indice,
            pontos: pontos
        }))
        .filter(item => item.pontos === maiorPontuacao);

    return {
        pontuacao: pontuacao,
        vencedores: vencedores
    };
}

// Executa quando a pessoa envia as respostas.
formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = campoNome.value.trim();
    const data = campoNascimento.value;

    // Validação dos campos.
    if (nome === "" || data === "") {
        alert("Preencha seu nome e sua data de nascimento!");
        return;
    }

    const nascimento = new Date(data + "T00:00:00");
    const hoje = new Date();

    if (Number.isNaN(nascimento.getTime()) || nascimento > hoje) {
        alert("Informe uma data de nascimento válida, que não seja futura.");
        return;
    }

    const idade = calcularIdade(data);
    const resultadoTeste = calcularPerfil();
    const vencedores = resultadoTeste.vencedores;

    // Esconde o formulário e apresenta o resultado.
    formulario.hidden = true;
    resultado.hidden = false;

    // Trata a possibilidade de empate.
    if (vencedores.length > 1) {
        const nomesEmpatados = vencedores
            .map(item => perfis[item.indice].nome)
            .join(" e ");

        dadosResultado.innerHTML = `
            <p>Participante: <strong>${escaparHTML(nome)}</strong></p>
            <p>Idade: <strong>${idade} anos</strong></p>
            <h3>Temos um empate!</h3>
            <p>Seus perfis foram: <strong>${nomesEmpatados}</strong>.</p>
            <p>Responda novamente pensando nas suas preferências principais para descobrir seu perfil predominante.</p>
        `;

        return;
    }

    // Localiza o perfil vencedor no array de objetos.
    const perfil = perfis.find(
        item => item.id === vencedores[0].indice + 1
    );

    dadosResultado.innerHTML = `
        <p>Participante: <strong>${escaparHTML(nome)}</strong></p>
        <p>Idade: <strong>${idade} anos</strong></p>

        <h3>${perfil.nome}</h3>
        <p>Categoria: <strong>${perfil.categoria}</strong></p>
        <p>${perfil.descricao}</p>

        <h4>Recomendação para a missão</h4>
        <p>${perfil.recomendacao}</p>

        <img
            src="${perfil.imagem}"
            alt="Ilustração do perfil ${perfil.nome}"
            onerror="this.hidden=true"
        >
    `;
});

// Evita que caracteres digitados no nome sejam interpretados como HTML.
function escaparHTML(texto) {
    return texto.replace(/[&<>"']/g, function(caractere) {
        const caracteres = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return caracteres[caractere];
    });
}

// Permite refazer o teste.
botaoRefazer.addEventListener("click", function() {
    formulario.reset();

    resultado.hidden = true;
    formulario.hidden = false;

    dadosResultado.innerHTML = "";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});