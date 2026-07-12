'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import WalletCard from '@/components/dashboard/WalletCard';
import StatCard from '@/components/dashboard/StatCard';
import RecentSales from '@/components/dashboard/RecentSales';

import useDashboard from '@/hooks/useDashboard';

import {
  Wallet,
  IndianRupee,
  FileText,
  ShoppingBag,
} from 'lucide-react';

export default function DashboardPage() {
  const { data, loading, error } = useDashboard();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <p className="text-red-500">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Welcome Back 👋
          </h1>

          <p className="text-slate-500">
            Here's what's happening with your marketplace.
          </p>
        </div>

        {/* Stats Cards */}
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

        {/* Wallet + Recent Sales */}
        <div className="grid lg:grid-cols-2 gap-6">

          <WalletCard
            walletBalance={data?.stats.walletBalance ?? 0}
            lifetimeEarnings={data?.stats.lifetimeEarnings ?? 0}
          />

          <RecentSales
            sales={(data?.recentSales as any) ?? []}
          />

        </div>

      </div>
    </DashboardLayout>
  );
}