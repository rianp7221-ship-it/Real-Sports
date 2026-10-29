// rs-base.js: ligação ao Supabase e funções partilhadas (carregar PRIMEIRO)
const SUPABASE_URL = 'https://eyikgikngskbbutuxuaj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aWtnaWtuZ3NrYmJ1dHV4dWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNDc1NjEsImV4cCI6MjEwODcyMzU2MX0.BszkQeKnrxb9PSA67K0uNzEagC2KLyDEDNYORPif5Fc';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const $ = id => document.getElementById(id);
const R = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
let saldo = 0, utilizador = null;

// ---------- Armazenamento local (histórico e bilhetes) ----------
const chave = t => t + '_' + (utilizador ? utilizador.id : 'visitante');
const ler = t => { try { return JSON.parse(localStorage.getItem(chave(t)) || '[]'); } catch (e) { return []; } };
const gravar = (t, v) => { try { localStorage.setItem(chave(t), JSON.stringify(v)); } catch (e) {} };
function registar(txt) { const h = ler('rs_hist'); h.unshift({ txt, data: new Date().toLocaleString('pt-BR') }); gravar('rs_hist', h.slice(0, 50)); }

// ---------- Saldo ----------
async function mudarSaldo(novo) {
    const { data, error } = await supabase.from('profiles').update({ balance: novo }).eq('id', utilizador.id).select('balance');
    if (error || !data || !data.length) {
        alert('Não foi possível atualizar o saldo no servidor. ' + (error ? error.message : 'Verifique as políticas (RLS) da tabela profiles.'));
        return false;
    }
    saldo = Number(data[0].balance);
    atualizarSaldoNaTela(saldo);
    return true;
}
function atualizarSaldoNaTela(v) { const el = $('user-balance'); if (el) el.textContent = R(v); }
function precisaLogin() { if (!utilizador) { alert('Entre na sua conta para continuar.'); location.href = 'login.html'; return true; } return false; }

// ---------- Abas ----------
function switchTab(aba) {
    $('tab-sports').classList.toggle('hidden', aba !== 'sports');
    $('tab-mines').classList.toggle('hidden', aba !== 'mines');
    if (aba === 'mines') renderMines();
}
