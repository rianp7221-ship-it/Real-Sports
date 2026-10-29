// sports.js: jogos, odds e boletim de apostas
let selectedBets = [];

// ---------- Jogos e odds ----------
const jogos = [
    { id: 1, liga: 'Brasileirão', casa: 'Flamengo', fora: 'Palmeiras', hora: 'Hoje 21:30', o: [2.10, 3.20, 3.40] },
    { id: 2, liga: 'Brasileirão', casa: 'Corinthians', fora: 'São Paulo', hora: 'Hoje 19:00', o: [2.45, 3.05, 2.90] },
    { id: 3, liga: 'Premier League', casa: 'Arsenal', fora: 'Chelsea', hora: 'Amanhã 13:30', o: [1.85, 3.60, 4.20] },
    { id: 4, liga: 'La Liga', casa: 'Real Madrid', fora: 'Barcelona', hora: 'Amanhã 17:00', o: [2.20, 3.40, 3.10] },
    { id: 5, liga: 'Série A', casa: 'Inter', fora: 'Juventus', hora: 'Sábado 15:45', o: [2.30, 3.10, 3.20] },
    { id: 6, liga: 'Liga Portugal', casa: 'Benfica', fora: 'Porto', hora: 'Sábado 18:00', o: [2.05, 3.30, 3.60] },
    { id: 7, liga: 'Bundesliga', casa: 'Bayern', fora: 'Dortmund', hora: 'Domingo 14:30', o: [1.70, 4.00, 4.80] }
];
const ativo = (id, i) => selectedBets.some(b => b.id === id && b.i === i)
    ? 'bg-brand-primary border-brand-primary text-white'
    : 'bg-brand-dark border-brand-border text-gray-300 hover:border-brand-primary';

function renderJogos() {
    $('sports-list').innerHTML = jogos.map(j => `
    <div class="bg-brand-card border border-brand-border rounded-2xl p-4">
        <div class="flex justify-between text-[11px] text-gray-500 mb-3"><span>${j.liga}</span><span>${j.hora}</span></div>
        <div class="flex items-center justify-between gap-3">
            <div class="flex-1 text-sm font-bold">${j.casa}<br><span class="text-gray-400">${j.fora}</span></div>
            <div class="grid grid-cols-3 gap-2">
                ${['1', 'X', '2'].map((p, i) => `
                <button onclick="escolher(${j.id},${i})" class="w-16 py-2 rounded-lg border text-center cursor-pointer transition-colors ${ativo(j.id, i)}">
                    <span class="block text-[10px] opacity-70">${p}</span><span class="text-xs font-black">${j.o[i].toFixed(2)}</span>
                </button>`).join('')}
            </div>
        </div>
    </div>`).join('');
}

function escolher(id, i) {
    const j = jogos.find(x => x.id === id);
    const pos = selectedBets.findIndex(b => b.id === id);
    const nome = i === 0 ? j.casa : i === 2 ? j.fora : 'Empate';
    if (pos >= 0 && selectedBets[pos].i === i) selectedBets.splice(pos, 1);
    else {
        const novo = { id, i, odd: j.o[i], jogo: j.casa + ' x ' + j.fora, nome };
        if (pos >= 0) selectedBets[pos] = novo; else selectedBets.push(novo);
    }
    renderJogos(); renderBoletim();
}

// As odds mudam um pouco a cada 10 segundos (a odd já escolhida fica fixa)
setInterval(() => {
    jogos.forEach(j => j.o = j.o.map(o => Math.max(1.05, +(o * (1 + (Math.random() - 0.5) * 0.04)).toFixed(2))));
    renderJogos();
}, 10000);

// ---------- Boletim ----------
function renderBoletim() {
    $('bet-count-badge').textContent = selectedBets.length;
    $('betslip').classList.toggle('hidden', !selectedBets.length);
    $('empty-betslip').classList.toggle('hidden', selectedBets.length > 0);
    $('betslip-content').innerHTML = selectedBets.map(b => `
    <div class="bg-brand-card border border-brand-border rounded-lg p-2.5 text-xs flex justify-between items-center">
        <div><div class="text-gray-400">${b.jogo}</div><div class="font-bold text-white">${b.nome} <span class="text-brand-primary">@ ${b.odd.toFixed(2)}</span></div></div>
        <button onclick="escolher(${b.id},${b.i})" class="text-gray-500 hover:text-red-500 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
    </div>`).join('');
    updateBetReturn();
}
function oddTotal() { return selectedBets.reduce((t, b) => t * b.odd, 1); }
function updateBetReturn() {
    const v = parseFloat($('bet-amount').value) || 0;
    $('total-odds').textContent = oddTotal().toFixed(2);
    $('bet-return').textContent = R(v * oddTotal());
}
async function placeBet() {
    if (precisaLogin()) return;
    const v = parseFloat($('bet-amount').value);
    if (!selectedBets.length) return alert('Escolha pelo menos uma odd.');
    if (!(v >= 1)) return alert('O valor mínimo é R$ 1,00.');
    if (v > saldo) return alert('Saldo insuficiente. Faça um depósito.');
    if (!(await mudarSaldo(saldo - v))) return;
    const odd = oddTotal();
    const t = ler('rs_tix');
    t.unshift({ id: Date.now().toString().slice(-6), jogos: selectedBets.map(b => b.jogo + ': ' + b.nome + ' @' + b.odd.toFixed(2)), valor: v, odd, retorno: v * odd, data: new Date().toLocaleString('pt-BR'), status: 'Pendente' });
    gravar('rs_tix', t);
    registar('Aposta de ' + R(v) + ' (odd ' + odd.toFixed(2) + ')');
    selectedBets = []; renderJogos(); renderBoletim();
    alert('Aposta realizada! Veja em "Meus Bilhetes".');
}
