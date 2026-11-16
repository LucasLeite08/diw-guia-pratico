/* VOTAÇÃO: GET com filtro + addEventListener + POST. */
let votosNestaAba = Number(sessionStorage.getItem('votosNestaAba') || 0); // Guarda só a CONTAGEM; os votos reais ficam em db.json.
document.getElementById('meusVotos').textContent = votosNestaAba;

async function registrarVoto(id, nome, botao) {
    botao.disabled = true;
    try {
        await API.votar(id); // POST /votos
        votosNestaAba++;
        sessionStorage.setItem('votosNestaAba', String(votosNestaAba));
        document.getElementById('meusVotos').textContent = votosNestaAba;
        mostrarAviso('success', `Voto registrado para ${nome}! Você votou ${votosNestaAba} vez(es) nesta aba.`);
    } catch (erro) {
        mostrarAviso('danger', `Erro ao votar: ${erro.message}`);
    } finally {
        botao.disabled = false;
    }
}

async function carregarVotacao() {
    try {
        const [naRoca, foraDaRoca] = await Promise.all([
            API.listarParticipantes(true),
            API.listarParticipantes(false)
        ]);
        const areaRoca = document.getElementById('listaRoca');
        const areaOutros = document.getElementById('listaOutros');
        areaRoca.replaceChildren();
        areaOutros.replaceChildren();
        if (naRoca.length === 0) areaRoca.appendChild(mensagemVazia('Nenhum participante na berlinda.'));
        naRoca.forEach(participante => {
            const coluna = criarCard(participante, true);
            const botao = coluna.querySelector('button');
            botao.addEventListener('click', () => registrarVoto(participante.id, participante.nome, botao));
            areaRoca.appendChild(coluna);
        });
        if (foraDaRoca.length === 0) areaOutros.appendChild(mensagemVazia('Nenhum outro participante cadastrado.'));
        foraDaRoca.forEach(participante => {
            areaOutros.appendChild(criarCard(participante, false));
        });
    } catch (erro) {
        mostrarAviso('danger', `Não foi possível carregar participantes: ${erro.message}`);
    }
}
carregarVotacao();
