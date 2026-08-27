import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ProtectedRouter } from './ProtectedRouter';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { RegisterPage } from '../../features/auth/pages/RegisterPage';
import { AdminBeritaPage } from '../../features/nawasena/berita/pages/AdminBeritaPage';
import { DashboardNawasenaPage } from '../../features/nawasena/dashboard/pages/DashboardNawasenaPage';
import { NawasenaLayout } from '../../features/nawasena/layout/NawasenaLayout';
import { DashboardPortalPage } from '../../features/portal-admin/dashboard/pages/DashboardPortalPage';
import { BeritaPage as PortalBeritaPage } from '../../features/portal/berita/pages/BeritaPage';
import { DashboardPage } from '../../features/portal/dashboard/pages/DashboardPage';
import { InfografisPage } from '../../features/portal/infografis/pages/InfografisPage';
import { KontakPage } from '../../features/portal/kontak/pages/KontakPage';
import { NawasenaPage } from '../../features/portal/nawasena/pages/NawasenaPage';
import { PertanianPage } from '../../features/portal/pertanian/pages/PertanianPage';
import { UmkmPage } from '../../features/portal/umkm/pages/UmkmPage';
import { DashboardLayout } from '../../shared/components/layout/DashboardLayout';
import { AdminUmkmPage } from '../../features/nawasena/umkm/pages/AdminUmkmPage';
import { AdminSchedulePage } from '../../features/nawasena/schedule/pages/AdminSchedulePage';
import { AdminHarvestPage } from '../../features/nawasena/harvest/pages/AdminHarvestPage';
import { AdminVillagePage } from '../../features/nawasena/village/pages/AdminVillagePage';
import { BeritaDetailPage } from '../../features/portal/berita/pages/BeritaDetailPage';
import { AdminPlantingSchedulePage } from '../../features/nawasena/planting-schedule/pages/AdminPlantingSchedulePage';
import { JadwalTanamPage } from '../../features/portal/pertanian/pages/JadwalTanamPage';

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
      { path: 'infografis', element: <InfografisPage /> },
      { path: 'nawasena', element: <NawasenaPage /> },
      { path: 'kontak', element: <KontakPage /> },
      { path: 'berita/:slug', element: <BeritaDetailPage /> },
      { path: 'jadwal-tanam', element: <JadwalTanamPage /> },
    ],
  },

  // ============ AREA PORTAL ADMIN (pemuda -- role: portal) ============
  // Kelola konten publik: Berita, UMKM, Profil Desa. Kalau akun dgn
  // role 'nawasena' coba masuk sini, ProtectedRouter otomatis lempar
  // balik ke area Nawasena miliknya sendiri (bukan ditolak mentah2).
  {
    path: '/portal-admin',
    element: <ProtectedRouter allowedRoles={['portal']} />,
    children: [
      {
        element: <NawasenaLayout />,
        children: [
          { index: true, element: <DashboardPortalPage /> },
          { path: 'berita', element: <AdminBeritaPage /> },
          { path: 'umkm', element: <AdminUmkmPage /> },
          { path: 'village', element: <AdminVillagePage /> },
        ],
      },
    ],
  },

  // ============ AREA NAWASENA ADMIN (tim teknologi -- role: nawasena) ============
  // Kelola data teknis pertanian: Jadwal Tanam, Data Panen, Jadwal.
  {
    path: '/nawasena-admin',
    element: <ProtectedRouter allowedRoles={['nawasena']} />,
    children: [
      {
        element: <NawasenaLayout />,
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
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
