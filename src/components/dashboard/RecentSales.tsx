'use client';

import { ShoppingBag, Clock } from 'lucide-react';

export interface RecentSale {
  id: string;
  paperTitle: string;
  amount: number;
  buyer?: string;
  createdAt: string;
}

interface RecentSalesProps {
  sales: RecentSale[];
}

export default function RecentSales({
  sales,
}: RecentSalesProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-xl font-bold text-slate-900">
            Recent Sales
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Latest earnings from your papers
          </p>

        </div>

        <ShoppingBag
          className="text-green-600"
          size={24}
        />

      </div>

      {sales.length === 0 ? (

        <div className="py-12 text-center">

          <ShoppingBag
            size={42}
            className="mx-auto text-slate-300"
          />

          <p className="mt-4 font-semibold text-slate-500">
            No sales yet
          </p>

          <p className="text-sm text-slate-400">
            Upload more papers to start earning.
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {sales.map((sale) => (

            <div
              key={sale.id}
              className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50"
            >

              <div>

                <h3 className="font-semibold text-slate-900">
                  {sale.paperTitle}
                </h3>

                {sale.buyer && (
                  <p className="text-sm text-slate-500">
                    Purchased by {sale.buyer}
                  </p>
                )}

                <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">

                  <Clock size={14} />

                  {sale.createdAt}

                </div>

              </div>

              <div className="text-right">

                <p className="text-xl font-bold text-green-600">
                  +₹{sale.amount.toFixed(2)}
                </p>

                <p className="text-xs text-slate-400">
                  Paper Sale
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}