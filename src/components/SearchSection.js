'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import ErrorBox from './ErrorBox';
import LoadingSpinner from './LoadingSpinner';
import { searchCertificates } from '@/lib/api';

export default function SearchSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResults([]);

      const data = await searchCertificates(query);
      setResults(data.data);
      setSearched(true);
    } catch (err) {
      setError('Failed to search certificates');
    } finally {
      setLoading(false);
    }
  };

  if (loading && searched) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, or certificate ID..."
          className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      </div>

      {error && <ErrorBox message={error} />}

      {searched && (
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 bg-slate-900">
            <h3 className="text-lg font-semibold text-white">
              Results ({results.length})
            </h3>
          </div>

          {results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-700">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Student Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Program</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((cert) => (
                    <tr key={cert._id} className="border-b border-slate-700 hover:bg-slate-700 transition">
                      <td className="px-6 py-4 text-sm text-gray-300">{cert.studentName}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{cert.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{cert.programName}</td>
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
          ) : (
            <div className="px-6 py-8 text-center text-gray-400">
              No certificates found matching your search
            </div>
          )}
        </div>
      )}
    </div>
  );
}