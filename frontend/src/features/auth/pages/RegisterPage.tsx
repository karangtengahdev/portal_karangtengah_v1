import { FormRegister } from '../components/FormRegister';

export const RegisterPage = () => {
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
          width: '100%',
          maxWidth: '480px',
          overflow: 'hidden',
          borderRadius: '24px',
          border: '1px solid rgba(31, 74, 52, 0.08)',
          background: '#ffffff',
          boxShadow:
            '0 25px 50px rgba(31, 74, 52, 0.08), 0 8px 24px rgba(31, 74, 52, 0.04)',
        }}
      >
        <FormRegister />
      </section>
    </main>
  );
};
