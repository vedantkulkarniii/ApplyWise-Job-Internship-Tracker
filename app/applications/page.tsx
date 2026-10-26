'use client';

import { useEffect, useState } from 'react';
import { store } from '@/lib/store';
import { Application } from '@/lib/types';
import Sidebar from '@/components/Sidebar';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import ApplicationForm from '@/components/ApplicationForm';
import SearchBar from '@/components/SearchBar';
import FilterDropdown from '@/components/FilterDropdown';
import SortDropdown, { SortOption } from '@/components/SortDropdown';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import { Plus, Edit2, Trash2, ExternalLink, Download, Briefcase } from 'lucide-react';
import { exportApplications } from '@/lib/export';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApps, setFilteredApps] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [jobTypeFilters, setJobTypeFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('appliedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [deleteAppId, setDeleteAppId] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applications, searchQuery, statusFilters, jobTypeFilters, sortBy, sortOrder]);

  const loadApplications = () => {
    const apps = store.getAllApplications();
    setApplications(apps);
  };

  const applyFilters = () => {
    let filtered = [...applications];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.company?.toLowerCase().includes(query) ||
        app.position?.toLowerCase().includes(query) ||
        app.location?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilters.length > 0) {
      filtered = filtered.filter(app => statusFilters.includes(app.status));
    }

    // Job type filter
    if (jobTypeFilters.length > 0) {
      filtered = filtered.filter(app => jobTypeFilters.includes(app.jobType));
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Application];
      let bValue: any = b[sortBy as keyof Application];

      if (sortBy === 'appliedDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredApps(filtered);
  };

  const handleDelete = () => {
    if (deleteAppId) {
      store.deleteApplication(deleteAppId);
      loadApplications();
      setDeleteAppId(null);
    }
  };

  const handleEdit = (app: Application) => {
    setEditingApp(app);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingApp(null);
    setShowModal(true);
  };

  const handleFormSubmit = (data: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingApp) {
      store.updateApplication(editingApp.id, data);
    } else {
      store.addApplication({
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Application);
    }
    loadApplications();
    setShowModal(false);
    setEditingApp(null);
  };

  const handleExport = (format: 'csv' | 'json') => {
    exportApplications(filteredApps, format);
  };

  const statusOptions = [
    { value: 'applied', label: 'Applied' },
    { value: 'screening', label: 'Screening' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'accepted', label: 'Accepted' },
  ];

  const jobTypeOptions = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'internship', label: 'Internship' },
    { value: 'contract', label: 'Contract' },
  ];

  const sortOptions: SortOption[] = [
    { value: 'appliedDate', label: 'Date Applied' },
    { value: 'company', label: 'Company' },
    { value: 'position', label: 'Position' },
    { value: 'status', label: 'Status' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
              <p className="text-gray-600 mt-1">
                {filteredApps.length} {filteredApps.length === 1 ? 'application' : 'applications'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 rounded-t-lg"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 rounded-b-lg"
                  >
                    Export JSON
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddNew}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                <span>Add Application</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[300px]">
                <SearchBar
                  placeholder="Search by company, position, or location..."
                  onSearch={setSearchQuery}
                />
              </div>
              <FilterDropdown
                label="Status"
                options={statusOptions}
                selectedValues={statusFilters}
                onChange={setStatusFilters}
              />
              <FilterDropdown
                label="Job Type"
                options={jobTypeOptions}
                selectedValues={jobTypeFilters}
                onChange={setJobTypeFilters}
              />
              <SortDropdown
                options={sortOptions}
                selectedSort={sortBy}
                sortOrder={sortOrder}
                onSortChange={(newSortBy, newOrder) => {
                  setSortBy(newSortBy);
                  setSortOrder(newOrder);
                }}
              />
            </div>
          </div>

          {/* Applications List */}
          {filteredApps.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No applications found"
              description={searchQuery || statusFilters.length > 0 || jobTypeFilters.length > 0
                ? "Try adjusting your filters to see more results"
                : "Start tracking your job applications by adding your first one"
              }
              actionLabel="Add Application"
              onAction={handleAddNew}
            />
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApps.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-gray-900">{app.company}</div>
                            {app.jobUrl && (
                              <a
                                href={app.jobUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink size={16} />
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{app.position}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 capitalize">{app.jobType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{app.location || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {new Date(app.appliedDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(app)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => setDeleteAppId(app.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingApp(null);
        }}
        title={editingApp ? 'Edit Application' : 'Add New Application'}
        size="lg"
      >
        <ApplicationForm
          application={editingApp || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowModal(false);
            setEditingApp(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteAppId}
        title="Delete Application"
        message="Are you sure you want to delete this application? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteAppId(null)}
      />
    </div>
  );
}
