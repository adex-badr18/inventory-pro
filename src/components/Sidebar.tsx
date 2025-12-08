import { 
  Package, 
  BarChart3, 
  Building2, 
  FileText, 
  Brain, 
  Calculator,
  Home,
  Settings,
  LogOut,
  ShoppingCart,
  ArrowRightLeft
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User, getAccessibleMenuItems } from '../utils/auth';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  user: User | null;
}

export function Sidebar({ currentView, onViewChange, onLogout, user }: SidebarProps) {
  const iconMap: Record<string, any> = {
    dashboard: Home,
    inventory: Package,
    branches: Building2,
    sales: ShoppingCart,
    reports: BarChart3,
    'batch-profit': Calculator
  };

  const menuItems = getAccessibleMenuItems(user);

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">InventoryPro</h2>
            <p className="text-sm text-gray-600">Management System</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = iconMap[item.id];
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 h-11 ${
                  isActive 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* AI Insights Widget */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-gray-900">AI Insights</span>
              <Badge variant="secondary" className="text-xs">3</Badge>
            </div>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="p-2 bg-white rounded border-l-2 border-red-400">
                Low stock alert: 5 items need restocking
              </div>
              <div className="p-2 bg-white rounded border-l-2 border-yellow-400">
                Branch B sales down 12% this week
              </div>
              <div className="p-2 bg-white rounded border-l-2 border-green-400">
                Increase profit by 8% with price adjustment
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2 flex-shrink-0">
        <Button variant="ghost" className="w-full justify-start gap-3 text-gray-700">
          <Settings className="h-5 w-5" />
          Settings
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}