/* RESULTADO: GET, filter(), sort(), porcentagem, progress-bar e DELETE. */
function calcularResultados(participantes, votos) {
    const total = votos.length;
    const resultados = participantes.map(participante => {
        const quantidade = votos.filter(voto => Number(voto.participanteId) === Number(participante.id)).length;
        const percentual = total > 0 ? (quantidade / total) * 100 : 0;
        return {participante, quantidade, percentual};
    });
    // Ordenar do mais votado para o menos votado.
    resultados.sort((a, b) => b.quantidade - a.quantidade);
    return {total, resultados};
}

function criarLinhaResultado(item, lider) {
    const div = document.createElement('div');
    div.className = 'resultado-item' + (lider ? ' lider' : '');
    const topo = document.createElement('div');
    topo.className = 'd-flex align-items-center gap-3 mb-3';
    const foto = document.createElement('img');
    foto.className = 'resultado-thumb';
    foto.src = item.participante.foto;
    foto.alt = `Arte de ${item.participante.nome}`;
    const nomes = document.createElement('div');
    nomes.className = 'flex-grow-1';
    const titulo = document.createElement('h2');
    titulo.className = 'h5 mb-1';
    titulo.textContent = item.participante.nome;
    nomes.appendChild(titulo);
    const detalhe = document.createElement('div');
    detalhe.className = 'small text-secondary';
    detalhe.textContent = `${item.quantidade} voto(s) • ${item.percentual.toFixed(1)}%`;
    nomes.appendChild(detalhe);
    if (lider) {
        const badge = document.createElement('span');
        badge.className = 'badge text-bg-warning mt-1';
        badge.textContent = 'Sairia hoje';
        nomes.appendChild(badge);
    }
    topo.append(foto, nomes);
    const progress = document.createElement('div');
    progress.className = 'progress';
    progress.setAttribute('role', 'progressbar');
    progress.setAttribute('aria-valuemin', '0');
    progress.setAttribute('aria-valuemax', '100');
    progress.setAttribute('aria-valuenow', String(item.percentual.toFixed(1)));
    progress.setAttribute('aria-label', `Percentual de ${item.participante.nome}`);
    const barra = document.createElement('div');
    barra.className = 'progress-bar';
    barra.style.width = `${item.percentual}%`;
    barra.textContent = `${item.percentual.toFixed(1)}%`;
    progress.appendChild(barra);
    div.append(topo, progress);
    return div;
}

async function carregarResultados() {
    try {
        const [participantes, votos] = await Promise.all([
            API.listarParticipantes(true), API.listarVotos()
        ]);
        const {total, resultados} = calcularResultados(participantes, votos);
        document.getElementById('totalVotos').textContent = total;
        const area = document.getElementById('listaResultados');
        area.replaceChildren();
        if (total === 0) {
            area.appendChild(mensagemVazia('Ainda não há votos. Acesse Votar para iniciar a votação!'));
            return;
        }
        // Só há líder com votos > 0. Se houver empate, o primeiro da ordenação é destacado.
        resultados.forEach((item, indice) => {
            area.appendChild(criarLinhaResultado(item, indice === 0 && item.quantidade > 0));
        });
    } catch (erro) {
        mostrarAviso('danger', `Não foi possível carregar resultados: ${erro.message}`);
    }
}

async function zerarVotacao() {
    const botao = document.getElementById('confirmarZerar');
    botao.disabled = true;
    try {
        const votos = await API.listarVotos();
        // Para cada voto, DELETE /votos/:id (uma requisição por registro).
        for (const voto of votos) await API.apagarVoto(voto.id);
        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalZerar')).hide();
        await carregarResultados();
        mostrarAviso('success', 'Todos os votos foram apagados.');
    } catch (erro) {
        mostrarAviso('danger', `Falha ao zerar: ${erro.message}`);
    } finally {
        botao.disabled = false;
    }
}

document.getElementById('atualizar').addEventListener('click', carregarResultados);
document.getElementById('confirmarZerar').addEventListener('click', zerarVotacao);
carregarResultados();
