// auth-header.js: sessão e cabeçalho (Entrar / saldo / Sair). Carregar POR ÚLTIMO
// ---------- Sessão: troca "Entrar" pelo painel do utilizador ----------
function mostrarVisitante() {
    utilizador = null; saldo = 0;
    $('user-auth-section').innerHTML = `<a href="login.html" class="bg-brand-primary hover:bg-brand-primaryHover text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-lg cursor-pointer">Entrar</a>`;
    $('admin-link').classList.add('hidden');
}
function mostrarUtilizador(user) {
    utilizador = user;
    const b = 'px-3 py-2 rounded-lg text-xs font-bold cursor-pointer';
    $('user-auth-section').innerHTML = `
    <div class="bg-brand-card border border-brand-border rounded-lg px-3 py-2 text-xs font-bold text-green-400 flex items-center"><i class="fa-solid fa-wallet mr-2"></i><span id="user-balance">R$ 0,00</span></div>
    <button onclick="openDepositModal()" class="bg-brand-primary hover:bg-brand-primaryHover text-white ${b}"><i class="fa-solid fa-plus mr-1"></i><span class="hidden md:inline">Depósito</span></button>
    <button onclick="openHistoryModal()" class="bg-brand-card border border-brand-border text-gray-300 hover:text-white ${b}"><i class="fa-solid fa-clock-rotate-left mr-1"></i><span class="hidden md:inline">Histórico</span></button>
    <button onclick="openMyTicketsModal()" class="bg-brand-card border border-brand-border text-gray-300 hover:text-white ${b}"><i class="fa-solid fa-ticket mr-1"></i><span class="hidden md:inline">Meus Bilhetes</span></button>
    <button id="btn-sair" class="bg-red-600 hover:bg-red-500 text-white ${b}"><i class="fa-solid fa-right-from-bracket mr-1"></i><span class="hidden md:inline">Sair</span></button>`;
    $('btn-sair').addEventListener('click', sair);
    carregarSaldo(user.id);
}
async function carregarSaldo(userId) {
    try {
        const { data, error } = await supabase.from('profiles').select('balance, role').eq('id', userId).single();
        if (!error && data) {
            saldo = Number(data.balance);
            if (data.role === 'admin') $('admin-link').classList.remove('hidden');
        }
    } catch (e) { console.warn('Erro ao ler o saldo:', e); }
    atualizarSaldoNaTela(saldo);
}
async function sair() { await supabase.auth.signOut(); mostrarVisitante(); }

async function iniciarSessao() {
    renderJogos(); renderBoletim();
    const { data } = await supabase.auth.getSession();
    data.session ? mostrarUtilizador(data.session.user) : mostrarVisitante();
    supabase.auth.onAuthStateChange((evento, session) => {
        if (session && (!utilizador || utilizador.id !== session.user.id)) mostrarUtilizador(session.user);
        else if (!session) mostrarVisitante();
    });
}
iniciarSessao();

  headerActions.appendChild(authDiv);
  checkUserSession();
});
