import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../../app/providers/AuthContext';
import { FormLogin } from '../components/FormLogin';
import { useAuthForm } from '../hooks/useAuthForm';

type LoginLocationState = {
  from?: {
    pathname?: string;
  };
};

export const LoginPage = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const from =
    (location.state as LoginLocationState | null)?.from?.pathname ?? '/dashboard';
  const redirectTo = from === '/login' ? '/dashboard' : from;

  const {
    email, // Ambil email dari hooks
    setEmail,
    password,
    setPassword,
    isSubmitting,
    errorMessage,
    handleLogin,
  } = useAuthForm(redirectTo);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 text-neutral-950">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm lg:grid-cols-[1fr_420px]">
          <div className="hidden bg-[linear-gradient(135deg,#166534_0%,#0f766e_45%,#0369a1_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-100">
                Portal Desa
              </p>
              <h1 className="mt-4 max-w-lg text-4xl font-semibold leading-tight">
                Karangtengah
              </h1>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-md bg-white/12 p-4">
                <p className="text-2xl font-semibold">128</p>
                <p className="mt-1 text-emerald-50">Data warga</p>
              </div>
              <div className="rounded-md bg-white/12 p-4">
                <p className="text-2xl font-semibold">24</p>
                <p className="mt-1 text-emerald-50">Agenda</p>
              </div>
              <div className="rounded-md bg-white/12 p-4">
                <p className="text-2xl font-semibold">8</p>
                <p className="mt-1 text-emerald-50">Layanan</p>
              </div>
            </div>
          </div>

          <FormLogin
            errorMessage={errorMessage}
            isSubmitting={isSubmitting}
            onPasswordChange={setPassword}
            onSubmit={handleLogin}
            onEmailChange={setEmail} // Pasing setEmail ke komponen
            password={password}
            email={email} // Pasing email ke komponen
          />
        </section>
      </div>
    </main>
  );
};