"use client";

import { useState } from "react";
import { LoginScreen } from "../components/LoginScreen";
import { Sidebar } from "../components/Sidebar";
import { TopNavigation } from "../components/TopNavigation";
import { Dashboard } from "../components/Dashboard";
import { InventoryManagement } from "../components/InventoryManagement";
import { BatchProfitModal } from "../components/BatchProfitModal";
import { BranchManagement } from "../components/BranchManagement";
import { BranchDetails } from "../components/BranchDetails";
import { SalesManagement } from "../components/SalesManagement";
import { ReportsAnalytics } from "../components/ReportsAnalytics";
import { FigmaExport } from "../components/FigmaExport";
import { StockTransfer } from "../components/StockTransfer";
import { RequireRole } from "../components/RequireRole";
import { Toaster } from "../components/ui/sonner";
import { Button } from "../components/ui/button";
import { User, getDefaultView, hasPermission } from "../utils/auth";

// Mock inventory data structure
interface InventoryItem {
  id: string;
  branchId: string;
  name: string;
  batchId: string;
  quantity: number;
  category: string;
}

const initialInventory: InventoryItem[] = [
  { id: '1', branchId: 'main', name: 'Laptop Dell XPS 13', batchId: 'BTH-001', quantity: 45, category: 'Electronics' },
  { id: '2', branchId: 'main', name: 'iPhone 14 Pro', batchId: 'BTH-002', quantity: 28, category: 'Electronics' },
  { id: '3', branchId: 'main', name: 'Samsung Galaxy S23', batchId: 'BTH-003', quantity: 32, category: 'Electronics' },
  { id: '4', branchId: 'north', name: 'Laptop Dell XPS 13', batchId: 'BTH-001', quantity: 18, category: 'Electronics' },
  { id: '5', branchId: 'north', name: 'Office Chair', batchId: 'BTH-004', quantity: 25, category: 'Furniture' },
  { id: '6', branchId: 'south', name: 'iPhone 14 Pro', batchId: 'BTH-002', quantity: 15, category: 'Electronics' },
  { id: '7', branchId: 'south', name: 'Standing Desk', batchId: 'BTH-005', quantity: 12, category: 'Furniture' },
  { id: '8', branchId: 'west', name: 'Samsung Galaxy S23', batchId: 'BTH-003', quantity: 20, category: 'Electronics' },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [currentBranch, setCurrentBranch] = useState("main");
  const [showFigmaExport, setShowFigmaExport] = useState(false);
  const [selectedBranchForDetails, setSelectedBranchForDetails] = useState<string | null>(null);
  const [isStockTransferOpen, setIsStockTransferOpen] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);

  const branches = [
    { id: 'main', name: 'Main Branch', code: 'BR-001' },
    { id: 'north', name: 'North Branch', code: 'BR-002' },
    { id: 'south', name: 'South Branch', code: 'BR-003' },
    { id: 'west', name: 'West Branch', code: 'BR-004' }
  ];

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsLoggedIn(true);
    setCurrentView(getDefaultView(loggedInUser.role));
    
    // For branch managers and sales reps, set their assigned branch
    if (loggedInUser.branchId) {
      setCurrentBranch(loggedInUser.branchId);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentView("dashboard");
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    setSelectedBranchForDetails(null);
  };

  const handleBranchChange = (branch: string) => {
    setCurrentBranch(branch);
  };

  const handleViewBranchDetails = (branchId: string) => {
    setSelectedBranchForDetails(branchId);
  };

  const handleBackFromBranchDetails = () => {
    setSelectedBranchForDetails(null);
  };

  const handleStockTransfer = async (transferData: {
    sourceBranchId: string;
    destinationBranchId: string;
    productId: string;
    productName: string;
    batchId: string;
    quantity: number;
  }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setInventory(prevInventory => {
      const newInventory = [...prevInventory];

      // Find and update source branch inventory
      const sourceIndex = newInventory.findIndex(
        item => item.id === transferData.productId && item.branchId === transferData.sourceBranchId
      );

      if (sourceIndex !== -1) {
        newInventory[sourceIndex] = {
          ...newInventory[sourceIndex],
          quantity: newInventory[sourceIndex].quantity - transferData.quantity
        };
      }

      // Find or create destination branch inventory
      const destIndex = newInventory.findIndex(
        item => 
          item.branchId === transferData.destinationBranchId && 
          item.batchId === transferData.batchId &&
          item.name === transferData.productName
      );

      if (destIndex !== -1) {
        // Update existing inventory in destination
        newInventory[destIndex] = {
          ...newInventory[destIndex],
          quantity: newInventory[destIndex].quantity + transferData.quantity
        };
      } else {
        // Create new inventory record in destination
        const sourceItem = newInventory[sourceIndex];
        newInventory.push({
          id: Date.now().toString(),
          branchId: transferData.destinationBranchId,
          name: transferData.productName,
          batchId: transferData.batchId,
          quantity: transferData.quantity,
          category: sourceItem.category
        });
      }

      return newInventory;
    });
  };

  const renderCurrentView = () => {
    // If a branch is selected for details, show the details page
    if (currentView === "branches" && selectedBranchForDetails) {
      return (
        <BranchDetails
          branchId={selectedBranchForDetails}
          onBack={handleBackFromBranchDetails}
        />
      );
    }

    switch (currentView) {
      case "dashboard":
        return (
          <Dashboard 
            currentBranch={currentBranch} 
            onNavigate={handleViewChange}
            onOpenStockTransfer={() => setIsStockTransferOpen(true)}
          />
        );
      case "inventory":
        return (
          <InventoryManagement currentBranch={currentBranch} />
        );
      case "batch-profit":
        return (
          <BatchProfitModal currentBranch={currentBranch} />
        );
      case "branches":
        return (
          <BranchManagement
            currentBranch={currentBranch}
            onBranchChange={handleBranchChange}
            onViewDetails={handleViewBranchDetails}
          />
        );
      case "sales":
        return <SalesManagement user={user || undefined} currentBranch={currentBranch} />;
      case "reports":
        return (
          <ReportsAnalytics currentBranch={currentBranch} user={user || undefined} />
        );
      default:
        return <Dashboard currentBranch={currentBranch} />;
    }
  };

  // Show Figma Export view
  if (showFigmaExport) {
    return (
      <>
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={() => setShowFigmaExport(false)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Exit Figma Export
          </Button>
        </div>
        <FigmaExport />
        <Toaster />
      </>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <div className="fixed top-4 right-4 z-50">
          {/* <Button
            onClick={() => setShowFigmaExport(true)}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm"
          >
            View Figma Export
          </Button> */}
        </div>
        <LoginScreen onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Figma Export Toggle */}
      <div className="fixed top-4 right-4 z-50">
        {/* <Button 
          onClick={() => setShowFigmaExport(true)}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm"
        >
          Figma Export
        </Button> */}
      </div>

      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        onLogout={handleLogout}
        user={user}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <TopNavigation
          currentBranch={currentBranch}
          onBranchChange={handleBranchChange}
          onOpenStockTransfer={() => setIsStockTransferOpen(true)}
          user={user}
        />

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {renderCurrentView()}
        </div>
      </div>

      {/* Stock Transfer Modal */}
      <StockTransfer
        isOpen={isStockTransferOpen}
        onClose={() => setIsStockTransferOpen(false)}
        onTransfer={handleStockTransfer}
        branches={branches}
        inventory={inventory}
      />

      <Toaster />
    </div>
  );
}