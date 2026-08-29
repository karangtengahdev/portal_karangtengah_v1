import {
  TextInput,
  PasswordInput,
  Button,
  Alert,
  Text,
  Title,
  Divider,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconArrowRight,
  IconLock,
  IconMail,
  IconAlertCircle,
  IconSeeding,
} from '@tabler/icons-react';
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(28px, 5vw, 56px) clamp(24px, 4vw, 56px)',
        fontFamily:
          "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif",
        background: '#ffffff',
      }}
    >
      <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
        {/* Brand mark */}
        <div style={{ marginBottom: '36px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              display: 'grid',
              placeItems: 'center',
              borderRadius: '16px',
              background: 'rgba(31, 74, 52, 0.08)',
              color: '#1F4A34',
              marginBottom: '20px',
            }}
          >
            <IconSeeding size={26} stroke={1.6} />
          </div>
          <Text
            size="sm"
            fw={600}
            tt="uppercase"
            style={{ letterSpacing: '0.18em', color: '#8A5A3B' }}
          >
            Dashboard Desa
          </Text>
          <Title
            order={2}
            mt={8}
            style={{
              color: '#1C2620',
              fontWeight: 700,
              fontSize: '26px',
              lineHeight: 1.2,
            }}
          >
            Selamat Datang Kembali
          </Title>
          <div
            style={{
              marginTop: '12px',
              height: '3px',
              width: '56px',
              borderRadius: '999px',
              background: '#D9A441',
            }}
          />
          <Text size="sm" mt="sm" c="dimmed">
            Masuk untuk mengelola data desa, panen, UMKM, dan berita.
          </Text>
        </div>

        {/* Form card */}
        <div
          style={{
            borderRadius: '20px',
            border: '1px solid rgba(31, 74, 52, 0.08)',
            background: 'rgba(248, 250, 245, 0.6)',
            padding: 'clamp(24px, 3vw, 32px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
          }}
        >
          <form
            onSubmit={onSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <TextInput
              label="Email"
              placeholder="Masukkan email Anda"
              leftSection={
                <IconMail size={18} style={{ color: '#9ca3af' }} />
              }
              value={email}
              onChange={(event) => onEmailChange(event.currentTarget.value)}
              type="email"
              required
              size="lg"
              radius="md"
              styles={{
                label: {
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#8A5A3B',
                  marginBottom: 6,
                },
                input: {
                  borderColor: '#E5E1D6',
                  transition: 'border-color 0.2s ease',
                },
              }}
            />

            <PasswordInput
              label="Password"
              placeholder="Masukkan password Anda"
              leftSection={
                <IconLock size={18} style={{ color: '#9ca3af' }} />
              }
              value={password}
              onChange={(event) =>
                onPasswordChange(event.currentTarget.value)
              }
              required
              size="lg"
              radius="md"
              styles={{
                label: {
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#8A5A3B',
                  marginBottom: 6,
                },
                input: {
                  borderColor: '#E5E1D6',
                  transition: 'border-color 0.2s ease',
                },
              }}
            />

            {errorMessage && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Gagal Masuk"
                variant="light"
                radius="md"
                styles={{
                  root: {
                    backgroundColor: 'rgba(193,80,46,0.08)',
                    borderColor: 'rgba(193,80,46,0.25)',
                  },
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
              styles={{
                root: {
                  backgroundColor: '#1F4A34',
                  transition: 'all 0.2s ease',
                },
              }}
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
          &copy; {new Date().getFullYear()} Portal Desa &middot; Studyblog Is
          The Best
        </Text>
      </div>
    </div>
  );
};