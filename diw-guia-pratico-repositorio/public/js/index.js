/* HOME: GET com filtro + cards dinâmicos. */
async function carregarHome() {
    try {
        // Promise.all permite aguardar ambas as consultas.
        const [naRoca, foraDaRoca] = await Promise.all([
            API.listarParticipantes(true),
            API.listarParticipantes(false)
        ]);
        document.getElementById('qtdRoca').textContent = naRoca.length;
        document.getElementById('qtdFora').textContent = foraDaRoca.length;

        const area = document.getElementById('destaques');
        area.replaceChildren();
        if (naRoca.length === 0) {
            area.appendChild(mensagemVazia('Ainda não há participantes na berlinda.'));
        }
        naRoca.forEach(participante => {
            area.appendChild(criarCard(participante));
        });
    } catch (erro) {
        mostrarAviso('danger', `Não foi possível carregar a página: ${erro.message}`);
    }
}
carregarHome();
