import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { ReportView } from './components/ReportView';
import { parseCSV } from './utils/csvParser';
import type { AttendanceRecord } from './types/attendance';
import { FileText, LayoutDashboard, Printer } from 'lucide-react';
import { clsx } from 'clsx';

function App() {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report'>('dashboard');

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      const parsedData = await parseCSV(file);
      setData(parsedData);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert('Failed to parse CSV file.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Gurukul Attendance Report</h1>
          </div>

          {data.length > 0 && (
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={clsx(
                    "px-4 py-2 rounded-md text-sm font-medium transition-all",
                    activeTab === 'dashboard' ? "bg-white text-primary-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <LayoutDashboard className="w-4 h-4 inline-block mr-2" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('report')}
                  className={clsx(
                    "px-4 py-2 rounded-md text-sm font-medium transition-all",
                    activeTab === 'report' ? "bg-white text-primary-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <FileText className="w-4 h-4 inline-block mr-2" />
                  Detailed Report
                </button>
              </div>

              <button
                onClick={handlePrint}
                className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                title="Print Report"
              >
                <Printer className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Welcome to Attendance Reporter</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Upload your weekly attendance CSV to generate beautiful insights and printable reports for the Sunday assembly.
              </p>
            </div>
            {loading ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Processing data...</p>
              </div>
            ) : (
              <FileUpload onFileUpload={handleFileUpload} />
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className={clsx(activeTab === 'dashboard' ? 'block' : 'hidden print:hidden')}>
              {/* <Dashboard data={data} /> */}
              <p>Dashboard Placeholder</p>
            </div>
            <div className={clsx(activeTab === 'report' ? 'block' : 'hidden print:block')}>
              <ReportView data={data} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
