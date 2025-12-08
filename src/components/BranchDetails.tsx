import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Progress } from './ui/progress';
import { 
  Building2, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  ArrowLeft,
  TrendingUp,
  Package,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface BranchDetailsProps {
  branchId: string;
  onBack: () => void;
}

interface Product {
  id: string;
  name: string;
  batchId: string;
  category: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdated: string;
}

interface Sale {
  id: string;
  date: string;
  productName: string;
  batchId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  profit: number;
  customer: string;
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
  tenant: string;
  establishedDate: string;
  status: 'active' | 'inactive' | 'maintenance' | 'pending';
  totalSales: number;
  totalInventoryValue: number;
  totalProducts: number;
  lowStockAlerts: number;
  totalProfit: number;
  performanceScore: number;
}

export function BranchDetails({ branchId, onBack }: BranchDetailsProps) {
  // Pagination state
  const [productsPage, setProductsPage] = useState(1);
  const [salesPage, setSalesPage] = useState(1);
  const itemsPerPage = 10;

  // Filter state
  const [productBatchFilter, setProductBatchFilter] = useState('all');
  const [productStatusFilter, setProductStatusFilter] = useState('all');
  const [salesDateFilter, setSalesDateFilter] = useState('all');
  const [salesDateFrom, setSalesDateFrom] = useState('');
  const [salesDateTo, setSalesDateTo] = useState('');

  // Mock branch data
  const branches: { [key: string]: Branch } = {
    'main': {
      id: 'main',
      name: 'Main Branch',
      code: 'BR-001',
      location: 'Downtown Lagos',
      address: '123 Victoria Island, Lagos, Nigeria',
      manager: 'Adebayo Johnson',
      phone: '+234 (0) 803 123 4567',
      email: 'main@inventorypro.ng',
      tenant: 'InventoryPro Nigeria Ltd.',
      establishedDate: '2020-01-15',
      status: 'active',
      totalSales: 85420000,
      totalInventoryValue: 45800000,
      totalProducts: 1250,
      lowStockAlerts: 23,
      totalProfit: 21340000,
      performanceScore: 92
    },
    'north': {
      id: 'north',
      name: 'North Branch',
      code: 'BR-002',
      location: 'Kano District',
      address: '456 Ahmadu Bello Way, Kano, Nigeria',
      manager: 'Fatima Abdullahi',
      phone: '+234 (0) 805 234 5678',
      email: 'north@inventorypro.ng',
      tenant: 'InventoryPro Nigeria Ltd.',
      establishedDate: '2021-03-20',
      status: 'active',
      totalSales: 64200000,
      totalInventoryValue: 32400000,
      totalProducts: 980,
      lowStockAlerts: 18,
      totalProfit: 16800000,
      performanceScore: 78
    },
    'south': {
      id: 'south',
      name: 'South Branch',
      code: 'BR-003',
      location: 'Port Harcourt Mall',
      address: '789 Aba Road, Port Harcourt, Nigeria',
      manager: 'Chinedu Okafor',
      phone: '+234 (0) 807 345 6789',
      email: 'south@inventorypro.ng',
      tenant: 'InventoryPro Nigeria Ltd.',
      establishedDate: '2021-08-10',
      status: 'active',
      totalSales: 72300000,
      totalInventoryValue: 38900000,
      totalProducts: 1100,
      lowStockAlerts: 15,
      totalProfit: 18750000,
      performanceScore: 85
    },
    'west': {
      id: 'west',
      name: 'West Branch',
      code: 'BR-004',
      location: 'Ibadan Plaza',
      address: '321 Dugbe Road, Ibadan, Nigeria',
      manager: 'Kemi Adeyemi',
      phone: '+234 (0) 809 456 7890',
      email: 'west@inventorypro.ng',
      tenant: 'InventoryPro Nigeria Ltd.',
      establishedDate: '2022-05-15',
      status: 'maintenance',
      totalSales: 51600000,
      totalInventoryValue: 28300000,
      totalProducts: 750,
      lowStockAlerts: 12,
      totalProfit: 13200000,
      performanceScore: 68
    }
  };

  // Mock products data for this branch
  const allProducts: Product[] = [
    { id: '1', name: 'Laptop Dell XPS 13', batchId: 'BTH-001', category: 'Electronics', quantity: 45, purchasePrice: 850000, sellingPrice: 1100000, status: 'in-stock', lastUpdated: '2024-01-15' },
    { id: '2', name: 'iPhone 14 Pro', batchId: 'BTH-002', category: 'Electronics', quantity: 8, purchasePrice: 980000, sellingPrice: 1250000, status: 'low-stock', lastUpdated: '2024-01-14' },
    { id: '3', name: 'Samsung Galaxy S23', batchId: 'BTH-003', category: 'Electronics', quantity: 32, purchasePrice: 750000, sellingPrice: 950000, status: 'in-stock', lastUpdated: '2024-01-15' },
    { id: '4', name: 'Office Chair Ergonomic', batchId: 'BTH-004', category: 'Furniture', quantity: 0, purchasePrice: 45000, sellingPrice: 65000, status: 'out-of-stock', lastUpdated: '2024-01-10' },
    { id: '5', name: 'Standing Desk', batchId: 'BTH-005', category: 'Furniture', quantity: 18, purchasePrice: 120000, sellingPrice: 165000, status: 'in-stock', lastUpdated: '2024-01-13' },
    { id: '6', name: 'HP LaserJet Printer', batchId: 'BTH-006', category: 'Electronics', quantity: 7, purchasePrice: 180000, sellingPrice: 245000, status: 'low-stock', lastUpdated: '2024-01-12' },
    { id: '7', name: 'Wireless Mouse', batchId: 'BTH-007', category: 'Accessories', quantity: 156, purchasePrice: 8500, sellingPrice: 13500, status: 'in-stock', lastUpdated: '2024-01-15' },
    { id: '8', name: 'Mechanical Keyboard', batchId: 'BTH-008', category: 'Accessories', quantity: 89, purchasePrice: 25000, sellingPrice: 38000, status: 'in-stock', lastUpdated: '2024-01-14' },
    { id: '9', name: 'LED Monitor 27"', batchId: 'BTH-009', category: 'Electronics', quantity: 23, purchasePrice: 180000, sellingPrice: 245000, status: 'in-stock', lastUpdated: '2024-01-15' },
    { id: '10', name: 'External SSD 1TB', batchId: 'BTH-010', category: 'Storage', quantity: 5, purchasePrice: 95000, sellingPrice: 135000, status: 'low-stock', lastUpdated: '2024-01-11' },
    { id: '11', name: 'Webcam HD 1080p', batchId: 'BTH-011', category: 'Accessories', quantity: 42, purchasePrice: 35000, sellingPrice: 52000, status: 'in-stock', lastUpdated: '2024-01-13' },
    { id: '12', name: 'Headphones Wireless', batchId: 'BTH-012', category: 'Audio', quantity: 67, purchasePrice: 45000, sellingPrice: 68000, status: 'in-stock', lastUpdated: '2024-01-14' },
    { id: '13', name: 'USB-C Hub', batchId: 'BTH-013', category: 'Accessories', quantity: 93, purchasePrice: 18000, sellingPrice: 28000, status: 'in-stock', lastUpdated: '2024-01-15' },
    { id: '14', name: 'Laptop Bag', batchId: 'BTH-014', category: 'Accessories', quantity: 38, purchasePrice: 12000, sellingPrice: 20000, status: 'in-stock', lastUpdated: '2024-01-12' },
    { id: '15', name: 'Power Bank 20000mAh', batchId: 'BTH-015', category: 'Accessories', quantity: 9, purchasePrice: 22000, sellingPrice: 35000, status: 'low-stock', lastUpdated: '2024-01-10' },
  ];

  // Mock sales data for this branch
  const allSales: Sale[] = [
    { id: 'SAL-001', date: '2024-01-15', productName: 'Laptop Dell XPS 13', batchId: 'BTH-001', quantity: 2, unitPrice: 1100000, total: 2200000, profit: 500000, customer: 'Techno Corp' },
    { id: 'SAL-002', date: '2024-01-15', productName: 'iPhone 14 Pro', batchId: 'BTH-002', quantity: 1, unitPrice: 1250000, total: 1250000, profit: 270000, customer: 'John Doe' },
    { id: 'SAL-003', date: '2024-01-14', productName: 'Samsung Galaxy S23', batchId: 'BTH-003', quantity: 3, unitPrice: 950000, total: 2850000, profit: 600000, customer: 'Mobile Store' },
    { id: 'SAL-004', date: '2024-01-14', productName: 'Standing Desk', batchId: 'BTH-005', quantity: 1, unitPrice: 165000, total: 165000, profit: 45000, customer: 'Office Plus' },
    { id: 'SAL-005', date: '2024-01-13', productName: 'Wireless Mouse', batchId: 'BTH-007', quantity: 15, unitPrice: 13500, total: 202500, profit: 75000, customer: 'Retail Hub' },
    { id: 'SAL-006', date: '2024-01-13', productName: 'Mechanical Keyboard', batchId: 'BTH-008', quantity: 8, unitPrice: 38000, total: 304000, profit: 104000, customer: 'Gaming Store' },
    { id: 'SAL-007', date: '2024-01-12', productName: 'LED Monitor 27"', batchId: 'BTH-009', quantity: 4, unitPrice: 245000, total: 980000, profit: 260000, customer: 'Tech Solutions' },
    { id: 'SAL-008', date: '2024-01-12', productName: 'Headphones Wireless', batchId: 'BTH-012', quantity: 6, unitPrice: 68000, total: 408000, profit: 138000, customer: 'Audio World' },
    { id: 'SAL-009', date: '2024-01-11', productName: 'USB-C Hub', batchId: 'BTH-013', quantity: 12, unitPrice: 28000, total: 336000, profit: 120000, customer: 'Retail Hub' },
    { id: 'SAL-010', date: '2024-01-11', productName: 'Webcam HD 1080p', batchId: 'BTH-011', quantity: 5, unitPrice: 52000, total: 260000, profit: 85000, customer: 'Office Plus' },
    { id: 'SAL-011', date: '2024-01-10', productName: 'Laptop Bag', batchId: 'BTH-014', quantity: 10, unitPrice: 20000, total: 200000, profit: 80000, customer: 'Fashion Store' },
    { id: 'SAL-012', date: '2024-01-10', productName: 'External SSD 1TB', batchId: 'BTH-010', quantity: 2, unitPrice: 135000, total: 270000, profit: 80000, customer: 'Techno Corp' },
    { id: 'SAL-013', date: '2024-01-09', productName: 'HP LaserJet Printer', batchId: 'BTH-006', quantity: 1, unitPrice: 245000, total: 245000, profit: 65000, customer: 'Print Shop' },
    { id: 'SAL-014', date: '2024-01-09', productName: 'Power Bank 20000mAh', batchId: 'BTH-015', quantity: 7, unitPrice: 35000, total: 245000, profit: 91000, customer: 'Mobile Store' },
    { id: 'SAL-015', date: '2024-01-08', productName: 'Laptop Dell XPS 13', batchId: 'BTH-001', quantity: 1, unitPrice: 1100000, total: 1100000, profit: 250000, customer: 'Corporate Client' },
  ];

  const branch = branches[branchId];

  if (!branch) {
    return (
      <div className="p-6">
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Branches
        </Button>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Branch not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    if (productBatchFilter !== 'all' && product.batchId !== productBatchFilter) return false;
    if (productStatusFilter !== 'all' && product.status !== productStatusFilter) return false;
    return true;
  });

  // Filter sales
  const filteredSales = allSales.filter(sale => {
    if (salesDateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return sale.date === today;
    }
    if (salesDateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(sale.date) >= weekAgo;
    }
    if (salesDateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return new Date(sale.date) >= monthAgo;
    }
    if (salesDateFilter === 'custom' && salesDateFrom && salesDateTo) {
      return sale.date >= salesDateFrom && sale.date <= salesDateTo;
    }
    return true;
  });

  // Pagination
  const totalProductPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const totalSalesPages = Math.ceil(filteredSales.length / itemsPerPage);
  
  const paginatedProducts = filteredProducts.slice(
    (productsPage - 1) * itemsPerPage,
    productsPage * itemsPerPage
  );
  
  const paginatedSales = filteredSales.slice(
    (salesPage - 1) * itemsPerPage,
    salesPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-red-100 text-red-800',
      'maintenance': 'bg-yellow-100 text-yellow-800',
      'pending': 'bg-blue-100 text-blue-800',
      'in-stock': 'bg-green-100 text-green-800',
      'low-stock': 'bg-yellow-100 text-yellow-800',
      'out-of-stock': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  // Get unique batch IDs for filter
  const uniqueBatchIds = Array.from(new Set(allProducts.map(p => p.batchId)));

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl text-gray-900 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              {branch.name}
            </h1>
            <p className="text-gray-600">{branch.code} • {branch.location}</p>
          </div>
        </div>
        {getStatusBadge(branch.status)}
      </div>

      {/* Branch Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Branch Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{branch.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Manager</p>
                  <p className="font-medium">{branch.manager}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{branch.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{branch.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Tenant</p>
                  <p className="font-medium">{branch.tenant}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Established</p>
                  <p className="font-medium">{new Date(branch.establishedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Performance Score</span>
                <span className="font-medium text-lg">{branch.performanceScore}%</span>
              </div>
              <Progress value={branch.performanceScore} className="h-3" />
              <p className="text-sm text-gray-500">
                Based on sales, inventory turnover, and operational efficiency
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{branch.totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{branch.totalInventoryValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branch.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Total items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{branch.lowStockAlerts}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₦{branch.totalProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Branch Products ({filteredProducts.length})</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Select value={productBatchFilter} onValueChange={setProductBatchFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {uniqueBatchIds.map(batchId => (
                    <SelectItem key={batchId} value={batchId}>{batchId}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={productStatusFilter} onValueChange={setProductStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Purchase Price</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="font-mono text-sm">{product.batchId}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>₦{product.purchasePrice.toLocaleString()}</TableCell>
                    <TableCell>₦{product.sellingPrice.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell className="text-sm text-gray-500">{new Date(product.lastUpdated).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {paginatedProducts.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.batchId}</p>
                    </div>
                    {getStatusBadge(product.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Category</p>
                      <p className="font-medium">{product.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Quantity</p>
                      <p className="font-medium">{product.quantity}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Purchase Price</p>
                      <p className="font-medium">₦{product.purchasePrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Selling Price</p>
                      <p className="font-medium">₦{product.sellingPrice.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Updated: {new Date(product.lastUpdated).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Products Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Showing {((productsPage - 1) * itemsPerPage) + 1} to {Math.min(productsPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProductsPage(p => Math.max(1, p - 1))}
                disabled={productsPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalProductPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={page === productsPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setProductsPage(page)}
                  className={page === productsPage ? "bg-blue-600" : ""}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProductsPage(p => Math.min(totalProductPages, p + 1))}
                disabled={productsPage === totalProductPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Branch Sales ({filteredSales.length})</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Select value={salesDateFilter} onValueChange={setSalesDateFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              {salesDateFilter === 'custom' && (
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={salesDateFrom}
                    onChange={(e) => setSalesDateFrom(e.target.value)}
                    className="w-full sm:w-auto"
                  />
                  <Input
                    type="date"
                    value={salesDateTo}
                    onChange={(e) => setSalesDateTo(e.target.value)}
                    className="w-full sm:w-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sale ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead>Customer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-mono text-sm">{sale.id}</TableCell>
                    <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{sale.productName}</TableCell>
                    <TableCell className="font-mono text-sm">{sale.batchId}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>₦{sale.unitPrice.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">₦{sale.total.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600 font-medium">₦{sale.profit.toLocaleString()}</TableCell>
                    <TableCell>{sale.customer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {paginatedSales.map((sale) => (
              <Card key={sale.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{sale.productName}</p>
                      <p className="text-sm text-gray-500">{sale.id} • {sale.batchId}</p>
                    </div>
                    <p className="text-sm text-gray-500">{new Date(sale.date).toLocaleDateString()}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Quantity</p>
                      <p className="font-medium">{sale.quantity}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Unit Price</p>
                      <p className="font-medium">₦{sale.unitPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total</p>
                      <p className="font-medium">₦{sale.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Profit</p>
                      <p className="font-medium text-green-600">₦{sale.profit.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    <span className="text-gray-600">Customer:</span> {sale.customer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sales Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Showing {((salesPage - 1) * itemsPerPage) + 1} to {Math.min(salesPage * itemsPerPage, filteredSales.length)} of {filteredSales.length} sales
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSalesPage(p => Math.max(1, p - 1))}
                disabled={salesPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalSalesPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={page === salesPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSalesPage(page)}
                  className={page === salesPage ? "bg-blue-600" : ""}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSalesPage(p => Math.min(totalSalesPages, p + 1))}
                disabled={salesPage === totalSalesPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
