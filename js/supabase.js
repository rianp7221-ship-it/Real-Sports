// Conexão com o Banco de Dados Supabase
const SUPABASE_URL = 'https://eyikgikngskbbutuxuaj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_xH3OeSXlZu07ue1PwImKyw_6cGkC9Fu';

// Cria a instância global
const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
