// Módulo do Jogo Mines
function initMinesGrid() {
    const grid = document.getElementById('mines-grid');
    if (!grid) return;
    grid.innerHTML = Array(25).fill(0).map((_, i) => `
        <button onclick="clickMineTile(${i})" class="h-12 bg-brand-dark hover:border-brand-green rounded-lg border border-brand-border flex items-center justify-center font-bold text-lg transition-all">
            <i class="fa-solid fa-star text-xs text-brand-dark"></i>
        </button>
    `).join('');
}

function switchTab(tab) {
    const sportsTab = document.getElementById('tab-sports');
    const minesTab = document.getElementById('tab-mines');

    if (sportsTab) sportsTab.classList.toggle('hidden', tab !== 'sports');
    if (minesTab) minesTab.classList.toggle('hidden', tab !== 'mines');

    if (tab === 'mines') {
        initMinesGrid();
    }
}

function clickMineTile(index) {
    if (!currentUser) return openAuthModal('login');
    alert(`Você clicou na casa ${index + 1} do Real Mines!`);
}
