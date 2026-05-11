// app.js - Frontend para Turnos Médicos

const API_BASE = 'http://localhost:3000/api';

// Elementos DOM
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const createTurnoForm = document.getElementById('createTurnoForm');
const createTurnoSection = document.getElementById('createTurnoSection');
const turnosContainer = document.getElementById('turnosContainer');

const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const createTurnoBtn = document.getElementById('createTurnoBtn');

const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');
const createTurnoMessage = document.getElementById('createTurnoMessage');

// Verificar si hay token al cargar
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        showDashboard();
        loadTurnos();
    } else {
        showAuth();
    }
});

// Navegación
loginBtn.addEventListener('click', () => {
    loginSection.style.display = 'block';
    registerSection.style.display = 'none';
});

registerBtn.addEventListener('click', () => {
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    showAuth();
});

createTurnoBtn.addEventListener('click', () => {
    createTurnoSection.style.display = createTurnoSection.style.display === 'none' ? 'block' : 'none';
});

// Formularios
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            showDashboard();
            loadTurnos();
            showMessage(loginMessage, 'Inicio de sesión exitoso', 'success');
        } else {
            showMessage(loginMessage, data.message || 'Error en el inicio de sesión', 'error');
        }
    } catch (error) {
        showMessage(loginMessage, 'Error de conexión', 'error');
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('registerNombre').value;
    const apellido = document.getElementById('registerApellido').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, apellido, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(registerMessage, 'Registro exitoso. Ahora puedes iniciar sesión.', 'success');
            registerForm.reset();
            loginBtn.click();
        } else {
            showMessage(registerMessage, data.message || 'Error en el registro', 'error');
        }
    } catch (error) {
        showMessage(registerMessage, 'Error de conexión', 'error');
    }
});

createTurnoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fecha = document.getElementById('turnoFecha').value;
    const hora = document.getElementById('turnoHora').value;
    const profesional = document.getElementById('turnoProfesional').value;
    const especialidad = document.getElementById('turnoEspecialidad').value;
    const motivo = document.getElementById('turnoMotivo').value;

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_BASE}/turnos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ fecha, hora, profesional, especialidad, motivo }),
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(createTurnoMessage, 'Turno creado exitosamente', 'success');
            createTurnoForm.reset();
            createTurnoSection.style.display = 'none';
            loadTurnos();
        } else {
            showMessage(createTurnoMessage, data.message || 'Error al crear turno', 'error');
        }
    } catch (error) {
        showMessage(createTurnoMessage, 'Error de conexión', 'error');
    }
});

// Funciones auxiliares
function showAuth() {
    loginSection.style.display = 'block';
    registerSection.style.display = 'none';
    dashboard.style.display = 'none';
    loginBtn.style.display = 'inline-block';
    registerBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
}

function showDashboard() {
    loginSection.style.display = 'none';
    registerSection.style.display = 'none';
    dashboard.style.display = 'block';
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
}

async function loadTurnos() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_BASE}/turnos/mis-turnos`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const turnos = await response.json();

        if (response.ok) {
            renderTurnos(turnos);
        } else {
            turnosContainer.innerHTML = '<p>Error al cargar turnos</p>';
        }
    } catch (error) {
        turnosContainer.innerHTML = '<p>Error de conexión</p>';
    }
}

function renderTurnos(turnos) {
    if (turnos.length === 0) {
        turnosContainer.innerHTML = '<p>No tienes turnos programados</p>';
        return;
    }

    turnosContainer.innerHTML = turnos.map(turno => `
        <div class="turno-card ${turno.estado}">
            <h4>${turno.especialidad}</h4>
            <p><strong>Fecha:</strong> ${new Date(turno.fecha).toLocaleDateString()}</p>
            <p><strong>Hora:</strong> ${turno.hora}</p>
            <p><strong>Motivo:</strong> ${turno.motivo || 'No especificado'}</p>
            <p class="estado"><strong>Estado:</strong> ${turno.estado}</p>
        </div>
    `).join('');
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = type;
    setTimeout(() => {
        element.textContent = '';
        element.className = '';
    }, 5000);
}