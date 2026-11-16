/* CRUD EXTRA: GET + POST + PUT + PATCH + DELETE. */
let participantesCache = [];
const form = document.getElementById('formParticipante');
const botaoSalvar = document.getElementById('salvar');

function limparFormulario() {
    form.reset();
    document.getElementById('participanteId').value = '';
    document.getElementById('tituloForm').textContent = 'Novo participante';
    document.getElementById('cancelar').classList.add('d-none');
}

function editarParticipante(participante) {
    document.getElementById('participanteId').value = participante.id;
    document.getElementById('nome').value = participante.nome;
    document.getElementById('estilo').value = participante.estilo || '';
    document.getElementById('descricao').value = participante.descricao || '';
    document.getElementById('foto').value = participante.foto;
    document.getElementById('naRoca').checked = participante.naRoca;
    document.getElementById('tituloForm').textContent = `Editando ID ${participante.id}`;
    document.getElementById('cancelar').classList.remove('d-none');
    document.getElementById('nome').focus();
}

async function excluirParticipante(id) {
    if (!confirm('Excluir este participante e os votos associados?')) return;
    try {
        // Se removemos um participante, apagamos também seus votos para não deixar dados órfãos.
        const votos = await API.listarVotos();
        for (const voto of votos) {
            if (Number(voto.participanteId) === Number(id)) await API.apagarVoto(voto.id);
        }
        await API.excluirParticipante(id);
        await listarAdmin();
        mostrarAviso('success', 'Participante excluído.');
    } catch (erro) { mostrarAviso('danger', `Erro ao excluir: ${erro.message}`); }
}

async function alternarStatus(participante) {
    try {
        // PATCH modifica só a propriedade naRoca (em vez de enviar o objeto completo).
        await API.mudarStatus(participante.id, !participante.naRoca);
        await listarAdmin();
        mostrarAviso('success', 'Status atualizado com PATCH.');
    } catch (erro) { mostrarAviso('danger', `Erro ao atualizar status: ${erro.message}`); }
}

function construirLinhaAdmin(participante) {
    const linha = document.createElement('div');
    linha.className = 'admin-row shadow-sm';
    const img = document.createElement('img');
    img.src = participante.foto;
    img.alt = '';
    img.className = 'admin-thumb';
    const dados = document.createElement('div');
    dados.className = 'admin-text';
    const nome = document.createElement('h3');
    nome.className = 'h6 mb-1';
    nome.textContent = `${participante.nome} (ID ${participante.id})`;
    const descricao = document.createElement('p');
    descricao.className = 'small text-secondary mb-0';
    descricao.textContent = `${participante.estilo || ''} • ${participante.naRoca ? 'Na berlinda' : 'Fora da berlinda'}`;
    dados.append(nome, descricao);
    const acoes = document.createElement('div');
    acoes.className = 'admin-actions';
    const editar = document.createElement('button');
    editar.type = 'button'; editar.className = 'btn btn-sm btn-outline-primary'; editar.textContent = 'Editar';
    editar.addEventListener('click', () => editarParticipante(participante));
    const status = document.createElement('button');
    status.type = 'button'; status.className = 'btn btn-sm btn-outline-secondary'; status.textContent = 'Alterar status';
    status.addEventListener('click', () => alternarStatus(participante));
    const excluir = document.createElement('button');
    excluir.type = 'button'; excluir.className = 'btn btn-sm btn-outline-danger'; excluir.textContent = 'Excluir';
    excluir.addEventListener('click', () => excluirParticipante(participante.id));
    acoes.append(editar, status, excluir);
    linha.append(img, dados, acoes);
    return linha;
}

async function listarAdmin() {
    try {
        participantesCache = await API.listarParticipantes();
        document.getElementById('total').textContent = `${participantesCache.length} registro(s)`;
        const area = document.getElementById('listaAdmin');
        area.replaceChildren();
        participantesCache.forEach(p => area.appendChild(construirLinhaAdmin(p)));
    } catch (erro) { mostrarAviso('danger', `Erro ao listar: ${erro.message}`); }
}

form.addEventListener('submit', async evento => {
    evento.preventDefault(); // Não recarregar a página quando o formulário for enviado.
    botaoSalvar.disabled = true;
    const id = document.getElementById('participanteId').value;
    const dados = {
        nome: document.getElementById('nome').value.trim(),
        estilo: document.getElementById('estilo').value.trim(),
        descricao: document.getElementById('descricao').value.trim(),
        foto: document.getElementById('foto').value,
        naRoca: document.getElementById('naRoca').checked
    };
    if (!dados.nome || !dados.estilo) {
        mostrarAviso('warning', 'Preencha nome e estilo.');
        botaoSalvar.disabled = false;
        return;
    }
    try {
        if (id) {
            // PUT substitui os dados do participante existente.
            await API.substituirParticipante(id, dados);
        } else {
            // POST cria um participante novo (id gerado pelo servidor).
            await API.criarParticipante(dados);
        }
        limparFormulario();
        await listarAdmin();
        mostrarAviso('success', id ? 'Participante editado com PUT.' : 'Participante cadastrado com POST.');
    } catch (erro) { mostrarAviso('danger', `Falha ao salvar: ${erro.message}`); }
    finally { botaoSalvar.disabled = false; }
});

document.getElementById('cancelar').addEventListener('click', limparFormulario);
listarAdmin();
