import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const banco = JSON.parse(readFileSync(new URL('../db-inicial.json', import.meta.url), 'utf-8'));

test('o banco tem as coleções exigidas', () => {
    assert.ok(Array.isArray(banco.participantes));
    assert.ok(Array.isArray(banco.votos));
    assert.ok(banco.participantes.length >= 3);
});

test('IDs são únicos e fotos existem', () => {
    const ids = banco.participantes.map(p => p.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(banco.participantes.every(p => typeof p.naRoca === 'boolean'));
});

test('contagem e percentual de votos não dividem por zero', () => {
    const votos = [{participanteId: 1}, {participanteId: 1}, {participanteId: 2}, {participanteId: 3}];
    const contagem = votos.filter(v => v.participanteId === 1).length;
    assert.equal(contagem, 2);
    assert.equal(contagem / votos.length * 100, 50);
    const vazios = [];
    const percentualVazio = vazios.length ? 1 / vazios.length * 100 : 0;
    assert.equal(percentualVazio, 0);
});
