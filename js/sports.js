// js/sports.js - Motor Visual Detalhado (Estilo Betano Clássico)

let currentBet = null;
let matchesData = [];

window.addEventListener('DOMContentLoaded', loadAndRenderMatches);

async function loadAndRenderMatches() {
    const list = document.getElementById('sports-list');
    if (list) {
        list.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 text-brand-primary col-span-full">
                <i class="fa-solid fa-circle-notch fa-spin text-4xl mb-4"></i>
                <p class="text-sm text-gray-400 font-bold uppercase tracking-widest">A carregar cotações...</p>
            </div>
        `;
    }

    await new Promise(resolve => setTimeout(resolve, 600));
    matchesData = getDetailedMatches();
    renderMatches();
}

function getDetailedMatches() {
    return [
        { 
            id: 1, 
            league: 'Brasil - Série A', 
            time: '19:30', 
            date: '28/10',
            home: 'Fluminense', 
            away: 'Internacional', 
            odds: { home: 1.85, draw: 3.50, away: 4.33 } 
        },
        { 
            id: 2, 
            league: 'Brasil - Série A', 
            time: '19:30', 
            date: '28/10',
            home: 'Santos', 
            away: 'Palmeiras', 
            odds: { home: 3.30, draw: 3.25, away: 2.20 } 
        },
        { 
            id: 3, 
            league: 'Brasil - Série A', 
            time: '19:30', 
            date: '28/10',
            home: 'RB Bragantino', 
            away: 'Chapecoense', 
            odds: { home: 1.28, draw: 5.50, away: 10.00 } 
        },
        { 
            id: 4, 
            league: 'Brasil - Série A', 
            time: '21:30', 
            date: '28/10',
            home: 'Bahia', 
            away: 'São Paulo', 
            odds: { home: 2.05, draw: 3.50, away: 3.60 } 
        }
    ];
}

function renderMatches() {
    const list = document.getElementById('sports-list');
    if (!list) return;
    
    list.innerHTML = matchesData.map(m => `
        <div class="bg-brand-card hover:bg-brand-card/80 border border-brand-border rounded-xl p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <!-- Lado Esquerdo: Horário, Data e Equipas (Estilo Linha Compacta Betano) -->
            <div class="flex items-start space-x-4">
                <div class="text-center min-w-[55px] pt-1">
                    <div class="text-xs font-bold text-white">${m.time}</div>
                    <div class="text-[10px] text-gray-400">${m.date}</div>
                </div>
                
                <div class="space-y-1">
                    <div class="flex items-center space-x-2 text-sm font-bold text-white">
                        <i class="fa-solid fa-shield text-[10px] text-brand-primary"></i>
                        <span>${m.home}</span>
                    </div>
                    <div class="flex items-center space-x-2 text-sm font-bold text-white">
                        <i class="fa-solid fa-shield text-[10px] text-gray-500"></i>
                        <span>${m.away}</span>
                    </div>
                    <div class="text-[10px] text-gray-400 pt-1 flex items-center space-x-1">
                        <i class="fa-solid fa-earth-americas text-[9px]"></i>
                        <span>${m.league}</span>
                    </div>
                </div>
            </div>

            <!-- Lado Direito: Botões de Cotação 1 X 2 Horizontais -->
            <div class="grid grid-cols-3 gap-2 w-full md:w-auto">
                <button onclick="addBet('${m.home} x ${m.away}', '${m.home}', ${m.odds.home})" class="bg-brand-dark hover:border-brand-primary border border-brand-border px-3 py-2 rounded-lg flex items-center justify-between space-x-3 transition-all group min-w-[90px]">
                    <span class="text-xs text-gray-400 group-hover:text-white">1</span>
                    <span class="text-sm font-bold text-brand-primary">${m.odds.home.toFixed(2)}</span>
                </button>
                <button onclick="addBet('${m.home} x ${m.away}', 'Empate', ${m.odds.draw})" class="bg-brand-dark hover:border-brand-primary border border-brand-border px-3 py-2 rounded-lg flex items-center justify-between space-x-3 transition-all group min-w-[90px]">
                    <span class="text-xs text-gray-400 group-hover:text-white">X</span>
                    <span class="text-sm font-bold text-brand-primary">${m.odds.draw.toFixed(2)}</span>
                </button>
                <button onclick="addBet('${m.home} x ${m.away}', '${m.away}', ${m.odds.away})" class="bg-brand-dark hover:border-brand-primary border border-brand-border px-3 py-2 rounded-lg flex items-center justify-between space-x-3 transition-all group min-w-[90px]">
                    <span class="text-xs text-gray-400 group-hover:text-white">2</span>
                    <span class="text-sm font-bold text-brand-primary">${m.odds.away.toFixed(2)}</span>
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
            <span class="text-brand-primary font-bold">@ ${currentBet.odds.toFixed(2)}</span>
        </div>
    `;
    document.getElementById('betslip').classList.remove('hidden');
    if (document.getElementById('empty-betslip')) document.getElementById('empty-betslip.classList']?.add('hidden');
    const emptySlip = document.getElementById('empty-betslip');
    if (emptySlip) emptySlip.classList.add('hidden');
    
    updateBetReturn();
}

function updateBetReturn() {
    if (!currentBet) return;
    const amount = parseFloat(document.getElementById('bet-amount').value) || 0;
    document.getElementById('bet-return').innerText = `R$ ${(amount * currentBet.odds).toFixed(2)}`;
}

function closeBetSlip() { 
    document.getElementById('betslip').classList.add('hidden'); 
    const emptySlip = document.getElementById('empty-betslip');
    if (emptySlip) emptySlip.classList.remove('hidden');
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
