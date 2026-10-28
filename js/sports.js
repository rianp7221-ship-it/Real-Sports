// js/sports.js - Módulo de Apostas com Widget Oficial da API-Football

let currentBet = null;

window.addEventListener('DOMContentLoaded', () => {
    renderSportsWidget();
});

function renderSportsWidget() {
    const list = document.getElementById('sports-list');
    if (!list) return;

    // Injeta o iframe oficial do widget da API-Football diretamente na tua página
    // Utiliza a tua chave API para carregar os dados oficiais em tempo real
    list.innerHTML = `
        <div class="bg-brand-card p-4 rounded-xl border border-brand-border space-y-4 shadow-sm">
            <div class="flex items-center justify-between border-b border-brand-border pb-3">
                <span class="text-sm font-bold text-brand-primary flex items-center">
                    <i class="fa-solid fa-satellite-dish mr-2"></i> Central de Jogos Ao Vivo (API Oficial)
                </span>
                <span class="text-xs text-gray-400">Atualizado em tempo real</span>
            </div>
            
            <div class="w-full overflow-hidden rounded-lg bg-brand-dark min-h-[500px] flex items-center justify-center">
                <!-- Widget Oficial da API-Football incorporado de forma segura -->
                <script type="module" src="https://widgets.api-sports.io/2.0.3/widgets.js"></script>
                <api-sports-widget 
                    key="219415e7d2ff117cc0e96919766c5479"
                    domain="v3.football.api-sports.io"
                    league="71" 
                    season="2026"
                    theme="dark"
                    ></api-sports-widget>
            </div>
        </div>
    `;
}

// Funções do Boletim de Apostas lateral (Mantidas intactas)
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
