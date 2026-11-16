# Exercícios progressivos para aprender sem copiar

Marque à medida que conseguir. Os arquivos prontos do projeto são o **gabarito comentado**.

## Nível 1 — Básico (10–15 min)
- [ ] Abra `public/votacao.html` e encontre o ID da área em que os cards aparecem.
- [ ] Localize no JS a linha que chama `addEventListener('click', ...)`.
- [ ] Modifique só o texto do botão de votar.
- [ ] Adicione um participante ao `db.json` e veja aparecer na página sem mudar o HTML.

## Nível 2 — DOM e eventos (15 min)
- [ ] No `votacao.js`, mostre `console.log(participante.nome)` ao clicar em um botão.
- [ ] Mostre o nome do participante escolhido em um elemento `<p>`.
- [ ] Explique a diferença entre `textContent` e `innerHTML`.

## Nível 3 — GET e POST (20 min)
- [ ] Abra `/participantes?naRoca=true` no navegador e explique a query string.
- [ ] Encontre a função `API.votar()`; diga o que `method`, `headers` e `body` fazem.
- [ ] Vote e verifique o registro adicionado em `db.json`.

## Nível 4 — Resultado e DELETE (15–20 min)
- [ ] Explique a conta `(quantidade / total) * 100`.
- [ ] Com zero votos, confirme que não ocorre divisão por zero.
- [ ] Zere a votação usando o modal; encontre o `for...of` de exclusão.
- [ ] Explique por que excluir `/votos/1` é diferente de `/participantes/1`.

## Nível 5 — Bootstrap e CRUD extra (20 min)
- [ ] Reduza a janela e veja a navbar se recolher.
- [ ] Troque `row-cols-md-3` por `row-cols-md-2` e observe o layout.
- [ ] No CRUD extra, crie um participante, edite e depois altere seu status.
- [ ] Localize `preventDefault()` no envio do formulário.

## Desafio final
**Enunciado:** crie uma página chamada `estatisticas.html` que consulta GET `/participantes`, mostra total de participantes e conta quantos têm `naRoca=true`. Use Bootstrap para duas caixas e JavaScript para preencher os números. Não escreva os números manualmente no HTML.

**Conselho:** primeiro deixe o GET aparecer no console; depois faça os contadores; por último formate o Bootstrap.
