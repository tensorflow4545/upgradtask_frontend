'use client';
import { FileText, RotateCcw } from 'lucide-react';
import StatCard from './StatCard';

export default function DashboardStats({ stats, onRefresh }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Overview</h2>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <RotateCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Total Certificates"
          value={stats?.totalCertificates || 0}
          icon={<FileText className="w-8 h-8" />}
          color="bg-blue-500"
        />

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <p className="text-gray-400 text-sm font-medium mb-2">System Status</p>
          <p className="text-2xl font-bold text-white">✅ Active</p>
        </div>
      </div>
    </div>
  );
}