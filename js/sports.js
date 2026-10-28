// js/sports.js - Motor de Apostas Desportivas
const matchesData = [
    { id: 1, league: 'Série A', time: 'Ao Vivo', home: 'Flamengo', away: 'Palmeiras', score: '2-1', odds: { home: 1.85, draw: 3.20, away: 4.10 } },
    { id: 2, league: 'Série A', time: '21:30', home: 'Corinthians', away: 'São Paulo', score: 'vs', odds: { home: 2.30, draw: 2.90, away: 3.10 } },
    { id: 3, league: 'Champions', time: 'Amanhã', home: 'Real Madrid', away: 'Man City', score: 'vs', odds: { home: 2.45, draw: 3.40, away: 2.75 } }
];

let currentBet = null;

window.addEventListener('DOMContentLoaded', renderMatches);

function renderMatches() {
    const list = document.getElementById('sports-list');
    if (!list) return;
    
    list.innerHTML = matchesData.map(m => `
        <div class="bg-brand-card p-4 rounded-xl border border-brand-border space-y-4 shadow-sm hover:border-brand-primary transition-colors">
            <div class="flex justify-between items-center text-xs text-gray-400">
                <span>${m.time === 'Ao Vivo' ? '<i class="fa-solid fa-circle text-red-500 animate-pulse mr-1"></i> Ao Vivo' : m.time}</span>
                <span class="text-brand-primary font-semibold">${m.league}</span>
            </div>
            <div class="flex justify-between items-center font-bold text-lg">
                <span>${m.home}</span>
                <span class="${m.score !== 'vs' ? 'text-brand-primary' : 'text-gray-500'}">${m.score}</span>
                <span>${m.away}</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
                <button onclick="addBet('${m.home} x ${m.away}', '${m.home}', ${m.odds.home})" class="bg-brand-dark hover:border-brand-primary border border-brand-border p-2 rounded text-center transition-all group">
                    <div class="text-xs text-gray-400 group-hover:text-white">1</div><div class="font-bold text-brand-primary group-hover:text-white">${m.odds.home.toFixed(2)}</div>
                </button>
                <button onclick="addBet('${m.home} x ${m.away}', 'Empate', ${m.odds.draw})" class="bg-brand-dark hover:border-brand-primary border border-brand-border p-2 rounded text-center transition-all group">
                    <div class="text-xs text-gray-400 group-hover:text-white">X</div><div class="font-bold text-brand-primary group-hover:text-white">${m.odds.draw.toFixed(2)}</div>
                </button>
                <button onclick="addBet('${m.home} x ${m.away}', '${m.away}', ${m.odds.away})" class="bg-brand-dark hover:border-brand-primary border border-brand-border p-2 rounded text-center transition-all group">
                    <div class="text-xs text-gray-400 group-hover:text-white">2</div><div class="font-bold text-brand-primary group-hover:text-white">${m.odds.away.toFixed(2)}</div>
                </button>
            </div>
        </div>
    `).join('');
}

function addBet(match, selection, odds) {
    currentBet = { match, selection, odds };
    document.getElementById('betslip-content').innerHTML = `
        <div class="font-bold text-white">${match}</div>
        <div class="text-xs text-brand-primary mt-1">Seleção: <b>${selection}</b> @ ${odds.toFixed(2)}</div>
    `;
    document.getElementById('betslip').classList.remove('hidden');
    if (document.getElementById('empty-betslip')) document.getElementById('empty-betslip').classList.add('hidden');
    updateBetReturn();
}

function updateBetReturn() {
    if (!currentBet) return;
    const amount = parseFloat(document.getElementById('bet-amount').value) || 0;
    document.getElementById('bet-return').innerText = `R$ ${(amount * currentBet.odds).toFixed(2)}`;
}

function closeBetSlip() { 
    document.getElementById('betslip').classList.add('hidden'); 
    if (document.getElementById('empty-betslip')) document.getElementById('empty-betslip').classList.remove('hidden');
    currentBet = null; 
}

async function placeBet() {
    if (!currentUser) return openAuthModal('login');
    const amount = parseFloat(document.getElementById('bet-amount').value) || 0;
    if (amount <= 0) return alert('Valor inválido.');
    if (amount > userBalance) return alert('Saldo insuficiente!');

    await updateBalanceInDb(userBalance - amount);
    
    // --- Integração com o Histórico ---
    if (typeof registerBet === 'function') {
        registerBet(currentBet.match, currentBet.selection, amount, (amount * currentBet.odds), 'Pendente');
    }

    alert(`Aposta de R$ ${amount.toFixed(2)} registada com sucesso!`);
    closeBetSlip();
}
