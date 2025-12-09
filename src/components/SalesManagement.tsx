"use client";

import React, { useMemo, useState } from "react";
import { format } from "date-fns";

import { Plus, Eye, CalendarIcon, Loader2, Trash2, DollarSign, Receipt, ShoppingCart, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerTrigger, DrawerClose } from "./ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { ScrollArea } from "./ui/scroll-area";
import { InvoiceView, InvoiceData, InvoiceLineItem } from "./InvoiceView";
import { 
  getProductsByBranch, 
  getBatchesForProduct, 
  getProductById, 
  getBatchById,
  updateBatchQuantity,
  getBranchById,
  Product,
  ProductBatch
} from "../utils/mockData";
import { User } from "../utils/auth";

interface SalesManagementProps {
  user?: User;
  currentBranch?: string;
}

/* Sales line item for the form */
type SaleLineItem = {
  id: string;
  productId: string;
  batchId: string;
  quantity: number;
  sellingPrice: number;
};

/* Saved invoice type */
type Invoice = {
  id: string;
  invoiceNo: string;
  customerName: string;
  date: string;
  branchId: string;
  salesRepName: string;
  items: {
    id: string;
    productId: string;
    productName: string;
    sku: string;
    batchId: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  total: number;
};

/* Initial dummy invoices */
const initialInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNo: "INV-1763512380543",
    customerName: "John Doe",
    date: "2025-02-01",
    branchId: "main",
    salesRepName: "Adebayo Johnson",
    items: [
      { 
        id: "1", 
        productId: "PROD-001",
        productName: "iPhone 15 Pro", 
        sku: "IP15P-256-BLU",
        batchId: "BTH-2024-001",
        quantity: 2, 
        unitPrice: 455000,
        total: 910000
      },
    ],
    total: 910000
  },
  {
    id: "2",
    invoiceNo: "INV-6547389027629",
    customerName: "Mary Johnson",
    date: "2025-02-07",
    branchId: "main",
    salesRepName: "Adebayo Johnson",
    items: [
      { 
        id: "2", 
        productId: "PROD-002",
        productName: "Samsung Galaxy S24", 
        sku: "SGS24-128-BLK",
        batchId: "BTH-2024-002",
        quantity: 1, 
        unitPrice: 372500,
        total: 372500
      }
    ],
    total: 372500
  },
];

export function SalesManagement({ user, currentBranch = 'main' }: SalesManagementProps): React.ReactElement {
  // Determine the active branch based on user role
  const activeBranch = user?.branchId || currentBranch;
  const salesRepName = user?.name || "Sales Representative";
  const salesRepEmail = user?.email || "sales@inventorypro.ng";

  // --- App state ---
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);

  // Filters & pagination
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Drawer (create invoice)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form for creating invoice
  const [customer, setCustomer] = useState("");
  const [saleItems, setSaleItems] = useState<SaleLineItem[]>([
    { id: Date.now().toString(), productId: "", batchId: "", quantity: 1, sellingPrice: 0 },
  ]);

  // Available products for the branch
  const [availableProducts] = useState<Product[]>(() => getProductsByBranch(activeBranch));

  // Track available batches per item
  const [itemBatches, setItemBatches] = useState<Record<string, ProductBatch[]>>({});

  // Invoice view
  const [generatedInvoice, setGeneratedInvoice] = useState<InvoiceData | null>(null);
  const [invoiceViewOpen, setInvoiceViewOpen] = useState(false);

  // Preview dialog
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  // --- Derived / helpers ---
  const filtered = useMemo(() => {
    let result = invoices;
    
    // Filter by branch if user is not super-admin
    if (user && user.role !== 'super-admin') {
      result = result.filter(inv => inv.branchId === activeBranch);
    }
    
    // Apply search and date filters
    return result.filter((inv) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        inv.customerName.toLowerCase().includes(q) ||
        inv.invoiceNo.toLowerCase().includes(q);

      const invDate = new Date(inv.date);
      const matchesFrom = dateFrom ? invDate >= dateFrom : true;
      const matchesTo = dateTo ? invDate <= dateTo : true;

      return matchesSearch && matchesFrom && matchesTo;
    });
  }, [invoices, search, dateFrom, dateTo, user, activeBranch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const totalSales = filtered.reduce((s, inv) => s + inv.total, 0);

  const avgItemsPerInvoice =
    filtered.length === 0
      ? 0
      : Number(
          (filtered.reduce((s, inv) => s + inv.items.length, 0) / filtered.length).toFixed(1)
        );

  // Calculate invoice total from sale items
  const invoiceSubtotal = useMemo(() => {
    return saleItems.reduce((sum, item) => {
      return sum + (item.quantity * item.sellingPrice);
    }, 0);
  }, [saleItems]);

  // --- Form helpers ---
  const addSaleItem = () =>
    setSaleItems((prev) => [
      ...prev,
      { id: Date.now().toString(), productId: "", batchId: "", quantity: 1, sellingPrice: 0 },
    ]);

  const removeSaleItem = (id: string) =>
    setSaleItems((prev) => (prev.length === 1 ? prev : prev.filter((item) => item.id !== id)));

  const updateSaleItem = <K extends keyof SaleLineItem>(id: string, field: keyof SaleLineItem, value: SaleLineItem[K]) => {
    setSaleItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        
        const updated = { ...item, [field]: value };
        
        // If product changed, reset batch and load new batches
        if (field === 'productId' && value) {
          updated.batchId = '';
          updated.sellingPrice = 0;

          const productId = value as string;
          const batches = getBatchesForProduct(productId, activeBranch);
          setItemBatches(prev => ({ ...prev, [id]: batches }));
        }
        
        // If batch changed, suggest the selling price from batch
        if (field === 'batchId' && value) {
          const batchId = value as string;
          const batch = getBatchById(batchId);
          if (batch && batch.sellingPrice) {
            updated.sellingPrice = batch.sellingPrice;
          }
        }
        
        return updated;
      })
    );
  };

  const validateCreateForm = (): string | null => {
    if (!customer.trim()) return "Customer name is required";
    
    if (saleItems.length === 0) return "At least one product is required";
    
    for (const item of saleItems) {
      if (!item.productId) return "All items must have a product selected";
      if (!item.batchId) return "All items must have a batch selected";
      if (!Number.isFinite(Number(item.quantity)) || item.quantity <= 0) 
        return "Quantity must be greater than zero";
      if (!Number.isFinite(Number(item.sellingPrice)) || item.sellingPrice <= 0) 
        return "Selling price must be greater than zero";
      
      // Validate against batch quantity
      const batch = getBatchById(item.batchId);
      if (!batch) return `Batch not found for item`;
      if (item.quantity > batch.quantity) 
        return `Insufficient stock in batch ${item.batchId}. Available: ${batch.quantity}`;
    }
    
    return null;
  };

  const resetCreateForm = () => {
    setCustomer("");
    setSaleItems([{ id: Date.now().toString(), productId: "", batchId: "", quantity: 1, sellingPrice: 0 }]);
    setItemBatches({});
  };

  const submitCreateInvoice = async () => {
    const err = validateCreateForm();
    if (err) {
      toast.error("Validation error", { description: err });
      return;
    }

    setIsSubmitting(true);
    try {
      // simulate API wait
      await new Promise((r) => setTimeout(r, 800));

      const newInvoiceNo = `INV-${Date.now()}`;
      const invoiceDate = new Date();
      
      // Build invoice line items using custom selling prices
      const lineItems: InvoiceLineItem[] = saleItems.map((item) => {
        const product = getProductById(item.productId)!;
        const unitPrice = item.sellingPrice;
        const total = item.quantity * unitPrice;
        
        return {
          id: item.id,
          productId: item.productId,
          productName: product.name,
          sku: product.sku,
          batchId: item.batchId,
          quantity: item.quantity,
          unitPrice,
          total
        };
      });

      // Calculate totals
      const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
      const discount = 0; // Can be extended later
      const tax = 0; // Can be extended later
      const total = subtotal - discount + tax;

      // Update inventory (reduce batch quantities)
      for (const item of saleItems) {
        updateBatchQuantity(item.batchId, -item.quantity);
      }

      // Create saved invoice record
      const savedInvoice: Invoice = {
        id: Date.now().toString(),
        invoiceNo: newInvoiceNo,
        customerName: customer.trim(),
        date: invoiceDate.toISOString().split("T")[0],
        branchId: activeBranch,
        salesRepName,
        items: lineItems,
        total
      };

      setInvoices((prev) => [savedInvoice, ...prev]);

      // Create full invoice data for viewing
      const branch = getBranchById(activeBranch);
      const invoiceData: InvoiceData = {
        invoiceNo: newInvoiceNo,
        date: invoiceDate,
        branchId: activeBranch,
        branchName: branch?.name || 'Unknown Branch',
        branchCode: branch?.code || 'N/A',
        customerName: customer.trim(),
        salesRepName,
        salesRepEmail,
        items: lineItems,
        subtotal,
        discount,
        tax,
        total
      };

      toast.success("Sale recorded successfully", { 
        description: `Invoice ${newInvoiceNo} created for ${customer.trim()}` 
      });

      // Show invoice view
      setGeneratedInvoice(invoiceData);
      setInvoiceViewOpen(true);

      // reset, close drawer, reset pagination to first page
      resetCreateForm();
      setDrawerOpen(false);
      setPage(1);
    } catch (e) {
      toast.error("Failed to create invoice", { description: "An unexpected error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is valid for submit button
  const isFormValid = () => {
    if (!customer.trim()) return false;
    for (const item of saleItems) {
      if (!item.productId || !item.batchId || item.quantity <= 0 || item.sellingPrice <= 0) return false;
    }
    return true;
  };

  // --- Render ---
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header + Create Drawer Trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-gray-900">Sales Management</h1>
          <p className="text-gray-600">View and manage sales invoices</p>
        </div>

        {/* Drawer Trigger */}
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <div className="flex items-center gap-2">
            <DrawerTrigger asChild>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4" />
                Create New Sales Invoice
              </Button>
            </DrawerTrigger>
          </div>

          {/* Drawer Content (right side) */}
          <DrawerContent className="flex flex-col max-h-screen" aria-describedby="drawer-description">
            <DrawerHeader className="shrink-0 border-b">
              <DrawerTitle>Create Sales Invoice</DrawerTitle>
              <DrawerDescription id="drawer-description">
                Fill out the form below to create a new sales invoice for your customer
              </DrawerDescription>
              <DrawerClose asChild>
                <button 
                  className="text-sm text-muted-foreground hover:text-gray-900"
                  aria-label="Close drawer"
                >
                  Close
                </button>
              </DrawerClose>
            </DrawerHeader>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitCreateInvoice();
                  }}
                  className="space-y-6"
                  role="form"
                  aria-label="Create sales invoice form"
                  id="invoice-form"
                >
                  {/* Branch Info */}
                  <Alert>
                    <AlertDescription>
                      Creating invoice for: <strong>{getBranchById(activeBranch)?.name}</strong>
                    </AlertDescription>
                  </Alert>

                  {/* Customer Name */}
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Customer Name *</Label>
                    <Input 
                      id="customer-name"
                      value={customer} 
                      onChange={(e) => setCustomer(e.target.value)} 
                      placeholder="Enter customer name" 
                      aria-required="true"
                    />
                  </div>

                  {/* Products */}
                  <div>
                    <Label>Products *</Label>
                    <div className="space-y-4 mt-2">
                      {saleItems.map((item, idx) => {
                        const selectedProduct = item.productId ? getProductById(item.productId) : null;
                        const availableBatches = itemBatches[item.id] || [];
                        const selectedBatch = item.batchId ? getBatchById(item.batchId) : null;
                        const lineTotal = item.quantity * item.sellingPrice;
                        
                        return (
                          <div key={item.id} className="rounded-lg p-4 border-2 border-gray-200 bg-white space-y-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm">Item #{idx + 1}</span>
                              <Button 
                                type="button"
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeSaleItem(item.id)} 
                                disabled={saleItems.length === 1} 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                aria-label={`Remove item ${idx + 1}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Product Dropdown */}
                            <div className="space-y-2">
                              <Label htmlFor={`product-${item.id}`} className="text-sm">
                                Product *
                              </Label>
                              <Select
                                value={item.productId}
                                onValueChange={(value) => updateSaleItem(item.id, "productId", value)}
                              >
                                <SelectTrigger id={`product-${item.id}`} aria-label="Select product">
                                  <SelectValue placeholder="Select a product" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableProducts.length === 0 ? (
                                    <div className="p-2 text-sm text-gray-500">No products available</div>
                                  ) : (
                                    availableProducts.map((product) => (
                                      <SelectItem key={product.id} value={product.id}>
                                        <div className="flex flex-col">
                                          <span>{product.name}</span>
                                          <span className="text-xs text-gray-500">
                                            SKU: {product.sku} • {product.category}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Batch Dropdown - only show if product selected */}
                            {selectedProduct && (
                              <div className="space-y-2">
                                <Label htmlFor={`batch-${item.id}`} className="text-sm">
                                  Batch *
                                </Label>
                                <Select
                                  value={item.batchId}
                                  onValueChange={(value) => updateSaleItem(item.id, "batchId", value)}
                                >
                                  <SelectTrigger id={`batch-${item.id}`} aria-label="Select batch">
                                    <SelectValue placeholder="Select a batch" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableBatches.length === 0 ? (
                                      <div className="p-2 text-sm text-gray-500">
                                        No batches available for this product
                                      </div>
                                    ) : (
                                      availableBatches.map((batch) => (
                                        <SelectItem key={batch.batchId} value={batch.batchId}>
                                          <div className="flex flex-col">
                                            <span className="font-mono text-sm">{batch.batchId}</span>
                                            <span className="text-xs text-gray-500">
                                              Available: {batch.quantity} units
                                              {batch.sellingPrice && ` • Suggested: ₦${batch.sellingPrice.toLocaleString()}`}
                                            </span>
                                          </div>
                                        </SelectItem>
                                      ))
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {/* Quantity and Price - only show if batch selected */}
                            {selectedBatch && (
                              <>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-2">
                                    <Label htmlFor={`quantity-${item.id}`} className="text-sm">
                                      Quantity * (Max: {selectedBatch.quantity})
                                    </Label>
                                    <Input 
                                      id={`quantity-${item.id}`}
                                      type="number" 
                                      min={1} 
                                      max={selectedBatch.quantity}
                                      value={item.quantity} 
                                      onChange={(e) => updateSaleItem(item.id, "quantity", Number(e.target.value))}
                                      aria-required="true"
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor={`selling-price-${item.id}`} className="text-sm">
                                      Selling Price (₦) *
                                    </Label>
                                    <Input 
                                      id={`selling-price-${item.id}`}
                                      type="number" 
                                      min={0}
                                      step="0.01"
                                      value={item.sellingPrice || ''} 
                                      onChange={(e) => updateSaleItem(item.id, "sellingPrice", Number(e.target.value))}
                                      placeholder="Enter price"
                                      aria-required="true"
                                    />
                                  </div>
                                </div>

                                {/* Line Total */}
                                <div className="pt-2 border-t">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Line Total:</span>
                                    <span className="font-medium">₦{lineTotal.toLocaleString()}</span>
                                  </div>
                                </div>

                                {/* Validation Messages */}
                                {item.quantity > selectedBatch.quantity && (
                                  <Alert className="bg-red-50 border-red-200">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-800">
                                      Quantity exceeds available stock ({selectedBatch.quantity} units)
                                    </AlertDescription>
                                  </Alert>
                                )}
                                
                                {item.sellingPrice > 0 && selectedBatch.costPrice && item.sellingPrice < selectedBatch.costPrice && (
                                  <Alert className="bg-yellow-50 border-yellow-200">
                                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                                    <AlertDescription className="text-yellow-800">
                                      Selling price (₦{item.sellingPrice.toLocaleString()}) is below cost price (₦{selectedBatch.costPrice.toLocaleString()})
                                    </AlertDescription>
                                  </Alert>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}

                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addSaleItem} 
                        className="w-full gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Another Product
                      </Button>
                    </div>
                  </div>

                  {/* Invoice Summary */}
                  {invoiceSubtotal > 0 && (
                    <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                      <h3 className="font-medium mb-3">Invoice Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>₦{invoiceSubtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Discount:</span>
                          <span>₦0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tax:</span>
                          <span>₦0</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-blue-300">
                          <span className="font-medium">Total:</span>
                          <span className="font-medium">₦{invoiceSubtotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Fixed Footer with Action Buttons */}
            <div className="shrink-0 border-t bg-white p-4 space-y-3">
              <div className="flex justify-end gap-3">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setDrawerOpen(false)} 
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>

                <Button 
                  type="submit" 
                  form="invoice-form"
                  className="bg-green-600 hover:bg-green-700 text-white" 
                  disabled={isSubmitting || !isFormValid()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Invoice"
                  )}
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                Tip: Select product → batch → enter quantity & price. All fields required.
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Invoice View Modal */}
      <InvoiceView
        invoice={generatedInvoice}
        open={invoiceViewOpen}
        onClose={() => setInvoiceViewOpen(false)}
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Sales</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">₦{totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From {filtered.length} invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm">Invoices</CardTitle>
            <Receipt className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{filtered.length}</div>
            <p className="text-xs text-muted-foreground">Total issued</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm">Avg Items / Invoice</CardTitle>
            <ShoppingCart className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{avgItemsPerInvoice}</div>
            <p className="text-xs text-muted-foreground">Average purchase size</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search by customer or invoice no..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-[280px]"
          aria-label="Search invoices"
        />

        {/* Date range: From */}
        <div className="flex items-center gap-2">
          <span className="text-sm">From:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-40 justify-between">
                {dateFrom ? format(dateFrom, "PPP") : "Pick date"}
                <CalendarIcon className="w-4 h-4 opacity-60" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-0">
              <Calendar mode="single" selected={dateFrom} onSelect={(d) => { setDateFrom(d); setPage(1); }} />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date range: To */}
        <div className="flex items-center gap-2">
          <span className="text-sm">To:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[160px] justify-between">
                {dateTo ? format(dateTo, "PPP") : "Pick date"}
                <CalendarIcon className="w-4 h-4 opacity-60" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-0">
              <Calendar mode="single" selected={dateTo} onSelect={(d) => { setDateTo(d); setPage(1); }} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={() => { setSearch(""); setDateFrom(undefined); setDateTo(undefined); setPage(1); }}>
            Reset filters
          </Button>
        </div>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Invoices</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No invoices found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((inv) => {
                    return (
                      <TableRow key={inv.id} className="hover:bg-muted/40">
                        <TableCell className="font-mono text-sm">{inv.invoiceNo}</TableCell>
                        <TableCell>{inv.customerName}</TableCell>
                        <TableCell>{inv.date}</TableCell>
                        <TableCell>{inv.items.length} items</TableCell>
                        <TableCell>₦{inv.total.toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          {/* Preview Dialog */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" onClick={() => setPreviewInvoice(inv)} aria-label={`View invoice ${inv.invoiceNo}`}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>

                            {/* Show preview for the selected invoice */}
                            {previewInvoice?.id === inv.id && (
                              <DialogContent className="max-w-8xl" aria-describedby="preview-description">
                                <DialogHeader>
                                  <DialogTitle>Invoice Preview — {inv.invoiceNo}</DialogTitle>
                                  <DialogDescription id="preview-description">
                                    Full details of this invoice
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="mt-4 space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">Invoice ID</p>
                                      <p className="font-medium font-mono">{inv.invoiceNo}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Date</p>
                                      <p className="font-medium">{inv.date}</p>
                                    </div>

                                    <div>
                                      <p className="text-sm text-muted-foreground">Customer</p>
                                      <p className="font-medium">{inv.customerName}</p>
                                    </div>

                                    <div>
                                      <p className="text-sm text-muted-foreground">Total</p>
                                      <p className="font-medium">
                                        ₦{inv.total.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    <h3 className="font-semibold mb-2">Purchased items</h3>
                                    <div className="rounded-md border overflow-hidden">
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead>Batch</TableHead>
                                            <TableHead className="text-right">Qty</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {inv.items.map((it) => (
                                            <TableRow key={it.id}>
                                              <TableCell>{it.productName}</TableCell>
                                              <TableCell className="text-gray-600">{it.sku}</TableCell>
                                              <TableCell className="font-mono text-sm">{it.batchId}</TableCell>
                                              <TableCell className="text-right">{it.quantity}</TableCell>
                                              <TableCell className="text-right">₦{it.unitPrice.toLocaleString()}</TableCell>
                                              <TableCell className="text-right font-medium">₦{it.total.toLocaleString()}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </div>

                                  <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="outline" onClick={() => setPreviewInvoice(null)}>
                                      Close
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            )}
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination control */}
      <div className="flex items-center justify-between mt-3">
        <div className="text-sm text-muted-foreground">
          Showing {paginated.length > 0 ? (page - 1) * perPage + 1 : 0}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Prev
          </Button>

          <div className="inline-flex items-center border rounded-md overflow-hidden">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageIndex = i + 1;
              return (
                <button
                  key={pageIndex}
                  onClick={() => setPage(pageIndex)}
                  className={`px-3 py-1 text-sm ${page === pageIndex ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                  aria-label={`Go to page ${pageIndex}`}
                  aria-current={page === pageIndex ? 'page' : undefined}
                >
                  {pageIndex}
                </button>
              );
            })}
          </div>

          <Button variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}