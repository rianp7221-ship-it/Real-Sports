// Módulo de Apostas Desportivas
let currentBet = null;

const matchesData = [
    { id: 1, league: 'Brasileirão - Série A', time: 'Ao Vivo - 72\'', home: 'Flamengo', away: 'Palmeiras', score: '2 - 1', odds: { home: 1.85, draw: 3.20, away: 4.10 } },
    { id: 2, league: 'Brasileirão - Série A', time: 'Hoje às 21:30', home: 'Corinthians', away: 'São Paulo', score: 'vs', odds: { home: 2.30, draw: 2.90, away: 3.10 } },
    { id: 3, league: 'Champions League', time: 'Amanhã às 16:00', home: 'Real Madrid', away: 'Manchester City', score: 'vs', odds: { home: 2.45, draw: 3.40, away: 2.75 } },
    { id: 4, league: 'Brasileirão - Série B', time: 'Hoje às 19:00', home: 'Santos', away: 'Goiás', score: 'vs', odds: { home: 1.75, draw: 3.10, away: 4.80 } }
];

function addBet(match, selection, odds) {
    currentBet = { match, selection, odds };
    const betContent = document.getElementById('betslip-content');
    const betSlip = document.getElementById('betslip');

    if (betContent) {
        betContent.innerHTML = `
            <div class="font-bold text-white">${match}</div>
            <div class="text-xs text-brand-green">Escolha: <b>${selection}</b> @ ${odds.toFixed(2)}</div>
        `;
    }
    if (betSlip) betSlip.classList.remove('hidden');
    updateBetReturn();
}

function updateBetReturn() {
    if (!currentBet) return;
    const amountInput = document.getElementById('bet-amount');
    const returnEl = document.getElementById('bet-return');
    const amount = parseFloat(amountInput?.value) || 0;

    if (returnEl) returnEl.innerText = `R$ ${(amount * currentBet.odds).toFixed(2)}`;
}

function closeBetSlip() {
    const betSlip = document.getElementById('betslip');
    if (betSlip) betSlip.classList.add('hidden');
    currentBet = null;
}

async function placeBet() {
    if (!currentUser) return openAuthModal('login');
    const amountInput = document.getElementById('bet-amount');
    const amount = parseFloat(amountInput?.value) || 0;

    if (amount <= 0) return alert('Insira um valor válido para a aposta.');
    if (amount > userBalance) return alert('Saldo insuficiente! Faça um depósito para continuar.');

    await updateBalanceInDb(userBalance - amount);
    alert(`Aposta confirmada com sucesso no valor de R$ ${amount.toFixed(2)}!`);
    closeBetSlip();
}

async function updateBalanceInDb(newBalance) {
    userBalance = newBalance;
    updateAuthUI();
    if (currentUser) {
        await _supabase.from('profiles').update({ balance: newBalance }).eq('id', currentUser.id);
    }
}

function openDepositModal() {
    if (!currentUser) return openAuthModal('login');
    const modal = document.getElementById('deposit-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeDepositModal() {
    const modal = document.getElementById('deposit-modal');
    if (modal) modal.classList.add('hidden');
}

async function simulateDeposit() {
    const amountInput = document.getElementById('deposit-amount');
    const val = parseFloat(amountInput?.value) || 0;
    if (val <= 0) return alert('Insira um valor válido para o depósito.');
    await updateBalanceInDb(userBalance + val);
    alert(`Depósito de R$ ${val.toFixed(2)} realizado com sucesso!`);
    closeDepositModal();
}
