import React, { useRef, useState } from 'react';
import { Download, Upload, RotateCcw, AlertTriangle, CheckCircle2, Database } from 'lucide-react';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { initializeData } from '../../services';
import { useToast } from '../../context/ToastContext';

export const AdminBackupPage: React.FC = () => {
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleExport = () => {
    const json = storage.exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agro-baadshah-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Backup file downloaded successfully!');
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = storage.importAll(content);
      setImportStatus(res);
      if (res.success) {
        showToast('Backup imported successfully!');
      } else {
        showToast(res.message, 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetDemoData = () => {
    if (
      window.confirm(
        'WARNING: This will reset all products, orders, categories, and sliders to the original factory seed data. Are you sure?'
      )
    ) {
      // Clear specific domain keys
      Object.values(STORAGE_KEYS).forEach((k) => {
        if (k !== STORAGE_KEYS.ADMIN_SESSION) {
          storage.remove(k);
        }
      });
      initializeData();
      showToast('System data reset to initial demo seeds.');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-serif text-stone-900">Backup & Restore Data</h1>
        <p className="text-xs text-stone-500 mt-1">
          Safeguard your product catalog, orders, slider images, and settings. Export JSON archives or restore snapshots.
        </p>
      </div>

      {importStatus && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-3 ${
            importStatus.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {importStatus.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{importStatus.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Backup Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-stone-900">Export Full System Backup</h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Generates a single standalone JSON file containing all products, uploaded image references, categories,
              orders, customer records, and store settings.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#0e4d34] hover:bg-[#093926] text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Backup (.JSON)</span>
          </button>
        </div>

        {/* Restore Backup Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-stone-900">Restore from JSON Archive</h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Upload a previously exported backup file to restore your entire catalog and orders.
            </p>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              <Upload className="w-4 h-4" />
              <span>Select File to Restore</span>
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 space-y-3 text-xs text-rose-950">
        <div className="flex items-center gap-2 text-rose-800 font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>Danger Zone: Factory Reset</span>
        </div>
        <p className="text-stone-700 leading-relaxed">
          Resetting will replace all products, categories, crops, and sample orders with the initial seed dataset.
          Ensure you have downloaded an export backup if you need to keep current changes.
        </p>

        <button
          onClick={handleResetDemoData}
          className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg shadow-xs transition flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Default Demo Seed Data</span>
        </button>
      </div>
    </div>
  );
};
