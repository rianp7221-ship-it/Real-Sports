// Gerenciador de Cadastros e Login (Reserva Local)
document.addEventListener("DOMContentLoaded", () => {
  // Carrega o CSS de autenticação automaticamente
  if (!document.querySelector('link[href="auth-style.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'auth-style.css';
    document.head.appendChild(link);
  }

  const headerActions = document.querySelector('.header-actions') || document.querySelector('header');
  if (!headerActions) return;

  const authDiv = document.createElement('div');
  authDiv.className = 'auth-container';

  const checkUserSession = () => {
    const loggedUser = localStorage.getItem('real_sports_logged_user');
    
    if (loggedUser) {
      authDiv.innerHTML = `
        <div class="user-profile-badge">
          <div class="user-avatar">${loggedUser.charAt(0).toUpperCase()}</div>
          <span>${loggedUser}</span>
        </div>
        <button id="btnLogout" class="btn-auth-login" style="padding: 6px 8px;">Sair</button>
      `;
      
      setTimeout(() => {
        const btnLogout = document.getElementById('btnLogout');
        if (btnLogout) {
          btnLogout.onclick = () => {
            localStorage.removeItem('real_sports_logged_user');
            checkUserSession();
          };
        }
      }, 100);

    } else {
      authDiv.innerHTML = `
        <button id="btnLogin" class="btn-auth-login">Entrar</button>
        <button id="btnRegister" class="btn-auth-register">Cadastrar</button>
      `;

      setTimeout(() => {
        const btnLogin = document.getElementById('btnLogin');
        const btnRegister = document.getElementById('btnRegister');

        if (btnLogin) {
          btnLogin.onclick = () => {
            const email = prompt("Digite seu e-mail de acesso:");
            if (email) {
              let users = JSON.parse(localStorage.getItem('real_sports_database') || '[]');
              const found = users.find(u => u.email === email);
              
              if (found) {
                localStorage.setItem('real_sports_logged_user', found.name);
                alert(`Bem-vindo de volta, ${found.name}!`);
                checkUserSession();
              } else {
                alert("E-mail não cadastrado! Faça o cadastro primeiro.");
              }
            }
          };
        }

        if (btnRegister) {
          btnRegister.onclick = () => {
            const name = prompt("Digite seu nome:");
            const email = prompt("Digite seu e-mail:");
            if (name && email) {
              let users = JSON.parse(localStorage.getItem('real_sports_database') || '[]');
              users.push({ name, email });
              localStorage.setItem('real_sports_database', JSON.stringify(users));
              
              localStorage.setItem('real_sports_logged_user', name);
              alert(`Conta criada com sucesso! Bem-vindo, ${name}.`);
              checkUserSession();
            }
          };
        }
      }, 100);
    }
  };

  headerActions.appendChild(authDiv);
  checkUserSession();
});
