'use client';

import { useState } from 'react';
import { Trash2, Download, Tag, CheckSquare } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onExport: () => void;
  onUpdateStatus?: (status: string) => void;
  onClearSelection: () => void;
}

export default function BulkActions({
  selectedCount,
  onDelete,
  onExport,
  onUpdateStatus,
  onClearSelection,
}: BulkActionsProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  if (selectedCount === 0) return null;

  const statusOptions = [
    { value: 'applied', label: 'Applied' },
    { value: 'screening', label: 'Screening' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'accepted', label: 'Accepted' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 px-6 py-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-gray-900">
            {selectedCount} selected
          </span>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        {onUpdateStatus && (
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Tag className="h-4 w-4" />
              Update Status
            </button>
            {showStatusMenu && (
              <div className="absolute bottom-full mb-2 left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onUpdateStatus(option.value);
                      setShowStatusMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Download className="h-4 w-4" />
          Export
        </button>

        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>

        <div className="h-6 w-px bg-gray-300" />

        <button
          onClick={onClearSelection}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
