// js/sports.js - Motor Dinâmico Híbrido (API + Fallback Inteligente)

let currentBet = null;
let matchesData = [];

const USE_REAL_API = true; 
const API_KEY = "219415e7d2ff117cc0e96919766c5479"; 

window.addEventListener('DOMContentLoaded', loadAndRenderMatches);

async function loadAndRenderMatches() {
    const list = document.getElementById('sports-list');
    if (list) {
        list.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 text-brand-primary col-span-full">
                <i class="fa-solid fa-circle-notch fa-spin text-4xl mb-4"></i>
                <p class="text-sm text-gray-400 font-bold uppercase tracking-widest">A sincronizar cotações ao vivo...</p>
            </div>
        `;
    }

    matchesData = await fetchMatches();
    renderMatches();
}

async function fetchMatches() {
    let apiMatches = [];

    if (USE_REAL_API && API_KEY !== "COLA_A_TUA_CHAVE_AQUI") {
        try {
            // Buscamos os jogos ao vivo que funcionam perfeitamente no plano gratuito
            const response = await fetch("https://v3.football.api-sports.io/fixtures?live=all", {
                method: "GET",
                headers: {
                    "x-apisports-key": API_KEY
                }
            });
            const data = await response.json();
            
            if (data.response && data.response.length > 0) {
                apiMatches = data.response.slice(0, 8).map(match => ({
                    id: match.fixture.id,
                    league: match.league.name,
                    time: match.fixture.status.elapsed ? match.fixture.status.elapsed + "'" : "AO VIVO",
                    home: match.teams.home.name,
                    away: match.teams.away.name,
                    score: `${match.goals.home ?? 0} - ${match.goals.away ?? 0}`,
                    odds: { 
                        home: Number((1.5 + (match.fixture.id % 5) * 0.1).toFixed(2)), 
                        draw: 3.20, 
                        away: Number((2.1 + (match.fixture.id % 4) * 0.15).toFixed(2)) 
                    }
                }));
            }
        } catch (error) {
            console.error("Aviso da API:", error);
        }
    }

    // Se a API trouxer menos de 3 jogos (ex: horários sem jogos ao vivo), 
    // juntamos com os jogos de destaque para a plataforma parecer sempre recheada.
    const fallback = getFallbackData();
    
    if (apiMatches.length > 0) {
        // Junta os da API com alguns de segurança para dar volume à página
        return [...apiMatches, ...fallback].slice(0, 6);
    }
    
    return fallback;
}

function getFallbackData() {
    return [
        { id: 101, league: 'Brasileirão Série A', time: '72\'', home: 'Flamengo', away: 'Palmeiras', score: '2 - 1', odds: { home: 1.85, draw: 3.20, away: 4.10 } },
        { id: 102, league: 'Liga dos Campeões', time: '21:30', home: 'Real Madrid', away: 'Man City', score: 'vs', odds: { home: 2.45, draw: 3.40, away: 2.75 } },
        { id: 103, league: 'Premier League', time: 'Amanhã', home: 'Arsenal', away: 'Liverpool', score: 'vs', odds: { home: 3.10, draw: 2.90, away: 1.80 } }
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
