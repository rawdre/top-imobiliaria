function setLoginMessage(message, type = 'error') {
  const box = document.getElementById('loginMessage');
  if (!box) return;
  box.textContent = message;
  box.className = `message show ${type}`;
}

async function bootstrapLogin() {
  const form = document.getElementById('loginForm');

  try {
    ensureConfigured();
    const session = await getSession();
    if (session) {
      window.location.href = './dashboard.html';
      return;
    }
  } catch (error) {
    setLoginMessage(error.message || 'Falha ao verificar sessão.');
    if (form) {
      form.querySelectorAll('input, button').forEach((field) => {
        field.disabled = true;
      });
    }
    return;
  }

  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const button = form.querySelector('button[type="submit"]');
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      setLoginMessage('Preencha email e senha.');
      return;
    }

    button.disabled = true;
    button.textContent = 'Entrando...';

    try {
      await signIn(email, password);
      window.location.href = './dashboard.html';
    } catch (error) {
      setLoginMessage(error.message || 'Não foi possível entrar.');
      button.disabled = false;
      button.textContent = 'Entrar no painel';
    }
  });
}

document.addEventListener('DOMContentLoaded', bootstrapLogin);
