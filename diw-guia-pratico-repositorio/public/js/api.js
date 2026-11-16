/*
 * CAMADA DA API: todas as requisições HTTP ficam neste arquivo.
 * Ao mudar de projeto, normalmente você só altera os caminhos e os campos.
 */
const API = {
    async requisitar(caminho, opcoes = {}) {
        const resposta = await fetch(caminho, opcoes);
        if (!resposta.ok) {
            throw new Error(`HTTP ${resposta.status}: ${resposta.statusText}`);
        }
        // DELETE normalmente retorna um corpo vazio; não tente fazer .json() nesse caso.
        if (resposta.status === 204) return null;
        const texto = await resposta.text();
        return texto ? JSON.parse(texto) : null;
    },

    // GET com query string: GET /participantes?naRoca=true
    listarParticipantes(naRoca = null) {
        const filtro = naRoca === null ? '' : `?naRoca=${naRoca}`;
        return this.requisitar(`/participantes${filtro}`);
    },
    listarVotos() {
        return this.requisitar('/votos');
    },

    // POST: objeto JavaScript -> JSON.stringify -> servidor
    votar(participanteId) {
        return this.requisitar('/votos', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                participanteId: Number(participanteId),
                data: new Date().toISOString()
            })
        });
    },

    // DELETE de cada registro de voto
    apagarVoto(id) {
        return this.requisitar(`/votos/${id}`, {method: 'DELETE'});
    },

    // CRUD extra: participantes
    criarParticipante(dados) {
        return this.requisitar('/participantes', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dados)
        });
    },
    substituirParticipante(id, dados) {
        return this.requisitar(`/participantes/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dados)
        });
    },
    mudarStatus(id, naRoca) {
        return this.requisitar(`/participantes/${id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({naRoca})
        });
    },
    excluirParticipante(id) {
        return this.requisitar(`/participantes/${id}`, {method: 'DELETE'});
    }
};
