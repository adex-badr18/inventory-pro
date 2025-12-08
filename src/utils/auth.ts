// User roles
export type UserRole = 'super-admin' | 'branch-manager' | 'sales-rep';

// User interface
export interface User {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  branchId?: string; // Optional for super-admin, required for others
  branchName?: string;
}

// Permission definitions
export const permissions = {
  'super-admin': {
    viewAllBranches: true,
    manageBranches: true,
    viewAllInventory: true,
    manageInventory: true,
    viewAllSales: true,
    manageSales: true,
    transferStock: true,
    viewAnalytics: true,
    manageUsers: true,
    viewReports: true,
  },
  'branch-manager': {
    viewAllBranches: false,
    manageBranches: false,
    viewAllInventory: false,
    manageInventory: true,
    viewAllSales: false,
    manageSales: false,
    transferStock: false,
    viewAnalytics: false,
    viewReports: false,
    manageUsers: false,
  },
  'sales-rep': {
    viewAllBranches: false,
    manageBranches: false,
    viewAllInventory: false,
    manageInventory: false,
    viewAllSales: false,
    manageSales: true,
    transferStock: false,
    viewAnalytics: false,
    viewReports: false,
    manageUsers: false,
  },
};

// Check if user has a specific permission
export function hasPermission(user: User | null, permission: keyof typeof permissions['super-admin']): boolean {
  if (!user) return false;
  return permissions[user.role][permission] || false;
}

// Check if user has any of the specified roles
export function hasRole(user: User | null, roles: UserRole[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

// Get accessible navigation items based on role
export function getAccessibleMenuItems(user: User | null) {
  if (!user) return [];

  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', roles: ['super-admin', 'branch-manager', 'sales-rep'] },
    { id: 'inventory', label: 'Inventory', roles: ['super-admin', 'branch-manager'] },
    { id: 'branches', label: 'Branches', roles: ['super-admin'] },
    { id: 'sales', label: 'Sales', roles: ['super-admin', 'branch-manager', 'sales-rep'] },
    { id: 'reports', label: 'Reports', roles: ['super-admin'] },
    { id: 'batch-profit', label: 'Batch Profit', roles: ['super-admin', 'branch-manager'] },
  ];

  return allMenuItems.filter(item => item.roles.includes(user.role));
}

// Mock users for login
export const mockUsers: User[] = [
  {
    userId: '1',
    name: 'Adebayo Johnson',
    email: 'admin@inventorypro.ng',
    role: 'super-admin',
  },
  {
    userId: '2',
    name: 'Fatima Abdullahi',
    email: 'fatima@inventorypro.ng',
    role: 'branch-manager',
    branchId: 'north',
    branchName: 'North Branch',
  },
  {
    userId: '3',
    name: 'Chinedu Okafor',
    email: 'chinedu@inventorypro.ng',
    role: 'branch-manager',
    branchId: 'south',
    branchName: 'South Branch',
  },
  {
    userId: '4',
    name: 'Kemi Adeyemi',
    email: 'kemi@inventorypro.ng',
    role: 'sales-rep',
    branchId: 'main',
    branchName: 'Main Branch',
  },
  {
    userId: '5',
    name: 'Oluwaseun Bello',
    email: 'seun@inventorypro.ng',
    role: 'sales-rep',
    branchId: 'west',
    branchName: 'West Branch',
  },
];

// Authenticate user
export function authenticateUser(email: string, password: string): User | null {
  // In a real app, this would validate against a backend
  // For demo purposes, any password works
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  return user || null;
}

// Get user role display name
export function getRoleDisplayName(role: UserRole): string {
  const roleNames = {
    'super-admin': 'Super Admin',
    'branch-manager': 'Branch Manager',
    'sales-rep': 'Sales Representative',
  };
  return roleNames[role];
}

// Get default view for user role
export function getDefaultView(role: UserRole): string {
  if (role === 'sales-rep') return 'sales';
  return 'dashboard';
}