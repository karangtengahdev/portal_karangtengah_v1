import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ProtectedRouter } from './ProtectedRouter';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { RegisterPage } from '../../features/auth/pages/RegisterPage';
import { AdminBeritaPage } from '../../features/portal-admin/berita/pages/AdminBeritaPage';
import { DashboardNawasenaPage } from '../../features/nawasena/dashboard/pages/DashboardNawasenaPage';
import { AdminLayout } from '../../shared/components/layout/AdminLayout';
import { DashboardPortalPage } from '../../features/portal-admin/dashboard/pages/DashboardPortalPage';
import { BeritaPage as PortalBeritaPage } from '../../features/portal/berita/pages/BeritaPage';
import { DashboardPage } from '../../features/portal/dashboard/pages/DashboardPage';
import { InfografisPage } from '../../features/portal/infografis/pages/InfografisPage';
import { KontakPage } from '../../features/portal/kontak/pages/KontakPage';
import { NawasenaPage } from '../../features/portal/nawasena/pages/NawasenaPage';
import { PertanianPage } from '../../features/portal/pertanian/pages/PertanianPage';
import { UmkmPage } from '../../features/portal/umkm/pages/UmkmPage';
import { UmkmDetailPage } from '../../features/portal/umkm/pages/UmkmDetailPage';
import { DashboardLayout } from '../../shared/components/layout/DashboardLayout';
import { AdminUmkmPage } from '../../features/portal-admin/umkm/pages/AdminUmkmPage';
import { AdminSchedulePage } from '../../features/nawasena/schedule/pages/AdminSchedulePage';
import { AdminHarvestPage } from '../../features/nawasena/harvest/pages/AdminHarvestPage';
import { AdminVillagePage } from '../../features/portal-admin/village/pages/AdminVillagePage';
import { AdminPadukuhanPage } from '../../features/portal-admin/padukuhan/pages/AdminPadukuhanPage';
import { BeritaDetailPage } from '../../features/portal/berita/pages/BeritaDetailPage';
import { AdminPlantingSchedulePage } from '../../features/nawasena/planting-schedule/pages/AdminPlantingSchedulePage';
import { JadwalTanamPage } from '../../features/portal/pertanian/pages/JadwalTanamPage';
import { DampakEkonomiPage } from '../../features/portal/pertanian/pages/DampakEkonomiPage';
import { RawDataPage } from '../../features/raw-data/pages/RawDataPage';

export const router = createBrowserRouter([
  // ============ PORTAL PUBLIK (tidak perlu login) ============
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'berita', element: <PortalBeritaPage /> },
      { path: 'pertanian', element: <PertanianPage /> },
      { path: 'umkm', element: <UmkmPage /> },
      { path: 'umkm/:slug', element: <UmkmDetailPage /> },
      { path: 'infografis', element: <InfografisPage /> },
      { path: 'nawasena', element: <NawasenaPage /> },
      { path: 'kontak', element: <KontakPage /> },
      { path: 'berita/:slug', element: <BeritaDetailPage /> },
      { path: 'jadwal-tanam', element: <JadwalTanamPage /> },
      { path: 'pertanian/dampak-ekonomi', element: <DampakEkonomiPage /> },
    ],
  },

  // ============ AREA PORTAL ADMIN (pemuda -- role: portal) ============
  // Berita, UMKM, Profil Desa -- file-nya SEKARANG benar-benar di
  // features/portal-admin/, bukan lagi nyasar di features/nawasena/.
  {
    path: '/portal-admin',
    element: <ProtectedRouter allowedRoles={['portal']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPortalPage /> },
          { path: 'berita', element: <AdminBeritaPage /> },
          { path: 'umkm', element: <AdminUmkmPage /> },
          { path: 'village', element: <AdminVillagePage /> },
          { path: 'padukuhan', element: <AdminPadukuhanPage /> },
        ],
      },
    ],
  },

  // ============ AREA NAWASENA ADMIN (tim teknologi -- role: nawasena) ============
  // Jadwal Tanam, Data Panen, Jadwal -- tetap di features/nawasena/,
  // ini memang sudah benar dari awal.
  {
    path: '/nawasena-admin',
    element: <ProtectedRouter allowedRoles={['nawasena']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardNawasenaPage /> },
          { path: 'schedule', element: <AdminSchedulePage /> },
          { path: 'harvest', element: <AdminHarvestPage /> },
          { path: 'planting-schedule', element: <AdminPlantingSchedulePage /> },
        ],
      },
    ],
  },

  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/raw-data',
    element: <RawDataPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
