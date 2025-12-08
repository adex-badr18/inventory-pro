import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { Progress } from './ui/progress';
import { 
  Building2, 
  Plus, 
  Edit, 
  Eye, 
  MapPin, 
  Users, 
  Package, 
  DollarSign,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface BranchManagementProps {
  currentBranch: string;
  onBranchChange: (branch: string) => void;
  onViewDetails?: (branchId: string) => void;
}

interface Branch {
  id: string;
  name: string;
  code: string;
  location: string;
  address: string;
  manager: string;
  phone: string;
  email: string;
  establishedDate: string;
  status: 'active' | 'inactive' | 'maintenance' | 'pending';
  employeeCount: number;
  totalProducts: number;
  monthlyRevenue: number;
  monthlyCosts: number;
  profitMargin: number;
  performanceScore: number;
  lastUpdated: string;
}

export function BranchManagement({ currentBranch, onBranchChange, onViewDetails }: BranchManagementProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    location: '',
    address: '',
    manager: '',
    phone: '',
    email: '',
    establishedDate: ''
  });

  // Mock branch data (now stateful)
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: 'main',
      name: 'Main Branch',
      code: 'BR-001',
      location: 'Downtown Lagos',
      address: '123 Victoria Island, Lagos, Nigeria',
      manager: 'Adebayo Johnson',
      phone: '+234 (0) 803 123 4567',
      email: 'main@inventorypro.ng',
      establishedDate: '2020-01-15',
      status: 'active',
      employeeCount: 25,
      totalProducts: 1250,
      monthlyRevenue: 52000000,
      monthlyCosts: 40700000,
      profitMargin: 21.7,
      performanceScore: 92,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'north',
      name: 'North Branch',
      code: 'BR-002',
      location: 'Kano District',
      address: '456 Ahmadu Bello Way, Kano, Nigeria',
      manager: 'Fatima Abdullahi',
      phone: '+234 (0) 805 234 5678',
      email: 'north@inventorypro.ng',
      establishedDate: '2021-03-20',
      status: 'active',
      employeeCount: 18,
      totalProducts: 980,
      monthlyRevenue: 40800000,
      monthlyCosts: 34200000,
      profitMargin: 16.2,
      performanceScore: 78,
      lastUpdated: '2024-01-14'
    },
    {
      id: 'south',
      name: 'South Branch',
      code: 'BR-003',
      location: 'Port Harcourt Mall',
      address: '789 Aba Road, Port Harcourt, Nigeria',
      manager: 'Chinedu Okafor',
      phone: '+234 (0) 807 345 6789',
      email: 'south@inventorypro.ng',
      establishedDate: '2021-08-10',
      status: 'active',
      employeeCount: 22,
      totalProducts: 1100,
      monthlyRevenue: 46800000,
      monthlyCosts: 37800000,
      profitMargin: 19.1,
      performanceScore: 85,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'west',
      name: 'West Branch',
      code: 'BR-004',
      location: 'Ibadan Plaza',
      address: '321 Dugbe Road, Ibadan, Nigeria',
      manager: 'Kemi Adeyemi',
      phone: '+234 (0) 809 456 7890',
      email: 'west@inventorypro.ng',
      establishedDate: '2022-05-15',
      status: 'maintenance',
      employeeCount: 15,
      totalProducts: 750,
      monthlyRevenue: 36400000,
      monthlyCosts: 30600000,
      profitMargin: 15.8,
      performanceScore: 68,
      lastUpdated: '2024-01-10'
    }
  ]);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      location: '',
      address: '',
      manager: '',
      phone: '',
      email: '',
      establishedDate: ''
    });
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate form
  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Branch name is required';
    if (!formData.code.trim()) return 'Branch code is required';
    if (!formData.location.trim()) return 'Location is required';
    if (!formData.address.trim()) return 'Address is required';
    if (!formData.manager.trim()) return 'Manager name is required';
    if (!formData.phone.trim()) return 'Phone number is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.establishedDate) return 'Established date is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }

    // Check for duplicate branch code
    if (branches.some(b => b.code.toLowerCase() === formData.code.toLowerCase())) {
      return 'Branch code already exists';
    }

    return null;
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    const error = validateForm();
    if (error) {
      toast.error('Validation Error', {
        description: error
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create new branch with default values
      const newBranch: Branch = {
        id: Date.now().toString(),
        name: formData.name,
        code: formData.code,
        location: formData.location,
        address: formData.address,
        manager: formData.manager,
        phone: formData.phone,
        email: formData.email,
        establishedDate: formData.establishedDate,
        status: 'pending',
        employeeCount: 0,
        totalProducts: 0,
        monthlyRevenue: 0,
        monthlyCosts: 0,
        profitMargin: 0,
        performanceScore: 0,
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      // Add to branches
      setBranches(prev => [newBranch, ...prev]);

      // Show success toast
      toast.success('Branch added successfully', {
        description: `${newBranch.name} has been added to the system`
      });

      // Close modal and reset form
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      // Show error toast
      toast.error('Failed to add branch', {
        description: 'An error occurred while adding the branch. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-red-100 text-red-800',
      'maintenance': 'bg-yellow-100 text-yellow-800',
      'pending': 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const totalRevenue = branches.reduce((sum, branch) => sum + branch.monthlyRevenue, 0);
  const totalProducts = branches.reduce((sum, branch) => sum + branch.totalProducts, 0);
  const totalEmployees = branches.reduce((sum, branch) => sum + branch.employeeCount, 0);
  const avgPerformance = branches.reduce((sum, branch) => sum + branch.performanceScore, 0) / branches.length;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl text-gray-900">Branch Management</h1>
          <p className="text-gray-600">Manage and monitor all branch locations</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={(open) => {
            setIsAddModalOpen(open);
            if (!open) resetForm();
          }}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700" id="add-branch-button">
              <Plus className="h-4 w-4" />
              Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" aria-describedby="add-branch-description">
            <DialogHeader>
              <DialogTitle>Add New Branch</DialogTitle>
            </DialogHeader>
            <p id="add-branch-description" className="sr-only">
              Fill out the form below to add a new branch to your system
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="branch-name">Branch Name *</Label>
                  <Input 
                    id="branch-name" 
                    placeholder="Enter branch name" 
                    value={formData.name} 
                    onChange={(e) => handleInputChange('name', e.target.value)} 
                    disabled={isSubmitting}
                    required
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Branch Code *</Label>
                  <Input 
                    id="code" 
                    placeholder="Enter branch code (e.g., BR-005)" 
                    value={formData.code} 
                    onChange={(e) => handleInputChange('code', e.target.value)} 
                    disabled={isSubmitting}
                    required
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input 
                    id="location" 
                    placeholder="Enter location" 
                    value={formData.location} 
                    onChange={(e) => handleInputChange('location', e.target.value)} 
                    disabled={isSubmitting}
                    required
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">Manager *</Label>
                  <Input 
                    id="manager" 
                    placeholder="Enter manager name" 
                    value={formData.manager} 
                    onChange={(e) => handleInputChange('manager', e.target.value)} 
                    disabled={isSubmitting}
                    required
                    aria-required="true"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input 
                    id="address" 
                    placeholder="Enter full address" 
                    value={formData.address} 
                    onChange={(e) => handleInputChange('address', e.target.value)} 
                    disabled={isSubmitting}
                    required
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    placeholder="Enter phone number" 
                    value={formData.phone} 
                    onChange={(e) => handleInputChange('phone', e.target.value)} 
                    disabled={isSubmitting}
                    required
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter email address" 
                    value={formData.email} 
                    onChange={(e) => handleInputChange('email', e.target.value)} 
                    disabled={isSubmitting}
                    required
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="established">Established Date *</Label>
                  <Input 
                    id="established" 
                    type="date" 
                    value={formData.establishedDate} 
                    onChange={(e) => handleInputChange('establishedDate', e.target.value)} 
                    disabled={isSubmitting}
                    required
                    aria-required="true"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Branch'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branches.length}</div>
            <p className="text-xs text-muted-foreground">
              {branches.filter(b => b.status === 'active').length} active branches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Monthly across all branches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Avg performance: {avgPerformance.toFixed(0)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Branch Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Branch Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Profit Margin</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium">{branch.name}</div>
                          <div className="text-sm text-gray-500">{branch.location}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{branch.manager}</TableCell>
                    <TableCell>{getStatusBadge(branch.status)}</TableCell>
                    <TableCell>{branch.employeeCount}</TableCell>
                    <TableCell>{branch.totalProducts.toLocaleString()}</TableCell>
                    <TableCell>₦{branch.monthlyRevenue.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={branch.profitMargin > 0 ? 'text-green-600' : 'text-red-600'}>
                        {branch.profitMargin.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={branch.performanceScore} className="w-16 h-2" />
                        <span className="text-sm">{branch.performanceScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => onViewDetails ? onViewDetails(branch.id) : onBranchChange(branch.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}