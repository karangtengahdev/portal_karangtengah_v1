import { IconLock, IconUserPlus } from '@tabler/icons-react';

export const FormRegister = () => {
  return (
    <form className="p-6 sm:p-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-emerald-700">
          Register
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-neutral-950">
          Registrasi Admin
        </h2>
      </div>

      <label className="mt-8 block text-sm font-medium text-neutral-700">
        Username
        <span className="mt-2 flex h-11 items-center gap-3 rounded-md border border-neutral-300 bg-white px-3">
          <IconUserPlus size={18} className="text-neutral-500" />
          <input
            className="h-full flex-1 border-0 bg-transparent text-sm outline-none"
            type="text"
          />
        </span>
      </label>

      <label className="mt-4 block text-sm font-medium text-neutral-700">
        Password
        <span className="mt-2 flex h-11 items-center gap-3 rounded-md border border-neutral-300 bg-white px-3">
          <IconLock size={18} className="text-neutral-500" />
          <input
            className="h-full flex-1 border-0 bg-transparent text-sm outline-none"
            type="password"
          />
        </span>
      </label>

      <button
        className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white"
        type="button"
      >
        Daftar
      </button>
    </form>
  );
};
