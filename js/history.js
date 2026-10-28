// --- ADIÇÃO CIRÚRGICA: Gestão de Bilhetes Locais ---
function renderMyLocalTickets() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;

    let localTickets = JSON.parse(localStorage.getItem('real_sports_tickets') || '[]');

    if (localTickets.length === 0) {
        return; // Mantém o histórico original intocado se não houver bilhetes locais
    }

    // Adiciona os bilhetes locais ao histórico existente
    const localHtml = localTickets.map(t => `
        <div class="bg-brand-dark border border-brand-border rounded-xl p-4 space-y-3 shadow-md relative overflow-hidden">
            <div class="absolute top-0 right-0 w-1 h-full bg-brand-primary"></div>
            <div class="flex justify-between items-center text-xs border-b border-brand-border pb-2">
                <span class="font-bold text-white"><i class="fa-solid fa-hashtag text-brand-primary mr-1"></i>${t.id} (Local)</span>
                <span class="text-gray-400">${t.date}</span>
            </div>
            <div class="space-y-1">
                ${t.bets.map(b => `
                    <div class="text-xs flex justify-between text-gray-300">
                        <span>${b.match} -> <b class="text-white">${b.selection}</b></span>
                        <span class="text-brand-primary font-bold">@ ${b.odds.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="flex justify-between items-center pt-2 border-t border-brand-border text-xs">
                <div>
                    <span class="text-gray-400">Aposta: </span><b class="text-white">R$ ${t.amount.toFixed(2)}</b> | 
                    <span class="text-gray-400">Odd: </span><b class="text-white">${t.totalOdds.toFixed(2)}</b>
                </div>
                <div>
                    <span class="text-gray-400">Retorno: </span><b class="text-brand-primary">R$ ${t.totalReturn.toFixed(2)}</b>
                    <span class="ml-2 px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 font-bold">${t.status}</span>
                </div>
            </div>
        </div>
    `).join('');

    historyList.innerHTML = localHtml + historyList.innerHTML;
}

// Executa automaticamente ao abrir o modal de histórico
document.addEventListener('DOMContentLoaded', () => {
    const originalOpenHistory = window.openHistoryModal;
    // Se quiseres que carregue sempre que o histórico abrir:
    window.openHistoryModal = function() {
        if (typeof originalOpenHistory === 'function') originalOpenHistory();
        renderMyLocalTickets();
    };
});
