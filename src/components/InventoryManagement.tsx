import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog';
import { Label } from './ui/label';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  AlertTriangle,
  Package,
  Calendar,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface InventoryManagementProps {
  currentBranch: string;
}

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  expiryDate: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired';
  supplier: string;
  batch: string;
}

export function InventoryManagement({ currentBranch }: InventoryManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    supplier: '',
    quantity: '',
    costPrice: '',
    purchaseDate: ''
  });

  // Mock inventory data (prices in Nigerian Naira) - now stateful
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'iPhone 15 Pro',
      sku: 'IP15P-256-BLU',
      category: 'Electronics',
      quantity: 45,
      costPrice: 372500,
      sellingPrice: 455000,
      expiryDate: '2025-12-31',
      status: 'in-stock',
      supplier: 'Apple Inc.',
      batch: 'BTH-2024-001'
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24',
      sku: 'SGS24-128-BLK',
      category: 'Electronics',
      quantity: 8,
      costPrice: 310500,
      sellingPrice: 372500,
      expiryDate: '2025-10-15',
      status: 'low-stock',
      supplier: 'Samsung',
      batch: 'BTH-2024-002'
    },
    {
      id: '3',
      name: 'Nike Air Max 270',
      sku: 'NAM270-42-WHT',
      category: 'Footwear',
      quantity: 0,
      costPrice: 36900,
      sellingPrice: 58000,
      expiryDate: '2026-06-30',
      status: 'out-of-stock',
      supplier: 'Nike',
      batch: 'BTH-2024-003'
    },
    {
      id: '4',
      name: 'Organic Milk 1L',
      sku: 'OM1L-001',
      category: 'Food',
      quantity: 25,
      costPrice: 1035,
      sellingPrice: 1650,
      expiryDate: '2024-01-15',
      status: 'expired',
      supplier: 'Organic Farms',
      batch: 'BTH-2023-045'
    },
    {
      id: '5',
      name: 'MacBook Air M3',
      sku: 'MBA-M3-256-SLV',
      category: 'Electronics',
      quantity: 12,
      costPrice: 455000,
      sellingPrice: 538500,
      expiryDate: '2026-03-20',
      status: 'in-stock',
      supplier: 'Apple Inc.',
      batch: 'BTH-2024-004'
    }
  ]);

  // Generate unique batch ID
  const generateBatchId = () => {
    const year = new Date().getFullYear();
    const maxBatch = inventoryData.reduce((max, item) => {
      const match = item.batch.match(/BTH-\d{4}-(\d{3})/);
      if (match) {
        const num = parseInt(match[1]);
        return num > max ? num : max;
      }
      return max;
    }, 0);
    const newBatchNum = (maxBatch + 1).toString().padStart(3, '0');
    return `BTH-${year}-${newBatchNum}`;
  };

  // Determine status based on quantity and expiry date
  const determineStatus = (quantity: number, expiryDate: string): InventoryItem['status'] => {
    // Default status for newly added products is always 'in-stock'
    return 'in-stock';
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      category: '',
      supplier: '',
      quantity: '',
      costPrice: '',
      purchaseDate: ''
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
    if (!formData.name.trim()) return 'Product name is required';
    if (!formData.sku.trim()) return 'SKU is required';
    if (!formData.category) return 'Category is required';
    if (!formData.supplier.trim()) return 'Supplier is required';
    if (!formData.quantity || parseInt(formData.quantity) < 0) return 'Valid quantity is required';
    if (!formData.costPrice || parseFloat(formData.costPrice) < 0) return 'Valid cost price is required';
    if (!formData.purchaseDate) return 'Purchase date is required';
    
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

      // Create new product
      const newProduct: InventoryItem = {
        id: Date.now().toString(),
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        quantity: parseInt(formData.quantity),
        costPrice: parseFloat(formData.costPrice),
        sellingPrice: 0, // Selling price is not required in the form
        expiryDate: formData.purchaseDate,
        status: determineStatus(parseInt(formData.quantity), formData.purchaseDate),
        supplier: formData.supplier,
        batch: generateBatchId()
      };

      // Add to inventory
      setInventoryData(prev => [newProduct, ...prev]);

      // Show success toast
      toast.success('Product added successfully', {
        description: `${newProduct.name} has been added to inventory`
      });

      // Close modal and reset form
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      // Show error toast
      toast.error('Failed to add product', {
        description: 'An error occurred while adding the product. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredData = inventoryData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      'in-stock': { variant: 'default', color: 'bg-green-100 text-green-800' },
      'low-stock': { variant: 'secondary', color: 'bg-yellow-100 text-yellow-800' },
      'out-of-stock': { variant: 'destructive', color: 'bg-red-100 text-red-800' },
      'expired': { variant: 'destructive', color: 'bg-red-100 text-red-800' }
    };
    
    const config = variants[status as keyof typeof variants];
    return (
      <Badge className={config.color}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getProfitMargin = (costPrice: number, sellingPrice: number) => {
    const margin = ((sellingPrice - costPrice) / costPrice) * 100;
    return margin.toFixed(1);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage your inventory across all branches</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={(open) => {
            setIsAddModalOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700" id="add-product-button">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" aria-describedby="add-product-description">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <p id="add-product-description" className="sr-only">
                Fill out the form below to add a new product to your inventory
              </p>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter product name" 
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={isSubmitting}
                      required
                      aria-required="true"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input 
                      id="sku" 
                      placeholder="Enter SKU" 
                      value={formData.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      disabled={isSubmitting}
                      required
                      aria-required="true"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                      disabled={isSubmitting}
                      required
                    >
                      <SelectTrigger id="category" aria-required="true">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Clothing">Clothing</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Footwear">Footwear</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier *</Label>
                    <Input 
                      id="supplier" 
                      placeholder="Enter supplier name" 
                      value={formData.supplier}
                      onChange={(e) => handleInputChange('supplier', e.target.value)}
                      disabled={isSubmitting}
                      required
                      aria-required="true"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      placeholder="Enter quantity" 
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      disabled={isSubmitting}
                      min="0"
                      required
                      aria-required="true"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost Price (₦) *</Label>
                    <Input 
                      id="cost" 
                      type="number" 
                      placeholder="Enter cost price" 
                      value={formData.costPrice}
                      onChange={(e) => handleInputChange('costPrice', e.target.value)}
                      disabled={isSubmitting}
                      min="0"
                      step="0.01"
                      required
                      aria-required="true"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Purchase Date *</Label>
                    <Input 
                      id="purchaseDate" 
                      type="date" 
                      value={formData.purchaseDate}
                      onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
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
                      'Add Product'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                placeholder="Search products, SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Footwear">Footwear</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory Items ({filteredData.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Cost Price</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Profit Margin</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.sku}</div>
                      </div>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="font-mono text-sm">{item.batch}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.quantity}
                        {item.quantity <= 10 && item.quantity > 0 && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        {item.quantity === 0 && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>₦{item.costPrice.toLocaleString()}</TableCell>
                    <TableCell>₦{item.sellingPrice.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="text-green-600 font-medium">
                        {getProfitMargin(item.costPrice, item.sellingPrice)}%
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-xl font-bold">{inventoryData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-xl font-bold">
                  {inventoryData.filter(item => item.status === 'low-stock').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-xl font-bold">
                  {inventoryData.filter(item => item.status === 'out-of-stock').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-xl font-bold">
                  {inventoryData.filter(item => item.status === 'expired').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}