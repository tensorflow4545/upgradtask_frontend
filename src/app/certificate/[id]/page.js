'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CertificateViewer from '@/components/CertificateViewer';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBox from '@/components/ErrorBox';
import { fetchCertificateById } from '@/lib/api';

export default function CertificatePage() {
  const params = useParams();
  const certificateId = params.id;
  
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!certificateId) return;
    
    loadCertificate();
  }, [certificateId]);

  const loadCertificate = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchCertificateById(certificateId);
      setCertificate(data.data);
    } catch (err) {
      setError(err.message || 'Failed to load certificate');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorBox message={error} />
          <div className="text-center mt-6">
            <p className="text-gray-400 mb-4">Certificate not found or has expired</p>
            <a
              href="/"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <ErrorBox message="Certificate data not found" />
      </div>
    );
  }

  return <CertificateViewer certificate={certificate} />;
}