# GUIA RÁPIDO DE DIW — PARA LER NO VS CODE

Use `Ctrl + F` para localizar o nome do assunto. **Este arquivo é um roteiro de estudo, não uma substituição da prática.**

## 1. HTML mínimo e JavaScript

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="vendor/bootstrap/bootstrap.min.css">
  <script src="js/script.js" defer></script>
</head>
<body>
  <button id="btn">Clique</button>
  <p id="saida">0</p>
</body>
</html>
```

```js
let numero = 0;
const btn = document.getElementById('btn');
const saida = document.getElementById('saida');
btn.addEventListener('click', () => {
    numero++;
    saida.textContent = numero;
});
```

- `getElementById`: procura um elemento.
- `textContent`: altera texto.
- `addEventListener('click', ...)`: reage a clique.
- `defer`: executa script depois de analisar o HTML.
- `let`: valor pode mudar; `const`: variável não pode receber outra referência.

## 2. Array + forEach + DOM

```js
const pessoas = [{id: 1, nome: 'Ana'}, {id: 2, nome: 'Bruno'}];
const lista = document.getElementById('lista');
lista.replaceChildren();
pessoas.forEach(pessoa => {
    const titulo = document.createElement('h3');
    titulo.textContent = pessoa.nome;
    lista.appendChild(titulo);
});
```

A cada elemento do array, crie um elemento HTML. **Não escreva todos os participantes no HTML se a prova exigir dados dinâmicos.**

## 3. Fetch GET — buscar dados

```js
async function carregar() {
    try {
        const resposta = await fetch('/participantes?naRoca=true');
        if (!resposta.ok) throw new Error('HTTP ' + resposta.status);
        const dados = await resposta.json();
        console.log(dados);
    } catch (erro) {
        console.error(erro);
    }
}
carregar();
```

- `fetch` faz requisição HTTP e retorna Promise.
- `await` aguarda a Promise dentro de função `async`.
- `resposta.json()` interpreta o conteúdo JSON.
- `resposta.ok` é importante porque HTTP 404 não rejeita automaticamente o `fetch`.
- `/participantes?naRoca=true` é filtro de URL (query string).

## 4. Fetch POST — cadastrar / votar

```js
await fetch('/votos', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        participanteId: 1,
        data: new Date().toISOString()
    })
});
```

- `JSON.stringify` converte objeto JS em texto JSON.
- `participanteId` relaciona o voto ao participante.
- `id` do voto é um identificador diferente, gerado pelo servidor.

## 5. Fetch PUT e PATCH — atualizar

```js
await fetch('/participantes/1', {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({nome:'Ana', estilo:'MPB', foto:'img/aurora.svg', naRoca:true})
});
```

`PUT` substitui o registro. Para mudar só uma propriedade, use `PATCH`:

```js
await fetch('/participantes/1', {
    method: 'PATCH',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({naRoca:false})
});
```

## 6. Fetch DELETE — excluir

```js
await fetch('/votos/5', {method: 'DELETE'});
```

Para apagar **todos**:

```js
const resposta = await fetch('/votos');
const votos = await resposta.json();
for (const voto of votos) {
    await fetch(`/votos/${voto.id}`, {method:'DELETE'});
}
```

## 7. Porcentagens, filtro e ordenação

```js
const quantidade = votos.filter(v => v.participanteId === participante.id).length;
const percentual = votos.length > 0 ? quantidade / votos.length * 100 : 0;
const resultados = [{nome:'Ana', votos:10}, {nome:'Bruno', votos:3}];
resultados.sort((a, b) => b.votos - a.votos); // decrescente
```

**Atenção:** quando um ID é string e o outro número, normalize com `Number(...)` antes de comparar.

## 8. Bootstrap 5 — classes fundamentais

| O que fazer | Classe |
|---|---|
| Container centralizado | `container` |
| Linha | `row` |
| Metade da largura a partir de md | `col-md-6` |
| 1 coluna móvel, 3 a partir de md | `row-cols-1 row-cols-md-3` |
| Menu com colapso | `navbar navbar-expand-md`, `navbar-toggler`, `collapse navbar-collapse` |
| Card | `card`, `card-img-top`, `card-body` |
| Botão vermelho e largo | `btn btn-danger w-100` |
| Imagem circular/responsiva | `rounded-circle img-fluid` |
| Badge | `badge text-bg-danger` |
| Alerta de sucesso | `alert alert-success` |
| Barra de progresso | `progress`, `progress-bar`, `style="width: 70%"` |
| Modal | `modal`, `modal-dialog`, `modal-content`, `data-bs-toggle="modal"` |

**Navbar e modal exigem o JS do Bootstrap:** `bootstrap.bundle.min.js`.

## 9. Formulários

```html
<form id="form">
  <input id="nome" required>
  <button type="submit">Salvar</button>
</form>
```

```js
document.getElementById('form').addEventListener('submit', async evento => {
    evento.preventDefault();  // impede recarregar
    const nome = document.getElementById('nome').value.trim();
    // depois use POST /participantes com esse nome
});
```

## 10. Ordem para montar uma prova prática

1. Criar `package.json`, `db.json`, `public/` e rodar o servidor.
2. Testar API diretamente (`/participantes`, `/votos`).
3. Montar HTML das páginas e links da navbar.
4. Carregar CSS e bundle JavaScript do Bootstrap.
5. Criar uma função GET e mostrar dados no console.
6. Montar os cards com `forEach` + DOM.
7. Colocar botões e eventos.
8. Implementar POST/DELETE e verificar o banco.
9. Calcular percentuais e atualizar o DOM.
10. Testar estados vazios, erro HTTP, mobile e recarregamento.

## 11. Diagnóstico rápido

- Tela vazia? `F12` → **Console**.
- Script dá 404/MIME `application/json`? Caminho errado ou static não configurado.
- API dá 404? Endpoint diferente do `db.json`.
- `Cannot read properties of null`? `id` não existe ou script executou cedo demais.
- `.forEach is not a function`? Resposta não é array (verifique JSON e rota).
- Não salva no banco? Verifique `method`, `Content-Type` e `JSON.stringify`.
- Página foi aberta com `file:///`? Abra via `localhost:3000`.
