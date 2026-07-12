'use client';

import { IndianRupee } from 'lucide-react';

interface Sale {
  amount: number;
  created_at: string;
  papers: {
    course_title: string;
  } | null;
}

interface RecentSalesProps {
  sales: Sale[];
}

export default function RecentSales({
  sales,
}: RecentSalesProps) {
  return (
    <div className="rounded-3xl bg-white shadow-sm border border-slate-200 p-6">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">
            Recent Sales
          </h2>

          <p className="text-sm text-slate-500">
            Your latest paper purchases
          </p>
        </div>
      </div>

      {sales.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          No sales yet.
        </div>
      ) : (
        <div className="space-y-4">
          {sales.map((sale, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 hover:bg-slate-50 transition"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  {sale.papers?.course_title ?? 'Paper'}
                </p>

                <p className="text-xs text-slate-500">
                  {new Date(
                    sale.created_at
                  ).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-1 text-green-600 font-bold">
                <IndianRupee size={16} />
                {sale.amount}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}