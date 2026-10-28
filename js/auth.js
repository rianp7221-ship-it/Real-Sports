// js/auth.js - Autenticação e Gestão de Utilizador
let currentUser = null;
let userBalance = 0.00;
let authMode = 'login';

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const { data: { user } } = await _supabase.auth.getUser();
        if (user) {
            currentUser = user;
            await loadUserProfile();
        }
    } catch (e) {
        console.error("Erro de sessão:", e);
    }
    updateAuthUI();
});

function updateAuthUI() {
    const loggedIn = document.getElementById('user-logged-section');
    const guest = document.getElementById('user-guest-section');
    const balanceText = document.getElementById('user-balance');

    if (currentUser) {
        if(loggedIn) loggedIn.classList.remove('hidden');
        if(guest) guest.classList.add('hidden');
        if(balanceText) balanceText.innerText = `R$ ${userBalance.toFixed(2)}`;
    } else {
        if(loggedIn) loggedIn.classList.add('hidden');
        if(guest) guest.classList.remove('hidden');
    }
}

async function loadUserProfile() {
    if (!currentUser) return;
    const { data } = await _supabase.from('profiles').select('balance').eq('id', currentUser.id).single();
    if (data) {
        userBalance = parseFloat(data.balance);
        updateAuthUI();
    }
}

async function updateBalanceInDb(newBalance) {
    userBalance = newBalance;
    updateAuthUI();
    if (currentUser) {
        await _supabase.from('profiles').update({ balance: newBalance }).eq('id', currentUser.id);
    }
}

function openAuthModal(mode) {
    authMode = mode;
    document.getElementById('auth-modal').classList.remove('hidden');
    document.getElementById('auth-title').innerText = mode === 'signup' ? 'Criar Conta' : 'Entrar';
    document.getElementById('auth-name-container').classList.toggle('hidden', mode !== 'signup');
    document.getElementById('auth-submit-btn').innerText = mode === 'signup' ? 'Cadastrar' : 'Entrar';
}

function closeAuthModal() { document.getElementById('auth-modal').classList.add('hidden'); }

async function submitAuth() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const fullName = document.getElementById('auth-name')?.value || '';

    if (!email || !password) return alert('Preencha os dados corretamente.');

    if (authMode === 'signup') {
        const { error } = await _supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
        if (error) alert('Erro: ' + error.message);
        else { alert('Conta criada! Faça login.'); openAuthModal('login'); }
    } else {
        const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
        if (error) alert('Erro: ' + error.message);
        else { currentUser = data.user; await loadUserProfile(); closeAuthModal(); }
    }
}

async function logout() {
    await _supabase.auth.signOut();
    currentUser = null;
    userBalance = 0;
    updateAuthUI();
}

function openDepositModal() {
    if (!currentUser) return openAuthModal('login');
    document.getElementById('deposit-modal').classList.remove('hidden');
}
function closeDepositModal() { document.getElementById('deposit-modal').classList.add('hidden'); }

async function simulateDeposit() {
    const val = parseFloat(document.getElementById('deposit-amount').value) || 0;
    if (val <= 0) return;
    await updateBalanceInDb(userBalance + val);
    alert(`Depósito de R$ ${val.toFixed(2)} processado!`);
    closeDepositModal();
}
