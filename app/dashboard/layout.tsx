import '@/app/globals.css';
import { DashboardLayoutClient } from '@/components/dashboard/dashboard-layout-client';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
