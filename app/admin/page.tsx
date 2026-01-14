'use client';

import { useState, useEffect } from 'react';

interface SubmissionData {
  _id: string;
  name: string;
  contact: string;
  email: string; // Added email field
  state: string;
  visitorType: 'ib' | 'visitor';
  interest: 'trading' | 'fixed_returns';
  createdAt: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataError, setDataError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    // Use an environment variable for a strong password in production
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      setError('Invalid password');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchSubmissions = async () => {
        setLoading(true);
        setDataError('');
        try {
          const response = await fetch('/api/submissions');
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const data: SubmissionData[] = await response.json();
          setSubmissions(data);
        } catch (err: any) {
          setDataError(err.message || 'Failed to fetch submissions.');
        } finally {
          setLoading(false);
        }
      };
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <form onSubmit={handleLogin} className="p-8 bg-gray-800 rounded shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      {loading && <p className="text-center">Loading submissions...</p>}
      {dataError && <p className="text-red-500 text-center">{dataError}</p>}
      {!loading && !dataError && submissions.length === 0 && (
        <p className="text-center">No submissions found.</p>
      )}

      {submissions.length > 0 && (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-gray-700">
              <tr>
                <th scope="col" className="py-3 px-6">Name</th>
                <th scope="col" className="py-3 px-6">Contact</th>
                <th scope="col" className="py-3 px-6">Email</th> {/* Added Email Header */}
                <th scope="col" className="py-3 px-6">State</th>
                <th scope="col" className="py-3 px-6">Visitor Type</th>
                <th scope="col" className="py-3 px-6">Interest</th>
                <th scope="col" className="py-3 px-6">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                  <td className="py-4 px-6">{submission.name}</td>
                  <td className="py-4 px-6">{submission.contact}</td>
                  <td className="py-4 px-6">{submission.email}</td> {/* Added Email Data */}
                  <td className="py-4 px-6">{submission.state}</td>
                  <td className="py-4 px-6">{submission.visitorType}</td>
                  <td className="py-4 px-6">{submission.interest}</td>
                  <td className="py-4 px-6">{new Date(submission.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {submissions.length > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => window.open('/api/export-excel', '_blank')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Export to Excel
          </button>
        </div>
      )}
    </div>
  );
}