// mines.js: jogo Real Mines
// ---------- Real Mines ----------
let mn = null;
const multMines = (k, m) => { let x = 0.97; for (let i = 0; i < k; i++) x *= (25 - i) / (25 - m - i); return x; };

function renderMines() {
    const ativoJogo = mn && !mn.fim;
    const k = mn ? mn.abertas.size : 0, m = mn ? mn.minas : 3;
    const celulas = Array.from({ length: 25 }, (_, n) => {
        let txt = '', cls = 'bg-brand-dark border-brand-border hover:border-brand-primary';
        if (mn && mn.abertas.has(n)) { txt = '<i class="fa-solid fa-gem text-green-400"></i>'; cls = 'bg-green-900/30 border-green-600'; }
        else if (mn && mn.fim && mn.bombas.has(n)) { txt = '<i class="fa-solid fa-bomb text-red-500"></i>'; cls = 'bg-red-900/30 border-red-700'; }
        return `<button ${ativoJogo ? `onclick="abrirCasa(${n})"` : 'disabled'} class="aspect-square rounded-xl border text-xl cursor-pointer transition-colors ${cls}">${txt}</button>`;
    }).join('');
    $('tab-mines').innerHTML = `
    <div class="bg-brand-card p-5 rounded-2xl border border-brand-border shadow-2xl space-y-4">
        <h2 class="text-xl font-black uppercase italic text-white text-center"><i class="fa-solid fa-bomb text-brand-primary mr-2"></i>Real Mines</h2>
        <div class="grid grid-cols-5 gap-2">${celulas}</div>
        ${ativoJogo ? `
        <div class="text-center text-sm">Multiplicador: <b class="text-brand-primary">${multMines(k, m).toFixed(2)}x</b> | Ganho atual: <b class="text-green-400">${R(mn.aposta * multMines(k, m))}</b></div>
        <button onclick="retirar()" ${k ? '' : 'disabled'} class="w-full bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white font-black py-3 rounded-xl uppercase text-xs cursor-pointer">Retirar ganho</button>`
        : `
        ${mn ? `<div class="text-center text-sm font-bold ${mn.ganhou ? 'text-green-400' : 'text-red-500'}">${mn.msg}</div>` : ''}
        <div class="grid grid-cols-2 gap-3 text-xs text-gray-400">
            <label>Aposta (R$)<input id="mines-bet" type="number" min="1" value="10" class="mt-1 w-full bg-brand-dark border border-brand-border rounded-lg px-2.5 py-2 text-white font-bold outline-none"></label>
            <label>Minas<select id="mines-count" class="mt-1 w-full bg-brand-dark border border-brand-border rounded-lg px-2.5 py-2 text-white font-bold outline-none">
                ${[1, 3, 5, 10, 15].map(n => `<option value="${n}" ${n === 3 ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
        </div>
        <button onclick="iniciarMines()" class="w-full bg-brand-primary hover:bg-brand-primaryHover text-white font-black py-3 rounded-xl uppercase text-xs cursor-pointer">Começar jogo</button>`}
    </div>`;
}
async function iniciarMines() {
    if (precisaLogin()) return;
    const v = parseFloat($('mines-bet').value), m = parseInt($('mines-count').value);
    if (!(v >= 1)) return alert('O valor mínimo é R$ 1,00.');
    if (v > saldo) return alert('Saldo insuficiente. Faça um depósito.');
    if (!(await mudarSaldo(saldo - v))) return;
    const bombas = new Set();
    while (bombas.size < m) bombas.add(Math.floor(Math.random() * 25));
    mn = { aposta: v, minas: m, bombas, abertas: new Set(), fim: false };
    renderMines();
}
async function abrirCasa(n) {
    if (!mn || mn.fim || mn.abertas.has(n)) return;
    if (mn.bombas.has(n)) {
        mn.fim = true; mn.ganhou = false; mn.msg = 'Você acertou numa mina! Perdeu ' + R(mn.aposta) + '.';
        registar('Real Mines: perdeu ' + R(mn.aposta));
    } else {
        mn.abertas.add(n);
        if (mn.abertas.size === 25 - mn.minas) return retirar();
    }
    renderMines();
}
async function retirar() {
    if (!mn || mn.fim || !mn.abertas.size) return;
    const ganho = mn.aposta * multMines(mn.abertas.size, mn.minas);
    mn.fim = true;
    if (await mudarSaldo(saldo + ganho)) { mn.ganhou = true; mn.msg = 'Retirou ' + R(ganho) + '!'; registar('Real Mines: ganhou ' + R(ganho)); }
    else { mn.ganhou = false; mn.msg = 'Erro ao creditar o ganho.'; }
    renderMines();
}
