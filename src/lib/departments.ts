import { ComplaintCategory } from '../types/complaint';

export interface DepartmentConfig {
  name: string;
  nameUrdu: string;
  handlesCategories: ComplaintCategory[];
  description: string;
}

export const departments: DepartmentConfig[] = [
  { name: 'WASA', nameUrdu: 'واپڈا', handlesCategories: ['water', 'sewerage'], description: 'Water and Sanitation Agency' },
  { name: 'PESCO', nameUrdu: 'پیسکو', handlesCategories: ['electricity'], description: 'Peshawar Electric Supply Company' },
  { name: 'TMA', nameUrdu: 'ٹی ایم اے', handlesCategories: ['streetlight', 'sanitation', 'road', 'pothole', 'public-space'], description: 'Tehsil Municipal Administration' },
  { name: 'Highways Department', nameUrdu: 'ہائی ویز', handlesCategories: ['road', 'traffic-infrastructure'], description: 'Provincial Highways & Roads' },
  { name: 'Traffic Police', nameUrdu: 'ٹریفک پولیس', handlesCategories: ['traffic-infrastructure'], description: 'Traffic Management Authority' },
];

export function suggestDepartment(category: ComplaintCategory): DepartmentConfig | null {
  return departments.find(d => d.handlesCategories.includes(category)) || null;
}
