import { ComplaintCategory } from '../types/complaint';

export interface CategoryConfig {
  id: ComplaintCategory;
  label: string;
  labelUrdu: string;
  icon: string;
  color: string;
}

export const categories: CategoryConfig[] = [
  { id: 'water', label: 'Water Supply', labelUrdu: 'پانی', icon: '💧', color: 'blue' },
  { id: 'electricity', label: 'Electricity', labelUrdu: 'بجلی', icon: '⚡', color: 'amber' },
  { id: 'road', label: 'Road', labelUrdu: 'سڑک', icon: '🛣️', color: 'zinc' },
  { id: 'pothole', label: 'Pothole', labelUrdu: 'گڑھا', icon: '🕳️', color: 'zinc' },
  { id: 'streetlight', label: 'Streetlight', labelUrdu: 'سٹریٹ لائٹ', icon: '💡', color: 'amber' },
  { id: 'sanitation', label: 'Sanitation', labelUrdu: 'صفائی', icon: '🧹', color: 'emerald' },
  { id: 'sewerage', label: 'Sewerage', labelUrdu: 'نالی', icon: '🚰', color: 'zinc' },
  { id: 'traffic-infrastructure', label: 'Traffic', labelUrdu: 'ٹریفک', icon: '🚦', color: 'red' },
  { id: 'public-space', label: 'Public Space', labelUrdu: 'عوامی جگہ', icon: '🏞️', color: 'emerald' },
  { id: 'other', label: 'Other', labelUrdu: 'دیگر', icon: '📋', color: 'zinc' },
];

export function getCategoryConfig(id: ComplaintCategory): CategoryConfig {
  return categories.find(c => c.id === id) || categories[categories.length - 1];
}
