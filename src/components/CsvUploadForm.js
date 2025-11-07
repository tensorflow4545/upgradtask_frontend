'use client';
import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import ErrorBox from './ErrorBox';
import StatBox from './StatBox';
import { uploadCSV } from '@/lib/api';

export default function CsvUploadForm({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid CSV file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setUploadResult(null);

      const result = await uploadCSV(file);
      setUploadResult(result);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (onUploadSuccess) {
        setTimeout(onUploadSuccess, 1000);
      }
    } catch (err) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-6">Upload CSV File</h2>

        {error && <ErrorBox message={error} />}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Select CSV File</label>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-300 font-medium">Click to select or drag and drop</p>
                <p className="text-gray-500 text-sm mt-1">CSV files only</p>
              </button>
            </div>
          </div>

          {file && (
            <div className="p-4 bg-blue-900 border border-blue-700 rounded-lg">
              <p className="text-blue-200 text-sm">
                Selected: <span className="font-semibold">{file.name}</span>
              </p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading...' : 'Upload & Generate Certificates'}
          </button>
        </div>

        <div className="mt-8 p-4 bg-slate-700 rounded-lg">
          <p className="text-sm font-semibold text-gray-300 mb-3">CSV Template:</p>
          <pre className="text-xs text-gray-400 overflow-x-auto">
{`Name,Email,Program
John Doe,john@example.com,Web Development
Jane Smith,jane@example.com,Data Science`}
          </pre>
        </div>
      </div>

      {uploadResult && (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Upload Summary</h3>
          <div className="space-y-3">
            <StatBox label="Total Records" value={uploadResult.summary.totalRecords} />
            <StatBox label="Successful" value={uploadResult.summary.successfullyProcessed} color="text-green-400" />
            <StatBox label="Failed" value={uploadResult.summary.failed} color="text-red-400" />
          </div>

          {uploadResult.processed.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Processed Certificates:</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {uploadResult.processed.map((cert, idx) => (
                  <div key={idx} className="p-2 bg-slate-700 rounded text-sm text-gray-300">
                    <p>✅ {cert.studentName}</p>
                    <p className="text-xs text-gray-400">{cert.email}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}