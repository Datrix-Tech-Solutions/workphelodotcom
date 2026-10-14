import { Users, Calculator, Megaphone, Settings, BarChart3, ShieldCheck, Zap, TrendingUp, Layers } from 'lucide-react';

export const modules = [
  {
    icon: Users,
    title: 'HR Management',
    color: 'from-blue-900 to-blue-900',
    lightBg: 'bg-blue-300',
    textColor: 'text-blue-900',
    features: [
      { name: 'Employee records management', image: '/landing/images/modules/hr-employees.png' },
      { name: 'Leave & attendance management', image: '/landing/images/modules/hr-payroll.png' },
      { name: 'Performance management', image: '/landing/images/modules/hr-assetmanagement.png' },
      { name: 'Recruitment & onboarding', image: '/landing/images/modules/hr-employees.png' },
      { name: 'Employee self-service portal', image: '/landing/images/modules/hr-selfservice.png' },
      { name: 'Approval workflows', image: '/landing/images/modules/hr-assetmanagement.png' },
      { name: 'Payroll Management', image: '/landing/images/modules/hr-payroll.png' },
    ],
  },
  {
    icon: Megaphone,
    title: 'Marketing & Business Development',
    color: 'from-amber-500 to-orange-600',
    lightBg: 'bg-amber-50',
    textColor: 'text-amber-700',
    features: [
      { name: 'Lead management', image: '/landing/images/modules/mkt-leads.png' },
      { name: 'Opportunity tracking', image: '/landing/images/modules/mkt-leads.png' },
      { name: 'Customer relationship management', image: '/landing/images/modules/mkt-crm.png' },
      { name: 'Follow-up monitoring', image: '/landing/images/modules/mkt-crm.png' },
      { name: 'Sales pipeline visibility', image: '/landing/images/modules/mkt-leads.png' },
      { name: 'Fleet management', image: '/landing/images/modules/mkt-crm.png' },
    ],
  },
  {
    icon: Calculator,
    title: 'Accounting',
    color: 'from-rose-500 to-pink-600',
    lightBg: 'bg-rose-50',
    textColor: 'text-rose-700',
    features: [
      { name: 'General Ledger', image: '/landing/images/modules/acc-ledger.png' },
      { name: 'Accounts Payable & Receivable', image: '/landing/images/modules/acc-ledger.png' },
      { name: 'Cash Management', image: '/landing/images/modules/acc-reports.png' },
      { name: 'Bank Reconciliation', image: '/landing/images/modules/acc-ledger.png' },
      { name: 'Financial Reporting', image: '/landing/images/modules/acc-reports.png' },
      { name: 'Budget Management & Expense Tracking', image: '/landing/images/modules/acc-reports.png' },
      { name: 'Multi-branch accounting', image: '/landing/images/modules/acc-reports.png' },
      { name: 'Payroll Management', image: '/landing/images/modules/acc-ledger.png' },
    ],
  },
  {
    icon: Settings,
    title: 'Operations',
    color: 'from-violet-500 to-purple-600',
    lightBg: 'bg-violet-50',
    textColor: 'text-violet-700',
    features: [
      { name: 'Reinsurance Brokerage Software', image: '/landing/images/modules/ops-process.png' },
      { name: 'Insurance Brokerage Software', image: '/landing/images/modules/ops-process.png' },
      { name: 'Hospital Management Software', image: '/landing/images/modules/ops-industry.png' },
      { name: 'School Management Software', image: '/landing/images/modules/ops-industry.png' },
      { name: 'Manufacturing processes', image: '/landing/images/modules/ops-process.png' },
      { name: 'Industry-specific business processes', image: '/landing/images/modules/ops-industry.png' },
    ],
  },
];

export const dashboardFeatures = [
  'Company-wide performance metrics',
  'Sales pipeline status',
  'Revenue tracking',
  'Staff productivity insights',
  'Operational performance indicators',
  'Financial health monitoring',
  'Departmental performance reports',
];

export const benefits = [
  { icon: TrendingUp, title: 'Reduce Software Costs', desc: 'Replace multiple standalone applications with a single integrated platform to lower subscription and licensing expenses.' },
  { icon: Layers, title: 'Eliminate Duplicate Data', desc: 'A single source of truth means no more re-entering data across disconnected systems.' },
  { icon: Users, title: 'Improve Collaboration', desc: 'Departments share real-time data, breaking down silos and boosting teamwork.' },
  { icon: BarChart3, title: 'Enhance Reporting', desc: 'Consolidated, accurate reports replace fragmented spreadsheets and guesswork.' },
  { icon: Zap, title: 'Increase Productivity', desc: 'One login, one platform — employees spend less time switching tools and more time delivering results.' },
  { icon: ShieldCheck, title: 'Simplify IT Administration', desc: 'Manage one system instead of dozens, reducing IT overhead and complexity.' },
];
