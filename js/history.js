// history.js: janelas de Histórico, Depósito PIX e Meus Bilhetes
// ---------- Janelas (modais) ----------
function openHistoryModal() {
    const h = ler('rs_hist'), el = $('history-modal').querySelector('.py-8, #hist-list');
    el.id = 'hist-list';
    el.className = h.length ? 'space-y-2 max-h-80 overflow-y-auto text-sm' : 'text-sm text-gray-400 text-center py-8';
    el.innerHTML = h.length ? h.map(x => `<div class="bg-brand-dark border border-brand-border rounded-lg p-2.5 flex justify-between"><span>${x.txt}</span><span class="text-gray-500 text-xs">${x.data}</span></div>`).join('') : 'Nenhuma atividade recente registada.';
    $('history-modal').classList.remove('hidden');
}
function closeHistoryModal() { $('history-modal').classList.add('hidden'); }
function openDepositModal() { $('deposit-modal').classList.remove('hidden'); }
function closeDepositModal() { $('deposit-modal').classList.add('hidden'); const a = $('pix-area'); if (a) a.innerHTML = ''; }
function simulateDeposit() {
    if (precisaLogin()) return;
    const v = parseFloat($('deposit-amount').value);
    if (!(v >= 1)) return alert('O valor mínimo é R$ 1,00.');
    let a = $('pix-area');
    if (!a) { a = document.createElement('div'); a.id = 'pix-area'; a.className = 'mt-4 space-y-2 text-center'; $('deposit-modal').firstElementChild.appendChild(a); }
    a.innerHTML = `<p class="text-[11px] text-gray-400">PIX simulado (copia e cola):</p>
    <div class="bg-brand-dark border border-brand-border rounded-lg p-2 text-[10px] break-all text-gray-300">00020126SIMULADO${Date.now()}</div>
    <button onclick="confirmarDeposito(${v})" class="w-full bg-green-600 hover:bg-green-500 text-white font-black py-3 rounded-xl uppercase text-xs cursor-pointer">Simular pagamento de ${R(v)}</button>`;
}
async function confirmarDeposito(v) {
    if (await mudarSaldo(saldo + v)) { registar('Depósito de ' + R(v)); closeDepositModal(); }
}
function openMyTicketsModal() {
    const t = ler('rs_tix');
    $('my-tickets-modal-list').innerHTML = t.length ? t.map(x => `
    <div class="bg-brand-dark border border-brand-border rounded-xl p-3 text-xs space-y-1">
        <div class="flex justify-between"><span class="font-bold text-white">Bilhete #${x.id}</span><span class="text-amber-500 font-bold">${x.status}</span></div>
        ${x.jogos.map(g => `<div class="text-gray-400">${g}</div>`).join('')}
        <div class="flex justify-between pt-1 border-t border-brand-border"><span>Valor: ${R(x.valor)} | Odd: ${x.odd.toFixed(2)}</span><span class="text-brand-primary font-bold">Retorno: ${R(x.retorno)}</span></div>
        <div class="text-gray-600">${x.data}</div>
    </div>`).join('') : '<div class="text-sm text-gray-400 text-center py-8">Ainda não tem bilhetes.</div>';
    $('my-tickets-modal').classList.remove('hidden');
}
function closeMyTicketsModal() { $('my-tickets-modal').classList.add('hidden'); }
