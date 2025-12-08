import { format } from 'date-fns';
import { Printer, X } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Separator } from './ui/separator';

export interface InvoiceLineItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  batchId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  invoiceNo: string;
  date: Date;
  branchId: string;
  branchName: string;
  branchCode: string;
  customerName?: string;
  salesRepName: string;
  salesRepEmail: string;
  items: InvoiceLineItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

interface InvoiceViewProps {
  invoice: InvoiceData | null;
  open: boolean;
  onClose: () => void;
}

export function InvoiceView({ invoice, open, onClose }: InvoiceViewProps) {
  if (!invoice) return null;

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Generate the print HTML
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice ${invoice.invoiceNo}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              padding: 20px;
              color: #1f2937;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: start;
              padding-bottom: 20px;
              border-bottom: 3px solid #1f2937;
              margin-bottom: 20px;
            }
            .header-left h1 {
              font-size: 28px;
              margin-bottom: 8px;
              font-weight: 600;
            }
            .header-left p {
              color: #6b7280;
              margin-bottom: 4px;
            }
            .branch-info {
              margin-top: 12px;
              font-size: 14px;
              color: #6b7280;
            }
            .header-right {
              text-align: right;
            }
            .header-right h2 {
              font-size: 24px;
              margin-bottom: 12px;
              font-weight: 600;
            }
            .header-right .label {
              color: #6b7280;
              font-size: 14px;
            }
            .header-right .value {
              font-family: 'Courier New', monospace;
              margin-bottom: 8px;
            }
            .info-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              padding: 20px 0;
            }
            .info-box h3 {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 8px;
            }
            .info-box .name {
              font-weight: 500;
              margin-bottom: 4px;
            }
            .info-box .email {
              font-size: 14px;
              color: #6b7280;
            }
            .separator {
              height: 1px;
              background: #e5e7eb;
              margin: 20px 0;
            }
            .items-section h3 {
              font-weight: 600;
              margin-bottom: 12px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              overflow: hidden;
            }
            thead {
              background: #f9fafb;
            }
            th {
              text-align: left;
              padding: 12px;
              font-size: 14px;
              font-weight: 600;
              border-bottom: 1px solid #e5e7eb;
            }
            th.text-right {
              text-align: right;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #e5e7eb;
            }
            td.text-right {
              text-align: right;
            }
            tbody tr:last-child td {
              border-bottom: none;
            }
            .sku {
              color: #6b7280;
            }
            .batch {
              font-family: 'Courier New', monospace;
              font-size: 13px;
              color: #6b7280;
            }
            .totals {
              display: flex;
              justify-content: flex-end;
              margin-top: 20px;
            }
            .totals-box {
              width: 320px;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              color: #6b7280;
            }
            .totals-row.total {
              border-top: 1px solid #e5e7eb;
              padding-top: 12px;
              margin-top: 8px;
              font-size: 20px;
              color: #1f2937;
              font-weight: bold;
            }
            .footer {
              margin-top: 40px;
              padding-top: 30px;
              border-top: 1px solid #e5e7eb;
            }
            .footer-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              font-size: 14px;
            }
            .footer-box h4 {
              font-weight: 600;
              margin-bottom: 8px;
            }
            .footer-box p {
              color: #6b7280;
              margin-bottom: 4px;
              font-size: 13px;
            }
            .footer-note {
              text-align: center;
              margin-top: 24px;
              padding-top: 16px;
              border-top: 1px solid #e5e7eb;
            }
            .footer-note p {
              color: #6b7280;
              font-size: 13px;
            }
            .footer-note .timestamp {
              color: #9ca3af;
              font-size: 11px;
              margin-top: 4px;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div class="header-left">
                <h1>InventoryPro</h1>
                <p>Multi-Branch Management System</p>
                <div class="branch-info">
                  <p>${invoice.branchName}</p>
                  <p>Branch Code: ${invoice.branchCode}</p>
                  <p>Lagos, Nigeria</p>
                </div>
              </div>
              <div class="header-right">
                <h2>SALES INVOICE</h2>
                <div class="label">Invoice No:</div>
                <div class="value">${invoice.invoiceNo}</div>
                <div class="label" style="margin-top: 12px;">Date:</div>
                <div class="value">${format(invoice.date, 'PPP')}</div>
                <div class="value" style="font-size: 13px; color: #6b7280;">${format(invoice.date, 'p')}</div>
              </div>
            </div>

            <div class="info-section">
              <div class="info-box">
                <h3>Bill To:</h3>
                <div class="name">${invoice.customerName || 'Walk-in Customer'}</div>
              </div>
              <div class="info-box">
                <h3>Sales Representative:</h3>
                <div class="name">${invoice.salesRepName}</div>
                <div class="email">${invoice.salesRepEmail}</div>
              </div>
            </div>

            <div class="separator"></div>

            <div class="items-section">
              <h3>Items</h3>
              <table>
                <thead>
                  <tr>
                    <th style="width: 40px;">#</th>
                    <th>Product Name</th>
                    <th>SKU</th>
                    <th>Batch ID</th>
                    <th class="text-right">Qty</th>
                    <th class="text-right">Unit Price</th>
                    <th class="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.items.map((item, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${item.productName}</td>
                      <td class="sku">${item.sku}</td>
                      <td class="batch">${item.batchId}</td>
                      <td class="text-right">${item.quantity}</td>
                      <td class="text-right">₦${item.unitPrice.toLocaleString()}</td>
                      <td class="text-right" style="font-weight: 500;">₦${item.total.toLocaleString()}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="totals">
              <div class="totals-box">
                <div class="totals-row">
                  <span>Subtotal:</span>
                  <span>₦${invoice.subtotal.toLocaleString()}</span>
                </div>
                ${invoice.discount > 0 ? `
                  <div class="totals-row">
                    <span>Discount:</span>
                    <span style="color: #10b981;">-₦${invoice.discount.toLocaleString()}</span>
                  </div>
                ` : ''}
                ${invoice.tax > 0 ? `
                  <div class="totals-row">
                    <span>Tax (VAT):</span>
                    <span>₦${invoice.tax.toLocaleString()}</span>
                  </div>
                ` : ''}
                <div class="totals-row total">
                  <span>Total:</span>
                  <span>₦${invoice.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div class="footer">
              <div class="footer-grid">
                <div class="footer-box">
                  <h4>Payment Information</h4>
                  <p>Payment due upon receipt</p>
                  <p>Bank: GTBank Nigeria</p>
                  <p>Account: 0123456789</p>
                </div>
                <div class="footer-box">
                  <h4>Terms & Conditions</h4>
                  <p>All sales are final unless otherwise stated. Returns accepted within 7 days with original receipt. Please inspect all items before leaving the store.</p>
                </div>
              </div>
              <div class="footer-note">
                <p>Thank you for your business!</p>
                <p class="timestamp">Generated by InventoryPro - ${format(new Date(), 'PPP p')}</p>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh] overflow-y-auto p-6" aria-describedby="invoice-description">
        <DialogHeader>
          <DialogTitle>Sales Invoice - {invoice.invoiceNo}</DialogTitle>
          <DialogDescription id="invoice-description">
            Complete sales invoice with itemized products, pricing, and payment information
          </DialogDescription>
        </DialogHeader>

        {/* Invoice Content - Responsive Layout */}
        <div className="bg-white space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pb-6 border-b-2 border-gray-900">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl text-gray-900 mb-2">InventoryPro</h1>
              <p className="text-gray-600">Multi-Branch Management System</p>
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>{invoice.branchName}</p>
                <p>Branch Code: {invoice.branchCode}</p>
                <p>Lagos, Nigeria</p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <h2 className="text-xl md:text-2xl text-gray-900 mb-2">SALES INVOICE</h2>
              <div className="text-sm space-y-1">
                <p className="text-gray-600">Invoice No:</p>
                <p className="font-mono break-all">{invoice.invoiceNo}</p>
                <p className="text-gray-600 mt-2">Date:</p>
                <p>{format(invoice.date, 'PPP')}</p>
                <p className="text-sm text-gray-500">{format(invoice.date, 'p')}</p>
              </div>
            </div>
          </div>

          {/* Customer & Sales Rep Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div>
              <h3 className="text-sm text-gray-600 mb-2">Bill To:</h3>
              <div className="text-gray-900">
                <p className="font-medium">{invoice.customerName || 'Walk-in Customer'}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-2">Sales Representative:</h3>
              <div className="text-gray-900">
                <p className="font-medium">{invoice.salesRepName}</p>
                <p className="text-sm text-gray-600 break-all">{invoice.salesRepEmail}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Items Table - Responsive */}
          <div>
            <h3 className="text-gray-900 mb-3">Items</h3>
            
            {/* Desktop Table View */}
            <div className="hidden md:block border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Batch ID</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell className="text-gray-600">{item.sku}</TableCell>
                      <TableCell className="font-mono text-sm text-gray-600">{item.batchId}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">₦{item.unitPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">₦{item.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {invoice.items.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="font-medium">{item.productName}</span>
                      </div>
                      <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                      <p className="text-xs text-gray-500 font-mono">Batch: {item.batchId}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Quantity</p>
                      <p className="font-medium">{item.quantity}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Unit Price</p>
                      <p className="font-medium">₦{item.unitPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Total</p>
                      <p className="font-medium">₦{item.total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end pt-4">
            <div className="w-full md:w-80 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-medium">₦{invoice.subtotal.toLocaleString()}</span>
              </div>
              
              {invoice.discount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Discount:</span>
                  <span className="font-medium text-green-600">-₦{invoice.discount.toLocaleString()}</span>
                </div>
              )}
              
              {invoice.tax > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Tax (VAT):</span>
                  <span className="font-medium">₦{invoice.tax.toLocaleString()}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between text-lg md:text-xl text-gray-900">
                <span>Total:</span>
                <span className="font-bold">₦{invoice.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 mt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-sm">
              <div>
                <h4 className="text-gray-900 mb-2">Payment Information</h4>
                <p className="text-gray-600">Payment due upon receipt</p>
                <p className="text-gray-600">Bank: GTBank Nigeria</p>
                <p className="text-gray-600">Account: 0123456789</p>
              </div>
              <div>
                <h4 className="text-gray-900 mb-2">Terms & Conditions</h4>
                <p className="text-gray-600 text-xs">
                  All sales are final unless otherwise stated. Returns accepted within 7 days with original receipt.
                  Please inspect all items before leaving the store.
                </p>
              </div>
            </div>
            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">Thank you for your business!</p>
              <p className="text-gray-500 text-xs mt-1">Generated by InventoryPro - {format(new Date(), 'PPP p')}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
          <Button onClick={handlePrint} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
            <Printer className="w-4 h-4 mr-2" />
            Print Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}