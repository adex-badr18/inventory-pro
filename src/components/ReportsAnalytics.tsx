import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { 
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  FileText, 
  Download, 
  TrendingUp,
  Building2,
  Package,
  DollarSign,
  AlertCircle,
  FileBarChart,
  ShoppingCart,
  TrendingDown,
  BarChart3
} from 'lucide-react';
import { User, hasPermission } from '../utils/auth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface ReportsAnalyticsProps {
  currentBranch: string;
  user?: User;
}

export function ReportsAnalytics({ currentBranch, user }: ReportsAnalyticsProps) {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(currentBranch);
  const [reportType, setReportType] = useState<'consolidated' | 'single'>('single');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Check permissions
  const canViewReports = user && hasPermission(user, 'viewReports');
  const canViewAllBranches = user && hasPermission(user, 'viewAllBranches');
  const isBranchManager = user?.role === 'branch-manager';
  const isSalesRep = user?.role === 'sales-rep';

  // If sales rep, show permission denied
  if (isSalesRep) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
              <p className="text-gray-600">
                You do not have permission to access the Reports & Analytics section. 
                Please contact your administrator if you believe this is an error.
              </p>
              <Badge className="bg-red-100 text-red-800">
                Sales Representative - Limited Access
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // For Branch Manager, always use their assigned branch
  const effectiveBranch = isBranchManager ? (user?.branchId || currentBranch) : selectedBranch;
  const effectiveReportType = isBranchManager ? 'single' : reportType;

  // Branch data
  const branches = [
    { id: 'main', name: 'Main Branch', location: 'Downtown' },
    { id: 'north', name: 'North Branch', location: 'North District' },
    { id: 'south', name: 'South Branch', location: 'South Mall' },
    { id: 'west', name: 'West Branch', location: 'West Plaza' }
  ];

  // Categories
  const categories = [
    'Electronics',
    'Clothing',
    'Food & Beverages',
    'Books',
    'Home & Garden'
  ];

  // Mock data based on branch and filters
  const getBranchData = (branchId: string) => {
    const branchDataMap: Record<string, any> = {
      'main': {
        stockValue: 18625000,
        totalSales: 24750000,
        totalProfit: 4125000,
        profitMargin: 16.7
      },
      'north': {
        stockValue: 12850000,
        totalSales: 18900000,
        totalProfit: 3150000,
        profitMargin: 16.7
      },
      'south': {
        stockValue: 15670000,
        totalSales: 22450000,
        totalProfit: 3742500,
        profitMargin: 16.7
      },
      'west': {
        stockValue: 9840000,
        totalSales: 14200000,
        totalProfit: 2370000,
        profitMargin: 16.7
      }
    };
    return branchDataMap[branchId];
  };

  // Calculate metrics based on report type
  const calculateMetrics = () => {
    if (effectiveReportType === 'consolidated' && canViewAllBranches) {
      // Consolidated report - sum all branches
      const allBranches = branches.map(b => getBranchData(b.id));
      return {
        stockValue: allBranches.reduce((sum, b) => sum + b.stockValue, 0),
        totalSales: allBranches.reduce((sum, b) => sum + b.totalSales, 0),
        totalProfit: allBranches.reduce((sum, b) => sum + b.totalProfit, 0),
        profitMargin: 16.7
      };
    } else {
      // Single branch report
      return getBranchData(effectiveBranch);
    }
  };

  const metrics = calculateMetrics();

  // Sales trend data
  const salesTrendData = [
    { month: 'Jan', sales: 3520000, profit: 587200 },
    { month: 'Feb', sales: 4050000, profit: 676350 },
    { month: 'Mar', sales: 3760000, profit: 627920 },
    { month: 'Apr', sales: 4860000, profit: 811620 },
    { month: 'May', sales: 5230000, profit: 873410 },
    { month: 'Jun', sales: 4780000, profit: 798260 }
  ];

  // Inventory movement data
  const inventoryMovementData = [
    { month: 'Jan', inbound: 450, outbound: 385, net: 65 },
    { month: 'Feb', inbound: 520, outbound: 480, net: 40 },
    { month: 'Mar', inbound: 380, outbound: 410, net: -30 },
    { month: 'Apr', inbound: 650, outbound: 590, net: 60 },
    { month: 'May', inbound: 720, outbound: 680, net: 40 },
    { month: 'Jun', inbound: 580, outbound: 620, net: -40 }
  ];

  // Top selling products
  const topSellingProducts = [
    { 
      id: '1',
      name: 'iPhone 15 Pro', 
      sku: 'IPH-15P-256',
      category: 'Electronics',
      unitsSold: 145, 
      revenue: 65975000,
      profit: 11025500,
      profitMargin: 16.7
    },
    { 
      id: '2',
      name: 'Samsung Galaxy S24', 
      sku: 'SAM-S24-512',
      category: 'Electronics',
      unitsSold: 118, 
      revenue: 43941000,
      profit: 7338067,
      profitMargin: 16.7
    },
    { 
      id: '3',
      name: 'MacBook Air M3', 
      sku: 'MBA-M3-16-512',
      category: 'Electronics',
      unitsSold: 87, 
      revenue: 46849500,
      profitMargin: 16.7,
      profit: 7823867
    },
    { 
      id: '4',
      name: 'AirPods Pro', 
      sku: 'APP-2GEN',
      category: 'Electronics',
      unitsSold: 234, 
      revenue: 7020000,
      profit: 1172340,
      profitMargin: 16.7
    },
    { 
      id: '5',
      name: 'Dell XPS 13', 
      sku: 'DELL-XPS13-I7',
      category: 'Electronics',
      unitsSold: 76, 
      revenue: 24700000,
      profit: 4124900,
      profitMargin: 16.7
    }
  ];

  // Batch profit breakdown
  const batchProfitData = [
    {
      batchId: 'BTH-2024-001',
      product: 'iPhone 15 Pro',
      quantity: 50,
      soldQuantity: 45,
      totalCost: 18625000,
      totalRevenue: 20475000,
      grossProfit: 3735000,
      profitMargin: 18.2,
      status: 'active'
    },
    {
      batchId: 'BTH-2024-002',
      product: 'Samsung Galaxy S24',
      quantity: 30,
      soldQuantity: 22,
      totalCost: 9315000,
      totalRevenue: 8195000,
      grossProfit: 1364000,
      profitMargin: 16.7,
      status: 'active'
    },
    {
      batchId: 'BTH-2024-003',
      product: 'MacBook Air M3',
      quantity: 15,
      soldQuantity: 15,
      totalCost: 6825000,
      totalRevenue: 8077500,
      grossProfit: 1242000,
      profitMargin: 18.2,
      status: 'sold-out'
    },
    {
      batchId: 'BTH-2024-004',
      product: 'AirPods Pro',
      quantity: 100,
      soldQuantity: 89,
      totalCost: 2670000,
      totalRevenue: 2670000,
      grossProfit: 890000,
      profitMargin: 25.0,
      status: 'active'
    }
  ];

  // Export functionality
  const exportToPDF = () => {
    const reportData = {
      title: effectiveReportType === 'consolidated' ? 'Consolidated Report - All Branches' : `Branch Report - ${branches.find(b => b.id === effectiveBranch)?.name}`,
      dateRange,
      fromDate,
      toDate,
      category: categoryFilter,
      metrics,
      salesTrend: salesTrendData,
      topProducts: topSellingProducts,
      batchProfit: batchProfitData
    };
    
    console.log('Exporting to PDF:', reportData);
    alert(`PDF export initiated for ${effectiveReportType === 'consolidated' ? 'consolidated report' : 'single branch report'}. In production, this would generate a PDF file.`);
  };

  const exportToCSV = () => {
    // Create CSV content
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Add header
    csvContent += `Report Type,${effectiveReportType === 'consolidated' ? 'Consolidated (All Branches)' : branches.find(b => b.id === effectiveBranch)?.name}\n`;
    csvContent += `Date Range,${dateRange}\n`;
    csvContent += `Category Filter,${categoryFilter}\n\n`;
    
    // Add metrics
    csvContent += 'Metric,Value\n';
    csvContent += `Total Stock Value,₦${metrics.stockValue.toLocaleString()}\n`;
    csvContent += `Total Sales,₦${metrics.totalSales.toLocaleString()}\n`;
    csvContent += `Total Profit,₦${metrics.totalProfit.toLocaleString()}\n`;
    csvContent += `Profit Margin,${metrics.profitMargin}%\n\n`;
    
    // Add top products
    csvContent += 'Top Selling Products\n';
    csvContent += 'Product Name,SKU,Units Sold,Revenue,Profit,Profit Margin\n';
    topSellingProducts.forEach(product => {
      csvContent += `${product.name},${product.sku},${product.unitsSold},₦${product.revenue.toLocaleString()},₦${product.profit.toLocaleString()},${product.profitMargin}%\n`;
    });
    
    console.log('Exporting to CSV:', csvContent);
    alert(`CSV export initiated. In production, this would download a CSV file.`);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">
            {effectiveReportType === 'consolidated' && canViewAllBranches
              ? 'Consolidated business insights across all branches'
              : `Business insights for ${branches.find(b => b.id === effectiveBranch)?.name}`}
          </p>
          {isBranchManager && (
            <Badge className="mt-2 bg-blue-100 text-blue-800">
              Branch Manager View - {user?.branchName}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={exportToPDF} 
            className="gap-2"
            disabled={!canViewReports}
          >
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button 
            variant="outline" 
            onClick={exportToCSV} 
            className="gap-2"
            disabled={!canViewReports}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Report Type - Only for Enterprise Admin */}
            {canViewAllBranches && (
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select value={reportType} onValueChange={(value: 'consolidated' | 'single') => setReportType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consolidated">Consolidated (All Branches)</SelectItem>
                    <SelectItem value="single">Single Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Branch Selector - Only for Enterprise Admin and only if single branch selected */}
            {canViewAllBranches && reportType === 'single' && (
              <div className="space-y-2">
                <Label>Branch</Label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Date Range */}
            {dateRange === 'custom' && (
              <>
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Input 
                    type="date" 
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Input 
                    type="date" 
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ₦{metrics.stockValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Current inventory valuation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₦{metrics.totalSales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              +12.5% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ₦{metrics.totalProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.profitMargin}% profit margin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {effectiveReportType === 'consolidated' ? 'Active Branches' : 'Branch Status'}
            </CardTitle>
            <Building2 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {effectiveReportType === 'consolidated' ? branches.length : '1'}
            </div>
            <p className="text-xs text-muted-foreground">
              {effectiveReportType === 'consolidated' ? 'Branches reporting' : 'Branch active'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sales Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `₦${Number(value).toLocaleString()}`,
                    name === 'sales' ? 'Sales' : 'Profit'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stackId="1" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6} 
                />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stackId="2" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  fillOpacity={0.6} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inventory Movement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Inventory Movement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryMovementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="inbound" fill="#10B981" name="Inbound" />
                <Bar dataKey="outbound" fill="#EF4444" name="Outbound" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileBarChart className="h-5 w-5" />
            Top Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Units Sold</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-right">Margin %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSellingProducts.map((product, index) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-600' :
                        'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">{product.sku}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{product.unitsSold}</TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      ₦{product.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium text-purple-600">
                      ₦{product.profit.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-green-600 font-medium">
                        {product.profitMargin}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Batch Profit Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Batch Profit Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Sold</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                  <TableHead className="text-right">Gross Profit</TableHead>
                  <TableHead className="text-right">Margin %</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batchProfitData.map((batch) => (
                  <TableRow key={batch.batchId}>
                    <TableCell className="font-mono text-sm">{batch.batchId}</TableCell>
                    <TableCell className="font-medium">{batch.product}</TableCell>
                    <TableCell className="text-right">{batch.quantity}</TableCell>
                    <TableCell className="text-right">{batch.soldQuantity}</TableCell>
                    <TableCell className="text-right">
                      ₦{batch.totalCost.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      ₦{batch.totalRevenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium text-purple-600">
                      ₦{batch.grossProfit.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-green-600 font-medium">
                        {batch.profitMargin.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        batch.status === 'active' ? 'bg-green-100 text-green-800' :
                        batch.status === 'sold-out' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {batch.status === 'sold-out' ? 'Sold Out' : 
                         batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Footer */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Report Summary</h3>
              <p className="text-sm text-gray-600">
                Generated for {effectiveReportType === 'consolidated' ? 'all branches' : branches.find(b => b.id === effectiveBranch)?.name} 
                {' • '}
                {dateRange === 'custom' ? `${fromDate} to ${toDate}` : dateRange}
                {' • '}
                Category: {categoryFilter === 'all' ? 'All' : categoryFilter}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportToPDF} className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={exportToCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
