import { useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true';

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ dni: '', password: '', role: 'doctor' });
  const [recoverMode, setRecoverMode] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();

    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', form.role);
    localStorage.setItem('userName', `Usuario ${form.dni || 'Admin'}`);

    navigate('/');
  };

  const handleRecover = (event) => {
    event.preventDefault();
    alert('Se ha enviado un enlace de recuperación a tu correo registrado.');
    setRecoverMode(false);
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="logo">🏥 Medic DB</div>

        {!recoverMode ? (
          <>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin} className="auth-form">
              <label>
                DNI o Correo Institucional
                <input
                  type="text"
                  value={form.dni}
                  onChange={(event) => setForm((prev) => ({ ...prev, dni: event.target.value }))}
                  placeholder="Ej. 71234567 o admin@medic.com"
                  required
                />
              </label>

              <label>
                Contraseña
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="••••••••"
                  required
                />
              </label>

              <label>
                Simular ingreso como:
                <select
                  value={form.role}
                  onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                >
                  <option value="doctor">Médico</option>
                  <option value="enfermera">Enfermera</option>
                  <option value="admin">Administrativo</option>
                  <option value="paciente">Paciente</option>
                </select>
              </label>

              <button type="submit" className="btn">Ingresar al Sistema</button>
            </form>

            <p className="auth-link" onClick={() => setRecoverMode(true)}>
              ¿Olvidaste tu contraseña?
            </p>
          </>
        ) : (
          <>
            <h2>Recuperar Acceso</h2>
            <p className="muted-text">
              Ingresa tu DNI o correo. Te enviaremos instrucciones para restablecer tu contraseña.
            </p>
            <form onSubmit={handleRecover} className="auth-form">
              <label>
                DNI o Correo
                <input type="text" placeholder="Ej. 71234567" required />
              </label>
              <button type="submit" className="btn">Enviar enlace de recuperación</button>
            </form>
            <p className="auth-link" onClick={() => setRecoverMode(false)}>
              Volver a Iniciar Sesión
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function DashboardPage() {
  const [activeView, setActiveView] = useState('dashboard-view');
  const userName = localStorage.getItem('userName') || 'Dr. Admin';
  const userRole = localStorage.getItem('userRole') || 'admin';

  const menuItems = useMemo(
    () => [
      { id: 'dashboard-view', label: '📊 Dashboard' },
      { id: 'pacientes-view', label: '👥 Pacientes' },
      { id: 'citas-view', label: '📅 Citas Médicas' },
      { id: 'clinico-view', label: '⚕️ Historial Clínico' },
    ],
    []
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">
          <h2>Medic DB</h2>
        </div>
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`nav-btn ${activeView === item.id ? 'active' : ''}`}
                  onClick={() => setActiveView(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="search-bar">
            <input type="text" placeholder="Buscar por DNI o Nombre..." />
          </div>
          <div className="user-profile">
            <span>👤 {userName}</span>
            <small className="role-chip">{userRole}</small>
          </div>
        </header>

        <section className="views-container">
          <article className={`view-module ${activeView === 'dashboard-view' ? 'active' : ''}`}>
            <h1>Panel General</h1>
            <p>Bienvenido al sistema hospitalario.</p>
          </article>

          <article className={`view-module ${activeView === 'pacientes-view' ? 'active' : ''}`}>
            <h1>Directorio de Pacientes</h1>
            <p>Aquí gestionaremos las entidades PERSONA y PACIENTE.</p>
          </article>

          <article className={`view-module ${activeView === 'citas-view' ? 'active' : ''}`}>
            <h1>Gestión de Citas</h1>
            <p>Módulo para programar y revisar la entidad CITA.</p>
          </article>

          <article className={`view-module ${activeView === 'clinico-view' ? 'active' : ''}`}>
            <h1>Historial y Atención</h1>
            <p>Registro de DIAGNÓSTICOS, TRATAMIENTOS y RECETAS.</p>
          </article>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
