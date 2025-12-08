import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  DollarSign, 
  Package, 
  TrendingUp, 
  Building2, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight 
} from 'lucide-react';

interface DashboardProps {
  currentBranch: string;
  onNavigate?: (view: string) => void;
  onOpenStockTransfer?: () => void;
}

export function Dashboard({ currentBranch, onNavigate, onOpenStockTransfer }: DashboardProps) {
  // Mock data for different branches (in Nigerian Naira)
  const branchData = {
    main: {
      totalSales: 52000000,
      stockValue: 37000000,
      profitMargin: 18.5,
      lowStockItems: 12
    },
    north: {
      totalSales: 40800000,
      stockValue: 28000000,
      profitMargin: 16.2,
      lowStockItems: 8
    },
    south: {
      totalSales: 46800000,
      stockValue: 32700000,
      profitMargin: 19.1,
      lowStockItems: 15
    },
    west: {
      totalSales: 36400000,
      stockValue: 24600000,
      profitMargin: 15.8,
      lowStockItems: 6
    }
  };

  const currentData = branchData[currentBranch as keyof typeof branchData] || branchData.main;

  const salesTrendData = [
    { month: 'Jan', sales: 35200000, profit: 6344000 },
    { month: 'Feb', sales: 38100000, profit: 6858000 },
    { month: 'Mar', sales: 32300000, profit: 5814000 },
    { month: 'Apr', sales: 44700000, profit: 8046000 },
    { month: 'May', sales: 51800000, profit: 9324000 },
    { month: 'Jun', sales: currentData.totalSales, profit: currentData.totalSales * (currentData.profitMargin / 100) }
  ];

  const branchComparisonData = [
    { branch: 'Main', sales: 52000000, performance: 92 },
    { branch: 'North', sales: 40800000, performance: 78 },
    { branch: 'South', sales: 46800000, performance: 85 },
    { branch: 'West', sales: 36400000, performance: 68 }
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#3B82F6' },
    { name: 'Clothing', value: 25, color: '#10B981' },
    { name: 'Food', value: 20, color: '#F59E0B' },
    { name: 'Books', value: 12, color: '#EF4444' },
    { name: 'Others', value: 8, color: '#8B5CF6' }
  ];

  const topProducts = [
    { name: 'iPhone 15 Pro', sales: 245, revenue: 101200000, change: 12.5 },
    { name: 'Samsung Galaxy S24', sales: 189, revenue: 70400000, change: -5.2 },
    { name: 'MacBook Air M3', sales: 98, revenue: 48700000, change: 18.7 },
    { name: 'Dell XPS 13', sales: 76, revenue: 28300000, change: 8.3 },
    { name: 'iPad Pro', sales: 145, revenue: 42000000, change: -2.1 }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{currentData.totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{currentData.stockValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              +3.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.profitMargin}%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowDownRight className="h-3 w-3 text-red-600" />
              -0.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items need restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Sales & Profit Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `₦${Number(value).toLocaleString()}`, 
                    name === 'sales' ? 'Sales' : 'Profit'
                  ]}
                />
                <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Branch Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Branch Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={branchComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="branch" />
                <YAxis />
                <Tooltip formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Sales']} />
                <Bar dataKey="sales" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span>{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-gray-600">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₦{product.revenue.toLocaleString()}</p>
                    <div className="flex items-center gap-1">
                      {product.change > 0 ? (
                        <ArrowUpRight className="h-3 w-3 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-600" />
                      )}
                      <span className={`text-xs ${product.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(product.change)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div 
              className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
              onClick={() => onNavigate?.('inventory')}
            >
              <Package className="h-8 w-8 text-blue-600 mb-2" />
              <h4>Add New Product</h4>
              <p className="text-sm text-gray-600">Add products to inventory</p>
            </div>
            <div 
              className="p-4 border border-green-200 rounded-lg hover:bg-green-50 cursor-pointer transition-colors"
              onClick={() => onOpenStockTransfer?.()}
            >
              <Building2 className="h-8 w-8 text-green-600 mb-2" />
              <h4>Transfer Stock</h4>
              <p className="text-sm text-gray-600">Move stock between branches</p>
            </div>
            <div 
              className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors"
              onClick={() => onNavigate?.('reports')}
            >
              <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
              <h4>Generate Report</h4>
              <p className="text-sm text-gray-600">Create detailed reports</p>
            </div>
            <div 
              className="p-4 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
              onClick={() => onNavigate?.('inventory')}
            >
              <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
              <h4>Stock Alerts</h4>
              <p className="text-sm text-gray-600">View low stock alerts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}