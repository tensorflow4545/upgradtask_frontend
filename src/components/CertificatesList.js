'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';
import ErrorBox from './ErrorBox';
import { fetchStats } from '@/lib/api';

export default function CertificatesList() {
  const router = useRouter();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const data = await fetchStats();
      setCertificates(data.data?.recentCertificates || []);
    } catch (err) {
      setError('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBox message={error} />;

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700 bg-slate-900">
        <h3 className="text-lg font-semibold text-white">Recent Certificates</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-700">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Student Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Program</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert._id} className="border-b border-slate-700 hover:bg-slate-700 transition">
                <td className="px-6 py-4 text-sm text-gray-300">{cert.studentName}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{cert.email}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{cert.programName}</td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {new Date(cert.dateOfIssue).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => router.push(`/certificate/${cert.certificateId}`)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}