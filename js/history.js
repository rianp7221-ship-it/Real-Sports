// js/history.js - Módulo de Histórico de Apostas

function openHistoryModal() {
    if (!currentUser) return openAuthModal('login');
    document.getElementById('history-modal').classList.remove('hidden');
    renderHistory();
}

function closeHistoryModal() {
    document.getElementById('history-modal').classList.add('hidden');
}

// Guarda a aposta associada ao ID único do utilizador
function registerBet(game, selection, amount, returnAmount, status) {
    if (!currentUser) return;
    const storageKey = 'realsports_bets_' + currentUser.id;
    let bets = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    bets.unshift({
        game,
        selection,
        amount,
        returnAmount,
        status,
        date: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    });

    localStorage.setItem(storageKey, JSON.stringify(bets));
}

// Desenha a lista no modal
function renderHistory() {
    const listEl = document.getElementById('history-list');
    if (!listEl) return;
    
    const storageKey = 'realsports_bets_' + currentUser.id;
    let bets = JSON.parse(localStorage.getItem(storageKey) || '[]');

    if (bets.length === 0) {
        listEl.innerHTML = `
            <div class="flex flex-col items-center justify-center text-gray-500 py-12">
                <i class="fa-solid fa-receipt text-5xl mb-4 opacity-20"></i>
                <p>Ainda não efetuaste nenhuma aposta.</p>
            </div>
        `;
        return;
    }

    listEl.innerHTML = bets.map(bet => {
        let statusColor = bet.status === 'Ganha' ? 'text-green-500' : 
                          bet.status === 'Perdida' ? 'text-red-500' : 'text-amber-500';
        let returnText = bet.status === 'Perdida' ? 'R$ 0.00' : `R$ ${bet.returnAmount.toFixed(2)}`;
        let lineThrough = bet.status === 'Perdida' ? 'line-through text-gray-500' : 'text-brand-primary';
        
        return `
            <div class="bg-brand-card border border-brand-border rounded-lg p-4 flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                    <div class="flex items-center space-x-2 mb-2">
                        <span class="text-xs text-gray-400"><i class="fa-regular fa-clock"></i> ${bet.date}</span>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded uppercase ${statusColor} bg-brand-dark border border-brand-border">${bet.status}</span>
                    </div>
                    <h4 class="font-bold text-white text-md">${bet.game}</h4>
                    <p class="text-xs text-gray-400 mt-1">Seleção: <span class="text-white">${bet.selection}</span></p>
                </div>
                <div class="mt-3 md:mt-0 text-left md:text-right border-t md:border-t-0 border-brand-border pt-3 md:pt-0 min-w-[120px]">
                    <div class="text-xs text-gray-400">Aposta: <span class="text-white font-bold">R$ ${bet.amount.toFixed(2)}</span></div>
                    <div class="text-sm mt-1">Retorno: <span class="font-bold ${lineThrough}">${returnText}</span></div>
                </div>
            </div>
        `;
    }).join('');
}
