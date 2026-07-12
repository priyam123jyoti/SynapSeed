'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import WalletCard from '@/components/dashboard/WalletCard';
import StatCard from '@/components/dashboard/StatCard';
import RecentSales from '@/components/dashboard/RecentSales';
import UploadedPapersTable from '@/components/dashboard/UploadedPapersTable';


import useDashboard from '@/hooks/useDashboard';

import {
  Wallet,
  IndianRupee,
  FileText,
  ShoppingBag,
} from 'lucide-react';

export default function DashboardPage() {
  const { data } = useDashboard();
  return (
    <DashboardLayout>

    

      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-bold">
            Welcome Back 👋
          </h1>

          <p className="text-slate-500">
            Here's what's happening with your marketplace.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">

          <StatCard
            title="Wallet Balance"
            value={`₹${data?.stats.walletBalance ?? 0}`}
            icon={<Wallet />}
          />

          <StatCard
            title="Lifetime Earnings"
            value={`₹${data?.stats.lifetimeEarnings ?? 0}`}
            icon={<IndianRupee />}
          />

          <StatCard
            title="Uploaded Papers"
            value={data?.stats.uploadedPapers ?? 0}
            icon={<FileText />}
          />

          <StatCard
            title="Total Sales"
            value={data?.stats.totalSales ?? 0}
            icon={<ShoppingBag />}
          />

        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <WalletCard
            walletBalance={data?.stats.walletBalance ?? 0}
            lifetimeEarnings={data?.stats.lifetimeEarnings ?? 0}
          />

        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          <RecentSales
            sales={data?.recentSales ?? []}
          />

          <UploadedPapersTable
            papers={data?.uploadedPapersTable ?? []}
          />

        </div>

      </div>

    </DashboardLayout>
  );
}