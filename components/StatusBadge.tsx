import { ApplicationStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: ApplicationStatus;
}

const statusColors: Record<ApplicationStatus, string> = {
  'Wishlist': 'bg-gray-100 text-gray-700',
  'Applied': 'bg-blue-100 text-blue-700',
  'Online Assessment': 'bg-purple-100 text-purple-700',
  'Interview': 'bg-yellow-100 text-yellow-700',
  'Offer': 'bg-green-100 text-green-700',
  'Accepted': 'bg-emerald-100 text-emerald-700',
  'Rejected': 'bg-red-100 text-red-700',
  'Withdrawn': 'bg-orange-100 text-orange-700',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
      {status}
    </span>
  );
}
