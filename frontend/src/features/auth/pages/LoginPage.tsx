import { Navigate } from 'react-router-dom';

import { getHomePathForRole, useAuth } from '../../../app/providers/AuthContext';
import { FormLogin } from '../components/FormLogin';
import { useAuthForm } from '../hooks/useAuthForm';

export const LoginPage = () => {
  const { isAuthenticated, role } = useAuth();

  const {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    errorMessage,
    handleLogin,
  } = useAuthForm();

  if (isAuthenticated) {
    return <Navigate to={getHomePathForRole(role)} replace />;
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8faf5 0%, #eef3e6 50%, #f5f2eb 100%)',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <section
        style={{
          display: 'grid',
          width: '100%',
          maxWidth: '1040px',
          overflow: 'hidden',
          borderRadius: '24px',
          border: '1px solid rgba(31, 74, 52, 0.08)',
          background: '#ffffff',
          boxShadow:
            '0 25px 50px rgba(31, 74, 52, 0.08), 0 8px 24px rgba(31, 74, 52, 0.04), 0 0 0 1px rgba(255,255,255,0.8)',
          gridTemplateColumns: '1fr',
        }}
        className="login-card-grid"
      >
        {/* Panel kiri — branding */}
        <div className="login-brand-panel">
          <div style={{ position: 'relative', zIndex: 2 }}>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: 'rgba(255,255,255,0.7)',
                margin: 0,
              }}
            >
              Portal Desa
            </p>
            <h1
              style={{
                marginTop: '12px',
                fontSize: '36px',
                fontWeight: 800,
                lineHeight: 1.1,
                color: '#ffffff',
                fontFamily:
                  "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
                letterSpacing: '-0.01em',
              }}
            >
              Karang
              <br />
              tengah
            </h1>
            <div
              style={{
                width: '48px',
                height: '3px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.35)',
                marginTop: '20px',
              }}
            />
            <p
              style={{
                marginTop: '16px',
                fontSize: '13px',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.72)',
                maxWidth: '280px',
              }}
            >
              Sistem informasi terpadu untuk pengelolaan data desa, pertanian
              cerdas, dan UMKM lokal.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {[
              { value: '128', label: 'Data Warga' },
              { value: '24', label: 'Agenda' },
              { value: '8', label: 'Layanan' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: '14px 12px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#ffffff',
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.6)',
                    marginTop: '6px',
                    margin: '6px 0 0',
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Decorative shapes */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-40px',
              left: '-40px',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Panel kanan — form */}
        <FormLogin
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
          onEmailChange={setEmail}
          password={password}
          email={email}
        />
      </section>
    </main>
  );
};
