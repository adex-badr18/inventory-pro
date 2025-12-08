import { LoginScreen } from './LoginScreen';
import { Sidebar } from './Sidebar';
import { TopNavigation } from './TopNavigation';
import { Dashboard } from './Dashboard';
import { InventoryManagement } from './InventoryManagement';
import { BatchProfitModal } from './BatchProfitModal';
import { BranchManagement } from './BranchManagement';
import { ReportsAnalytics } from './ReportsAnalytics';

// Static versions for Figma export
export function FigmaExport() {
  // Mock handlers for static display
  const mockHandlers = {
    onLogin: () => {},
    onLogout: () => {},
    onViewChange: () => {},
    onBranchChange: () => {}
  };

  return (
    <div className="space-y-16 p-8 bg-gray-100">
      
      {/* Screen 1: Login Interface */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Login Screen</h2>
          <p className="text-gray-600">User authentication interface</p>
        </div>
        <div className="border-4 border-blue-200 rounded-lg overflow-hidden">
          <LoginScreen onLogin={mockHandlers.onLogin} />
        </div>
      </div>

      {/* Screen 2: Dashboard Interface */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard Interface</h2>
          <p className="text-gray-600">Main dashboard with sidebar and navigation</p>
        </div>
        <div className="border-4 border-blue-200 rounded-lg overflow-hidden">
          <div className="flex h-screen bg-gray-100">
            <Sidebar 
              currentView="dashboard" 
              onViewChange={mockHandlers.onViewChange}
              onLogout={mockHandlers.onLogout}
            />
            <div className="flex-1 flex flex-col">
              <TopNavigation 
                currentBranch="main"
                onBranchChange={mockHandlers.onBranchChange}
              />
              <div className="flex-1 overflow-auto">
                <Dashboard currentBranch="main" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen 3: Inventory Management Interface */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Inventory Management Interface</h2>
          <p className="text-gray-600">Product inventory management with batch tracking</p>
        </div>
        <div className="border-4 border-blue-200 rounded-lg overflow-hidden">
          <div className="flex h-screen bg-gray-100">
            <Sidebar 
              currentView="inventory" 
              onViewChange={mockHandlers.onViewChange}
              onLogout={mockHandlers.onLogout}
            />
            <div className="flex-1 flex flex-col">
              <TopNavigation 
                currentBranch="main"
                onBranchChange={mockHandlers.onBranchChange}
              />
              <div className="flex-1 overflow-auto">
                <InventoryManagement currentBranch="main" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen 4: Batch Profit Analysis Interface */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Batch Profit Analysis Interface</h2>
          <p className="text-gray-600">Detailed profit calculation and batch performance</p>
        </div>
        <div className="border-4 border-blue-200 rounded-lg overflow-hidden">
          <div className="flex h-screen bg-gray-100">
            <Sidebar 
              currentView="batch-profit" 
              onViewChange={mockHandlers.onViewChange}
              onLogout={mockHandlers.onLogout}
            />
            <div className="flex-1 flex flex-col">
              <TopNavigation 
                currentBranch="main"
                onBranchChange={mockHandlers.onBranchChange}
              />
              <div className="flex-1 overflow-auto">
                <BatchProfitModal currentBranch="main" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen 5: Branch Management Interface */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Branch Management Interface</h2>
          <p className="text-gray-600">Multi-branch management and performance tracking</p>
        </div>
        <div className="border-4 border-blue-200 rounded-lg overflow-hidden">
          <div className="flex h-screen bg-gray-100">
            <Sidebar 
              currentView="branches" 
              onViewChange={mockHandlers.onViewChange}
              onLogout={mockHandlers.onLogout}
            />
            <div className="flex-1 flex flex-col">
              <TopNavigation 
                currentBranch="main"
                onBranchChange={mockHandlers.onBranchChange}
              />
              <div className="flex-1 overflow-auto">
                <BranchManagement 
                  currentBranch="main" 
                  onBranchChange={mockHandlers.onBranchChange} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen 6: Reports & Analytics Interface */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Reports & Analytics Interface</h2>
          <p className="text-gray-600">Comprehensive business reporting and analytics</p>
        </div>
        <div className="border-4 border-blue-200 rounded-lg overflow-hidden">
          <div className="flex h-screen bg-gray-100">
            <Sidebar 
              currentView="reports" 
              onViewChange={mockHandlers.onViewChange}
              onLogout={mockHandlers.onLogout}
            />
            <div className="flex-1 flex flex-col">
              <TopNavigation 
                currentBranch="main"
                onBranchChange={mockHandlers.onBranchChange}
              />
              <div className="flex-1 overflow-auto">
                <ReportsAnalytics currentBranch="main" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component Library: Individual Components */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Component Library</h2>
          <p className="text-gray-600">Individual components for design system</p>
        </div>

        {/* Sidebar Component */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Sidebar Component</h3>
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden inline-block">
            <Sidebar 
              currentView="dashboard" 
              onViewChange={mockHandlers.onViewChange}
              onLogout={mockHandlers.onLogout}
            />
          </div>
        </div>

        {/* Top Navigation Component */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Top Navigation Component</h3>
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
            <TopNavigation 
              currentBranch="main"
              onBranchChange={mockHandlers.onBranchChange}
            />
          </div>
        </div>
      </div>

      {/* Mobile Responsive Views */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Mobile Responsive Views</h2>
          <p className="text-gray-600">Key screens optimized for mobile devices</p>
        </div>

        {/* Mobile Login */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Mobile Login Screen</h3>
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden mx-auto" style={{ width: '375px', height: '812px' }}>
            <LoginScreen onLogin={mockHandlers.onLogin} />
          </div>
        </div>

        {/* Mobile Dashboard */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Mobile Dashboard</h3>
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden mx-auto" style={{ width: '375px', height: '812px' }}>
            <div className="h-full bg-gray-100">
              <TopNavigation 
                currentBranch="main"
                onBranchChange={mockHandlers.onBranchChange}
              />
              <div className="flex-1 overflow-auto" style={{ height: 'calc(100% - 64px)' }}>
                <Dashboard currentBranch="main" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Color Palette & Design Tokens */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Design System</h2>
          <p className="text-gray-600">Color palette and design tokens</p>
        </div>

        {/* Color Palette */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Color Palette</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-lg mb-2 mx-auto"></div>
              <p className="text-sm">Primary Blue</p>
              <p className="text-xs text-gray-600">#3B82F6</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-lg mb-2 mx-auto"></div>
              <p className="text-sm">Success Green</p>
              <p className="text-xs text-gray-600">#10B981</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-red-600 rounded-lg mb-2 mx-auto"></div>
              <p className="text-sm">Error Red</p>
              <p className="text-xs text-gray-600">#EF4444</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-500 rounded-lg mb-2 mx-auto"></div>
              <p className="text-sm">Warning Yellow</p>
              <p className="text-xs text-gray-600">#F59E0B</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-900 rounded-lg mb-2 mx-auto"></div>
              <p className="text-sm">Text Dark</p>
              <p className="text-xs text-gray-600">#111827</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-lg mb-2 mx-auto border"></div>
              <p className="text-sm">Background Light</p>
              <p className="text-xs text-gray-600">#F3F4F6</p>
            </div>
          </div>
        </div>

        {/* Typography Scale */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Typography Scale</h3>
          <div className="space-y-2">
            <div className="text-3xl font-bold">Heading 1 - Bold 30px</div>
            <div className="text-2xl font-bold">Heading 2 - Bold 24px</div>
            <div className="text-xl font-bold">Heading 3 - Bold 20px</div>
            <div className="text-lg font-medium">Heading 4 - Medium 18px</div>
            <div className="text-base">Body Text - Regular 16px</div>
            <div className="text-sm text-gray-600">Small Text - Regular 14px</div>
            <div className="text-xs text-gray-500">Caption - Regular 12px</div>
          </div>
        </div>

        {/* Spacing Scale */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Spacing Scale</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-blue-600"></div>
              <span>2px - xs spacing</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-blue-600"></div>
              <span>4px - sm spacing</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-blue-600"></div>
              <span>6px - md spacing</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-600"></div>
              <span>8px - lg spacing</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600"></div>
              <span>12px - xl spacing</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600"></div>
              <span>16px - 2xl spacing</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}