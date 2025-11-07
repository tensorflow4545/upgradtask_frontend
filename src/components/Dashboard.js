'use client';
import { useState, useEffect } from 'react';
import { FileText, Upload, Search } from 'lucide-react';
import DashboardStats from './DashboardStats';
import CsvUploadForm from './CsvUploadForm';
import CertificatesList from './CertificatesList';
import SearchSection from './SearchSection';
import ErrorBox from './ErrorBox';
import LoadingSpinner from './LoadingSpinner';
import { fetchStats } from '@/lib/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const data = await fetchStats();
      setStats(data.data);
    } catch (err) {
      setStatsError('Failed to fetch statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  const tabs = [
    { id: 'stats', label: 'Dashboard', icon: FileText },
    { id: 'upload', label: 'Upload CSV', icon: Upload },
    { id: 'search', label: 'Search', icon: Search },
  ];

  return (
    <div>
      {/* Tab Navigation */}
      <nav className="flex gap-1 mb-8 border-b border-slate-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-4 font-medium flex items-center gap-2 border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Tab Content */}
      <div>
        {activeTab === 'stats' && (
          <div>
            {statsLoading && <LoadingSpinner />}
            {statsError && <ErrorBox message={statsError} />}
            {stats && (
              <>
                <DashboardStats stats={stats} onRefresh={loadStats} />
                <CertificatesList />
              </>
            )}
          </div>
        )}

        {activeTab === 'upload' && <CsvUploadForm onUploadSuccess={loadStats} />}

        {activeTab === 'search' && <SearchSection />}
      </div>
    </div>
  );
}