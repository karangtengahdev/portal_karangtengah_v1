import { FormRegister } from '../components/FormRegister';

export const RegisterPage = () => {
  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 text-neutral-950">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl items-center justify-center">
        <section className="w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
          <FormRegister />
        </section>
      </div>
    </main>
  );
};
