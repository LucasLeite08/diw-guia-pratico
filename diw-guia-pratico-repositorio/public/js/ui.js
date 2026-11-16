/* Funções reutilizáveis de apresentação e DOM. */
function mostrarAviso(tipo, mensagem) {
    const area = document.getElementById('aviso');
    if (!area) return;
    area.replaceChildren();
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
    alerta.setAttribute('role', 'alert');
    alerta.textContent = mensagem;
    const fechar = document.createElement('button');
    fechar.type = 'button';
    fechar.className = 'btn-close';
    fechar.setAttribute('aria-label', 'Fechar');
    fechar.setAttribute('data-bs-dismiss', 'alert');
    alerta.appendChild(fechar);
    area.appendChild(alerta);
}

/*
 * Cria um card Bootstrap de um participante recebido da API.
 * Os textos vindos do usuário são colocados com textContent (não innerHTML).
 */
function criarCard(participante, comBotao = false) {
    const coluna = document.createElement('div');
    coluna.className = 'col';

    const card = document.createElement('article');
    card.className = 'card card-festival h-100 shadow-sm';

    const img = document.createElement('img');
    img.className = 'card-img-top' + (comBotao ? '' : ' img-small');
    img.src = participante.foto;
    img.alt = `Arte de ${participante.nome}`;
    card.appendChild(img);

    const corpo = document.createElement('div');
    corpo.className = 'card-body d-flex flex-column';

    if (participante.naRoca) {
        const etiqueta = document.createElement('span');
        etiqueta.className = 'badge text-bg-danger align-self-start mb-2';
        etiqueta.textContent = 'Na berlinda';
        corpo.appendChild(etiqueta);
    }

    const titulo = document.createElement('h3');
    titulo.className = 'card-title h5';
    titulo.textContent = participante.nome;
    corpo.appendChild(titulo);

    const estilo = document.createElement('p');
    estilo.className = 'text-secondary small mb-1';
    estilo.textContent = participante.estilo || '';
    corpo.appendChild(estilo);

    const descricao = document.createElement('p');
    descricao.className = 'card-text small text-secondary flex-grow-1';
    descricao.textContent = participante.descricao || '';
    corpo.appendChild(descricao);

    if (comBotao) {
        const botao = document.createElement('button');
        botao.className = 'btn btn-danger w-100 mt-2';
        botao.type = 'button';
        botao.textContent = 'Votar para eliminar';
        // O evento é adicionado pela página votacao.js.
        botao.dataset.participanteId = participante.id;
        botao.dataset.participanteNome = participante.nome;
        corpo.appendChild(botao);
    }

    card.appendChild(corpo);
    coluna.appendChild(card);
    return coluna;
}

function mensagemVazia(texto) {
    const p = document.createElement('p');
    p.className = 'text-secondary';
    p.textContent = texto;
    return p;
}
