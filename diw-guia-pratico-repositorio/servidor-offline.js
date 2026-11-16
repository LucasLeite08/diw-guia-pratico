/*
 * Servidor de treino alternativo, sem npm, escrito em Node.js nativo.
 * Oferece API REST simples + arquivos estáticos para estudar offline.
 * A prova, quando exigir JSON Server, deve ser executada com npm.cmd start.
 */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const {URL} = require('node:url');
const PORTA = 3000;
const RAIZ = __dirname;
const PUBLIC = path.join(RAIZ, 'public');
const BANCO = path.join(RAIZ, 'db.json');

const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.json':'application/json; charset=utf-8','.ico':'image/x-icon'};
function lerBanco() { return JSON.parse(fs.readFileSync(BANCO, 'utf8')); }
function salvarBanco(db) { fs.writeFileSync(BANCO, JSON.stringify(db, null, 2) + '\n'); }
function json(res, codigo, valor) {
    res.writeHead(codigo, {'Content-Type':'application/json; charset=utf-8', 'Access-Control-Allow-Origin':'*'});
    res.end(codigo === 204 ? '' : JSON.stringify(valor));
}
async function lerCorpo(req) {
    let corpo = '';
    for await (const trecho of req) {
        corpo += trecho;
        if (corpo.length > 1_000_000) throw new Error('Corpo muito grande');
    }
    return corpo ? JSON.parse(corpo) : {};
}
async function servidor(req, res) {
    try {
        const url = new URL(req.url, `http://localhost:${PORTA}`);
        const partes = url.pathname.split('/').filter(Boolean);
        if (['participantes','votos'].includes(partes[0])) {
            const colecao = partes[0];
            if (partes.length > 2) return json(res,404,{error:'Not Found'});
            const id = partes[1];
            const db = lerBanco();
            const lista = db[colecao];
            if (req.method === 'GET') {
                if (id) {
                    const registro = lista.find(item => String(item.id) === id);
                    return registro ? json(res,200,registro) : json(res,404,{error:'Not Found'});
                }
                let filtrados = lista;
                for (const [campo,valor] of url.searchParams) {
                    filtrados = filtrados.filter(item => String(item[campo]) === valor);
                }
                return json(res,200,filtrados);
            }
            if (req.method === 'POST' && !id) {
                const novo = await lerCorpo(req);
                if (typeof novo !== 'object' || !novo || Array.isArray(novo)) return json(res,400,{error:'Objeto JSON obrigatório'});
                const maior = lista.reduce((acc,item)=>Math.max(acc, Number(item.id) || 0), 0);
                const registro = {...novo, id: maior + 1};
                lista.push(registro);
                salvarBanco(db);
                return json(res,201,registro);
            }
            if (id && ['PUT','PATCH','DELETE'].includes(req.method)) {
                const i = lista.findIndex(item => String(item.id) === id);
                if (i === -1) return json(res,404,{error:'Not Found'});
                if (req.method === 'DELETE') {
                    lista.splice(i,1);
                    salvarBanco(db);
                    return json(res,200,{});
                }
                const dados = await lerCorpo(req);
                if (!dados || typeof dados !== 'object' || Array.isArray(dados)) return json(res,400,{error:'Objeto JSON obrigatório'});
                if (req.method === 'PUT') lista[i] = {...dados,id:lista[i].id};
                else lista[i] = {...lista[i],...dados,id:lista[i].id};
                salvarBanco(db);
                return json(res,200,lista[i]);
            }
            return json(res,405,{error:'Método não permitido'});
        }
        if (req.method !== 'GET') return json(res,405,{error:'Método não permitido'});
        // Caminhos do frontend: / vira public/index.html.
        const alvo = path.resolve(PUBLIC, '.' + (url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname)));
        if (!alvo.startsWith(PUBLIC + path.sep)) return json(res,403,{error:'Forbidden'});
        if (!fs.existsSync(alvo) || !fs.statSync(alvo).isFile()) return json(res,404,{error:'Not Found'});
        res.writeHead(200, {'Content-Type': mime[path.extname(alvo)] || 'application/octet-stream'});
        fs.createReadStream(alvo).pipe(res);
    } catch (erro) {
        console.error(erro);
        json(res,500,{error:erro.message});
    }
}
http.createServer(servidor).listen(PORTA, () => console.log(`Servidor de treino: http://localhost:${PORTA}`));
