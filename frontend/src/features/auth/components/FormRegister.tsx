import { TextInput, PasswordInput, Button, Text, Title, Divider } from '@mantine/core';
import { IconLock, IconUserPlus, IconArrowLeft } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export const FormRegister = () => {
  return (
    <div
      style={{
        padding: 'clamp(28px, 5vw, 48px) clamp(24px, 4vw, 48px)',
        fontFamily:
          "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div style={{ marginBottom: '32px' }}>
        <Text
          size="sm"
          fw={600}
          tt="uppercase"
          style={{ letterSpacing: '0.18em', color: '#1F4A34' }}
        >
          Register
        </Text>
        <Title
          order={2}
          mt={8}
          style={{ color: '#1C2620', fontWeight: 700, fontSize: '24px' }}
        >
          Registrasi Admin
        </Title>
        <div
          style={{
            marginTop: '12px',
            height: '3px',
            width: '48px',
            borderRadius: '999px',
            background: '#D9A441',
          }}
        />
      </div>

      <form
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <TextInput
          label="Username"
          placeholder="Masukkan username"
          leftSection={
            <IconUserPlus size={18} style={{ color: '#9ca3af' }} />
          }
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
            input: { borderColor: '#E5E1D6' },
          }}
        />

        <PasswordInput
          label="Password"
          placeholder="Masukkan password"
          leftSection={
            <IconLock size={18} style={{ color: '#9ca3af' }} />
          }
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
            input: { borderColor: '#E5E1D6' },
          }}
        />

        <Button
          type="button"
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
          Daftar
        </Button>
      </form>

      <Button
        component={Link}
        to="/login"
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        size="md"
        radius="md"
        mt="lg"
        fullWidth
        styles={{ root: { color: '#1F4A34' } }}
      >
        Sudah punya akun? Masuk
      </Button>

      <Divider mt="xl" mb="md" color="#EDEAE0" />
      <Text size="xs" ta="center" c="dimmed">
        &copy; {new Date().getFullYear()} Portal Desa &middot; Studyblog Is
        The Best
      </Text>
    </div>
  );
};
