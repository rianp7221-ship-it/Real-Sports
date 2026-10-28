// js/sports.js - Motor Dinâmico Simulado de Alta Performance (Betano Style)

let currentBet = null;
let matchesData = [];

// Carrega os jogos assim que o ecrã abre
window.addEventListener('DOMContentLoaded', loadAndRenderMatches);

async function loadAndRenderMatches() {
    const list = document.getElementById('sports-list');
    if (list) {
        list.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 text-brand-primary col-span-full">
                <i class="fa-solid fa-circle-notch fa-spin text-4xl mb-4"></i>
                <p class="text-sm text-gray-400 font-bold uppercase tracking-widest">A sincronizar cotações...</p>
            </div>
        `;
    }

    // Simula o carregamento fluido da rede
    await new Promise(resolve => setTimeout(resolve, 800));
    matchesData = getRealisticMatches();
    renderMatches();
}

function getRealisticMatches() {
    return [
        { 
            id: 1, 
            league: 'Brasileirão Série A', 
            time: '78\'', 
            home: 'Flamengo', 
            away: 'Palmeiras', 
            score: '2 - 1', 
            odds: { home: 1.75, draw: 3.40, away: 4.50 } 
        },
        { 
            id: 2, 
            league: 'Liga dos Campeões', 
            time: 'Ao Vivo', 
            home: 'Real Madrid', 
            away: 'Manchester City', 
            score: '1 - 1', 
            odds: { home: 2.30, draw: 3.20, away: 2.90 } 
        },
        { 
            id: 3, 
            league: 'Premier League', 
            time: '34\'', 
            home: 'Arsenal', 
            away: 'Liverpool', 
            score: '0 - 0', 
            odds: { home: 2.10, draw: 3.30, away: 3.10 } 
        },
        { 
            id: 4, 
            league: 'La Liga', 
            time: 'Intervalo', 
            home: 'Barcelona', 
            away: 'Atlético de Madrid', 
            score: '2 - 0', 
            odds: { home: 1.45, draw: 4.20, away: 6.00 } 
        }
    ];
}

function renderMatches() {
    const list = document.getElementById('sports-list');
    if (!list) return;
    
    list.innerHTML = matchesData.map(m => `
        <div class="bg-brand-card p-4 rounded-xl border border-brand-border space-y-4 shadow-sm hover:border-brand-primary transition-colors relative overflow-hidden">
            <div class="absolute top-0 right-0 w-1 h-full bg-brand-primary"></div>
            
            <div class="flex justify-between items-center text-xs text-gray-400">
                <span class="flex items-center font-bold text-white bg-red-600/20 px-2 py-0.5 rounded border border-red-500/30">
                    <i class="fa-solid fa-circle text-red-500 animate-pulse mr-1.5 text-[8px]"></i> ${m.time}
                </span>
                <span class="text-gray-400 font-bold uppercase tracking-wider text-[10px]">${m.league}</span>
            </div>
            
            <div class="flex justify-between items-center font-bold text-lg">
                <span class="w-2/5 text-right truncate pr-2">${m.home}</span>
                <span class="w-1/5 text-center text-brand-primary text-xl font-black bg-brand-dark py-1 rounded border border-brand-border">${m.score}</span>
                <span class="w-2/5 text-left truncate pl-2">${m.away}</span>
            </div>
            
            <div class="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-brand-border/50">
                <button onclick="addBet('${m.home} x ${m.away}', '${m.home}', ${m.odds.home})" class="bg-brand-dark hover:bg-brand-primary hover:text-white border border-brand-border hover:border-brand-primary p-2 rounded text-center transition-all group flex justify-between items-center px-3">
                    <span class="text-xs text-gray-500 group-hover:text-white/80">1</span>
                    <span class="font-bold text-brand-primary group-hover:text-white">${m.odds.home.toFixed(2)}</span>
                </button>
                <button onclick="addBet('${m.home} x ${m.away}', 'Empate', ${m.odds.draw})" class="bg-brand-dark hover:bg-brand-primary hover:text-white border border-brand-border hover:border-brand-primary p-2 rounded text-center transition-all group flex justify-between items-center px-3">
                    <span class="text-xs text-gray-500 group-hover:text-white/80">X</span>
                    <span class="font-bold text-brand-primary group-hover:text-white">${m.odds.draw.toFixed(2)}</span>
                </button>
                <button onclick="addBet('${m.home} x ${m.away}', '${m.away}', ${m.odds.away})" class="bg-brand-dark hover:bg-brand-primary hover:text-white border border-brand-border hover:border-brand-primary p-2 rounded text-center transition-all group flex justify-between items-center px-3">
                    <span class="text-xs text-gray-500 group-hover:text-white/80">2</span>
                    <span class="font-bold text-brand-primary group-hover:text-white">${m.odds.away.toFixed(2)}</span>
                </button>
            </div>
        </div>
    `).join('');
}

function addBet(match, selection, odds) {
    currentBet = { match, selection, odds: parseFloat(odds) };
    document.getElementById('betslip-content').innerHTML = `
        <div class="font-bold text-white mb-1">${match}</div>
        <div class="text-xs text-gray-300 flex justify-between border-t border-brand-border pt-1">
            <span>Seleção: <b class="text-white">${selection}</b></span>
            <span class="text-brand-primary font-bold">@ ${currentBans = currentBet.odds.toFixed(2)}</span>
        </div>
    `;
    // Garante que o formato exibe a odd correta
    document.getElementById('betslip-content').innerHTML = `
        <div class="font-bold text-white mb-1">${match}</div>
        <div class="text-xs text-gray-300 flex justify-between border-t border-brand-border pt-1">
            <span>Seleção: <b class="text-white">${selection}</b></span>
            <span class="text-brand-primary font-bold">@ ${currentBet.odds.toFixed(2)}</span>
        </div>
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
    if (amount <= 0) return alert('Insira um valor válido.');
    if (amount > userBalance) return alert('Saldo insuficiente!');

    await updateBalanceInDb(userBalance - amount);
    
    if (typeof registerBet === 'function') {
        registerBet(currentBet.match, currentBet.selection, amount, (amount * currentBet.odds), 'Pendente');
    }

    alert(`Aposta de R$ ${amount.toFixed(2)} registada com sucesso!`);
    closeBetSlip();
}
