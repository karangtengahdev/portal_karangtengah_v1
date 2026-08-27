import { TextInput, PasswordInput, Button, Alert, Paper, Text, Title, Divider } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconLock, IconMail, IconAlertCircle, IconSeeding } from '@tabler/icons-react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';

type FormLoginProps = {
  email: string;
  password: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export const FormLogin = ({
  email,
  password,
  isSubmitting,
  errorMessage,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: FormLoginProps) => {
  return (
    // Padding diperbesar (p-10 -> p-12/p-14) supaya form terasa lebih
    // lega, sejalan dengan kolom yang sekarang sudah lebih lebar.
    <Paper className="flex h-full flex-col justify-center p-6 sm:p-12 lg:p-14 font-['Plus_Jakarta_Sans']" radius={0} bg="transparent">
      {/* max-w-sm (384px) -> max-w-md (448px): form jadi lebih besar
          secara nyata, bukan cuma kolom luarnya yang lebar sementara
          isinya tetap kecil di tengah. */}
      <div className="mx-auto w-full max-w-md">
        {/* Brand mark -- ikon & teks sedikit diperbesar mengikuti skala baru */}
        <div className="mb-9 flex flex-col items-start">
          <div className="mb-4 grid h-14 w-14 place-items-center rounded-xl bg-[#1F4A34]/10 text-[#1F4A34]">
            <IconSeeding size={28} stroke={1.6} />
          </div>
          <Text size="sm" fw={600} tt="uppercase" style={{ letterSpacing: '0.18em' }} c="#8A5A3B">
            Dashboard Desa
          </Text>
          <Title order={2} mt={8} c="#1C2620" fw={700} size="28px">
            Selamat Datang Kembali
          </Title>
          <div className="mt-3 h-[3px] w-14 rounded-full bg-[#D9A441]" />
          <Text size="sm" mt="sm" c="dimmed">
            Masuk untuk mengelola data desa, panen, UMKM, dan berita.
          </Text>
        </div>

        {/* Card field -- padding diperbesar (p-6/p-7 -> p-7/p-8) */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white/70 p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm sm:p-8">
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <TextInput
              label="Email"
              placeholder="Masukkan email Anda"
              leftSection={<IconMail size={18} className="text-neutral-400" />}
              value={email}
              onChange={(event) => onEmailChange(event.currentTarget.value)}
              type="email"
              required
              size="lg"
              radius="md"
              styles={{
                label: { fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8A5A3B', marginBottom: 6 },
                input: { borderColor: '#E5E1D6' },
              }}
              classNames={{ input: 'focus:border-[#1F4A34]' }}
            />

            <PasswordInput
              label="Password"
              placeholder="Masukkan password Anda"
              leftSection={<IconLock size={18} className="text-neutral-400" />}
              value={password}
              onChange={(event) => onPasswordChange(event.currentTarget.value)}
              required
              size="lg"
              radius="md"
              styles={{
                label: { fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8A5A3B', marginBottom: 6 },
                input: { borderColor: '#E5E1D6' },
              }}
              classNames={{ input: 'focus:border-[#1F4A34]' }}
            />

            {errorMessage && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Gagal Masuk"
                variant="light"
                radius="md"
                styles={{
                  root: { backgroundColor: 'rgba(193,80,46,0.08)', borderColor: 'rgba(193,80,46,0.25)' },
                  title: { color: '#C1502E' },
                  body: { color: '#8A5A3B' },
                  icon: { color: '#C1502E' },
                }}
              >
                {errorMessage}
              </Alert>
            )}

            <Button
              type="submit"
              loading={isSubmitting}
              rightSection={<IconArrowRight size={18} />}
              size="lg"
              radius="md"
              mt="sm"
              fullWidth
              styles={{ root: { backgroundColor: '#1F4A34', '&:hover': { backgroundColor: '#173a29' } } }}
            >
              Masuk
            </Button>
          </form>
        </div>

        <Button
          component={Link}
          to="/"
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          size="md"
          radius="md"
          mt="lg"
          fullWidth
          styles={{ root: { color: '#1F4A34' } }}
        >
          Kembali ke Beranda
        </Button>

        <Divider mt="xl" mb="md" color="#EDEAE0" />
        <Text size="xs" ta="center" c="dimmed">
          &copy; {new Date().getFullYear()} Portal Desa &middot; Studyblog Is The Best
        </Text>
      </div>
    </Paper>
  );
};