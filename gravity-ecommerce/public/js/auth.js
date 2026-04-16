// Authentication State Management
const Auth = {
  getToken: () => localStorage.getItem('gravity_token'),
  getUser: () => JSON.parse(localStorage.getItem('gravity_user')),
  setAuth: (token, user) => {
    localStorage.setItem('gravity_token', token);
    localStorage.setItem('gravity_user', JSON.stringify(user));
    UI.updateNavUser();
  },
  logout: () => {
    localStorage.removeItem('gravity_token');
    localStorage.removeItem('gravity_user');
    window.location.reload();
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('gravity_token');
  },
  requireAuth: (callback) => {
    if (Auth.isAuthenticated()) {
      callback();
    } else {
      UI.openModal('auth-modal');
    }
  }
};

// UI Handling for Auth
const UI = {
  updateNavUser: () => {
    const user = Auth.getUser();
    const userBtn = document.getElementById('nav-user');
    if (userBtn) {
      if (user) {
        userBtn.innerHTML = `Welcome, ${user.name.split(' ')[0]} <a href="#" onclick="Auth.logout()">(Logout)</a>`;
      } else {
        userBtn.innerHTML = `Login / Sign Up`;
      }
    }
  },
  openModal: (id) => {
    const modal = document.getElementById(id);
    if(modal) modal.classList.add('active');
  },
  closeModal: (id) => {
    const modal = document.getElementById(id);
    if(modal) modal.classList.remove('active');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  UI.updateNavUser();

  // Handle Login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
          Auth.setAuth(data.token, data.user);
          UI.closeModal('auth-modal');
          window.location.reload();
        } else {
          alert(data.error);
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  // Handle Signup
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = e.target.name.value;
      const email = e.target.email.value;
      const password = e.target.password.value;
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (res.ok) {
          Auth.setAuth(data.token, data.user);
          UI.closeModal('auth-modal');
          window.location.reload();
        } else {
          alert(data.error);
        }
      } catch (err) {
        console.error(err);
      }
    });
  }
});
