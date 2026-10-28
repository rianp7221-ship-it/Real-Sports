let currentUser = null;
let userBalance = 0.00;
let authMode = 'login';

// Verificar sessão ao carregar a página
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const { data: { user } } = await _supabase.auth.getUser();
        if (user) {
            currentUser = user;
            await loadUserProfile();
        }
    } catch (e) {
        console.error("Erro ao carregar sessão:", e);
    }
    updateAuthUI();
});

function updateAuthUI() {
    const loggedSec = document.getElementById('user-logged-section');
    const guestSec = document.getElementById('user-guest-section');
    const balEl = document.getElementById('user-balance');

    if (currentUser) {
        if(loggedSec) loggedSec.classList.remove('hidden');
        if(guestSec) guestSec.classList.add('hidden');
        if(balEl) balEl.innerText = `R$ ${userBalance.toFixed(2)}`;
    } else {
        if(loggedSec) loggedSec.classList.add('hidden');
        if(guestSec) guestSec.classList.remove('hidden');
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

function openAuthModal(mode) {
    authMode = mode;
    const modal = document.getElementById('auth-modal');
    const title = document.getElementById('auth-title');
    const nameCont = document.getElementById('auth-name-container');
    const btn = document.getElementById('auth-submit-btn');

    if(modal) modal.classList.remove('hidden');
    if(title) title.innerText = mode === 'signup' ? 'Criar Conta' : 'Entrar no Real Sports';
    if(nameCont) nameCont.classList.toggle('hidden', mode !== 'signup');
    if(btn) btn.innerText = mode === 'signup' ? 'Cadastrar' : 'Entrar';
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if(modal) modal.classList.add('hidden');
}

async function submitAuth() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const fullName = document.getElementById('auth-name')?.value || '';

    if (!email || !password) return alert('Preencha e-mail e senha.');

    if (authMode === 'signup') {
        // Cadastro corrigido (signUp)
        const { data, error } = await _supabase.auth.signUp({
            email: email,
            password: password,
            options: { data: { full_name: fullName } }
        });

        if (error) {
            alert('Erro no cadastro: ' + error.message);
        } else {
            alert('Conta criada com sucesso! Faça login para entrar.');
            openAuthModal('login');
        }
    } else {
        // Login corrigido (signInWithPassword)
        const { data, error } = await _supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            alert('Erro no login: ' + error.message);
        } else {
            currentUser = data.user;
            await loadUserProfile();
            closeAuthModal();
        }
    }
}

async function logout() {
    await _supabase.auth.signOut();
    currentUser = null;
    userBalance = 0;
    updateAuthUI();
}
