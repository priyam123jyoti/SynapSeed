'use client';

import Link from 'next/link';
import {
  FileText,
  Eye,
  IndianRupee,
  TrendingUp,
} from 'lucide-react';

export interface UploadedPaper {
  id: string;
  title: string;
  courseCode: string;
  semester: number;
  uploadedAt: string;
  totalSales: number;
  revenue: number;
}

interface UploadedPapersTableProps {
  papers: UploadedPaper[];
}

export default function UploadedPapersTable({
  papers,
}: UploadedPapersTableProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6">

        <div>

          <h2 className="text-xl font-bold text-slate-900">
            Uploaded Papers
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage all your uploaded question papers
          </p>

        </div>

      </div>

      {/* Empty State */}

      {papers.length === 0 ? (

        <div className="py-16 text-center">

          <FileText
            size={48}
            className="mx-auto text-slate-300"
          />

          <h3 className="mt-5 text-lg font-bold text-slate-700">
            No Papers Uploaded
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Upload your first paper to start earning.
          </p>

        </div>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-100 bg-slate-50">

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Paper
                </th>

                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                  Semester
                </th>

                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                  Sales
                </th>

                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                  Revenue
                </th>

                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                  Uploaded
                </th>

                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {papers.map((paper) => (

                <tr
                  key={paper.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >

                  {/* Paper */}

                  <td className="px-6 py-5">

                    <div>

                      <h3 className="font-semibold text-slate-900">
                        {paper.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {paper.courseCode}
                      </p>

                    </div>

                  </td>

                  {/* Semester */}

                  <td className="text-center">

                    <span className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
                      Sem {paper.semester}
                    </span>

                  </td>

                  {/* Sales */}

                  <td className="text-center">

                    <div className="flex items-center justify-center gap-2 font-semibold text-slate-800">

                      <TrendingUp
                        size={16}
                        className="text-green-600"
                      />

                      {paper.totalSales}

                    </div>

                  </td>

                  {/* Revenue */}

                  <td className="text-center">

                    <div className="flex items-center justify-center gap-1 font-bold text-green-600">

                      <IndianRupee size={16} />

                      {paper.revenue.toFixed(2)}

                    </div>

                  </td>

                  {/* Date */}

                  <td className="text-center text-sm text-slate-500">

                    {paper.uploadedAt}

                  </td>

                  {/* Action */}

                  <td className="text-center">

                    <Link
                      href={`/papers/view/${paper.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                    >
                      <Eye size={16} />
                      View
                    </Link>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}