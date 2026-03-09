// ===== CREDENTIALS =====
const ADMIN = { username: 'admin', password: 'admin123' };

// ===== LOGIN =====
function handleLogin() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorEl = document.getElementById('loginError');

  if (username === ADMIN.username && password === ADMIN.password) {
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'main.html';
  } else {
    errorEl.style.display = 'block';
    setTimeout(() => errorEl.style.display = 'none', 3000);
  }
}

// Enter key support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleLogin();
});