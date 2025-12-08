// Mock data utilities for inventory and sales management

export interface ProductBatch {
  batchId: string;
  productId: string;
  branchId: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  expiryDate: string;
  purchaseDate: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  supplier: string;
  description?: string;
}

// Product catalog
export const products: Product[] = [
  {
    id: 'PROD-001',
    name: 'iPhone 15 Pro',
    sku: 'IP15P-256-BLU',
    category: 'Electronics',
    supplier: 'Apple Inc.',
    description: 'iPhone 15 Pro 256GB Blue'
  },
  {
    id: 'PROD-002',
    name: 'Samsung Galaxy S24',
    sku: 'SGS24-128-BLK',
    category: 'Electronics',
    supplier: 'Samsung',
    description: 'Samsung Galaxy S24 128GB Black'
  },
  {
    id: 'PROD-003',
    name: 'Nike Air Max 270',
    sku: 'NAM270-42-WHT',
    category: 'Footwear',
    supplier: 'Nike',
    description: 'Nike Air Max 270 Size 42 White'
  },
  {
    id: 'PROD-004',
    name: 'MacBook Air M3',
    sku: 'MBA-M3-256-SLV',
    category: 'Electronics',
    supplier: 'Apple Inc.',
    description: 'MacBook Air M3 256GB Silver'
  },
  {
    id: 'PROD-005',
    name: 'Dell XPS 13',
    sku: 'DXP13-512-BLK',
    category: 'Electronics',
    supplier: 'Dell',
    description: 'Dell XPS 13 512GB Black'
  },
  {
    id: 'PROD-006',
    name: 'Sony WH-1000XM5',
    sku: 'SWXM5-BLK',
    category: 'Electronics',
    supplier: 'Sony',
    description: 'Sony WH-1000XM5 Headphones Black'
  },
  {
    id: 'PROD-007',
    name: 'Adidas Ultraboost',
    sku: 'AUB-43-BLU',
    category: 'Footwear',
    supplier: 'Adidas',
    description: 'Adidas Ultraboost Size 43 Blue'
  },
  {
    id: 'PROD-008',
    name: 'HP LaserJet Pro',
    sku: 'HLP-M404DN',
    category: 'Electronics',
    supplier: 'HP',
    description: 'HP LaserJet Pro M404dn Printer'
  }
];

// Product batches by branch
export let productBatches: ProductBatch[] = [
  // Main Branch
  {
    batchId: 'BTH-2024-001',
    productId: 'PROD-001',
    branchId: 'main',
    quantity: 45,
    costPrice: 372500,
    sellingPrice: 455000,
    expiryDate: '2025-12-31',
    purchaseDate: '2024-01-15'
  },
  {
    batchId: 'BTH-2024-002',
    productId: 'PROD-002',
    branchId: 'main',
    quantity: 28,
    costPrice: 310500,
    sellingPrice: 372500,
    expiryDate: '2025-10-15',
    purchaseDate: '2024-02-20'
  },
  {
    batchId: 'BTH-2024-003',
    productId: 'PROD-004',
    branchId: 'main',
    quantity: 12,
    costPrice: 455000,
    sellingPrice: 538500,
    expiryDate: '2026-03-20',
    purchaseDate: '2024-03-10'
  },
  {
    batchId: 'BTH-2024-004',
    productId: 'PROD-005',
    branchId: 'main',
    quantity: 18,
    costPrice: 425000,
    sellingPrice: 515000,
    expiryDate: '2026-05-30',
    purchaseDate: '2024-04-05'
  },
  {
    batchId: 'BTH-2024-005',
    productId: 'PROD-006',
    branchId: 'main',
    quantity: 35,
    costPrice: 82500,
    sellingPrice: 125000,
    expiryDate: '2026-08-15',
    purchaseDate: '2024-05-12'
  },
  
  // North Branch
  {
    batchId: 'BTH-2024-006',
    productId: 'PROD-001',
    branchId: 'north',
    quantity: 22,
    costPrice: 372500,
    sellingPrice: 455000,
    expiryDate: '2025-12-31',
    purchaseDate: '2024-01-20'
  },
  {
    batchId: 'BTH-2024-007',
    productId: 'PROD-003',
    branchId: 'north',
    quantity: 30,
    costPrice: 36900,
    sellingPrice: 58000,
    expiryDate: '2026-06-30',
    purchaseDate: '2024-02-15'
  },
  {
    batchId: 'BTH-2024-008',
    productId: 'PROD-007',
    branchId: 'north',
    quantity: 25,
    costPrice: 41200,
    sellingPrice: 65000,
    expiryDate: '2026-07-20',
    purchaseDate: '2024-03-08'
  },
  
  // South Branch
  {
    batchId: 'BTH-2024-009',
    productId: 'PROD-002',
    branchId: 'south',
    quantity: 15,
    costPrice: 310500,
    sellingPrice: 372500,
    expiryDate: '2025-10-15',
    purchaseDate: '2024-02-25'
  },
  {
    batchId: 'BTH-2024-010',
    productId: 'PROD-004',
    branchId: 'south',
    quantity: 8,
    costPrice: 455000,
    sellingPrice: 538500,
    expiryDate: '2026-03-20',
    purchaseDate: '2024-03-15'
  },
  {
    batchId: 'BTH-2024-011',
    productId: 'PROD-008',
    branchId: 'south',
    quantity: 20,
    costPrice: 103500,
    sellingPrice: 155000,
    expiryDate: '2027-01-10',
    purchaseDate: '2024-04-20'
  },
  
  // West Branch
  {
    batchId: 'BTH-2024-012',
    productId: 'PROD-001',
    branchId: 'west',
    quantity: 32,
    costPrice: 372500,
    sellingPrice: 455000,
    expiryDate: '2025-12-31',
    purchaseDate: '2024-01-25'
  },
  {
    batchId: 'BTH-2024-013',
    productId: 'PROD-005',
    branchId: 'west',
    quantity: 14,
    costPrice: 425000,
    sellingPrice: 515000,
    expiryDate: '2026-05-30',
    purchaseDate: '2024-04-10'
  },
  {
    batchId: 'BTH-2024-014',
    productId: 'PROD-006',
    branchId: 'west',
    quantity: 28,
    costPrice: 82500,
    sellingPrice: 125000,
    expiryDate: '2026-08-15',
    purchaseDate: '2024-05-18'
  }
];

// Helper functions
export function getProductsByBranch(branchId: string): Product[] {
  const branchBatches = productBatches.filter(b => b.branchId === branchId);
  const productIds = new Set(branchBatches.map(b => b.productId));
  return products.filter(p => productIds.has(p.id));
}

export function getBatchesForProduct(productId: string, branchId: string): ProductBatch[] {
  return productBatches.filter(
    b => b.productId === productId && b.branchId === branchId && b.quantity > 0
  );
}

export function getProductById(productId: string): Product | undefined {
  return products.find(p => p.id === productId);
}

export function getBatchById(batchId: string): ProductBatch | undefined {
  return productBatches.find(b => b.batchId === batchId);
}

export function updateBatchQuantity(batchId: string, quantityChange: number): boolean {
  const batchIndex = productBatches.findIndex(b => b.batchId === batchId);
  if (batchIndex === -1) return false;
  
  const newQuantity = productBatches[batchIndex].quantity + quantityChange;
  if (newQuantity < 0) return false;
  
  productBatches[batchIndex] = {
    ...productBatches[batchIndex],
    quantity: newQuantity
  };
  return true;
}

export function getTotalInventoryValue(branchId?: string): number {
  const batches = branchId 
    ? productBatches.filter(b => b.branchId === branchId)
    : productBatches;
  
  return batches.reduce((total, batch) => {
    return total + (batch.quantity * batch.costPrice);
  }, 0);
}

export function getBranchById(branchId: string): { id: string; name: string; code: string } | undefined {
  const branches = [
    { id: 'main', name: 'Main Branch', code: 'BR-001' },
    { id: 'north', name: 'North Branch', code: 'BR-002' },
    { id: 'south', name: 'South Branch', code: 'BR-003' },
    { id: 'west', name: 'West Branch', code: 'BR-004' }
  ];
  return branches.find(b => b.id === branchId);
}
