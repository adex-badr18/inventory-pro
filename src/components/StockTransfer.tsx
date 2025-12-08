import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from './ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Alert, AlertDescription } from './ui/alert';
import { 
  ArrowRightLeft,
  Building2,
  Package,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

interface StockTransferProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (transfer: TransferData) => Promise<void>;
  branches: Branch[];
  inventory: InventoryItem[];
}

interface Branch {
  id: string;
  name: string;
  code: string;
}

interface InventoryItem {
  id: string;
  branchId: string;
  name: string;
  batchId: string;
  quantity: number;
  category: string;
}

interface TransferData {
  sourceBranchId: string;
  destinationBranchId: string;
  productId: string;
  productName: string;
  batchId: string;
  quantity: number;
}

export function StockTransfer({ 
  isOpen, 
  onClose, 
  onTransfer, 
  branches,
  inventory 
}: StockTransferProps) {
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    sourceBranchId: '',
    destinationBranchId: '',
    productId: '',
    batchId: '',
    quantity: ''
  });

  const [errors, setErrors] = useState({
    sourceBranchId: '',
    destinationBranchId: '',
    productId: '',
    batchId: '',
    quantity: ''
  });

  // Get available products for selected source branch
  const availableProducts = formData.sourceBranchId
    ? inventory.filter(item => item.branchId === formData.sourceBranchId && item.quantity > 0)
    : [];

  // Get unique products (remove duplicates by name)
  const uniqueProducts = Array.from(
    new Map(availableProducts.map(item => [item.name, item])).values()
  );

  // Get batches for selected product
  const availableBatches = formData.productId
    ? availableProducts.filter(item => item.id === formData.productId || item.name === formData.productId)
    : [];

  // Get selected product details
  const selectedProduct = formData.productId && formData.batchId
    ? availableProducts.find(item => 
        (item.id === formData.productId || item.name === formData.productId) && 
        item.batchId === formData.batchId
      )
    : null;

  // Get branch names
  const getSourceBranch = () => branches.find(b => b.id === formData.sourceBranchId);
  const getDestinationBranch = () => branches.find(b => b.id === formData.destinationBranchId);

  const resetForm = () => {
    setFormData({
      sourceBranchId: '',
      destinationBranchId: '',
      productId: '',
      batchId: '',
      quantity: ''
    });
    setErrors({
      sourceBranchId: '',
      destinationBranchId: '',
      productId: '',
      batchId: '',
      quantity: ''
    });
    setStep('form');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors = {
      sourceBranchId: '',
      destinationBranchId: '',
      productId: '',
      batchId: '',
      quantity: ''
    };

    let isValid = true;

    if (!formData.sourceBranchId) {
      newErrors.sourceBranchId = 'Source branch is required';
      isValid = false;
    }

    if (!formData.destinationBranchId) {
      newErrors.destinationBranchId = 'Destination branch is required';
      isValid = false;
    }

    if (formData.sourceBranchId && formData.destinationBranchId && 
        formData.sourceBranchId === formData.destinationBranchId) {
      newErrors.destinationBranchId = 'Destination must be different from source';
      isValid = false;
    }

    if (!formData.productId) {
      newErrors.productId = 'Product is required';
      isValid = false;
    }

    if (!formData.batchId) {
      newErrors.batchId = 'Batch ID is required';
      isValid = false;
    }

    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
      isValid = false;
    }

    // Check available quantity
    if (selectedProduct && parseInt(formData.quantity) > selectedProduct.quantity) {
      newErrors.quantity = `Insufficient stock. Available: ${selectedProduct.quantity}`;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));

    // Reset dependent fields
    if (field === 'sourceBranchId') {
      setFormData(prev => ({
        ...prev,
        productId: '',
        batchId: '',
        quantity: ''
      }));
    }
    
    if (field === 'productId') {
      setFormData(prev => ({
        ...prev,
        batchId: '',
        quantity: ''
      }));
    }

    if (field === 'batchId') {
      setFormData(prev => ({
        ...prev,
        quantity: ''
      }));
    }
  };

  const handleContinueToConfirm = () => {
    if (validateForm()) {
      setShowConfirmDialog(true);
    } else {
      // Focus on first error field
      const firstErrorField = Object.entries(errors).find(([_, error]) => error);
      if (firstErrorField) {
        const fieldName = firstErrorField[0];
        const element = document.getElementById(fieldName);
        element?.focus();
      }
    }
  };

  const handleConfirmTransfer = async () => {
    if (!selectedProduct) return;

    setIsSubmitting(true);
    setShowConfirmDialog(false);

    try {
      const transferData: TransferData = {
        sourceBranchId: formData.sourceBranchId,
        destinationBranchId: formData.destinationBranchId,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        batchId: formData.batchId,
        quantity: parseInt(formData.quantity)
      };

      await onTransfer(transferData);

      toast.success('Stock transferred successfully', {
        description: `${formData.quantity} units of ${selectedProduct.name} transferred from ${getSourceBranch()?.name} to ${getDestinationBranch()?.name}`
      });

      handleClose();
    } catch (error) {
      toast.error('Transfer failed', {
        description: error instanceof Error ? error.message : 'An error occurred during the transfer'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-2xl" aria-describedby="transfer-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-blue-600" />
              Transfer Stock Between Branches
            </DialogTitle>
          </DialogHeader>
          <p id="transfer-description" className="sr-only">
            Transfer inventory stock from one branch to another
          </p>

          <form onSubmit={(e) => {
            e.preventDefault();
            handleContinueToConfirm();
          }}>
            <div className="space-y-6 py-4">
              {/* Branch Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sourceBranchId" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    Source Branch *
                  </Label>
                  <Select 
                    value={formData.sourceBranchId} 
                    onValueChange={(value) => handleInputChange('sourceBranchId', value)}
                  >
                    <SelectTrigger 
                      id="sourceBranchId"
                      className={errors.sourceBranchId ? 'border-red-500' : ''}
                      aria-invalid={!!errors.sourceBranchId}
                      aria-describedby={errors.sourceBranchId ? 'sourceBranchId-error' : undefined}
                    >
                      <SelectValue placeholder="Select source branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map(branch => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name} ({branch.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sourceBranchId && (
                    <p id="sourceBranchId-error" className="text-sm text-red-600" role="alert">
                      {errors.sourceBranchId}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destinationBranchId" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    Destination Branch *
                  </Label>
                  <Select 
                    value={formData.destinationBranchId} 
                    onValueChange={(value) => handleInputChange('destinationBranchId', value)}
                  >
                    <SelectTrigger 
                      id="destinationBranchId"
                      className={errors.destinationBranchId ? 'border-red-500' : ''}
                      aria-invalid={!!errors.destinationBranchId}
                      aria-describedby={errors.destinationBranchId ? 'destinationBranchId-error' : undefined}
                    >
                      <SelectValue placeholder="Select destination branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches
                        .filter(b => b.id !== formData.sourceBranchId)
                        .map(branch => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name} ({branch.code})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.destinationBranchId && (
                    <p id="destinationBranchId-error" className="text-sm text-red-600" role="alert">
                      {errors.destinationBranchId}
                    </p>
                  )}
                </div>
              </div>

              {/* Product Selection */}
              {formData.sourceBranchId && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="productId" className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      Product *
                    </Label>
                    <Select 
                      value={formData.productId} 
                      onValueChange={(value) => handleInputChange('productId', value)}
                    >
                      <SelectTrigger 
                        id="productId"
                        className={errors.productId ? 'border-red-500' : ''}
                        aria-invalid={!!errors.productId}
                        aria-describedby={errors.productId ? 'productId-error' : undefined}
                      >
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueProducts.length > 0 ? (
                          uniqueProducts.map(product => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} ({product.category})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-products" disabled>
                            No products available in this branch
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.productId && (
                      <p id="productId-error" className="text-sm text-red-600" role="alert">
                        {errors.productId}
                      </p>
                    )}
                  </div>

                  {/* Batch Selection */}
                  {formData.productId && (
                    <div className="space-y-2">
                      <Label htmlFor="batchId">Batch ID *</Label>
                      <Select 
                        value={formData.batchId} 
                        onValueChange={(value) => handleInputChange('batchId', value)}
                      >
                        <SelectTrigger 
                          id="batchId"
                          className={errors.batchId ? 'border-red-500' : ''}
                          aria-invalid={!!errors.batchId}
                          aria-describedby={errors.batchId ? 'batchId-error' : undefined}
                        >
                          <SelectValue placeholder="Select batch" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableBatches.map(batch => (
                            <SelectItem key={batch.batchId} value={batch.batchId}>
                              {batch.batchId} (Available: {batch.quantity})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.batchId && (
                        <p id="batchId-error" className="text-sm text-red-600" role="alert">
                          {errors.batchId}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Quantity Input */}
                  {formData.batchId && selectedProduct && (
                    <div className="space-y-2">
                      <Label htmlFor="quantity">
                        Quantity to Transfer * 
                        <span className="text-sm text-gray-500 ml-2">
                          (Available: {selectedProduct.quantity})
                        </span>
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max={selectedProduct.quantity}
                        placeholder="Enter quantity"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        className={errors.quantity ? 'border-red-500' : ''}
                        aria-invalid={!!errors.quantity}
                        aria-describedby={errors.quantity ? 'quantity-error' : undefined}
                        required
                      />
                      {errors.quantity && (
                        <p id="quantity-error" className="text-sm text-red-600" role="alert">
                          {errors.quantity}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Current Selection Summary */}
              {selectedProduct && formData.quantity && (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-sm">
                    <strong>Transfer Summary:</strong><br />
                    Transfer <strong>{formData.quantity}</strong> units of <strong>{selectedProduct.name}</strong> (Batch: {formData.batchId})<br />
                    From: <strong>{getSourceBranch()?.name}</strong> → To: <strong>{getDestinationBranch()?.name}</strong>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button 
                type="button"
                variant="outline" 
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting || !selectedProduct || !formData.quantity}
              >
                Continue to Confirm
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              Confirm Stock Transfer
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>Please review and confirm the stock transfer details:</p>
                
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Product:</span>
                      <span className="font-medium">{selectedProduct?.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Batch ID:</span>
                      <span className="font-mono text-sm">{formData.batchId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <span className="font-medium text-lg">{formData.quantity} units</span>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">From</span>
                          <span className="font-medium">{getSourceBranch()?.name}</span>
                          <span className="text-xs text-gray-500">{getSourceBranch()?.code}</span>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                        <div className="flex flex-col text-right">
                          <span className="text-xs text-gray-500">To</span>
                          <span className="font-medium">{getDestinationBranch()?.name}</span>
                          <span className="text-xs text-gray-500">{getDestinationBranch()?.code}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    After transfer, {getSourceBranch()?.name} will have{' '}
                    <strong>{selectedProduct ? selectedProduct.quantity - parseInt(formData.quantity || '0') : 0}</strong> units remaining.
                  </AlertDescription>
                </Alert>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmTransfer}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Transferring...
                </>
              ) : (
                <>
                  Confirm Transfer
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
