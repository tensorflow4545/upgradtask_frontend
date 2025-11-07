'use client';
import { Download, Mail, Share2, Check } from 'lucide-react';
import { useState } from 'react';

export default function CertificateViewer({ certificate }) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const certificateUrl = certificate.certificateUrl || certificate.certificateImageUrl;
  const certificateFileType = certificate.certificateFileType || 'application/pdf';

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      setDownloaded(true);
      const link = document.createElement('a');
      link.href = certificateUrl;
      const extension = certificateFileType === 'application/pdf'
        ? 'pdf'
        : certificateFileType?.split('/')?.pop() || 'certificate';
      link.download = `${certificate.studentName}-certificate.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (err) {
      console.error('Download failed:', err);
      setDownloaded(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Certificate',
        text: `Check out ${certificate.studentName}'s certificate`,
        url: window.location.href,
      });
    } else {
      handleCopy();
    }
  };

  const issuedDate = new Date(certificate.dateOfIssue).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Certificate of Achievement</h1>
          <p className="text-gray-400">Verify and download your certificate</p>
        </div>

        {/* Main Content Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Certificate Preview - Left/Top */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-2xl">
              <div className="relative">
                {certificateFileType === 'application/pdf' ? (
                  <object
                    data={`${certificateUrl}#toolbar=0`}
                    type="application/pdf"
                    className="w-full h-[600px]"
                  >
                    <iframe
                      src={`${certificateUrl}#toolbar=0`}
                      title="Certificate Preview"
                      className="w-full h-[600px]"
                    />
                  </object>
                ) : (
                  <img
                    src={certificateUrl}
                    alt={`${certificate.studentName}'s Certificate`}
                    className="w-full h-auto object-cover"
                  />
                )}
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="lg:hidden mt-6 flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>

          {/* Certificate Details - Right/Bottom */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Details Card */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h2 className="text-lg font-bold text-white mb-6">Certificate Details</h2>

                {/* Student Name */}
                <div className="mb-5">
                  <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Student Name</p>
                  <p className="text-white text-lg font-semibold">{certificate.studentName}</p>
                </div>

                {/* Email */}
                <div className="mb-5">
                  <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Email</p>
                  <p className="text-blue-400 text-sm break-all">{certificate.email}</p>
                </div>

                {/* Program */}
                <div className="mb-5">
                  <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Program</p>
                  <p className="text-white text-sm">{certificate.programName}</p>
                </div>

                {/* Issued Date */}
                <div className="mb-6">
                  <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Issued Date</p>
                  <p className="text-white text-sm">{issuedDate}</p>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-600 pt-6 mb-6">
                  <p className="text-gray-400 text-xs font-semibold uppercase mb-2">Certificate ID</p>
                  <p className="text-gray-300 text-xs font-mono break-all">{certificate.certificateId}</p>
                </div>

                {/* Verification Badge */}
                <div className="bg-green-900 border border-green-700 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-semibold text-sm">Verified</span>
                  </div>
                  <p className="text-green-300 text-xs">This certificate is authentic and valid</p>
                </div>
              </div>

              {/* Action Buttons - Desktop */}
              <div className="hidden lg:flex flex-col gap-3">
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                >
                  <Download className="w-5 h-5" />
                  {downloaded ? 'Downloaded!' : 'Download'}
                </button>
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
                >
                  <Mail className="w-5 h-5" />
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <p className="text-gray-400 text-sm mb-3">
              This certificate verifies that the holder has successfully completed the required coursework and demonstrated competency in the field of study.
            </p>
            <p className="text-gray-500 text-xs">
              Certificate issued on {issuedDate} | ID: {certificate.certificateId.slice(0, 12)}...
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
