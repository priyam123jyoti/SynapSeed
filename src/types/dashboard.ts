// src/types/dashboard.ts

export interface DashboardStats {
  walletBalance: number;
  lifetimeEarnings: number;
  uploadedPapers: number;
  totalSales: number;
}

export interface EarningsData {
  month: string;
  earnings: number;
}

export interface RecentSale {
  id: string;
  paperTitle: string;
  amount: number;
  buyer?: string;
  createdAt: string;
}

export interface UploadedPaper {
  id: string;
  title: string;
  courseCode: string;
  semester: number;
  uploadedAt: string;
  totalSales: number;
  revenue: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
  earningsChart: EarningsData[];
  recentSales: RecentSale[];
  uploadedPapersTable: UploadedPaper[];
}