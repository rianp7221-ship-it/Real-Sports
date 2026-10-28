// js/mines.js - Módulo Profissional do Jogo Mines
let isPlaying = false;
let currentBetAmount = 0;
let mineCount = 3;
let safeClicks = 0;
let grid = [];
let currentMultiplier = 1.00;

function switchTab(tab) {
    document.getElementById('tab-sports').classList.toggle('hidden', tab !== 'sports');
    document.getElementById('tab-mines').classList.toggle('hidden', tab !== 'mines');
    if (tab === 'mines' && !isPlaying) initMinesGrid();
}

function initMinesGrid() {
    const gridEl = document.getElementById('mines-grid');
    if (!gridEl) return;
    
    const controlsHtml = `
        <div class="flex space-x-2 w-full mb-4">
            <div class="w-1/2">
                <label class="text-xs text-gray-400">Valor (R$)</label>
                <input type="number" id="mines-bet-amount" value="10" min="1" ${isPlaying ? 'disabled' : ''} class="w-full bg-brand-dark border border-brand-border rounded-lg px-3 py-2 text-white font-bold text-center disabled:opacity-50 outline-none focus:border-brand-primary">
            </div>
            <div class="w-1/2">
                <label class="text-xs text-gray-400">Bombas</label>
                <select id="mines-count" ${isPlaying ? 'disabled' : ''} class="w-full bg-brand-dark border border-brand-border rounded-lg px-3 py-2 text-white font-bold text-center disabled:opacity-50 outline-none focus:border-brand-primary">
                    <option value="3">3 Bombas</option>
                    <option value="5">5 Bombas</option>
                    <option value="10">10 Bombas</option>
                </select>
            </div>
        </div>
        ${isPlaying 
            ? `<button onclick="cashoutMines()" class="bg-amber-500 hover:bg-amber-400 text-black font-black px-6 py-3 rounded-lg w-full mb-4 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all flex justify-between items-center">
                 <span>CASHOUT</span>
                 <span class="text-xl">R$ ${(currentBetAmount * currentMultiplier).toFixed(2)}</span>
               </button>`
            : `<button onclick="startMines()" class="bg-brand-primary hover:bg-brand-primaryHover text-white font-bold px-6 py-3 rounded-lg w-full mb-4 transition-all uppercase tracking-wide">Apostar</button>`
        }
    `;

    let boardHtml = '<div class="grid grid-cols-5 gap-2">';
    for (let i = 0; i < 25; i++) {
        let cellContent = '';
        let cellClass = 'h-12 bg-brand-dark rounded-lg border border-brand-border flex items-center justify-center font-bold text-lg transition-all';
        
        if (grid[i] === 'revealed') {
            cellContent = '<i class="fa-solid fa-star text-amber-400 text-xl drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"></i>';
            cellClass += ' bg-amber-900/20 border-amber-500/50';
        } else if (grid[i] === 'bomb-revealed') {
            cellContent = '<i class="fa-solid fa-bomb text-red-500 text-xl"></i>';
            cellClass += ' bg-red-900/40 border-red-500';
        } else if (isPlaying) {
            cellClass += ' hover:border-brand-primary cursor-pointer shadow-lg';
            cellContent = `<button class="w-full h-full" onclick="clickMine(${i})"></button>`;
        } else {
            cellClass += ' opacity-50';
        }
        boardHtml += `<div class="${cellClass}">${cellContent}</div>`;
    }
    boardHtml += '</div>';
    gridEl.innerHTML = controlsHtml + boardHtml;
}

async function startMines() {
    if (!currentUser) return openAuthModal('login');
    
    currentBetAmount = parseFloat(document.getElementById('mines-bet-amount').value) || 0;
    mineCount = parseInt(document.getElementById('mines-count').value) || 3;

    if (currentBetAmount <= 0) return alert("Insira um valor válido.");
    if (currentBetAmount > userBalance) return alert("Saldo insuficiente!");

    await updateBalanceInDb(userBalance - currentBetAmount);

    isPlaying = true;
    safeClicks = 0;
    currentMultiplier = 1.00;
    
    grid = Array(25).fill('empty');
    let bombsPlaced = 0;
    while (bombsPlaced < mineCount) {
        let rand = Math.floor(Math.random() * 25);
        if (grid[rand] !== 'bomb') {
            grid[rand] = 'bomb';
            bombsPlaced++;
        }
    }
    initMinesGrid();
}

function clickMine(index) {
    if (!isPlaying || grid[index] === 'revealed') return;

    if (grid[index] === 'bomb') {
        gameOver(false);
    } else {
        grid[index] = 'revealed';
        safeClicks++;
        
        const baseRisk = 25 / (25 - mineCount - safeClicks + 1);
        currentMultiplier = currentMultiplier * (baseRisk * 0.95);
        
        if (safeClicks === (25 - mineCount)) {
            gameOver(true);
        } else {
            initMinesGrid();
        }
    }
}

async function cashoutMines() {
    if (!isPlaying) return;
    gameOver(true);
}

async function gameOver(won) {
    isPlaying = false;
    
    for (let i = 0; i < 25; i++) {
        if (grid[i] === 'bomb') grid[i] = 'bomb-revealed';
        else if (grid[i] === 'empty') grid[i] = 'revealed'; 
    }
    initMinesGrid();

    const prize = won && safeClicks > 0 ? currentBetAmount * currentMultiplier : 0;
    
    // --- Integração com o Histórico ---
    if (typeof registerBet === 'function') {
        registerBet('Real Mines', (safeClicks + ' Estrelas (' + mineCount + ' Bombas)'), currentBetAmount, prize, won ? 'Ganha' : 'Perdida');
    }

    if (won && safeClicks > 0) {
        await updateBalanceInDb(userBalance + prize);
        setTimeout(() => alert(`Cashout! Ganhaste R$ ${prize.toFixed(2)}!`), 300);
    } else {
        setTimeout(() => alert(`BOOM! Acertaste na bomba e perdeste R$ ${currentBetAmount.toFixed(2)}.`), 300);
    }
}
