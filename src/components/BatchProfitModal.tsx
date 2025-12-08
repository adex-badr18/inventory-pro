import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Package,
  Calendar,
  Eye
} from 'lucide-react';

interface BatchProfitModalProps {
  currentBranch: string;
}

interface BatchData {
  id: string;
  batchNumber: string;
  productName: string;
  category: string;
  purchaseDate: string;
  expiryDate: string;
  quantity: number;
  unitCost: number;
  unitPrice: number;
  soldQuantity: number;
  remainingQuantity: number;
  totalCost: number;
  totalRevenue: number;
  grossProfit: number;
  profitMargin: number;
  status: 'active' | 'expired' | 'sold-out';
}

export function BatchProfitModal({ currentBranch }: BatchProfitModalProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchData | null>(null);

  // Mock batch data (prices in Nigerian Naira)
  const batchData: BatchData[] = [
    {
      id: '1',
      batchNumber: 'BTH-2024-001',
      productName: 'iPhone 15 Pro',
      category: 'Electronics',
      purchaseDate: '2024-01-15',
      expiryDate: '2025-12-31',
      quantity: 50,
      unitCost: 372500,
      unitPrice: 455000,
      soldQuantity: 45,
      remainingQuantity: 5,
      totalCost: 18625000,
      totalRevenue: 20475000,
      grossProfit: 3735000,
      profitMargin: 18.2,
      status: 'active'
    },
    {
      id: '2',
      batchNumber: 'BTH-2024-002',
      productName: 'Samsung Galaxy S24',
      category: 'Electronics',
      purchaseDate: '2024-02-01',
      expiryDate: '2025-10-15',
      quantity: 30,
      unitCost: 310500,
      unitPrice: 372500,
      soldQuantity: 22,
      remainingQuantity: 8,
      totalCost: 9315000,
      totalRevenue: 8195000,
      grossProfit: 1364000,
      profitMargin: 16.7,
      status: 'active'
    },
    {
      id: '3',
      batchNumber: 'BTH-2024-003',
      productName: 'MacBook Air M3',
      category: 'Electronics',
      purchaseDate: '2024-01-10',
      expiryDate: '2026-03-20',
      quantity: 15,
      unitCost: 455000,
      unitPrice: 538500,
      soldQuantity: 15,
      remainingQuantity: 0,
      totalCost: 6825000,
      totalRevenue: 8077500,
      grossProfit: 1242000,
      profitMargin: 18.2,
      status: 'sold-out'
    },
    {
      id: '4',
      batchNumber: 'BTH-2024-004',
      productName: 'AirPods Pro',
      category: 'Electronics',
      purchaseDate: '2024-03-05',
      expiryDate: '2026-03-05',
      quantity: 100,
      unitCost: 26700,
      unitPrice: 30000,
      soldQuantity: 89,
      remainingQuantity: 11,
      totalCost: 2670000,
      totalRevenue: 2670000,
      grossProfit: 890000,
      profitMargin: 25.0,
      status: 'active'
    }
  ];

  // Profit trend data (in Nigerian Naira)
  const profitTrendData = [
    { month: 'Jan', profit: 3520000, batches: 3 },
    { month: 'Feb', profit: 5050000, batches: 5 },
    { month: 'Mar', profit: 4060000, batches: 4 },
    { month: 'Apr', profit: 6460000, batches: 6 },
    { month: 'May', profit: 7830000, batches: 7 },
    { month: 'Jun', profit: 6340000, batches: 5 }
  ];

  const categoryProfitData = [
    { category: 'Electronics', profit: 6340000, batches: 12 },
    { category: 'Clothing', profit: 3690000, batches: 8 },
    { category: 'Food', profit: 870000, batches: 15 },
    { category: 'Books', profit: 745000, batches: 6 }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'bg-green-100 text-green-800',
      'expired': 'bg-red-100 text-red-800',
      'sold-out': 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  const totalProfit = batchData.reduce((sum, batch) => sum + batch.grossProfit, 0);
  const activeBatches = batchData.filter(batch => batch.status === 'active').length;
  const averageMargin = batchData.reduce((sum, batch) => sum + batch.profitMargin, 0) / batchData.length;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl text-gray-900">Batch Profit Analysis</h1>
          <p className="text-gray-600">Track profit performance across product batches</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="current-month">Current Month</SelectItem>
            <SelectItem value="last-3-months">Last 3 Months</SelectItem>
            <SelectItem value="last-6-months">Last 6 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gross Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₦{totalProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all batches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBatches}</div>
            <p className="text-xs text-muted-foreground">Currently generating profit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${averageMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {averageMargin.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Profit margin average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <Calculator className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batchData.length}</div>
            <p className="text-xs text-muted-foreground">All time batches</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profit Trend Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={profitTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'profit' ? `₦${Number(value).toLocaleString()}` : value,
                    name === 'profit' ? 'Profit' : 'Batches'
                  ]}
                />
                <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profit by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryProfitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Profit']} />
                <Bar dataKey="profit" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Batch Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Batch Performance Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch Number</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Total Revenue</TableHead>
                  <TableHead>Gross Profit</TableHead>
                  <TableHead>Margin %</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batchData.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-mono text-sm">{batch.batchNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{batch.productName}</div>
                        <div className="text-sm text-gray-500">{batch.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(batch.purchaseDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Sold: {batch.soldQuantity}</div>
                        <div className="text-gray-500">Remaining: {batch.remainingQuantity}</div>
                      </div>
                    </TableCell>
                    <TableCell>₦{batch.totalCost.toLocaleString()}</TableCell>
                    <TableCell>₦{batch.totalRevenue.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${batch.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₦{batch.grossProfit.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${batch.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {batch.profitMargin.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(batch.status)}</TableCell>
                    <TableCell>
                      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedBatch(batch)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl" aria-describedby="batch-details-description">
                          <DialogHeader>
                            <DialogTitle>Batch Details - {selectedBatch?.batchNumber}</DialogTitle>
                            <DialogDescription id="batch-details-description">
                              Detailed financial and product information for the selected batch.
                            </DialogDescription>
                          </DialogHeader>
                          {selectedBatch && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4>Product Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div>Name: {selectedBatch.productName}</div>
                                    <div>Category: {selectedBatch.category}</div>
                                    <div>Purchase Date: {new Date(selectedBatch.purchaseDate).toLocaleDateString()}</div>
                                  </div>
                                </div>
                                <div>
                                  <h4>Financial Summary</h4>
                                  <div className="space-y-2 text-sm">
                                    <div>Unit Cost: ₦{selectedBatch.unitCost.toLocaleString()}</div>
                                    <div>Unit Price: ₦{selectedBatch.unitPrice.toLocaleString()}</div>
                                    <div>Total Cost: ₦{selectedBatch.totalCost.toLocaleString()}</div>
                                    <div>Total Revenue: ₦{selectedBatch.totalRevenue.toLocaleString()}</div>
                                  </div>
                                </div>
                              </div>
                              <div className="border-t pt-4">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                  <div className="p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold">{selectedBatch.quantity}</div>
                                    <div className="text-sm text-gray-600">Initial Quantity</div>
                                  </div>
                                  <div className="p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold">{selectedBatch.soldQuantity}</div>
                                    <div className="text-sm text-gray-600">Sold</div>
                                  </div>
                                  <div className="p-4 bg-orange-50 rounded-lg">
                                    <div className="text-2xl font-bold">{selectedBatch.remainingQuantity}</div>
                                    <div className="text-sm text-gray-600">Remaining</div>
                                  </div>
                                </div>
                              </div>
                              <div className="border-t pt-4">
                                <div className={`text-center p-6 rounded-lg ${selectedBatch.grossProfit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                                  <div className={`text-3xl font-bold ${selectedBatch.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ₦{selectedBatch.grossProfit.toLocaleString()}
                                  </div>
                                  <div className="text-lg font-medium">
                                    Gross Profit ({selectedBatch.profitMargin.toFixed(1)}% Margin)
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
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